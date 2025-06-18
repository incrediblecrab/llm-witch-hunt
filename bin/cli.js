#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
const LLMWitchHunt = require('../src/index');

const program = new Command();

program
  .name('llm-witch-hunt')
  .description('Detect and audit AI/LLM-generated code and API usage in your codebase')
  .version(require('../package.json').version);

program
  .argument('[path]', 'Path to scan (default: current directory)', '.')
  .option('-o, --output <file>', 'Output file path', 'llm-witch-hunt-report.json')
  .option('-f, --format <format>', 'Output format (json)', 'json')
  .option('--include <patterns...>', 'Include patterns (glob)')
  .option('--exclude <patterns...>', 'Exclude patterns (glob)')
  .option('--no-context', 'Exclude code context from output')
  .option('--no-keys', 'Skip API key detection')
  .option('--fail-on-detect', 'Exit with code 1 if findings are detected')
  .option('-q, --quiet', 'Suppress console output except errors')
  .option('--json-only', 'Output only JSON to stdout (no file)')
  .action(async (scanPath, options) => {
    try {
      const absolutePath = path.resolve(scanPath);
      
      if (!options.quiet && !options.jsonOnly) {
        console.log(chalk.blue(`🔍 LLM Witch Hunt - Scanning ${path.relative(process.cwd(), absolutePath) || '.'}`));
        console.log(chalk.gray('Looking for AI/LLM patterns and API calls...\n'));
      }

      const scanner = new LLMWitchHunt({
        rootPath: absolutePath,
        include: options.include || ['**/*'],
        exclude: options.exclude || [],
        includeContext: options.context,
        detectKeys: options.keys
      });

      const { report, savedPath } = await scanner.generateReport(
        options.output,
        options.format
      );

      if (options.jsonOnly) {
        console.log(JSON.stringify(report, null, 2));
        return;
      }

      if (!options.quiet) {
        const summaryText = scanner.reporter.formatSummaryText(report);
        console.log(summaryText);
        
        if (report.summary.totalFindings > 0) {
          console.log('\n' + chalk.yellow('⚠️  Findings detected!'));
          
          if (report.summary.potentialKeys > 0) {
            console.log(chalk.red(`🔑 ${report.summary.potentialKeys} potential API keys found`));
          }
          
          if (report.summary.apiFindings > 0) {
            console.log(chalk.yellow(`📡 ${report.summary.apiFindings} API calls detected`));
          }
          
          if (report.summary.aiFindings > 0) {
            console.log(chalk.cyan(`🤖 ${report.summary.aiFindings} AI patterns found`));
          }
          
          if (savedPath && options.format === 'json') {
            console.log(`\n📄 Detailed report saved to: ${chalk.underline(savedPath)}`);
          }
        } else {
          console.log('\n' + chalk.green('✅ No AI/LLM patterns detected'));
        }
      }

      if (options.failOnDetect && report.summary.totalFindings > 0) {
        process.exit(1);
      }

    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      if (process.env.DEBUG) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

// Add version command explicitly
program
  .command('version')
  .description('Display version information')
  .action(() => {
    console.log(`llm-witch-hunt v${require('../package.json').version}`);
  });

// Add info command for debugging
program
  .command('info')
  .description('Display configuration and pattern information')
  .action(() => {
    const patterns = require('../src/patterns');
    console.log(chalk.blue('LLM Witch Hunt - Configuration'));
    console.log(chalk.gray('================================'));
    console.log(`Version: ${require('../package.json').version}`);
    console.log(`Node.js: ${process.version}`);
    console.log(`Platform: ${process.platform}`);
    console.log(`\nSupported file extensions:`);
    patterns.FILE_EXTENSIONS_TO_SCAN.forEach(ext => {
      console.log(`  ${ext}`);
    });
    console.log(`\nSupported LLM providers:`);
    Object.entries(patterns.LLM_APIS).forEach(([key, config]) => {
      console.log(`  ${config.provider} (${key})`);
    });
  });

program.parse();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('Unhandled Rejection at:'), promise, chalk.red('reason:'), reason);
  process.exit(1);
});