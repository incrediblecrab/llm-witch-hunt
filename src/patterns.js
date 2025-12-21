// Auto-updated on 2025-12-21T02:43:02.391Z by update-llm-patterns.js
// Auto-updated on 2025-12-14T02:42:51.295Z by update-llm-patterns.js
// Auto-updated on 2025-12-07T02:41:55.755Z by update-llm-patterns.js
// Auto-updated on 2025-11-30T02:41:24.849Z by update-llm-patterns.js
// Auto-updated on 2025-11-23T02:42:24.228Z by update-llm-patterns.js
// Auto-updated on 2025-11-16T02:36:39.386Z by update-llm-patterns.js
// Auto-updated on 2025-11-09T02:35:11.872Z by update-llm-patterns.js
// Auto-updated on 2025-11-02T02:35:44.725Z by update-llm-patterns.js
// Auto-updated on 2025-10-26T02:34:37.589Z by update-llm-patterns.js
// Auto-updated on 2025-10-19T02:35:48.849Z by update-llm-patterns.js
// Auto-updated on 2025-10-12T02:31:56.213Z by update-llm-patterns.js
// Auto-updated on 2025-10-05T03:05:39.054Z by update-llm-patterns.js
// Auto-updated on 2025-09-28T03:06:24.747Z by update-llm-patterns.js
// Auto-updated on 2025-09-21T03:05:29.775Z by update-llm-patterns.js
// Auto-updated on 2025-09-14T03:00:35.179Z by update-llm-patterns.js
// Auto-updated on 2025-09-07T03:00:59.228Z by update-llm-patterns.js
// Auto-updated on 2025-08-31T03:05:23.618Z by update-llm-patterns.js
// Auto-updated on 2025-08-24T03:17:29.453Z by update-llm-patterns.js
// Auto-updated on 2025-08-17T03:24:26.394Z by update-llm-patterns.js
// Auto-updated on 2025-08-10T03:42:25.972Z by update-llm-patterns.js
// Auto-updated on 2025-08-04T15:57:11.435Z by update-llm-patterns.js
// Auto-updated on 2025-08-03T03:49:38.973Z by update-llm-patterns.js
// Auto-updated on 2025-07-27T03:45:59.837Z by update-llm-patterns.js
// Auto-updated on 2025-07-24T04:16:00.880Z by update-llm-patterns.js
// Auto-updated on 2025-07-07T15:43:15.935Z by update-llm-patterns.js
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

