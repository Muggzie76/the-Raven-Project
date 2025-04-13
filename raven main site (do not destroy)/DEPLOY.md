# Deployment Guide

This document outlines the steps for deploying the Raven Website to production environments.

## Overview

The deployment process consists of the following steps:

1. Build the application
2. Minify the assets for production
3. Deploy to the target environment

## Prerequisites

- Node.js (v16+)
- npm (v8+)
- Access to the production server or deployment environment
- SSL certificates (for HTTPS)

## Deployment Steps

### 1. Prepare for Deployment

Make sure your code is up to date and all changes are committed:

```bash
git pull
npm install
```

### 2. Build the Application

Build the React application:

```bash
npm run build
```

This will create a production build in the `build/` directory.

### 3. Minify Assets

Run the minification script to optimize CSS, JavaScript, and HTML files:

```bash
npm run minify
```

This creates optimized files in the `public/dist/` directory with the following benefits:
- Reduced file sizes for faster loading
- Consolidated files for fewer HTTP requests
- Optimized code for better performance

### 4. Deploy to Production

#### Using the Deploy Script

The simplest way to deploy is using the built-in deploy script:

```bash
npm run deploy
```

This will:
1. Copy the necessary files to the production environment
2. Configure the server with security headers
3. Start or restart the server

#### Manual Deployment

If you need to deploy manually:

1. Copy the following directories to your production server:
   - `build/`
   - `public/dist/`
   - `server.js`
   - `package.json`
   - `package-lock.json`

2. On the production server:
   ```bash
   npm install --production
   node server.js
   ```

### 5. SSL Configuration

For secure HTTPS connections, you need to configure SSL certificates:

1. Place your SSL certificates in the `ssl/` directory:
   - `ssl/key.pem`: Private key
   - `ssl/cert.pem`: Certificate

2. If you don't have certificates, you can generate self-signed certificates for testing:
   ```bash
   npm run ssl:generate
   ```

   Note: Self-signed certificates will trigger browser warnings.

### 6. Verify Deployment

After deployment, verify that:

1. The site is accessible at the expected URL
2. All pages load correctly
3. Assets (images, styles, scripts) are loading
4. Features are working as expected

## Troubleshooting

### Common Issues

1. **Missing Assets**
   - Check that the minification process completed successfully
   - Verify the paths to assets in the HTML files
   - Ensure all assets were copied to the production environment

2. **Server Not Starting**
   - Check for port conflicts
   - Verify Node.js is installed and the correct version
   - Check server logs for errors

3. **SSL Issues**
   - Verify certificates are correctly placed in the ssl/ directory
   - Check certificate expiration dates
   - Ensure certificate and key files have correct permissions

4. **Performance Issues**
   - Verify minification ran successfully
   - Check for large unoptimized images
   - Enable compression on the server

## Continuous Deployment

For automated deployments, you can set up a CI/CD pipeline using:
- GitHub Actions
- Jenkins
- CircleCI
- GitLab CI

A typical workflow would include:
1. Run tests on pull requests
2. Build and minify on merge to main branch
3. Automatic deployment to staging/production environments

## Rollback Procedure

If you need to roll back to a previous version:

1. Identify the previous working version from Git
2. Check out that version
3. Rebuild and redeploy following the steps above

Alternatively, if you maintain deployment archives:

1. Stop the current server
2. Replace the current deployment with the archived version
3. Restart the server

## Production Environment Configuration

The server can be configured using environment variables:

```
PORT=80               # HTTP port (default: 3000)
HTTPS_PORT=443        # HTTPS port (default: 3443)
NODE_ENV=production   # Environment (development or production)
```

These can be set in a `.env` file or directly in the environment. 