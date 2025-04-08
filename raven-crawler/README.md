# Raven Article Crawler

A web crawler designed to extract articles from the Nuance platform for The Raven Project.

## Project Structure

```
raven-crawler/
├── src/                # Source code
│   └── crawler.py      # Main crawler script
├── data/               # Data files
│   ├── articles/       # Extracted articles
│   └── links/         # Article link files
└── README.md          # This file
```

## Features

- Extracts article content, titles, and dates from Nuance platform
- Handles dynamic content loading
- Cleans and formats extracted content
- Saves articles in a structured format
- Includes error handling and logging

## Requirements

- Python 3.8+
- undetected-chromedriver
- beautifulsoup4
- requests

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. Place article links in `data/links/` directory
2. Run the crawler:
   ```bash
   python src/crawler.py
   ```
3. Extracted articles will be saved in `data/articles/`

## Current Status

The crawler is functional but may need improvements for:
- Better content extraction
- Handling of different article formats
- Image downloading
- Rate limiting and error recovery

## Future Improvements

- [ ] Add support for image downloads
- [ ] Implement rate limiting
- [ ] Add retry mechanism for failed requests
- [ ] Improve date parsing
- [ ] Add content validation
- [ ] Implement progress tracking
- [ ] Add support for different article formats

## Notes

- The crawler uses undetected-chromedriver to bypass potential anti-bot measures
- Articles are saved in text format with metadata
- The crawler includes a delay between requests to be respectful to the server 