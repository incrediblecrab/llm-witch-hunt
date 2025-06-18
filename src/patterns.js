const AI_PATTERNS = {
  comments: [
    /AI[- ]generated/gi,
    /generated\s+by\s+(ChatGPT|GPT-[34]|Claude|Anthropic|Copilot|OpenAI|Gemini|Bard|DeepSeek|Qwen|Llama|Mistral|Mixtral|Codestral|Gemma)/gi,
    /created\s+(by|with|using)\s+(ChatGPT|GPT-[34]|Claude|Anthropic|Copilot|OpenAI|Gemini|Bard|DeepSeek|Qwen|Llama|Mistral|Mixtral|Codestral|Gemma)/gi,
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
    /Assisted-by:\s*(ChatGPT|Claude|GPT|Copilot|DeepSeek|Qwen|Llama|Mistral|Gemini)/gi
  ],
  
  variables: [
    /\b(ai|llm|gpt|claude|openai|anthropic|deepseek|qwen|llama|mistral|gemini)Response\b/gi,
    /\b(ai|llm|gpt|claude|deepseek|qwen|llama)Output\b/gi,
    /\b(ai|llm|gpt|claude|deepseek|qwen|llama)Result\b/gi,
    /\b(chatgpt|claude|gemini|copilot|deepseek|qwen|llama|mistral)Client\b/gi,
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
    /import\s+.*langchain/g,
    /from\s+['"]@mistralai\/mistralai['"]/g,
    /from\s+['"]replicate['"]/g,
    /from\s+['"]together-ai['"]/g
  ]
};

const LLM_APIS = {
  openai: {
    patterns: [
      /api\.openai\.com/gi,
      /openai\.createCompletion/gi,
      /openai\.createChatCompletion/gi,
      /openai\.createEmbedding/gi,
      /openai\.createImage/gi,
      /openai\.chat\.completions\.create/gi
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
      /gemini\.generateContent/gi,
      /gemma.*generate/gi
    ],
    provider: 'Google'
  },
  cohere: {
    patterns: [
      /api\.cohere\.ai/gi,
      /cohere\.generate/gi,
      /cohere\.embed/gi,
      /cohere\.classify/gi
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
      /replicate\.run/gi,
      /replicate\.predictions\.create/gi
    ],
    provider: 'Replicate'
  },
  deepseek: {
    patterns: [
      /api\.deepseek\.com/gi,
      /deepseek\.chat/gi,
      /deepseek-ai\/deepseek/gi,
      /deepseek.*complete/gi
    ],
    provider: 'DeepSeek'
  },
  mistral: {
    patterns: [
      /api\.mistral\.ai/gi,
      /mistral\.chat/gi,
      /mistral.*complete/gi,
      /codestral.*generate/gi
    ],
    provider: 'Mistral AI'
  },
  alibaba: {
    patterns: [
      /dashscope\.aliyuncs\.com/gi,
      /qwen.*generate/gi,
      /codeqwen.*complete/gi
    ],
    provider: 'Alibaba (Qwen)'
  },
  meta: {
    patterns: [
      /llama.*generate/gi,
      /llama.*chat/gi,
      /opt.*generate/gi
    ],
    provider: 'Meta'
  },
  openrouter: {
    patterns: [
      /openrouter\.ai\/api/gi,
      /api\.openrouter\.ai/gi,
      /openrouter.*completions/gi
    ],
    provider: 'OpenRouter'
  },
  together: {
    patterns: [
      /api\.together\.xyz/gi,
      /together\.ai\/api/gi,
      /together.*inference/gi
    ],
    provider: 'Together AI'
  }
};

// Extended model names for detection
const MODEL_NAMES = {
  openai: ['gpt-3', 'gpt-3.5', 'gpt-4', 'gpt-4o', 'davinci', 'curie', 'babbage', 'ada', 'text-davinci', 'code-davinci'],
  anthropic: ['claude', 'claude-2', 'claude-3', 'claude-instant', 'claude-opus', 'claude-sonnet', 'claude-haiku'],
  google: ['gemini', 'gemma', 'palm', 'bard', 'lamda'],
  meta: ['llama', 'llama2', 'llama3', 'llama-2', 'llama-3', 'opt', 'opt-175b'],
  deepseek: ['deepseek', 'deepseek-coder', 'deepseek-math', 'deepseek-vl', 'deepseek-moe', 'deepseek-v2', 'deepseek-v3', 'deepseek-r1'],
  mistral: ['mistral', 'mixtral', 'codestral', 'mistral-7b', 'mixtral-8x7b', 'mixtral-8x22b'],
  alibaba: ['qwen', 'qwen1.5', 'qwen2', 'qwen2.5', 'codeqwen', 'qwen-vl', 'qwen-math'],
  other: ['falcon', 'mpt', 'starcoder', 'wizardcoder', 'phi', 'yi', 'vicuna', 'alpaca']
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
  MODEL_NAMES,
  FILE_EXTENSIONS_TO_SCAN,
  DEFAULT_IGNORE_PATTERNS
};