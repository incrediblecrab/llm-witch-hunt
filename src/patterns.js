const AI_PATTERNS = {
  comments: [
    /AI[- ]generated/gi,
    /generated\s+by\s+(ChatGPT|GPT-[34]|Claude|Anthropic|Copilot|OpenAI|Gemini|Bard)/gi,
    /created\s+(by|with|using)\s+(ChatGPT|GPT-[34]|Claude|Anthropic|Copilot|OpenAI|Gemini|Bard)/gi,
    /@ai-assisted/gi,
    /copilot[- ]generated/gi,
    /\bLLM[- ]generated\b/gi,
    /artificial\s+intelligence\s+generated/gi,
    /machine[- ]generated/gi,
    /auto[- ]generated\s+by\s+AI/gi
  ],
  
  authors: [
    /Co-authored-by:\s*(.*)AI/gi,
    /Co-authored-by:\s*(GitHub\s+)?Copilot/gi,
    /Generated-by:\s*(.*)AI/gi,
    /AI-Assistant:\s*/gi,
    /Assisted-by:\s*(ChatGPT|Claude|GPT|Copilot)/gi
  ],
  
  variables: [
    /\b(ai|llm|gpt|claude|openai|anthropic)Response\b/gi,
    /\b(ai|llm|gpt|claude)Output\b/gi,
    /\b(ai|llm|gpt|claude)Result\b/gi,
    /\b(chatgpt|claude|gemini|copilot)Client\b/gi,
    /\b(ai|llm)Service\b/gi,
    /\b(ai|llm)Handler\b/gi,
    /\bpromptTemplate\b/gi,
    /\bsystemPrompt\b/gi,
    /\bcompletionTokens\b/gi
  ],
  
  imports: [
    /from\s+['"]openai['"]/g,
    /require\s*\(\s*['"]openai['"]\s*\)/g,
    /from\s+['"]@anthropic-ai\/sdk['"]/g,
    /require\s*\(\s*['"]@anthropic-ai\/sdk['"]\s*\)/g,
    /from\s+['"]@google-cloud\/aiplatform['"]/g,
    /from\s+['"]cohere-ai['"]/g,
    /from\s+['"]@huggingface\/inference['"]/g,
    /import\s+.*langchain/g
  ]
};

const LLM_APIS = {
  openai: {
    patterns: [
      /api\.openai\.com/gi,
      /openai\.createCompletion/gi,
      /openai\.createChatCompletion/gi,
      /openai\.createEmbedding/gi,
      /openai\.createImage/gi
    ],
    provider: 'OpenAI'
  },
  anthropic: {
    patterns: [
      /api\.anthropic\.com/gi,
      /anthropic\.complete/gi,
      /anthropic\.messages\.create/gi,
      /claude\.ai\/api/gi
    ],
    provider: 'Anthropic'
  },
  google: {
    patterns: [
      /generativelanguage\.googleapis\.com/gi,
      /aiplatform\.googleapis\.com/gi,
      /palm\.generateText/gi,
      /gemini\.generateContent/gi
    ],
    provider: 'Google'
  },
  cohere: {
    patterns: [
      /api\.cohere\.ai/gi,
      /cohere\.generate/gi,
      /cohere\.embed/gi
    ],
    provider: 'Cohere'
  },
  huggingface: {
    patterns: [
      /api-inference\.huggingface\.co/gi,
      /huggingface\.co\/api/gi,
      /hf\.inference/gi
    ],
    provider: 'Hugging Face'
  },
  azure: {
    patterns: [
      /\.openai\.azure\.com/gi,
      /\.cognitiveservices\.azure\.com/gi,
      /azure.*openai/gi
    ],
    provider: 'Azure OpenAI'
  },
  replicate: {
    patterns: [
      /api\.replicate\.com/gi,
      /replicate\.run/gi
    ],
    provider: 'Replicate'
  }
};

const FILE_EXTENSIONS_TO_SCAN = [
  '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cs', '.cpp', '.c', '.h',
  '.go', '.rs', '.php', '.rb', '.swift', '.kt', '.scala', '.r', '.m', '.mm',
  '.vue', '.svelte'
];

const DEFAULT_IGNORE_PATTERNS = [
  'node_modules/**',
  'dist/**',
  'build/**',
  'coverage/**',
  '.git/**',
  '*.min.js',
  '*.bundle.js',
  'vendor/**',
  'third_party/**',
  'external/**',
  '*.lock',
  'package-lock.json',
  'yarn.lock'
];

module.exports = {
  AI_PATTERNS,
  LLM_APIS,
  FILE_EXTENSIONS_TO_SCAN,
  DEFAULT_IGNORE_PATTERNS
};