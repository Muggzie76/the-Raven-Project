# Minification Script Documentation

The `minify.js` script is a utility for minifying CSS, JavaScript, and HTML files for the Raven Website. This document explains how the script works, how to use it, and how to troubleshoot common issues.

## Overview

The minification script performs the following operations:
- Minifies CSS files using `clean-css`
- Minifies JavaScript files using `terser`
- Minifies HTML files using `html-minifier`
- Copies all other files to the destination directory without modification
- Outputs size reduction statistics for minified files

## Prerequisites

The script requires the following Node.js packages:
- `clean-css`: For CSS minification
- `terser`: For JavaScript minification
- `html-minifier`: For HTML minification
- `fs` and `path`: Node.js built-in modules

These dependencies are listed in the project's package.json file.

## Usage

### Running the Script

To run the minification script, use the following command:

```bash
npm run minify
```

This will:
1. Delete the existing `public/dist` directory (if it exists)
2. Create a new empty `public/dist` directory
3. Minify all CSS files in the `public` directory and save them to `public/dist` with `.min.css` extension
4. Minify all JS files in the `public` directory and save them to `public/dist` with `.min.js` extension
5. Process all HTML files and subdirectories, minifying HTML files and copying other files
6. Output statistics and log information to the console

### Configuration

The script uses the following configuration:

- **Input Directory**: `public/` 
- **Output Directory**: `public/dist/`
- **HTML Minification Options**:
  - Remove comments
  - Collapse whitespace
  - Minify inline JS/CSS
  - Remove redundant attributes
  - Remove empty attributes
  - Remove script/style type attributes
  - Use short doctype

## How It Works

### Directory Cleanup

The script starts by cleaning up the `dist` directory to ensure a fresh start and avoid potential issues with old files:

```javascript
function deleteDirRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}
```

### CSS Minification

CSS files are processed using the `clean-css` library:

```javascript
async function minifyCSS() {
  // Find all CSS files
  const cssFiles = fs.readdirSync(PUBLIC_DIR)
    .filter(file => file.endsWith('.css'))
    .map(file => path.join(PUBLIC_DIR, file));
  
  // Process each file
  for (const cssFile of cssFiles) {
    // Read content
    const cssContent = fs.readFileSync(cssFile, 'utf8');
    
    // Minify using clean-css
    const minified = new CleanCSS().minify(cssContent);
    
    // Write output and log stats
    // ...
  }
}
```

### JavaScript Minification

JavaScript files are processed using the `terser` library:

```javascript
async function minifyJS() {
  // Find all JS files (excluding already minified ones)
  const jsFiles = fs.readdirSync(PUBLIC_DIR)
    .filter(file => file.endsWith('.js') && !file.includes('min.js'))
    .map(file => path.join(PUBLIC_DIR, file));
  
  // Process each file
  for (const jsFile of jsFiles) {
    // Read content
    const jsContent = fs.readFileSync(jsFile, 'utf8');
    
    // Minify using terser
    const minified = await minify(jsContent, {
      compress: true,
      mangle: true
    });
    
    // Write output and log stats
    // ...
  }
}
```

### HTML Minification

HTML files are processed using the `html-minifier` library:

```javascript
function minifyHtml(sourcePath, destPath) {
  // Read content
  const content = fs.readFileSync(sourcePath, 'utf8');
  
  // Minify using html-minifier
  const minified = htmlMinifier(content, minifyOptions);
  
  // Write output
  fs.writeFileSync(destPath, minified);
}
```

### Directory Processing

The script recursively processes all directories, with safeguards to prevent infinite recursion:

```javascript
function processDirectory(sourceDir, destDir) {
  // Skip dist directory to prevent recursion
  if (sourceDir === DIST_DIR || sourceDir.includes('/dist/')) {
    return;
  }
  
  // Create destination directory
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // Process all files
  const files = fs.readdirSync(sourceDir);
  
  files.forEach(file => {
    // Skip dist directories
    if (file === 'dist') {
      return;
    }
    
    // Process file based on type
    // ...
  });
}
```

## Troubleshooting

### Common Issues

1. **"ENOSPC: no space left on device"**
   - This error occurs when the disk is full or when there's a recursive copying issue
   - Solution: Ensure the script doesn't recursively copy files into the dist directory
   - Check that you have sufficient disk space available

2. **"Identifier has already been declared"**
   - This error occurs when there's a naming conflict between imported libraries and custom functions
   - Solution: Rename one of the conflicting variables/functions

3. **"Error processing [file]"**
   - Check file permissions
   - Verify the file exists
   - Ensure there are no special characters in the filename that could cause issues

4. **Missing output files**
   - Verify the output directory structure exists
   - Check for errors in the console output
   - Make sure the input files exist and are readable

### Logging

The script includes comprehensive logging to help troubleshoot issues:
- Startup information
- Directory cleanup status
- Minification progress for each file
- File size statistics (original vs. minified)
- Error messages for failed operations

If you encounter issues, check the console output for specific error messages that can help identify the problem.

## Extending the Script

To add support for additional file types or customize the minification process:

1. For new file types, add a new handler function similar to `minifyCSS()` or `minifyJS()`
2. Modify the `processDirectory()` function to recognize and process the new file type
3. Add any required libraries to the project dependencies
4. Update the minification options as needed

## Performance Considerations

The script processes all files in a single run, which can be memory-intensive for large projects. For very large sites, consider:

1. Processing files in batches
2. Adding an option to only process changed files
3. Implementing parallel processing for independent files

## Security Notes

The script operates only on files within the project directory and doesn't execute any external code. However, as with any build script, be cautious when minifying third-party code as minification can sometimes obscure malicious code. 