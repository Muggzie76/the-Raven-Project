/**
 * Raven Website Minification Script
 * This script minifies CSS and JS files in the public directory
 */
const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { minify } = require('terser');
const htmlMinifier = require('html-minifier').minify;

// Paths
const PUBLIC_DIR = path.join(__dirname, 'public');
const DIST_DIR = path.join(__dirname, 'public', 'dist');

/**
 * Recursively delete a directory
 * @param {string} dirPath - Path to the directory to delete
 */
function deleteDirRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`Cleaning directory: ${dirPath}`);
    
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`Successfully removed directory: ${dirPath}`);
    } catch (err) {
      console.error(`Error removing directory ${dirPath}:`, err);
    }
  }
}

// Clean up the dist directory before starting
deleteDirRecursive(DIST_DIR);

// Create dist directory if it doesn't exist
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Configuration options for minification
const minifyOptions = {
  removeComments: true,
  collapseWhitespace: true,
  minifyJS: true,
  minifyCSS: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true
};

// Minify CSS files
async function minifyCSS() {
  console.log('Minifying CSS files...');
  
  try {
    const cssFiles = fs.readdirSync(PUBLIC_DIR)
      .filter(file => file.endsWith('.css'))
      .map(file => path.join(PUBLIC_DIR, file));
    
    for (const cssFile of cssFiles) {
      const filename = path.basename(cssFile);
      const outputFilename = filename.replace('.css', '.min.css');
      const outputPath = path.join(DIST_DIR, outputFilename);
      
      // Read the file content
      const cssContent = fs.readFileSync(cssFile, 'utf8');
      
      // Minify using clean-css
      const minified = new CleanCSS().minify(cssContent);
      
      // Write the output file
      fs.writeFileSync(outputPath, minified.styles);
      
      console.log(`Minified ${filename} -> ${outputFilename}`);
      
      // Get file size reduction
      const originalSize = fs.statSync(cssFile).size;
      const minifiedSize = fs.statSync(outputPath).size;
      const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
      console.log(`  Size reduced by ${reduction}% (${originalSize} -> ${minifiedSize} bytes)`);
    }
  } catch (error) {
    console.error('Error minifying CSS:', error);
  }
}

// Minify JS files
async function minifyJS() {
  console.log('Minifying JS files...');
  
  try {
    const jsFiles = fs.readdirSync(PUBLIC_DIR)
      .filter(file => file.endsWith('.js') && !file.includes('min.js'))
      .map(file => path.join(PUBLIC_DIR, file));
    
    for (const jsFile of jsFiles) {
      const filename = path.basename(jsFile);
      const outputFilename = filename.replace('.js', '.min.js');
      const outputPath = path.join(DIST_DIR, outputFilename);
      
      // Read the file content
      const jsContent = fs.readFileSync(jsFile, 'utf8');
      
      // Minify using terser
      const minified = await minify(jsContent, {
        compress: true,
        mangle: true
      });
      
      // Write the output file
      fs.writeFileSync(outputPath, minified.code);
      
      console.log(`Minified ${filename} -> ${outputFilename}`);
      
      // Get file size reduction
      const originalSize = fs.statSync(jsFile).size;
      const minifiedSize = fs.statSync(outputPath).size;
      const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
      console.log(`  Size reduced by ${reduction}% (${originalSize} -> ${minifiedSize} bytes)`);
    }
  } catch (error) {
    console.error('Error minifying JS:', error);
  }
}

/**
 * Minifies HTML content from source to destination
 * @param {string} sourcePath - Path to source HTML file
 * @param {string} destPath - Path to destination file
 */
function minifyHtml(sourcePath, destPath) {
  try {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const minified = htmlMinifier(content, minifyOptions);
    
    // Ensure directory exists
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(destPath, minified);
    console.log(`Minified ${sourcePath} to ${destPath}`);
  } catch (err) {
    console.error(`Error minifying ${sourcePath}:`, err);
  }
}

/**
 * Process all HTML files in a directory
 * @param {string} sourceDir - Source directory
 * @param {string} destDir - Destination directory
 */
function processDirectory(sourceDir, destDir) {
  // Skip processing if sourceDir is the dist directory to prevent recursion
  if (sourceDir === DIST_DIR || sourceDir.includes('/dist/')) {
    return;
  }
  
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  try {
    const files = fs.readdirSync(sourceDir);
    
    files.forEach(file => {
      // Skip processing dist directories to prevent recursion
      if (file === 'dist') {
        return;
      }
      
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(destDir, file);
      
      try {
        const stats = fs.statSync(sourcePath);
        
        if (stats.isDirectory()) {
          // Create nested directory if it doesn't exist
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true });
          }
          processDirectory(sourcePath, destPath);
        } else if (file.endsWith('.html')) {
          minifyHtml(sourcePath, destPath);
        } else {
          // Ensure the target directory exists
          const dir = path.dirname(destPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          // Copy non-HTML files directly
          fs.copyFileSync(sourcePath, destPath);
        }
      } catch (err) {
        console.error(`Error processing ${sourcePath}:`, err);
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${sourceDir}:`, err);
  }
}

// Run minification
async function run() {
  console.log('Starting minification process...');
  await minifyCSS();
  await minifyJS();
  processDirectory(PUBLIC_DIR, DIST_DIR);
  console.log('Minification complete!');
}

run().catch(err => {
  console.error('Error during minification:', err);
});

module.exports = {
  minifyHtml,
  processDirectory
};