// Extended model names for detection (auto-updated)
const MODEL_NAMES = {
  openai: ['gpt-3', 'gpt-3.5', 'gpt-4', 'gpt-4o', 'davinci', 'curie', 'text-davinci', 'code-davinci', 'gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano', 'gpt-4o-mini-search-preview', 'gpt-4o-search-preview', 'gpt-4.5-preview', 'gpt-4o-2024-11-20', 'chatgpt-4o-latest', 'gpt-4o-2024-08-06', 'gpt-4o-mini', 'gpt-4o-mini-2024-07-18', 'gpt-4o:extended', 'gpt-4o-2024-05-13', 'gpt-4-turbo', 'gpt-3.5-turbo-0613', 'gpt-4-turbo-preview', 'gpt-3.5-turbo-1106', 'gpt-4-1106-preview', 'gpt-3.5-turbo-instruct', 'gpt-3.5-turbo-16k', 'gpt-3.5-turbo', 'gpt-3.5-turbo-0125', 'gpt-4-0314', 'gpt-5-chat', 'gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-oss-120b', 'gpt-oss-20b:free', 'gpt-oss-20b', 'gpt-4o-audio-preview', 'gpt-oss-120b:free', 'gpt-5-codex', 'gpt-5-pro', 'gpt-5-image-mini', 'gpt-5-image', 'gpt-oss-120b:exacto', 'gpt-oss-safeguard-20b', 'gpt-5.1', 'gpt-5.1-chat', 'gpt-5.1-codex', 'gpt-5.1-codex-mini', 'gpt-5.1-codex-max', 'gpt-5.2-chat', 'gpt-5.2-pro', 'gpt-5.2'],
  anthropic: ['claude', 'claude-2', 'claude-3', 'claude-instant', 'claude-opus', 'claude-sonnet', 'claude-haiku', 'claude-opus-4', 'claude-sonnet-4', 'claude-3.7-sonnet', 'claude-3.7-sonnet:beta', 'claude-3.7-sonnet:thinking', 'claude-3.5-haiku:beta', 'claude-3.5-haiku', 'claude-3.5-haiku-20241022:beta', 'claude-3.5-haiku-20241022', 'claude-3.5-sonnet:beta', 'claude-3.5-sonnet', 'claude-3.5-sonnet-20240620:beta', 'claude-3.5-sonnet-20240620', 'claude-3-haiku:beta', 'claude-3-haiku', 'claude-3-opus:beta', 'claude-3-opus', 'claude-3-sonnet:beta', 'claude-3-sonnet', 'claude-2.1:beta', 'claude-2.1', 'claude-2:beta', 'claude-2.0:beta', 'claude-2.0', 'claude-opus-4.1', 'claude-sonnet-4.5', 'claude-haiku-4.5', 'claude-opus-4.5'],
  google: ['gemini', 'gemma', 'palm', 'bard', 'gemini-2.5-flash-lite-preview-06-17', 'gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.5-pro-preview', 'gemma-3n-e4b-it:free', 'gemini-2.5-flash-preview-05-20', 'gemini-2.5-flash-preview-05-20:thinking', 'gemini-2.5-pro-preview-05-06', 'gemini-2.5-flash-preview', 'gemini-2.5-flash-preview:thinking', 'gemini-2.5-pro-exp-03-25', 'gemma-3-1b-it:free', 'gemma-3-4b-it:free', 'gemma-3-4b-it', 'gemma-3-12b-it:free', 'gemma-3-12b-it', 'gemma-3-27b-it:free', 'gemma-3-27b-it', 'gemini-2.0-flash-lite-001', 'gemini-2.0-flash-001', 'gemini-2.0-flash-exp:free', 'gemini-flash-1.5-8b', 'gemma-2-27b-it', 'gemma-2-9b-it:free', 'gemma-2-9b-it', 'gemini-flash-1.5', 'gemini-pro-1.5', 'gemma-3n-e4b-it', 'gemini-2.5-flash-lite', 'gemma-3n-e2b-it:free', 'gemini-2.5-flash-image-preview:free', 'gemini-2.5-flash-image-preview', 'gemini-2.5-flash-preview-09-2025', 'gemini-2.5-flash-lite-preview-09-2025', 'gemini-2.5-flash-image', 'gemini-3-pro-image-preview', 'gemini-3-pro-preview', 'gemini-3-flash-preview'],
  meta: ['llama', 'llama2', 'llama3', 'llama-2', 'llama-3', 'opt', 'opt-175b', 'dobby-mini-unhinged-plus-llama-3.1-8b', 'llama-3.3-8b-instruct:free', 'llama-guard-4-12b', 'shisa-v2-llama3.3-70b:free', 'codellama-7b-instruct-solidity', 'llama-3.3-nemotron-super-49b-v1:free', 'llama-3.3-nemotron-super-49b-v1', 'llama-3.1-nemotron-ultra-253b-v1:free', 'llama-3.1-nemotron-ultra-253b-v1', 'llama-4-maverick:free', 'llama-4-maverick', 'llama-4-scout:free', 'llama-4-scout', 'llama3.1-typhoon2-70b-instruct', 'deephermes-3-llama-3-8b-preview:free', 'llama-guard-3-8b', 'deepseek-r1-distill-llama-8b', 'aion-rp-llama-3.1-8b', 'deepseek-r1-distill-llama-70b:free', 'deepseek-r1-distill-llama-70b', 'eva-llama-3.33-70b', 'llama-3.3-70b-instruct:free', 'llama-3.3-70b-instruct', 'llama-3.1-lumimaid-70b', 'llama-3.1-nemotron-70b-instruct', 'llama-3.2-3b-instruct:free', 'llama-3.2-3b-instruct', 'llama-3.2-1b-instruct:free', 'llama-3.2-1b-instruct', 'llama-3.2-90b-vision-instruct', 'llama-3.2-11b-vision-instruct:free', 'llama-3.2-11b-vision-instruct', 'llama-3.1-lumimaid-8b', 'hermes-3-llama-3.1-70b', 'hermes-3-llama-3.1-405b', 'llama-3.1-405b', 'llama-3.1-sonar-small-128k-online', 'llama-3.1-sonar-large-128k-online', 'llama-3.1-8b-instruct:free', 'llama-3.1-8b-instruct', 'llama-3.1-405b-instruct', 'llama-3.1-70b-instruct', 'hermes-2-pro-llama-3-8b', 'llama-3-lumimaid-70b', 'llama-guard-2-8b', 'llama-3-lumimaid-8b', 'llama-3-8b-instruct', 'llama-3-70b-instruct', 'shisa-v2-llama3.3-70b', 'llama-3.1-405b-instruct:free', 'cogito-v2-preview-llama-109b-moe', 'deephermes-3-llama-3-8b-preview', 'llama-3.3-nemotron-super-49b-v1.5', 'cogito-v2-preview-llama-405b', 'cogito-v2-preview-llama-70b', 'hermes-3-llama-3.1-405b:free'],
  deepseek: ['deepseek', 'deepseek-coder', 'deepseek-math', 'deepseek-vl', 'deepseek-moe', 'deepseek-v2', 'deepseek-v3', 'deepseek-r1', 'deepseek-r1-distill-qwen-7b', 'deepseek-r1-0528-qwen3-8b:free', 'deepseek-r1-0528-qwen3-8b', 'deepseek-r1-0528:free', 'deepseek-r1-0528', 'deepseek-prover-v2', 'deepseek-r1t-chimera:free', 'deepseek-v3-base:free', 'deepseek-chat-v3-0324:free', 'deepseek-chat-v3-0324', 'deepseek-r1-distill-qwen-1.5b', 'deepseek-r1-distill-qwen-32b:free', 'deepseek-r1-distill-qwen-32b', 'deepseek-r1-distill-qwen-14b:free', 'deepseek-r1-distill-qwen-14b', 'deepseek-r1:free', 'deepseek-chat:free', 'deepseek-chat', 'deepseek-r1t2-chimera:free', 'deepseek-r1t2-chimera', 'deepseek-r1t-chimera', 'deepseek-v3-base', 'deepseek-chat-v3.1', 'deepseek-v3.1-base', 'deepseek-chat-v3.1:free', 'cogito-v2-preview-deepseek-671b', 'deepseek-v3.1-terminus', 'deepseek-v3.2-exp', 'deepseek-v3.1-terminus:exacto', 'deepseek-v3.2-speciale', 'deepseek-v3.2', 'deepseek-v3.1-nex-n1:free'],
  mistral: ['mistral', 'mixtral', 'codestral', 'mistral-7b', 'mixtral-8x7b', 'mixtral-8x22b', 'deephermes-3-mistral-24b-preview:free', 'mistral-medium-3', 'mistral-small-3.1-24b-instruct:free', 'mistral-small-3.1-24b-instruct', 'mistral-saba', 'dolphin3.0-r1-mistral-24b:free', 'dolphin3.0-mistral-24b:free', 'mistral-small-24b-instruct-2501:free', 'mistral-small-24b-instruct-2501', 'codestral-2501', 'mistral-large-2411', 'mistral-large-2407', 'mistral-nemo:free', 'mistral-nemo', 'dolphin-mixtral-8x22b', 'mistral-7b-instruct:free', 'mistral-7b-instruct', 'mistral-7b-instruct-v0.3', 'mixtral-8x22b-instruct', 'mistral-large', 'nous-hermes-2-mixtral-8x7b-dpo', 'mistral-medium', 'mistral-small', 'mistral-tiny', 'mistral-7b-instruct-v0.2', 'mixtral-8x7b-instruct', 'mistral-7b-instruct-v0.1', 'mistral-small-3.2-24b-instruct:free', 'mistral-small-3.2-24b-instruct', 'dolphin-mistral-24b-venice-edition:free', 'deephermes-3-mistral-24b-preview', 'dolphin3.0-r1-mistral-24b', 'codestral-2508', 'dolphin3.0-mistral-24b', 'mistral-medium-3.1', 'mistral-large-2512', 'mistral-small-creative'],
  alibaba: ['qwen', 'qwen1.5', 'qwen2', 'qwen2.5', 'codeqwen', 'qwen-vl', 'qwen-math', 'qwen3-30b-a3b:free', 'qwen3-30b-a3b', 'qwen3-8b:free', 'qwen3-8b', 'qwen3-14b:free', 'qwen3-14b', 'qwen3-32b:free', 'qwen3-32b', 'qwen3-235b-a22b:free', 'qwen3-235b-a22b', 'qwen2.5-vl-32b-instruct:free', 'qwen2.5-vl-32b-instruct', 'qwen-vl-plus', 'qwen-vl-max', 'qwen-turbo', 'qwen2.5-vl-72b-instruct:free', 'qwen2.5-vl-72b-instruct', 'qwen-plus', 'qwen-max', 'eva-qwen-2.5-72b', 'qwen-2.5-coder-32b-instruct:free', 'qwen-2.5-coder-32b-instruct', 'eva-qwen-2.5-32b', 'qwen-2.5-7b-instruct', 'qwen-2.5-72b-instruct:free', 'qwen-2.5-72b-instruct', 'qwen-2.5-vl-7b-instruct:free', 'qwen-2.5-vl-7b-instruct', 'qwen-2-72b-instruct', 'qwen3-coder:free', 'qwen3-coder', 'qwen3-235b-a22b-07-25:free', 'qwen3-235b-a22b-07-25', 'qwen3-4b:free', 'qwen3-30b-a3b-instruct-2507', 'qwen3-235b-a22b-thinking-2507', 'qwen3-235b-a22b-2507:free', 'qwen3-235b-a22b-2507', 'qwen3-30b-a3b-thinking-2507', 'qwen3-coder-30b-a3b-instruct', 'qwen3-max', 'qwen3-next-80b-a3b-thinking', 'qwen3-next-80b-a3b-instruct', 'qwen-plus-2025-07-28', 'qwen-plus-2025-07-28:thinking', 'qwen3-coder-flash', 'qwen3-coder-plus', 'qwen3-vl-235b-a22b-thinking', 'qwen3-vl-235b-a22b-instruct', 'qwen3-vl-30b-a3b-thinking', 'qwen3-vl-30b-a3b-instruct', 'qwen2.5-coder-7b-instruct', 'qwen3-vl-8b-thinking', 'qwen3-vl-8b-instruct', 'qwen3-coder:exacto', 'qwen3-vl-32b-instruct'],
  other: ['babbage', 'ada', 'lamda', 'falcon', 'mpt', 'starcoder', 'wizardcoder', 'phi', 'yi', 'vicuna', 'alpaca', 'minimax-m1', 'minimax-m1:extended', 'kimi-dev-72b:free', 'o3-pro', 'magistral-small-2506', 'magistral-medium-2506', 'magistral-medium-2506:thinking', 'sarvam-m:free', 'valkyrie-49b-v1', 'devstral-small:free', 'devstral-small', 'codex-mini', 'caller-large', 'spotlight', 'maestro-reasoning', 'virtuoso-large', 'coder-large', 'virtuoso-medium-v2', 'arcee-blitz', 'phi-4-reasoning-plus:free', 'phi-4-reasoning-plus', 'phi-4-reasoning:free', 'mercury-coder-small-beta', 'internvl3-14b:free', 'internvl3-2b:free', 'glm-z1-rumination-32b', 'mai-ds-r1:free', 'glm-z1-32b:free', 'glm-z1-32b', 'glm-4-32b:free', 'glm-4-32b', 'o4-mini-high', 'o3', 'o4-mini', 'llemma_7b', 'qwq-32b-arliai-rpr-v1:free', 'deepcoder-14b-preview:free', 'kimi-vl-a3b-thinking:free', 'grok-3-mini-beta', 'grok-3-beta', 'openhands-lm-32b-v0.1', 'qwerky-72b:free', 'o1-pro', 'olympiccoder-32b:free', 'jamba-1.6-large', 'jamba-1.6-mini', 'command-a', 'reka-flash-3:free', 'anubis-pro-105b-v1', 'skyfall-36b-v2', 'phi-4-multimodal-instruct', 'sonar-reasoning-pro', 'sonar-pro', 'sonar-deep-research', 'qwq-32b:free', 'qwq-32b', 'r1-1776', 'o3-mini-high', 'aion-1.0', 'aion-1.0-mini', 'o3-mini', 'sonar-reasoning', 'sonar', 'lfm-7b', 'lfm-3b', 'minimax-01', 'phi-4', 'l3.3-euryale-70b', 'o1', 'grok-2-vision-1212', 'grok-2-1212', 'command-r7b-12-2024', 'nova-lite-v1', 'nova-micro-v1', 'nova-pro-v1', 'qwq-32b-preview', 'pixtral-large-2411', 'grok-vision-beta', 'mn-inferor-12b', 'sorcererlm-8x22b', 'unslopnemo-12b', 'magnum-v4-72b', 'grok-beta', 'ministral-8b', 'ministral-3b', 'inflection-3-productivity', 'inflection-3-pi', 'rocinante-12b', 'magnum-v2-72b', 'lfm-40b', 'o1-preview', 'o1-preview-2024-09-12', 'o1-mini', 'o1-mini-2024-09-12', 'pixtral-12b', 'command-r-plus-08-2024', 'command-r-08-2024', 'l3.1-euryale-70b', 'phi-3.5-mini-128k-instruct', 'l3-lunaris-8b', 'mn-starcannon-12b', 'mn-celeste-12b', 'magnum-72b', 'yi-large', 'l3-euryale-70b', 'phi-3-mini-128k-instruct', 'phi-3-medium-128k-instruct', 'fimbulvetr-11b-v2', 'wizardlm-2-8x22b', 'command-r-plus', 'command-r-plus-04-2024', 'midnight-rose-70b', 'command', 'command-r', 'command-r-03-2024', 'noromaid-20b', 'toppy-m-7b', 'goliath-120b', 'auto', 'mythalion-13b', 'weaver', 'remm-slerp-l2-13b', 'mythomax-l2-13b', 'mercury', 'morph-v2', 'grok-3-mini', 'grok-3', 'internvl3-14b', 'internvl3-2b', 'cypher-alpha:free', 'ernie-4.5-300b-a47b', 'anubis-70b-v1.1', 'mercury-coder', 'ui-tars-1.5-7b', 'router', 'kimi-k2:free', 'kimi-k2', 'glm-4.1v-9b-thinking', 'devstral-medium', 'grok-4', 'hunyuan-a13b-instruct:free', 'hunyuan-a13b-instruct', 'morph-v3-large', 'morph-v3-fast', 'sarvam-m', 'devstral-small-2505:free', 'devstral-small-2505', 'mai-ds-r1', 'qwq-32b-arliai-rpr-v1', 'deepcoder-14b-preview', 'kimi-vl-a3b-thinking', 'reka-flash-3', 'horizon-beta', 'glm-4.5', 'glm-4.5-air:free', 'glm-4.5-air', 'jamba-mini-1.7', 'jamba-large-1.7', 'ernie-4.5-21b-a3b', 'ernie-4.5-vl-28b-a3b', 'glm-4.5v', 'ernie-4.5-vl-424b-a47b', 'grok-code-fast-1', 'hermes-4-70b', 'hermes-4-405b', 'kimi-dev-72b', 'sonoma-dusk-alpha', 'sonoma-sky-alpha', 'kimi-k2-0905', 'seed-oss-36b-instruct', 'step3', 'longcat-flash-chat', 'nemotron-nano-9b-v2:free', 'nemotron-nano-9b-v2', 'molmo-7b-d', 'olmo-2-0325-32b-instruct', 'grok-4-fast:free', 'tongyi-deepresearch-30b-a3b', 'afm-4.5b', 'internvl3-78b', 'cydonia-24b-v4.1', 'relace-apply-3', 'grok-4-fast', 'glm-4.6', 'tongyi-deepresearch-30b-a3b:free', 'longcat-flash-chat:free', 'ernie-4.5-21b-a3b-thinking', 'l3.1-70b-hanami-x1', 'ring-1t', 'ling-1t', 'o3-deep-research', 'o4-mini-deep-research', 'minimax-m2:free', 'andromeda-alpha', 'lfm2-8b-a1b', 'lfm-2.2-6b', 'granite-4.0-h-micro', 'glm-4.6:exacto', 'kimi-k2-0905:exacto', 'nova-premier-v1', 'text-embedding-3-large', 'sonar-pro-search', 'voxtral-small-24b-2507', 'nemotron-nano-12b-v2-vl:free', 'nemotron-nano-12b-v2-vl', 'minimax-m2', 'kimi-linear-48b-a3b-instruct', 'polaris-alpha', 'kimi-k2-thinking', 'sherlock-dash-alpha', 'sherlock-think-alpha', 'kat-coder-pro:free', 'olmo-3-32b-think', 'olmo-3-7b-instruct', 'olmo-3-7b-think', 'grok-4.1-fast', 'grok-4.1-fast:free', 'cogito-v2.1-671b', 'intellect-3', 'tng-r1t-chimera:free', 'tng-r1t-chimera', 'bert-nebulon-alpha', 'nova-2-lite-v1:free', 'nova-2-lite-v1', 'ministral-14b-2512', 'ministral-8b-2512', 'ministral-3b-2512', 'trinity-mini:free', 'trinity-mini', 'olmo-3-32b-think:free', 'devstral-2512:free', 'devstral-2512', 'relace-search', 'glm-4.6v', 'rnj-1-instruct', 'bodybuilder', 'olmo-3.1-32b-think:free', 'mimo-v2-flash:free', 'nemotron-3-nano-30b-a3b:free', 'nemotron-3-nano-30b-a3b']
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