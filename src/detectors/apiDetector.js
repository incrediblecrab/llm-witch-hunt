const { LLM_APIS } = require('../patterns');

class APIDetector {
  constructor() {
    this.apis = LLM_APIS;
  }

  detect(fileContent, filePath) {
    if (!fileContent || typeof fileContent !== 'string') {
      return [];
    }

    const findings = [];
    const lines = fileContent.split('\n');
    
    // Limit processing to reasonable file sizes
    if (lines.length > 10000) {
      return [];
    }
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const trimmedLine = line.trim();
      
      // Skip empty lines and very long lines
      if (!trimmedLine || trimmedLine.length > 500) {
        return;
      }
      
      // Check each API provider
      for (const [apiKey, apiConfig] of Object.entries(this.apis)) {
        for (const pattern of apiConfig.patterns) {
          try {
            const matches = trimmedLine.match(pattern);
            if (matches) {
              findings.push({
                type: 'api_call',
                provider: apiConfig.provider,
                pattern: pattern.source,
                match: matches[0].substring(0, 100), // Limit match length
                line: lineNumber,
                column: line.indexOf(matches[0]) + 1,
                context: trimmedLine.substring(0, 200), // Limit context length
                apiKey: apiKey
              });
            }
          } catch (error) {
            // Skip invalid regex matches
            continue;
          }
        }
      }
    });
    
    // Limit total findings to prevent memory issues
    return findings.slice(0, 1000);
  }

  getSummary(findings) {
    const summary = {
      total: findings.length,
      byProvider: {},
      uniqueProviders: new Set()
    };
    
    findings.forEach(finding => {
      summary.byProvider[finding.provider] = (summary.byProvider[finding.provider] || 0) + 1;
      summary.uniqueProviders.add(finding.provider);
    });
    
    summary.uniqueProviderCount = summary.uniqueProviders.size;
    summary.uniqueProviders = Array.from(summary.uniqueProviders);
    
    return summary;
  }

  // Helper method to check if a file might contain API keys
  detectPotentialKeys(fileContent) {
    if (!fileContent || typeof fileContent !== 'string') {
      return [];
    }

    const keyPatterns = [
      /OPENAI_API_KEY/gi,
      /ANTHROPIC_API_KEY/gi,
      /sk-[a-zA-Z0-9]{48}/g, // OpenAI key pattern
      /sk-ant-[a-zA-Z0-9]{95}/g, // Anthropic key pattern
      /AIza[a-zA-Z0-9-_]{35}/g, // Google API key pattern
      /api[_-]?key.*=.*['"][a-zA-Z0-9-_]{20,}['"]/gi
    ];
    
    const potentialKeys = [];
    const lines = fileContent.split('\n');
    
    // Limit processing to reasonable file sizes
    if (lines.length > 10000) {
      return [];
    }
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const trimmedLine = line.trim();
      
      // Skip empty lines and very long lines
      if (!trimmedLine || trimmedLine.length > 500) {
        return;
      }
      
      for (const pattern of keyPatterns) {
        try {
          const matches = trimmedLine.match(pattern);
          if (matches) {
            // Mask the actual key value for security
            const maskedMatch = matches[0].replace(/['"][^'"]*['"]/, '"***MASKED***"');
            const maskedContext = trimmedLine.replace(/['"][^'"]*['"]/, '"***MASKED***"');
            
            potentialKeys.push({
              type: 'potential_api_key',
              line: lineNumber,
              pattern: pattern.source,
              match: maskedMatch.substring(0, 100), // Limit match length
              context: maskedContext.substring(0, 200) // Limit context length
            });
          }
        } catch (error) {
          // Skip invalid regex matches
          continue;
        }
      }
    });
    
    // Limit total findings to prevent memory issues
    return potentialKeys.slice(0, 100);
  }
}

module.exports = APIDetector;