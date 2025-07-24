#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

/**
 * Automated LLM pattern updater
 * Fetches latest models from OpenRouter API and Awesome-LLM repository
 * Updates patterns.js with new models and providers
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/models';
const AWESOME_LLM_URL = 'https://api.github.com/repos/Hannibal046/Awesome-LLM/contents/README.md';
const PATTERNS_FILE = path.join(__dirname, '../src/patterns.js');

// Known providers and their API patterns
const PROVIDER_PATTERNS = {
  'openai': {
    apiPatterns: ['/api\.openai\.com/gi', '/openai\.chat\.completions\.create/gi'],
    sdkPatterns: ['/from\\s+[\'"]openai[\'"]/', '/openai\\.createCompletion/gi']
  },
  'anthropic': {
    apiPatterns: ['/api\.anthropic\.com/gi', '/claude\.ai\\/api/gi'],
    sdkPatterns: ['/from\\s+[\'"]@anthropic-ai\\/sdk[\'"]/', '/anthropic\\.messages\\.create/gi']
  },
  'google': {
    apiPatterns: ['/generativelanguage\.googleapis\.com/gi', '/gemini\.generateContent/gi'],
    sdkPatterns: ['/from\\s+[\'"]@google-cloud\\/aiplatform[\'"]/', '/palm\\.generateText/gi']
  }
};

async function fetchFromUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { headers }, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        if (response.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        }
      });
    });
    
    request.on('error', reject);
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function fetchOpenRouterModels() {
  try {
    console.log('Fetching OpenRouter models...');
    const response = await fetchFromUrl(OPENROUTER_API_URL);
    const data = JSON.parse(response);
    
    const models = data.data || [];
    const providers = new Set();
    const modelNames = new Set();
    
    models.forEach(model => {
      if (model.id) {
        const [provider, ...nameParts] = model.id.split('/');
        providers.add(provider);
        modelNames.add(nameParts.join('/'));
      }
    });
    
    return {
      providers: Array.from(providers),
      models: Array.from(modelNames),
      total: models.length
    };
  } catch (error) {
    console.warn('Failed to fetch OpenRouter models:', error.message);
    return { providers: [], models: [], total: 0 };
  }
}

async function fetchAwesomeLLMModels() {
  try {
    console.log('Fetching Awesome-LLM repository...');
    const response = await fetchFromUrl(AWESOME_LLM_URL, {
      'User-Agent': 'llm-witch-hunt-updater'
    });
    const data = JSON.parse(response);
    
    if (!data.content) {
      throw new Error('No content found in repository');
    }
    
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    
    // Extract model names using regex patterns
    const modelPatterns = [
      /(?:^|\s)(GPT-?\d+(?:\.\d+)?(?:-\w+)?)/gmi,
      /(?:^|\s)(Claude(?:-\d+)?(?:-\w+)?)/gmi,
      /(?:^|\s)(LLaMA?(?:-?\d+)?(?:-\w+)?)/gmi,
      /(?:^|\s)(Qwen(?:\d+(?:\.\d+)?)?(?:-\w+)?)/gmi,
      /(?:^|\s)(DeepSeek(?:-\w+)?(?:-\d+)?)/gmi,
      /(?:^|\s)(Mistral(?:-\d+B)?)/gmi,
      /(?:^|\s)(Mixtral(?:-\d+x\d+B)?)/gmi,
      /(?:^|\s)(Gemini(?:-\w+)?)/gmi,
      /(?:^|\s)(Gemma(?:-?\d+)?)/gmi,
      /(?:^|\s)(Codestral(?:-\d+B)?)/gmi
    ];
    
    const models = new Set();
    modelPatterns.forEach(pattern => {
      const matches = content.match(pattern) || [];
      matches.forEach(match => models.add(match.trim().toLowerCase()));
    });
    
    return Array.from(models);
  } catch (error) {
    console.warn('Failed to fetch Awesome-LLM models:', error.message);
    return [];
  }
}

function updatePatternsFile(openRouterData, awesomeLLMModels) {
  try {
    console.log('Reading current patterns file...');
    const currentContent = fs.readFileSync(PATTERNS_FILE, 'utf8');
    
    // Extract existing patterns
    const existingModels = extractExistingModels(currentContent);
    
    // Merge with new data
    const allModels = new Set([...existingModels, ...openRouterData.models, ...awesomeLLMModels]);
    const allProviders = new Set([...openRouterData.providers]);
    
    console.log(`Total models found: ${allModels.size}`);
    console.log(`Total providers found: ${allProviders.size}`);
    
    // Generate updated patterns
    const updatedContent = generateUpdatedPatterns(currentContent, Array.from(allModels), Array.from(allProviders));
    
    // Write back to file
    fs.writeFileSync(PATTERNS_FILE, updatedContent);
    console.log('✅ Patterns file updated successfully!');
    
    return {
      modelsAdded: allModels.size - existingModels.length,
      totalModels: allModels.size,
      providersCount: allProviders.size
    };
  } catch (error) {
    console.error('Failed to update patterns file:', error.message);
    throw error;
  }
}

function extractExistingModels(content) {
  const modelMatches = content.match(/MODEL_NAMES\s*=\s*{[\s\S]*?};/);
  if (!modelMatches) return [];
  
  const modelSection = modelMatches[0];
  const allModels = [];
  
  // Extract model arrays
  const arrayMatches = modelSection.match(/\[[^\]]+\]/g) || [];
  arrayMatches.forEach(array => {
    const models = array.match(/'([^']+)'/g) || [];
    models.forEach(model => allModels.push(model.replace(/'/g, '')));
  });
  
  return allModels;
}

function generateUpdatedPatterns(currentContent, models, providers) {
  // Add timestamp comment
  const timestamp = new Date().toISOString();
  const header = `// Auto-updated on ${timestamp} by update-llm-patterns.js\n`;
  
  // Create model groups
  const modelGroups = groupModelsByProvider(models);
  
  // Generate MODEL_NAMES section
  const modelNamesSection = generateModelNamesSection(modelGroups);
  
  // Replace the MODEL_NAMES section
  const updatedContent = currentContent.replace(
    /\/\/ Extended model names for detection[\s\S]*?const MODEL_NAMES = {[\s\S]*?};/,
    `// Extended model names for detection (auto-updated)\nconst MODEL_NAMES = ${modelNamesSection};`
  );
  
  return header + updatedContent;
}

function groupModelsByProvider(models) {
  const groups = {
    openai: [],
    anthropic: [],
    google: [],
    meta: [],
    deepseek: [],
    mistral: [],
    alibaba: [],
    other: []
  };
  
  models.forEach(model => {
    const lower = model.toLowerCase();
    if (lower.includes('gpt') || lower.includes('davinci') || lower.includes('curie')) {
      groups.openai.push(model);
    } else if (lower.includes('claude')) {
      groups.anthropic.push(model);
    } else if (lower.includes('gemini') || lower.includes('gemma') || lower.includes('palm') || lower.includes('bard')) {
      groups.google.push(model);
    } else if (lower.includes('llama') || lower.includes('opt')) {
      groups.meta.push(model);
    } else if (lower.includes('deepseek')) {
      groups.deepseek.push(model);
    } else if (lower.includes('mistral') || lower.includes('mixtral') || lower.includes('codestral')) {
      groups.mistral.push(model);
    } else if (lower.includes('qwen')) {
      groups.alibaba.push(model);
    } else {
      groups.other.push(model);
    }
  });
  
  return groups;
}

function generateModelNamesSection(modelGroups) {
  const sections = Object.entries(modelGroups)
    .filter(([_, models]) => models.length > 0)
    .map(([provider, models]) => {
      const modelList = models.map(m => `'${m}'`).join(', ');
      return `  ${provider}: [${modelList}]`;
    });
  
  return `{\n${sections.join(',\n')}\n}`;
}

async function main() {
  console.log('🔍 Starting LLM pattern updater...');
  
  try {
    // Fetch data from sources
    const [openRouterData, awesomeLLMModels] = await Promise.all([
      fetchOpenRouterModels(),
      fetchAwesomeLLMModels()
    ]);
    
    console.log(`📊 Found ${openRouterData.total} OpenRouter models`);
    console.log(`📊 Found ${awesomeLLMModels.length} Awesome-LLM models`);
    
    // Update patterns file
    const updateResult = updatePatternsFile(openRouterData, awesomeLLMModels);
    
    console.log(`✅ Update complete!`);
    console.log(`   - Models added: ${updateResult.modelsAdded}`);
    console.log(`   - Total models: ${updateResult.totalModels}`);
    console.log(`   - Providers: ${updateResult.providersCount}`);
    
  } catch (error) {
    console.error('❌ Update failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, fetchOpenRouterModels, fetchAwesomeLLMModels };