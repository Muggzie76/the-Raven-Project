# The Raven Project Website

A modern web application for The Raven Project, featuring investigative journalism in the crypto world. Built with React and styled with a beautiful dark theme and bento grid layout.

## Features

- Responsive bento grid layout
- Dark theme with purple accents
- Blog post management system
- Admin dashboard
- Internet Identity authentication
- Article display with images
- Interactive UI elements
- Automated article import from Nuance.xyz

## Directory Structure

```
raven-website/
├── public/
│   ├── images/
│   ├── articles/      # Imported and stored articles
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── scripts/
│   ├── nuance-import.js  # Manual article import script
│   └── auto-import.js    # Automated article import script
└── src/
    ├── components/
    │   ├── admin/
    │   │   ├── NuanceImportTab.jsx  # Import management UI
    │   │   ├── OverviewTab.jsx
    │   │   └── PostsTab.jsx
    │   └── blog/
    │       └── templates/  # Article templates
    ├── auth/
    │   └── authService.js
    └── index.js
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Authentication

The website uses Internet Identity for authentication. Admin privileges are controlled through the `authService.js` configuration.

## Article Import System

The Raven website includes an automated system for importing articles from Nuance.xyz.

### Manual Import

To manually import articles:

```bash
# Import the latest articles (default limit: 5)
npm run import-articles

# Force re-import of all articles
npm run import-articles:force

# Import with a specific limit
npm run import-articles:limit 10
```

### Automated Import

Set up a cron job to automatically import new articles:

```bash
# Linux/Mac crontab example (runs daily at midnight)
0 0 * * * cd /path/to/raven-website && npm run auto-import
```

Configure the import settings in your `.env` file:

```
NUANCE_IMPORT_REFRESH_RATE=24    # Hours between imports
NUANCE_IMPORT_LIMIT=10           # Maximum articles to import per run
```

### Admin Dashboard

Access the article import UI in the admin dashboard:

1. Log in to the admin dashboard
2. Navigate to the "Nuance Import" tab
3. Configure import settings and view import history

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Links

- [Telegram](https://t.me/TheRavenProject)
- [Twitter/X](https://x.com/RavenICP)
- [YouTube](https://youtube.com/@ravenicp)
- [Instagram](https://www.instagram.com/raven_icp)
- [OpenChat](https://oc.app/community/n55pn-dyaaa-aaaac-acjwq-cai/channel/2353285477/?ref=qp2nb-hiaaa-aaaar-a6mpa-cai)
- [Nuance Blog](https://nuance.xyz/publication/Raven) 