/**
 * Nuance Article Import Script
 * 
 * This script automatically imports articles from Nuance.xyz to the Raven website.
 * It fetches articles from Nuance, processes them, and adds them to the public/articles directory.
 * 
 * Features:
 * - Fetches articles from Nuance.xyz
 * - Cleans and formats content for the Raven website
 * - Creates proper directory structure for each article
 * - Handles images and other media
 * - Updates article metadata
 * - Prevents duplicate imports
 * 
 * Usage: node scripts/nuance-import.js [--force] [--limit=10]
 * Options:
 *  --force: Force reimport of all articles
 *  --limit=N: Limit import to N most recent articles
 */

const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const sanitize = require('sanitize-filename');
const sharp = require('sharp');
const crypto = require('crypto');
const { execSync } = require('child_process');

// Configuration
const NUANCE_URL = 'https://nuance.xyz/publication/Raven';
const ARTICLES_DIR = path.join(__dirname, '../public/articles');
const IMAGES_DIR = path.join(__dirname, '../public/articles/images');
const LOG_FILE = path.join(__dirname, '../logs/nuance-import.log');

// Parse command line arguments
const args = process.argv.slice(2);
const FORCE_REIMPORT = args.includes('--force');
const LIMIT_MATCH = args.find(arg => arg.startsWith('--limit='));
const IMPORT_LIMIT = LIMIT_MATCH ? parseInt(LIMIT_MATCH.split('=')[1], 10) : Infinity;

// Ensure directories exist
async function ensureDirectoriesExist() {
  try {
    await fs.mkdir(path.join(__dirname, '../logs'), { recursive: true });
    await fs.mkdir(ARTICLES_DIR, { recursive: true });
    await fs.mkdir(IMAGES_DIR, { recursive: true });
    console.log('✅ Directories created/verified');
  } catch (error) {
    console.error('Error creating directories:', error);
    throw error;
  }
}

// Log to both console and file
async function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  console.log(logMessage);
  
  try {
    await fs.appendFile(LOG_FILE, logMessage + '\n');
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
}

