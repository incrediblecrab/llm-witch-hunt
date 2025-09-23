# LLM Witch-Hunt 🔍

![npm version](https://img.shields.io/npm/v/llm-witch-hunt)
![MLoT](https://img.shields.io/badge/MLoT-ai-blue)

Detect and audit AI/LLM-generated code and API usage in your codebase.

![Demo](https://raw.githubusercontent.com/incrediblecrab/Packages-and-Extensions-Media/main/llm-witch-hunt.gif)

## Overview

LLM Witch-Hunt is a lightweight npm package that scans your codebase to identify:

- **AI-generated code markers** (comments, authors, variable names)
- **LLM API calls** to major providers (OpenAI, Anthropic, Google, etc.)
- **Potential API keys** for security auditing
- **Comprehensive reporting** for compliance and governance

Perfect for security teams, compliance officers, and engineering managers who need visibility into AI usage across their projects.

## Installation

```bash
# Global installation
npm install -g llm-witch-hunt

# Local installation
npm install --save-dev llm-witch-hunt

# Run without installation
npx llm-witch-hunt
```

## Quick Start

```bash
# Scan current directory
llm-witch-hunt

# Scan specific directory
llm-witch-hunt ./src

# Generate detailed report
llm-witch-hunt --output report.json

# Use in CI/CD (fails if AI patterns detected)
llm-witch-hunt --fail-on-detect --quiet
```

## Usage

### Command Line Interface

```bash
llm-witch-hunt [path] [options]

Arguments:
  path                    Path to scan (default: current directory)

Options:
  -o, --output <file>     Output file path (default: llm-witch-hunt-report.json)
  -f, --format <format>   Output format: json (default: json)
  --include <patterns>    Include file patterns (glob)
  --exclude <patterns>    Exclude file patterns (glob)
  --no-context           Exclude code context from output
  --no-keys              Skip API key detection
  --fail-on-detect       Exit with code 1 if findings detected
  -q, --quiet            Suppress console output except errors
  --json-only            Output only JSON to stdout
  -h, --help             Display help information
  -V, --version          Display version number
```

### Examples

```bash
# Basic scan with custom output
llm-witch-hunt --output ./reports/ai-audit.json

# Scan only JavaScript/TypeScript files
llm-witch-hunt --include "**/*.{js,ts,jsx,tsx}"

# Exclude test files and node_modules
llm-witch-hunt --exclude "**/*.test.js" --exclude "node_modules/**"

# Silent scan for CI/CD
llm-witch-hunt --fail-on-detect --quiet --no-context

# Get machine-readable output
llm-witch-hunt --json-only | jq '.summary'
```

### Programmatic Usage

```javascript
const LLMWitchHunt = require('llm-witch-hunt');

// Initialize scanner
const scanner = new LLMWitchHunt({
  rootPath: './src',
  include: ['**/*.js', '**/*.ts'],
  exclude: ['node_modules/**'],
  includeContext: true,
  detectKeys: true
});

// Perform scan
const scanResults = await scanner.scan();
console.log(`Found ${scanResults.aiSummary.total} AI patterns`);

// Generate report
const { report, savedPath } = await scanner.generateReport('audit.json');
console.log(`Report saved to ${savedPath}`);
```

## What It Detects

### AI-Generated Code Patterns

- **Comments**: `// AI-generated`, `/* Created by ChatGPT */`, `@ai-assisted`
- **Author Tags**: `Co-authored-by: GitHub Copilot`, `Generated-by: AI`
- **Variable Names**: `aiResponse`, `llmOutput`, `gptResult`, `promptTemplate`
- **Import Statements**: `import OpenAI from 'openai'`, `require('@anthropic-ai/sdk')`

### LLM API Providers

- **OpenAI**: `api.openai.com`, `openai.createCompletion()`
- **Anthropic**: `api.anthropic.com`, `anthropic.messages.create()`
- **Google**: `generativelanguage.googleapis.com`, `gemini.generateContent()`
- **Cohere**: `api.cohere.ai`, `cohere.generate()`
- **Hugging Face**: `api-inference.huggingface.co`
- **Azure OpenAI**: `*.openai.azure.com`
- **Replicate**: `api.replicate.com`

### Security Features

- **API Key Detection**: Identifies potential API keys with pattern matching
- **Key Masking**: Automatically masks detected keys in output for security
- **Severity Levels**: Categorizes findings by risk level (high/medium/low/info)

## Output Format

The tool generates comprehensive JSON reports:

```json
{
  "metadata": {
    "scanDate": "2024-01-15T10:30:00.000Z",
    "version": "0.1.0",
    "totalFilesScanned": 156,
    "totalFilesWithFindings": 23
  },
  "summary": {
    "aiFindings": 47,
    "apiFindings": 12,
    "potentialKeys": 3,
    "totalFindings": 62
  },
  "findings": [
    {
      "file": "src/utils/helper.js",
      "type": "ai_comment",
      "category": "comment",
      "line": 42,
      "pattern": "AI[- ]generated",
      "match": "AI-generated",
      "context": "// This function was AI-generated",
      "severity": "info"
    }
  ],
  "statistics": {
    "aiPatterns": { "total": 47, "byCategory": {...} },
    "apiCalls": { "total": 12, "byProvider": {...} },
    "fileTypes": { ".js": {"count": 89, "withFindings": 12} }
  }
}
```

## Supported File Types

JavaScript, TypeScript, Python, Java, C#, C++, Go, Rust, PHP, Ruby, Swift, Kotlin, Scala, R, Objective-C, Vue, Svelte

## CI/CD Integration

### GitHub Actions

```yaml
name: AI Code Audit
on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npx llm-witch-hunt --fail-on-detect --output ai-audit.json
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: ai-audit-report
          path: ai-audit.json
```

### Pre-commit Hook

```bash
#!/bin/sh
npx llm-witch-hunt --fail-on-detect --quiet
```

## Configuration

Create a `.llmwitchhuntrc.json` file for persistent configuration:

```json
{
  "include": ["src/**/*", "lib/**/*"],
  "exclude": ["node_modules/**", "dist/**", "**/*.test.js"],
  "includeContext": true,
  "detectKeys": true,
  "failOnDetect": false
}
```

## Contributing

Contributions are welcome! 

### Development Setup

```bash
git clone https://github.com/incrediblecrab/llm-witch-hunt.git
cd llm-witch-hunt
npm install
npm test
```

### Adding New Patterns

To add detection patterns for new AI tools or providers:

1. Update `src/patterns.js` with new regex patterns
2. Add corresponding tests in `test/patterns.test.js`
3. Update documentation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

- [ ] HTML report generation
- [ ] IDE plugins (VS Code, IntelliJ)
- [ ] Custom rule configuration
- [ ] Cost estimation for API usage
- [ ] Integration with SAST tools
- [ ] AI code quality scoring

## Support

- 📖 Documentation: See this README and inline code comments
- 🐛 Issues: [Report bugs on GitHub](https://github.com/incrediblecrab/llm-witch-hunt/issues)
- 💬 Questions: [Check existing issues](https://github.com/incrediblecrab/llm-witch-hunt/issues) or create a new one

---

## Resources

- 📺 [Watch Demo Video](https://youtu.be/XuXNDf0LUGU)
- 🌐 [Visit MLoT Page](https://mlot.ai/llm-witch-hunt/)
- 📦 [View on GitHub](https://github.com/incrediblecrab/llm-witch-hunt)
- 🔒 [Privacy Policy](https://mlot.ai/privacy)

## Publisher

**Max's Lab of Things**
Visit [mlot.ai](https://mlot.ai/)

---

**Disclaimer**: This tool is designed for auditing and compliance purposes. It helps identify potential AI-generated code but should not be used as the sole method for making important decisions about code quality or security.