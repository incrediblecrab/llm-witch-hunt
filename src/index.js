const FileScanner = require('./scanner/fileScanner');
const AIDetector = require('./detectors/aiDetector');
const APIDetector = require('./detectors/apiDetector');
const JSONReporter = require('./reporters/jsonReporter');

class LLMWitchHunt {
  constructor(options = {}) {
    this.options = {
      rootPath: options.rootPath || process.cwd(),
      include: options.include || ['**/*'],
      exclude: options.exclude || [],
      includeContext: options.includeContext !== false,
      detectKeys: options.detectKeys !== false,
      ...options
    };
    
    this.scanner = new FileScanner(this.options);
    this.aiDetector = new AIDetector();
    this.apiDetector = new APIDetector();
    this.reporter = new JSONReporter(this.options);
  }

  async scan() {
    const files = await this.scanner.scanAndRead();
    const results = [];
    
    for (const file of files) {
      const aiFindings = this.aiDetector.detect(file.content, file.path);
      const apiFindings = this.apiDetector.detect(file.content, file.path);
      let potentialKeys = [];
      
      if (this.options.detectKeys) {
        potentialKeys = this.apiDetector.detectPotentialKeys(file.content);
      }
      
      results.push({
        file,
        aiFindings,
        apiFindings,
        potentialKeys
      });
    }
    
    return this._compileScanResults(results);
  }

  async generateReport(outputPath, format = 'json') {
    const scanResults = await this.scan();
    const report = await this.reporter.generate(scanResults);
    
    if (format === 'json') {
      const savedPath = await this.reporter.save(report, outputPath);
      return { report, savedPath };
    }
    
    return { report };
  }

  _compileScanResults(results) {
    const aiFindings = [];
    const apiFindings = [];
    const potentialKeys = [];
    
    results.forEach(result => {
      aiFindings.push(...result.aiFindings);
      apiFindings.push(...result.apiFindings);
      if (result.potentialKeys) {
        potentialKeys.push(...result.potentialKeys);
      }
    });
    
    return {
      results,
      totalFiles: results.length,
      filesWithFindings: results.filter(r => 
        r.aiFindings.length > 0 || 
        r.apiFindings.length > 0 || 
        (r.potentialKeys && r.potentialKeys.length > 0)
      ).length,
      aiSummary: this.aiDetector.getSummary(aiFindings),
      apiSummary: this.apiDetector.getSummary(apiFindings),
      potentialKeys
    };
  }
}

module.exports = LLMWitchHunt;