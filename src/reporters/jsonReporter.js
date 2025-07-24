const fs = require('fs').promises;
const path = require('path');

class JSONReporter {
  constructor(options = {}) {
    this.includeContext = options.includeContext !== false;
    this.includeStats = options.includeStats !== false;
  }

  async generate(scanResults) {
    const report = {
      metadata: {
        scanDate: new Date().toISOString(),
        version: require('../../package.json').version,
        totalFilesScanned: scanResults.totalFiles,
        totalFilesWithFindings: scanResults.filesWithFindings
      },
      summary: {
        aiFindings: scanResults.aiSummary.total,
        apiFindings: scanResults.apiSummary.total,
        potentialKeys: scanResults.potentialKeys?.length || 0,
        totalFindings: scanResults.aiSummary.total + scanResults.apiSummary.total + (scanResults.potentialKeys?.length || 0)
      },
      statistics: {
        aiPatterns: scanResults.aiSummary,
        apiCalls: scanResults.apiSummary,
        fileTypes: this._analyzeFileTypes(scanResults.results)
      },
      findings: []
    };

    // Process all findings
    scanResults.results.forEach(fileResult => {
      const relativePath = path.relative(process.cwd(), fileResult.file.path);
      
      // Add AI findings
      fileResult.aiFindings.forEach(finding => {
        report.findings.push({
          file: relativePath,
          type: finding.type,
          category: finding.category,
          line: finding.line,
          column: finding.column,
          pattern: finding.pattern,
          match: finding.match,
          context: this.includeContext ? finding.context : undefined,
          severity: this._getSeverity(finding)
        });
      });

      // Add API findings
      fileResult.apiFindings.forEach(finding => {
        report.findings.push({
          file: relativePath,
          type: finding.type,
          provider: finding.provider,
          line: finding.line,
          column: finding.column,
          pattern: finding.pattern,
          match: finding.match,
          context: this.includeContext ? finding.context : undefined,
          severity: this._getSeverity(finding)
        });
      });

      // Add potential key findings
      if (fileResult.potentialKeys) {
        fileResult.potentialKeys.forEach(finding => {
          report.findings.push({
            file: relativePath,
            type: finding.type,
            line: finding.line,
            pattern: finding.pattern,
            match: finding.match,
            context: this.includeContext ? finding.context : undefined,
            severity: 'high'
          });
        });
      }
    });

    return report;
  }

  async save(report, outputPath = 'llm-witch-hunt-report.json') {
    const jsonContent = JSON.stringify(report, null, 2);
    await fs.writeFile(outputPath, jsonContent, 'utf8');
    return outputPath;
  }

  _getSeverity(finding) {
    if (finding.type === 'potential_api_key') return 'high';
    if (finding.type === 'api_call') return 'medium';
    if (finding.category === 'import') return 'medium';
    if (finding.category === 'comment' || finding.category === 'author') return 'info';
    return 'low';
  }

  _analyzeFileTypes(results) {
    const fileTypes = {};
    
    results.forEach(result => {
      const ext = path.extname(result.file.path);
      if (!fileTypes[ext]) {
        fileTypes[ext] = {
          count: 0,
          withFindings: 0,
          totalFindings: 0
        };
      }
      
      fileTypes[ext].count++;
      
      const totalFindings = result.aiFindings.length + result.apiFindings.length + (result.potentialKeys?.length || 0);
      if (totalFindings > 0) {
        fileTypes[ext].withFindings++;
        fileTypes[ext].totalFindings += totalFindings;
      }
    });
    
    return fileTypes;
  }

  formatSummaryText(report) {
    const lines = [];
    lines.push(`LLM Witch Hunt - Scan Results`);
    lines.push(`============================`);
    lines.push(`Scan Date: ${report.metadata.scanDate}`);
    lines.push(`Files Scanned: ${report.metadata.totalFilesScanned}`);
    lines.push(`Files with Findings: ${report.metadata.totalFilesWithFindings}`);
    lines.push(``);
    lines.push(`Summary:`);
    lines.push(`- AI Patterns Found: ${report.summary.aiFindings}`);
    lines.push(`- API Calls Found: ${report.summary.apiFindings}`);
    lines.push(`- Potential API Keys: ${report.summary.potentialKeys}`);
    lines.push(`- Total Findings: ${report.summary.totalFindings}`);
    
    if (report.statistics.apiCalls.uniqueProviders.length > 0) {
      lines.push(``);
      lines.push(`API Providers Detected:`);
      report.statistics.apiCalls.uniqueProviders.forEach(provider => {
        const count = report.statistics.apiCalls.byProvider[provider];
        lines.push(`- ${provider}: ${count} references`);
      });
    }
    
    return lines.join('\n');
  }
}

module.exports = JSONReporter;