# Raven Website Article Crawler

This project crawls articles from Nuance.xyz for the Raven website project.

## Setup

1. Install Python 3.8 or higher
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

Run the crawler:
```bash
python crawler.py
```

The script will:
1. Crawl articles from the specified Nuance.xyz URL
2. Save the articles in JSON format in the `articles` directory
3. Print the number of articles crawled

## Output

Articles are saved in `articles/nuance_articles.json` with the following structure:
```json
[
  {
    "title": "Article Title",
    "content": "Article Content",
    "date": "Publication Date",
    "url": "Source URL"
  }
]
``` 