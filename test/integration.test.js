const LLMWitchHunt = require('../src/index');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

describe('LLMWitchHunt Integration', () => {
  let tempDir;
  let scanner;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'llm-witch-hunt-test-'));
    scanner = new LLMWitchHunt({ rootPath: tempDir });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('should scan a directory with patterns', async () => {
    // Create test file with detectable patterns
    const testFile = path.join(tempDir, 'test.js');
    const content = `
// Generated automatically for testing
import OpenAI from 'openai';

const aiResponse = await fetch('https://api.openai.com/v1/completions');
const llmOutput = await aiResponse.json();

function processData() {
  // This function was auto-generated
  return llmOutput.choices[0].text;
}
    `.trim();
    
    await fs.writeFile(testFile, content);

    const results = await scanner.scan();
    
    expect(results.totalFiles).toBe(1);
    expect(results.filesWithFindings).toBe(1);
    expect(results.aiSummary.total).toBeGreaterThan(0);
    expect(results.apiSummary.total).toBeGreaterThan(0);
  });

  it('should generate a complete report', async () => {
    const testFile = path.join(tempDir, 'ai-code.py');
    const content = `
# AI-generated script
import openai

def get_completion(prompt):
    # AI-assisted function for testing
    response = fetch('https://api.openai.com/v1/completions', {
        'method': 'POST',
        'headers': {'Authorization': 'Bearer sk-...'}
    })
    return response.json()
    `.trim();
    
    await fs.writeFile(testFile, content);

    const { report } = await scanner.generateReport();
    
    expect(report.metadata).toBeDefined();
    expect(report.summary).toBeDefined();
    expect(report.findings).toBeDefined();
    expect(report.findings.length).toBeGreaterThan(0);
    
    // Should have both AI patterns and API calls
    const aiFindings = report.findings.filter(f => f.type.startsWith('ai_'));
    const apiFindings = report.findings.filter(f => f.type === 'api_call');
    
    expect(aiFindings.length).toBeGreaterThan(0);
    expect(apiFindings.length).toBeGreaterThan(0);
  });

  it('should handle empty directories', async () => {
    const results = await scanner.scan();
    
    expect(results.totalFiles).toBe(0);
    expect(results.filesWithFindings).toBe(0);
    expect(results.aiSummary.total).toBe(0);
    expect(results.apiSummary.total).toBe(0);
  });

  it('should exclude specified patterns', async () => {
    // Create files in node_modules (should be excluded by default)
    const nodeModulesDir = path.join(tempDir, 'node_modules');
    await fs.mkdir(nodeModulesDir);
    
    const excludedFile = path.join(nodeModulesDir, 'test.js');
    await fs.writeFile(excludedFile, '// Auto-generated test code');
    
    // Create scanner with explicit exclude patterns
    const scannerWithExcludes = new LLMWitchHunt({ 
      rootPath: tempDir,
      exclude: ['node_modules/**', '**/node_modules/**']
    });
    
    const results = await scannerWithExcludes.scan();
    expect(results.totalFiles).toBe(0);
  });
});