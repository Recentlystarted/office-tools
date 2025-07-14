# GitHub Pages Environment Variables Setup Guide

Since GitHub Pages is a static hosting service, it doesn't support server-side environment variables. Here are the solutions:

## Method 1: Build-time Environment Variables (Recommended)

### Step 1: Create GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        # These come from GitHub repository secrets
        NEXT_PUBLIC_ADSENSE_PUBLISHER_ID: ${{ secrets.ADSENSE_PUBLISHER_ID }}
        NODE_ENV: production
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

### Step 2: Set GitHub Repository Secrets
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:
   - `ADSENSE_PUBLISHER_ID`: Your AdSense publisher ID (ca-pub-XXXXXXXXXXXXXXXX)

### Step 3: Enable GitHub Pages
1. In repository settings, go to **Pages**
2. Source: **GitHub Actions**
3. Your site will be available at: `https://yourusername.github.io/repository-name`

## Method 2: Direct Configuration (Less Secure)

If you want simpler deployment but less security:

### Edit the configuration file directly:
In `lib/adsense.ts`, replace:
```typescript
publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-0000000000000000',
```

With your actual publisher ID:
```typescript
publisherId: 'ca-pub-XXXXXXXXXXXXXXXX', // Your real publisher ID
```

### Then build and deploy:
```bash
npm run build
npm run export
```

Upload the `out` folder to GitHub Pages manually or use the simple GitHub Actions:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run build
      env:
        NODE_ENV: production
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

## Method 3: Using next.config.js (Static Export)

Update your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    // These will be embedded at build time
    NEXT_PUBLIC_ADSENSE_PUBLISHER_ID: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-XXXXXXXXXXXXXXXX'
  }
}

module.exports = nextConfig
```

## Recommended Approach

**Use Method 1 (GitHub Actions with Secrets)** because:
- ✅ Keeps sensitive data secure
- ✅ Automated deployment
- ✅ Environment-specific builds
- ✅ Professional workflow
- ✅ Easy to update without code changes

## Testing Your Setup

1. **Local Development:**
   ```bash
   # Create .env.local file
   echo "NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX" > .env.local
   echo "NODE_ENV=production" >> .env.local
   
   # Test build
   npm run build
   npm run start
   ```

2. **Production Deployment:**
   - Push to GitHub
   - Check Actions tab for build status
   - Visit your GitHub Pages URL
   - Open browser dev tools to verify AdSense script loads

## Troubleshooting

**GitHub Actions fails:**
- Check if secrets are set correctly
- Verify repository permissions
- Check Actions tab for error details

**Ads not showing:**
- Verify your domain is approved in AdSense
- Check browser console for errors
- Ensure NODE_ENV=production in the build

**Build errors:**
- Check if all dependencies are installed
- Verify environment variables are accessible
- Test build locally first
