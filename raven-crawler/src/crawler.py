import undetected_chromedriver as uc
from bs4 import BeautifulSoup
import logging
import os
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def setup_driver():
    options = uc.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    driver = uc.Chrome(options=options)
    return driver

def clean_text(text):
    # Remove duplicate lines
    lines = text.split('\n')
    seen = set()
    unique_lines = []
    for line in lines:
        line = line.strip()
        if line and line not in seen:
            seen.add(line)
            unique_lines.append(line)
    
    # Remove footer content
    cleaned_lines = []
    for line in unique_lines:
        if not any(footer in line.lower() for footer in ['more from this', 'related articles', 'share this']):
            cleaned_lines.append(line)
    
    return '\n'.join(cleaned_lines)

def extract_content(driver, url):
    try:
        driver.get(url)
        time.sleep(3)  # Wait for dynamic content to load
        
        # Wait for content to be present
        content = None
        for _ in range(3):  # Try multiple times
            page_source = driver.page_source
            soup = BeautifulSoup(page_source, 'html.parser')
            
            # Try different content selectors
            content = soup.find('article') or soup.find('div', class_='content') or soup.find('main')
            if content:
                break
            time.sleep(1)
        
        if not content:
            logging.error(f"Could not find content in {url}")
            return None
        
        # Extract title
        title = None
        title_elem = soup.find('h1') or soup.find('title')
        if title_elem:
            title = title_elem.get_text().strip()
        
        # Extract date
        date = None
        date_elem = soup.find('time') or soup.find('span', class_='date')
        if date_elem:
            date = date_elem.get_text().strip()
            try:
                # Try to parse the date into a standard format
                parsed_date = datetime.strptime(date, '%b %d %Y')
                date = parsed_date.strftime('%Y-%m-%d')
            except ValueError:
                pass  # Keep original date format if parsing fails
        
        # Clean up the content
        for script in content(['script', 'style', 'nav', 'header', 'footer']):
            script.decompose()
        
        # Get text content
        text = content.get_text(separator='\n', strip=True)
        text = clean_text(text)
        
        return {
            'title': title,
            'content': text,
            'date': date
        }
    except Exception as e:
        logging.error(f"Error extracting content from {url}: {str(e)}")
        return None

def crawl_article(driver, url):
    try:
        logging.info(f"Reading article: {url}")
        content = extract_content(driver, url)
        
        if not content:
            return False
        
        # Create a safe filename from the URL
        filename = url.split('/')[-1]
        if not filename:
            filename = 'article'
        
        # Create articles directory if it doesn't exist
        os.makedirs('articles', exist_ok=True)
        
        # Save content to file
        with open(f'articles/{filename}.txt', 'w', encoding='utf-8') as f:
            if content['title']:
                f.write(f"Title: {content['title']}\n\n")
            if content['date']:
                f.write(f"Date: {content['date']}\n\n")
            f.write(f"Content:\n\n{content['content']}")
        
        logging.info(f"Successfully saved content from: {filename}")
        return True
    except Exception as e:
        logging.error(f"Error processing {url}: {str(e)}")
        return False

def main():
    try:
        # Read article links from file
        with open('Raven article links.txt', 'r') as f:
            lines = f.readlines()
        
        # Skip the first line (instructions) and clean up URLs
        urls = [line.strip() for line in lines[1:] if line.strip() and line.strip().startswith('http')]
        
        logging.info(f"Starting to read {len(urls)} articles")
        
        # Set up Chrome driver
        driver = setup_driver()
        
        try:
            successful = 0
            for i, url in enumerate(urls, 1):
                logging.info(f"\nProcessing article {i}/{len(urls)}")
                if crawl_article(driver, url):
                    successful += 1
                time.sleep(2)  # Be nice to the server
            
            logging.info(f"\nCompleted reading {successful} out of {len(urls)} articles")
        finally:
            driver.quit()
    
    except Exception as e:
        logging.error(f"Error in main: {str(e)}")

if __name__ == "__main__":
    main() 