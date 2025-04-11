/**
 * Raven Website Minification Script
 * This script minifies CSS and JS files in the public directory
 */
const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { minify } = require('terser');

// Paths
const PUBLIC_DIR = path.join(__dirname, 'public');
const DIST_DIR = path.join(__dirname, 'public', 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

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

// Run minification
async function run() {
  console.log('Starting minification process...');
  await minifyCSS();
  await minifyJS();
  console.log('Minification complete!');
}

run().catch(err => {
  console.error('Error during minification:', err);
}); 