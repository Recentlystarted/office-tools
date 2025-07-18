# GitHub Pages Secrets Setup Guide

## 📋 Environment Variables for GitHub Pages

For deploying Office Tools to GitHub Pages with Razorpay integration, you need to set up these secrets in your GitHub repository settings.

### 🔧 How to Add GitHub Secrets

1. **Navigate to Repository Settings**
   - Go to your repository: `https://github.com/Recentlystarted/office-tools`
   - Click on **Settings** tab
   - Select **Secrets and variables** → **Actions**

2. **Add Repository Secrets**
   - Click **New repository secret**
   - Add each secret below

### 🔑 Required Secrets

#### **Razorpay Configuration**
```bash
# Razorpay API Keys (Get from https://dashboard.razorpay.com/)
NEXT_PUBLIC_RAZORPAY_KEY_ID
# Value: rzp_live_your_actual_key_id_here (for production)
# Value: rzp_test_your_test_key_id_here (for testing)

RAZORPAY_KEY_SECRET
# Value: your_razorpay_key_secret_here
# Note: This is PRIVATE - never expose in client-side code
```

#### **Website Configuration**
```bash
NEXT_PUBLIC_SITE_URL
# Value: https://office-tools.in

NEXT_PUBLIC_SITE_NAME
# Value: Office Tools

NEXT_PUBLIC_CONTACT_EMAIL
# Value: support@office-tools.in

NEXT_PUBLIC_BUSINESS_NAME
# Value: Office Tools
```

#### **API Configuration**
```bash
NEXT_PUBLIC_API_BASE_URL
# Value: https://your-api-domain.com
# Your backend API endpoint

NEXT_PUBLIC_API_TIMEOUT
# Value: 600000
# API timeout in milliseconds (10 minutes)

NEXT_PUBLIC_MAX_FILE_SIZE
# Value: 52428800
# Max file size in bytes (50MB)
```

#### **Analytics & Ads (Optional)**
```bash
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
# Value: G-XXXXXXXXXX
# Your Google Analytics 4 ID

NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
# Value: ca-pub-XXXXXXXXXXXXXXXX
# Your Google AdSense Publisher ID
```

#### **Environment & Build**
```bash
NODE_ENV
# Value: production
# Set to production for live deployment

NEXT_PUBLIC_VERCEL_ENV
# Value: production
# Build environment indicator
```

### 🚀 GitHub Actions Workflow

Create `.github/workflows/deploy.yml` for automated deployment:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout 🛎️
      uses: actions/checkout@v4
      
    - name: Setup Node.js 📦
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies 📋
      run: npm ci
      
    - name: Build application 🔧
      run: npm run build
      env:
        NEXT_PUBLIC_RAZORPAY_KEY_ID: ${{ secrets.NEXT_PUBLIC_RAZORPAY_KEY_ID }}
        RAZORPAY_KEY_SECRET: ${{ secrets.RAZORPAY_KEY_SECRET }}
        NEXT_PUBLIC_SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL }}
        NEXT_PUBLIC_SITE_NAME: ${{ secrets.NEXT_PUBLIC_SITE_NAME }}
        NEXT_PUBLIC_CONTACT_EMAIL: ${{ secrets.NEXT_PUBLIC_CONTACT_EMAIL }}
        NEXT_PUBLIC_BUSINESS_NAME: ${{ secrets.NEXT_PUBLIC_BUSINESS_NAME }}
        NEXT_PUBLIC_API_BASE_URL: ${{ secrets.NEXT_PUBLIC_API_BASE_URL }}
        NEXT_PUBLIC_API_TIMEOUT: ${{ secrets.NEXT_PUBLIC_API_TIMEOUT }}
        NEXT_PUBLIC_MAX_FILE_SIZE: ${{ secrets.NEXT_PUBLIC_MAX_FILE_SIZE }}
        NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: ${{ secrets.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID }}
        NEXT_PUBLIC_ADSENSE_PUBLISHER_ID: ${{ secrets.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID }}
        NODE_ENV: ${{ secrets.NODE_ENV }}
        
    - name: Deploy to GitHub Pages 🚀
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

### 🔐 Security Best Practices

#### **Secret Management**
- **Never commit secrets** to your repository
- **Use different keys** for testing and production
- **Rotate keys regularly** (every 6 months)
- **Monitor usage** in Razorpay dashboard

#### **Environment Separation**
```bash
# Development (.env.local)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
NODE_ENV=development

# Production (GitHub Secrets)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
NODE_ENV=production
```

### 📱 Testing Configuration

#### **Test with GitHub Secrets**
1. **Create a test branch**
2. **Use test Razorpay keys** in secrets
3. **Deploy to staging** environment
4. **Test payment flow** thoroughly
5. **Switch to live keys** when ready

#### **Local Testing**
```bash
# Create .env.local with test keys
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_test_key
RAZORPAY_KEY_SECRET=your_test_secret

# Test locally
npm run dev
```

### 🎯 Deployment Checklist

#### **Before Deployment**
- [ ] All secrets added to GitHub repository
- [ ] Razorpay account KYC completed
- [ ] Policy pages live and accessible
- [ ] Test payment flow working
- [ ] Environment variables validated

#### **After Deployment**
- [ ] Live site accessible at https://office-tools.in
- [ ] Donation system working
- [ ] Policy pages loading correctly
- [ ] Mobile responsiveness verified
- [ ] Payment notifications working

### 🔍 Troubleshooting

#### **Common Issues**
1. **Razorpay not loading**
   - Check if `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set correctly
   - Verify the key format (should start with `rzp_`)

2. **Payment failures**
   - Ensure you're using live keys for production
   - Check Razorpay dashboard for error logs

3. **Build failures**
   - Verify all required secrets are set
   - Check for typos in secret names

#### **Debug Commands**
```bash
# Check if environment variables are available
echo $NEXT_PUBLIC_RAZORPAY_KEY_ID

# Verify build with environment variables
npm run build
```

### 📞 Support

For deployment issues:
- **GitHub Actions**: Check the Actions tab for build logs
- **Razorpay**: Contact Razorpay support for payment issues
- **General**: Open an issue in the repository

---

## 🎉 Final Setup

Once all secrets are configured:

1. **Push to main branch**
2. **GitHub Actions will automatically deploy**
3. **Site will be live at https://office-tools.in**
4. **Donation system will be fully functional**

Your Office Tools website is now production-ready with secure payment processing! 🚀
