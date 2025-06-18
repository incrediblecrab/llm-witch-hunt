const { AI_PATTERNS } = require('../patterns');

class AIDetector {
  constructor() {
    this.patterns = AI_PATTERNS;
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
      
      // Skip empty lines and very long lines (potential minified code)
      if (!trimmedLine || trimmedLine.length > 500) {
        return;
      }
      
      // Check comment patterns
      for (const pattern of this.patterns.comments) {
        try {
          const matches = trimmedLine.match(pattern);
          if (matches) {
            findings.push({
              type: 'ai_comment',
              pattern: pattern.source,
              match: matches[0].substring(0, 100), // Limit match length
              line: lineNumber,
              column: line.indexOf(matches[0]) + 1,
              context: trimmedLine.substring(0, 200), // Limit context length
              category: 'comment'
            });
          }
        } catch (error) {
          // Skip invalid regex matches
          continue;
        }
      }
      
      // Check author patterns
      for (const pattern of this.patterns.authors) {
        try {
          const matches = trimmedLine.match(pattern);
          if (matches) {
            findings.push({
              type: 'ai_author',
              pattern: pattern.source,
              match: matches[0].substring(0, 100),
              line: lineNumber,
              column: line.indexOf(matches[0]) + 1,
              context: trimmedLine.substring(0, 200),
              category: 'author'
            });
          }
        } catch (error) {
          continue;
        }
      }
      
      // Check variable/function name patterns
      for (const pattern of this.patterns.variables) {
        try {
          const matches = trimmedLine.match(pattern);
          if (matches) {
            findings.push({
              type: 'ai_code',
              pattern: pattern.source,
              match: matches[0].substring(0, 100),
              line: lineNumber,
              column: line.indexOf(matches[0]) + 1,
              context: trimmedLine.substring(0, 200),
              category: 'variable'
            });
          }
        } catch (error) {
          continue;
        }
      }
      
      // Check import patterns
      for (const pattern of this.patterns.imports) {
        try {
          const matches = trimmedLine.match(pattern);
          if (matches) {
            findings.push({
              type: 'ai_import',
              pattern: pattern.source,
              match: matches[0].substring(0, 100),
              line: lineNumber,
              column: line.indexOf(matches[0]) + 1,
              context: trimmedLine.substring(0, 200),
              category: 'import'
            });
          }
        } catch (error) {
          continue;
        }
      }
    });
    
    // Limit total findings to prevent memory issues
    return findings.slice(0, 1000);
  }

  getSummary(findings) {
    const summary = {
      total: findings.length,
      byCategory: {},
      byType: {}
    };
    
    findings.forEach(finding => {
      summary.byCategory[finding.category] = (summary.byCategory[finding.category] || 0) + 1;
      summary.byType[finding.type] = (summary.byType[finding.type] || 0) + 1;
    });
    
    return summary;
  }
}

module.exports = AIDetector;