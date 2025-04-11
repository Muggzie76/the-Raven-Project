/**
 * Automated Nuance Article Import Script
 * 
 * This script is designed to be run as a cron job to automatically
 * import articles from Nuance.xyz at scheduled intervals.
 * 
 * Usage: node scripts/auto-import.js [--force]
 * 
 * Configuration can be set in the .env file:
 * NUANCE_IMPORT_REFRESH_RATE=24 (hours)
 * NUANCE_IMPORT_LIMIT=10
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');
require('dotenv').config();

// Configuration
const LOG_FILE = path.join(__dirname, '../logs/auto-import.log');
const HISTORY_FILE = path.join(__dirname, '../logs/import-history.json');
const DEFAULT_REFRESH_RATE = 24; // hours
const DEFAULT_IMPORT_LIMIT = 10;

// Get configuration from environment variables
const refreshRate = parseInt(process.env.NUANCE_IMPORT_REFRESH_RATE, 10) || DEFAULT_REFRESH_RATE;
const importLimit = parseInt(process.env.NUANCE_IMPORT_LIMIT, 10) || DEFAULT_IMPORT_LIMIT;

// Parse command line arguments
const args = process.argv.slice(2);
const forceImport = args.includes('--force');

/**
 * Log a message to both console and log file
 */
async function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  console.log(logMessage);
  
  try {
    // Ensure logs directory exists
    await fs.mkdir(path.join(__dirname, '../logs'), { recursive: true });
    
    // Append log message
    await fs.appendFile(LOG_FILE, logMessage + '\n');
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
}

/**
 * Check if an import is needed based on refresh rate
 */
async function shouldRunImport() {
  if (forceImport) {
    await log('Force import requested. Import will run regardless of schedule.');
    return true;
  }
  
  try {
    // Create history file if it doesn't exist
    try {
      await fs.access(HISTORY_FILE);
    } catch (error) {
      await fs.writeFile(HISTORY_FILE, JSON.stringify({ lastImport: null, imports: [] }));
    }
    
    // Read import history
    const history = JSON.parse(await fs.readFile(HISTORY_FILE, 'utf8'));
    
    if (!history.lastImport) {
      await log('No previous import found. Import will run.');
      return true;
    }
    
    // Calculate time since last import
    const lastImport = new Date(history.lastImport);
    const now = new Date();
    const hoursSinceLastImport = (now - lastImport) / (1000 * 60 * 60);
    
    await log(`Last import was ${hoursSinceLastImport.toFixed(2)} hours ago. Refresh rate is ${refreshRate} hours.`);
    
    return hoursSinceLastImport >= refreshRate;
  } catch (error) {
    await log(`Error checking import history: ${error.message}. Import will run.`, 'error');
    return true;
  }
}

/**
 * Update import history
 */
async function updateImportHistory(result) {
  try {
    // Read existing history
    let history;
    try {
      history = JSON.parse(await fs.readFile(HISTORY_FILE, 'utf8'));
    } catch (error) {
      history = { lastImport: null, imports: [] };
    }
    
    // Add new import record
    const now = new Date();
    
    const importRecord = {
      timestamp: now.toISOString(),
      result: result.success ? 'success' : 'error',
      articlesImported: result.articlesImported || 0,
      error: result.error || null
    };
    
    history.lastImport = now.toISOString();
    history.imports.unshift(importRecord); // Add to beginning of array
    
    // Keep only the last 100 imports
    if (history.imports.length > 100) {
      history.imports = history.imports.slice(0, 100);
    }
    
    // Save updated history
    await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
    
    await log('Updated import history.');
  } catch (error) {
    await log(`Error updating import history: ${error.message}`, 'error');
  }
}

/**
 * Run the import script
 */
async function runImport() {
  return new Promise((resolve) => {
    const args = [
      path.join(__dirname, 'nuance-import.js'),
      forceImport ? '--force' : '',
      `--limit=${importLimit}`
    ].filter(Boolean);
    
    const importProcess = spawn('node', args);
    
    let stdout = '';
    let stderr = '';
    let articlesImported = 0;
    
    importProcess.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      console.log(output);
      
      // Try to extract number of articles imported
      const match = output.match(/Processed (\d+) articles/);
      if (match && match[1]) {
        articlesImported = parseInt(match[1], 10);
      }
    });
    
    importProcess.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      console.error(output);
    });
    
    importProcess.on('close', (code) => {
      if (code === 0) {
        resolve({
          success: true,
          articlesImported,
          output: stdout
        });
      } else {
        resolve({
          success: false,
          error: stderr || `Import process exited with code ${code}`,
          output: stdout
        });
      }
    });
  });
}

/**
 * Main function
 */
async function main() {
  try {
    await log('Starting automated Nuance article import check');
    
    // Check if import is needed
    const shouldImport = await shouldRunImport();
    
    if (!shouldImport) {
      await log('Import not needed based on refresh rate. Exiting.');
      return;
    }
    
    // Run import
    await log('Running article import...');
    const result = await runImport();
    
    if (result.success) {
      await log(`Import completed successfully. Imported ${result.articlesImported} articles.`);
    } else {
      await log(`Import failed: ${result.error}`, 'error');
    }
    
    // Update import history
    await updateImportHistory(result);
    
    await log('Automated import process completed.');
  } catch (error) {
    await log(`Critical error during import: ${error.message}`, 'error');
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 