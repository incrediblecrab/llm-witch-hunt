const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');
const { FILE_EXTENSIONS_TO_SCAN, DEFAULT_IGNORE_PATTERNS } = require('../patterns');

class FileScanner {
  constructor(options = {}) {
    this.rootPath = path.resolve(options.rootPath || process.cwd());
    this.include = Array.isArray(options.include) ? options.include : ['**/*'];
    this.exclude = Array.isArray(options.exclude) ? options.exclude : DEFAULT_IGNORE_PATTERNS;
    this.extensions = Array.isArray(options.extensions) ? options.extensions : FILE_EXTENSIONS_TO_SCAN;
    this.maxFileSize = typeof options.maxFileSize === 'number' && options.maxFileSize > 0 
      ? options.maxFileSize 
      : 1024 * 1024; // 1MB default
  }

  async scan() {
    const files = [];
    
    try {
      for (const pattern of this.include) {
        if (typeof pattern !== 'string') continue;
        
        const globPattern = path.join(this.rootPath, pattern);
        const matchedFiles = await glob(globPattern, {
          ignore: this.exclude.map(ex => path.join(this.rootPath, ex)),
          nodir: true,
          absolute: true
        });
        
        files.push(...matchedFiles);
      }
      
      // Remove duplicates and filter by extension
      const uniqueFiles = [...new Set(files)];
      const filteredFiles = uniqueFiles.filter(file => {
        // Ensure file is within rootPath for security
        const relativePath = path.relative(this.rootPath, file);
        if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
          return false;
        }
        return this.extensions.some(ext => file.endsWith(ext));
      });
      
      return filteredFiles;
    } catch (error) {
      throw new Error(`Failed to scan files: ${error.message}`);
    }
  }

  async readFile(filePath) {
    try {
      // Security check: ensure file is within rootPath
      const resolvedPath = path.resolve(filePath);
      const relativePath = path.relative(this.rootPath, resolvedPath);
      if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
        return {
          path: filePath,
          content: null,
          error: 'File outside of scan directory',
          size: 0
        };
      }

      const stats = await fs.stat(resolvedPath);
      
      if (!stats.isFile()) {
        return {
          path: filePath,
          content: null,
          error: 'Not a file',
          size: 0
        };
      }
      
      if (stats.size > this.maxFileSize) {
        return {
          path: filePath,
          content: null,
          error: `File too large (${stats.size} bytes)`,
          size: stats.size
        };
      }
      
      const content = await fs.readFile(resolvedPath, 'utf8');
      return {
        path: filePath,
        content,
        size: stats.size,
        error: null
      };
    } catch (error) {
      return {
        path: filePath,
        content: null,
        error: `Failed to read file: ${error.message}`,
        size: 0
      };
    }
  }

  async scanAndRead() {
    const filePaths = await this.scan();
    const files = [];
    
    for (const filePath of filePaths) {
      const fileData = await this.readFile(filePath);
      if (fileData.content !== null) {
        files.push(fileData);
      }
    }
    
    return files;
  }
}

module.exports = FileScanner;