// Create a hash of the article content for comparison
function createContentHash(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

// Fetch articles from Nuance
async function fetchNuanceArticles() {
  try {
    log('Fetching articles from Nuance.xyz...');
    
    // First, fetch the publication page
    const response = await fetch(NUANCE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch Nuance publication page: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Find all article links
    const articleLinks = Array.from(document.querySelectorAll('a[href*="/article/"]'))
      .map(a => a.href)
      .filter(href => href.includes('/article/'))
      .map(href => {
        if (href.startsWith('/')) {
          return `https://nuance.xyz${href}`;
        }
        return href;
      });
    
    // Remove duplicates
    const uniqueLinks = [...new Set(articleLinks)];
    
    log(`Found ${uniqueLinks.length} unique article links`);
    
    // Limit the number of articles to process if specified
    const limitedLinks = uniqueLinks.slice(0, IMPORT_LIMIT);
    
    return limitedLinks;
  } catch (error) {
    log(`Error fetching Nuance articles: ${error.message}`, 'error');
    throw error;
  }
}

// Extract article content from a Nuance page
async function extractArticleContent(url) {
  try {
    log(`Extracting content from ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Extract basic article information
    const title = document.querySelector('h1')?.textContent.trim() || 'Untitled Article';
    const dateElement = document.querySelector('time') || document.querySelector('.date');
    const date = dateElement ? dateElement.textContent.trim() : new Date().toISOString().split('T')[0];
    
    // Extract the article content
    const articleElement = document.querySelector('article') || document.querySelector('.content');
    if (!articleElement) {
      throw new Error('Could not find article content');
    }
    
    // Remove unnecessary elements
    ['script', 'style', 'nav', 'footer', '.related-articles', '.social-share'].forEach(selector => {
      articleElement.querySelectorAll(selector).forEach(el => el.remove());
    });
    
    // Extract images
    const images = [];
    articleElement.querySelectorAll('img').forEach((img, index) => {
      const src = img.src;
      if (src && !src.startsWith('data:') && !src.includes('avatar') && !src.includes('logo')) {
        const imageName = `image-${index + 1}.jpg`;
        images.push({ src, name: imageName, alt: img.alt || title });
        // Replace the src with our local path
        img.src = `../images/${imageName}`;
      }
    });
    
    // Get the text content
    let content = articleElement.textContent.trim();
    
    // Clean up the content
    content = content
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n\n')  // Replace multiple new lines with double new line
      .trim();
    
    // Extract any tags or categories
    const tags = Array.from(document.querySelectorAll('.tag, .category, .topic'))
      .map(tag => tag.textContent.trim())
      .filter(tag => tag.length > 0);
    
    // Get author information
    const authorElement = document.querySelector('.author, .author-name');
    const author = authorElement ? authorElement.textContent.trim() : 'Raven';
    
    return {
      title,
      date,
      content,
      author,
      tags,
      images,
      url,
      raw: html
    };
  } catch (error) {
    log(`Error extracting content from ${url}: ${error.message}`, 'error');
    throw error;
  }
}

// Download and optimize an image
async function downloadImage(imageUrl, imagePath) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }
    
    const buffer = await response.buffer();
    
    // Optimize and save the image
    await sharp(buffer)
      .resize(1200, null, { withoutEnlargement: true }) // Resize to max width 1200px
      .toFormat('webp', { quality: 80 })
      .toFile(imagePath + '.webp');
    
    // Also save original format as fallback
    await fs.writeFile(imagePath, buffer);
    
    return true;
  } catch (error) {
    log(`Error downloading image ${imageUrl}: ${error.message}`, 'error');
    return false;
  }
}

// Save an article to the file system
async function saveArticle(article) {
  try {
    // Create a slug from the title
    const slug = sanitize(
      article.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
    );
    
    // Create article directory
    const articleDir = path.join(ARTICLES_DIR, slug);
    await fs.mkdir(articleDir, { recursive: true });
    
    // Save the article content
    await fs.writeFile(
      path.join(articleDir, 'content.txt'),
      `Title: ${article.title}\n\nContent:\n\n${article.content}`
    );
    
    // Save article metadata
    const metadata = {
      title: article.title,
      date: article.date,
      author: article.author,
      tags: article.tags,
      url: article.url,
      hash: createContentHash(article.content)
    };
    
    await fs.writeFile(
      path.join(articleDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
    
    // Save the original HTML
    await fs.writeFile(path.join(articleDir, 'raw.html'), article.raw);
    
    // Create a separate title file for easy access
    await fs.writeFile(path.join(articleDir, 'title.txt'), article.title);
    
    // Save URL for reference
    await fs.writeFile(path.join(articleDir, 'url.txt'), article.url);
    
    // Download and save images
    if (article.images.length > 0) {
      const imagesDir = path.join(articleDir, 'images');
      await fs.mkdir(imagesDir, { recursive: true });
      
      await Promise.all(
        article.images.map(async (image) => {
          const imagePath = path.join(imagesDir, image.name);
          await downloadImage(image.src, imagePath);
        })
      );
    }
    
    // Create a simplified article JSON for the website
    const articleJson = {
      title: article.title,
      slug,
      date: article.date,
      author: article.author,
      tags: article.tags,
      content: article.content,
      images: article.images.map(img => `${slug}/images/${img.name}`)
    };
    
    await fs.writeFile(
      path.join(articleDir, 'article.json'),
      JSON.stringify(articleJson, null, 2)
    );
    
    log(`Saved article "${article.title}" to ${articleDir}`);
    return slug;
  } catch (error) {
    log(`Error saving article: ${error.message}`, 'error');
    throw error;
  }
}

// Check if an article needs to be updated
async function shouldUpdateArticle(slug, newContentHash) {
  try {
    // If force reimport is enabled, always update
    if (FORCE_REIMPORT) return true;
    
    const metadataPath = path.join(ARTICLES_DIR, slug, 'metadata.json');
    const metadataExists = await fs.access(metadataPath).then(() => true).catch(() => false);
    
    if (!metadataExists) return true;
    
    const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
    
    // If the content hash is different, update the article
    return metadata.hash !== newContentHash;
  } catch (error) {
    log(`Error checking if article needs update: ${error.message}`, 'error');
    return true; // Update on error to be safe
  }
}

// Update the article index file
async function updateArticleIndex(slugs) {
  try {
    log('Updating article index...');
    
    const articles = await Promise.all(
      slugs.map(async (slug) => {
        try {
          const metadataPath = path.join(ARTICLES_DIR, slug, 'metadata.json');
          const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
          
          const articleJsonPath = path.join(ARTICLES_DIR, slug, 'article.json');
          const article = JSON.parse(await fs.readFile(articleJsonPath, 'utf8'));
          
          return {
            ...metadata,
            ...article,
            slug
          };
        } catch (error) {
          log(`Error reading article metadata for ${slug}: ${error.message}`, 'error');
          return null;
        }
      })
    );
    
    const validArticles = articles.filter(article => article !== null);
    
    // Sort articles by date (newest first)
    validArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Save the index file
    await fs.writeFile(
      path.join(ARTICLES_DIR, 'summary.json'),
      JSON.stringify(validArticles, null, 2)
    );
    
    log(`Updated article index with ${validArticles.length} articles`);
  } catch (error) {
    log(`Error updating article index: ${error.message}`, 'error');
  }
}

// Update the articleMetadata in populateBlogPosts.js
async function updateArticleMetadata(slugs) {
  try {
    log('Updating article metadata in populateBlogPosts.js...');
    
    const utilsPath = path.join(__dirname, '../src/utils/populateBlogPosts.js');
    let utilsContent = await fs.readFile(utilsPath, 'utf8');
    
    // Extract the current articleMetadata array
    const metadataMatch = utilsContent.match(/const articleMetadata = \[([\s\S]*?)\];/);
    if (!metadataMatch) {
      throw new Error('Could not find articleMetadata in populateBlogPosts.js');
    }
    
    // Generate new metadata entries
    const metadataEntries = await Promise.all(
      slugs.map(async (slug) => {
        try {
          const metadataPath = path.join(ARTICLES_DIR, slug, 'metadata.json');
          const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
          
          // Generate a short ID from the slug
          const id = slug.split('-').slice(0, 3).join('-');
          
          // Find the first image in the article, if any
          const imagesDir = path.join(ARTICLES_DIR, slug, 'images');
          let image = '/images/default-article.jpg'; // Default image
          
          try {
            const files = await fs.readdir(imagesDir);
            if (files.length > 0) {
              const webpFile = files.find(file => file.endsWith('.webp'));
              if (webpFile) {
                image = `/articles/${slug}/images/${webpFile}`;
              } else {
                image = `/articles/${slug}/images/${files[0]}`;
              }
            }
          } catch (error) {
            // No images directory or error reading it
          }
          
          return `{
        id: '${id}',
        slug: '${slug}',
        date: new Date('${metadata.date}').toISOString(),
        readTime: ${Math.ceil(metadata.content?.length / 1500) || 3},
        tags: ${JSON.stringify(metadata.tags || [])},
        image: '${image}',
        author: '${metadata.author || 'Raven'}',
        category: '${metadata.tags?.[0] || 'Crypto News'}'
    }`;
        } catch (error) {
          log(`Error generating metadata for ${slug}: ${error.message}`, 'error');
          return null;
        }
      })
    );
    
    const validEntries = metadataEntries.filter(entry => entry !== null);
    
    // Replace the articleMetadata array
    const newMetadata = `const articleMetadata = [\n    ${validEntries.join(',\n    ')}\n];`;
    utilsContent = utilsContent.replace(/const articleMetadata = \[([\s\S]*?)\];/, newMetadata);
    
    // Write the updated file
    await fs.writeFile(utilsPath, utilsContent);
    
    log(`Updated article metadata in populateBlogPosts.js with ${validEntries.length} entries`);
  } catch (error) {
    log(`Error updating article metadata: ${error.message}`, 'error');
  }
}

// Main function
async function main() {
  try {
    await ensureDirectoriesExist();
    log('Starting Nuance article import');
    
    // Fetch article URLs
    const articleUrls = await fetchNuanceArticles();
    
    // Process each article
    const processedSlugs = [];
    
    for (const url of articleUrls) {
      try {
        // Extract article content
        const article = await extractArticleContent(url);
        
        // Create a hash of the content
        const contentHash = createContentHash(article.content);
        
        // Create a slug
        const slug = sanitize(
          article.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
        );
        
        // Check if we need to update this article
        if (await shouldUpdateArticle(slug, contentHash)) {
          const savedSlug = await saveArticle(article);
          processedSlugs.push(savedSlug);
          log(`Processed article: ${article.title}`);
        } else {
          log(`Skipping article (unchanged): ${article.title}`);
          processedSlugs.push(slug);
        }
      } catch (error) {
        log(`Error processing article ${url}: ${error.message}`, 'error');
      }
    }
    
    // Update the article index
    await updateArticleIndex(processedSlugs);
    
    // Update the article metadata in populateBlogPosts.js
    await updateArticleMetadata(processedSlugs);
    
    log(`Nuance article import complete. Processed ${processedSlugs.length} articles.`);
  } catch (error) {
    log(`Critical error in main: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 