# Razorpay Integration Setup Guide

This guide will help you set up Razorpay payment integration for the Office Tools donation system.

## 🌐 Live Website Links

- **Main Website**: [https://office-tools.in](https://office-tools.in)
- **GitHub Repository**: [https://github.com/Recentlystarted/office-tools](https://github.com/Recentlystarted/office-tools)
- **Development Server**: [http://localhost:3001](http://localhost:3001)

## 📱 Mobile Responsive Design

The donation system is fully optimized for mobile devices:

### ✅ Mobile Features
- **Responsive Layout**: Works seamlessly on all screen sizes
- **Touch Optimized**: Large buttons and touch-friendly interface
- **Compact Mode**: Space-efficient design for mobile screens
- **Progressive Enhancement**: Graceful degradation on older devices
- **Fast Loading**: Optimized for mobile network speeds

### 📱 Mobile Testing
Test on various devices:
- **iPhone**: Safari, Chrome
- **Android**: Chrome, Samsung Internet
- **Tablet**: iPad, Android tablets
- **Desktop**: Chrome, Firefox, Safari, Edge

## Prerequisites

1. **Razorpay Account**: Sign up at [https://razorpay.com/](https://razorpay.com/)
2. **Business Verification**: Complete KYC and business verification
3. **Policy Pages**: Ensure all required policy pages are live on your website

## Required Policy Pages

For Razorpay account activation, you need these policy pages (already created):

- ✅ **Cancellation & Refunds**: [https://office-tools.in/cancellation-refunds](https://office-tools.in/cancellation-refunds)
- ✅ **Shipping Policy**: [https://office-tools.in/shipping](https://office-tools.in/shipping)
- ✅ **Contact Us**: [https://office-tools.in/contact](https://office-tools.in/contact)
- ✅ **Privacy Policy**: [https://office-tools.in/privacy](https://office-tools.in/privacy)
- ✅ **Terms of Service**: [https://office-tools.in/terms](https://office-tools.in/terms)

## Setup Steps

### 1. Get Razorpay API Keys

1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings** → **API Keys**
3. Generate API Keys for your account
4. Copy the **Key ID** and **Key Secret**

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the Razorpay configuration:
   ```bash
   # Razorpay Configuration
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1234567890abcdef  # Your actual key ID
   RAZORPAY_KEY_SECRET=your_secret_key_here               # Your actual secret
   ```

### 3. Test the Integration

1. **Test Mode**: Start with test keys (`rzp_test_...`)
2. **Test Payment**: Use test card numbers provided by Razorpay
3. **Verify Webhooks**: Test payment success/failure flows

### 4. Go Live

1. **Complete KYC**: Ensure your account is fully verified
2. **Switch to Live Keys**: Replace test keys with live keys (`rzp_live_...`)
3. **Update Environment**: Set `NODE_ENV=production`
4. **Mobile Testing**: Test on real devices before going live

## 📱 Mobile Responsiveness Testing

### Testing Steps
1. **Open Developer Tools**: Press F12 in Chrome/Firefox
2. **Toggle Device Mode**: Click device icon or Ctrl+Shift+M
3. **Test Different Sizes**:
   - iPhone SE (375x667)
   - iPhone 12 Pro (390x844)
   - iPad (768x1024)
   - Samsung Galaxy S21 (384x854)

### Mobile-Specific Features
- **Compact Donation Component**: Automatically uses smaller layout on mobile
- **Touch-Optimized Buttons**: Minimum 44px tap targets
- **Responsive Grid**: 2 columns on mobile, 4 on desktop
- **Flexible Text**: Scalable fonts and responsive typography
- **Optimized Images**: Proper sizing and loading

### Mobile Testing Checklist
- [ ] All buttons are easily tappable
- [ ] Text is readable without zooming
- [ ] Payment flow works on mobile browsers
- [ ] Pages load quickly on 3G/4G
- [ ] All links work correctly
- [ ] Donation component displays properly
- [ ] Toast notifications are visible

## Test Card Numbers

Use these test card numbers in test mode:

- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## Features Implemented

### ✅ Donation Component
- **Multiple donation amounts**: ₹100, ₹250, ₹500, ₹1000 (improved higher amounts)
- **Custom amount input**: Users can enter any amount between ₹10 - ₹100,000
- **Compact and full view modes**: Automatic responsive layout
- **Processing states and loading indicators**: Real-time feedback
- **Success/failure notifications**: Clear payment status messages

### ✅ Payment Flow
- **Razorpay checkout integration**: Complete payment processing
- **Secure payment processing**: Industry-standard security
- **Payment success/failure handling**: Proper error management
- **Payment ID tracking**: Transaction reference for users
- **Custom amount support**: Flexible donation amounts

### ✅ UI/UX Improvements
- **Fresh color scheme**: Beautiful blue/indigo/purple gradients (no more brown/orange)
- **Shadcn UI components**: Consistent design system
- **Responsive layout for all devices**: Mobile-first approach
- **Toast notifications with proper mobile sizing**: User-friendly feedback
- **Loading states and animations**: Smooth interactions
- **Error handling with user-friendly messages**: Clear error communication
- **Touch-friendly buttons and spacing**: Optimized for mobile
- **ARIA labels and keyboard navigation**: Accessibility compliant
- **Progressive Web App features**: Works offline and installable

### ✅ Security
- Environment variables for secrets
- Client-side key validation
- Secure payment processing
- No sensitive data storage
- **HTTPS Only**: Secure connections required
- **CSP Headers**: Content Security Policy protection

## File Structure

```
lib/
├── razorpay.ts              # Razorpay service and utilities
components/
├── donation-support.tsx     # Universal donation component
app/
├── layout.tsx              # Global layout with donation component
├── cancellation-refunds/   # Refund policy page
├── shipping/              # Shipping policy page
├── contact/               # Contact page
├── privacy/               # Privacy policy page
└── terms/                 # Terms of service page
```

## Usage

The donation component is automatically included on all pages via the main layout. You can also use it individually:

```tsx
import DonationSupport from '@/components/donation-support'

// Full view
<DonationSupport />

// Compact view
<DonationSupport compact />
```

## Support

For Razorpay integration issues:
1. Check the [Razorpay Documentation](https://razorpay.com/docs/)
2. Contact Razorpay Support
3. Review the browser console for error messages

For Office Tools specific issues:
- Check the donation component implementation
- Verify environment variables are set correctly
- Ensure all policy pages are accessible

## Security Notes

- Never expose your Razorpay Key Secret in client-side code
- Use environment variables for all sensitive configuration
- Implement proper error handling for payment failures
- Monitor payment transactions regularly

## Compliance

- All policy pages are created and linked
- Razorpay security requirements are met
- GDPR compliance maintained
- Indian payment regulations followed

## 🔗 Quick Links

### Live Website
- **Main Site**: [https://office-tools.in](https://office-tools.in)
- **GitHub**: [https://github.com/Recentlystarted/office-tools](https://github.com/Recentlystarted/office-tools)

### Policy Pages
- [Cancellation & Refunds](https://office-tools.in/cancellation-refunds)
- [Shipping Policy](https://office-tools.in/shipping)
- [Contact Us](https://office-tools.in/contact)
- [Privacy Policy](https://office-tools.in/privacy)
- [Terms of Service](https://office-tools.in/terms)

### Documentation
- **Setup Guide**: This file (RAZORPAY_SETUP.md)
- **Mobile Guide**: MOBILE_GUIDE.md
- **GitHub Secrets**: GITHUB_PAGES_SECRETS.md
- **Environment**: .env.example
- **Donations Page**: /donations (dedicated donation page)

## 🔐 GitHub Pages Deployment

### Required GitHub Secrets
Add these secrets to your repository settings (`Settings` → `Secrets and variables` → `Actions`):

#### **Essential Secrets**
```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_secret_key
NEXT_PUBLIC_SITE_URL=https://office-tools.in
NEXT_PUBLIC_SITE_NAME=Office Tools
NEXT_PUBLIC_CONTACT_EMAIL=support@office-tools.in
NODE_ENV=production
```

#### **Optional Secrets**
```bash
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

### Deployment Steps
1. **Add all secrets** to GitHub repository
2. **Push to main branch** - GitHub Actions will auto-deploy
3. **Site goes live** at https://office-tools.in
4. **Test donations** on live site

For detailed GitHub Pages setup, see: **GITHUB_PAGES_SECRETS.md**

## 🎯 Final Result

✅ **Universal donation system** deployed on all pages  
✅ **Mobile-responsive design** optimized for all devices  
✅ **Razorpay integration** ready for live payments  
✅ **Policy pages** created for compliance  
✅ **Professional UI** with smooth animations  
✅ **Secure payment processing** with proper error handling  

Your Office Tools website is now **production-ready** with a complete donation system! 🚀
