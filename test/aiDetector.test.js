const AIDetector = require('../src/detectors/aiDetector');

describe('AIDetector', () => {
  let detector;

  beforeEach(() => {
    detector = new AIDetector();
  });

  describe('detect', () => {
    it('should detect AI comments', () => {
      const content = `
function hello() {
  // AI-generated function
  console.log("Hello World");
}
      `.trim();

      const findings = detector.detect(content, 'test.js');
      expect(findings).toHaveLength(1);
      expect(findings[0].type).toBe('ai_comment');
      expect(findings[0].category).toBe('comment');
      expect(findings[0].line).toBe(2);
    });

    it('should detect AI-related variable names', () => {
      const content = `
const aiResponse = await fetch('/api');
let llmOutput = processData(aiResponse);
      `.trim();

      const findings = detector.detect(content, 'test.js');
      expect(findings.length).toBeGreaterThan(0);
      
      const variableFindings = findings.filter(f => f.category === 'variable');
      expect(variableFindings.length).toBeGreaterThan(0);
    });

    it('should detect AI-related imports', () => {
      const content = `
import OpenAI from 'openai';
const { Anthropic } = require('@anthropic-ai/sdk');
      `.trim();

      const findings = detector.detect(content, 'test.js');
      expect(findings.length).toBeGreaterThan(0);
      
      const importFindings = findings.filter(f => f.category === 'import');
      expect(importFindings.length).toBeGreaterThan(0);
    });

    it('should return empty array for clean code', () => {
      const content = `
function calculateSum(a, b) {
  return a + b;
}
      `.trim();

      const findings = detector.detect(content, 'test.js');
      expect(findings).toHaveLength(0);
    });
  });

  describe('getSummary', () => {
    it('should provide correct summary statistics', () => {
      const findings = [
        { type: 'ai_comment', category: 'comment' },
        { type: 'ai_comment', category: 'comment' },
        { type: 'ai_code', category: 'variable' }
      ];

      const summary = detector.getSummary(findings);
      expect(summary.total).toBe(3);
      expect(summary.byCategory.comment).toBe(2);
      expect(summary.byCategory.variable).toBe(1);
      expect(summary.byType.ai_comment).toBe(2);
      expect(summary.byType.ai_code).toBe(1);
    });
  });
});