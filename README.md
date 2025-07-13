# 🛠️ Office Tools - Professional Online Tools

[![Website](https://img.shields.io/website?url=https%3A%2F%2Foffice-tools.in)](https://office-tools.in)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/built%20with-Next.js%2015-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/styled%20with-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/components-shadcn%2Fui-000000.svg)](https://ui.shadcn.com/)

A modern **Next.js 15** frontend for Office Tools - a comprehensive collection of **25+ professional online tools** for PDF processing, document conversion, text manipulation, and office productivity. Built with TypeScript, styled with Tailwind CSS and shadcn/ui components, and powered by our custom Flask API.

🌟 **Live Site:** [https://office-tools.in](https://office-tools.in)

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **pnpm 8+** - Install with `npm install -g pnpm`
- **Git** - For version control

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Recentlystarted/office-tools.git
   cd office-tools
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Production Build

```bash
# Build for production
pnpm build

# Start production server (if not using static export)
pnpm start
```

## 🌟 Live Demo

**Visit:** [https://office-tools.in](https://office-tools.in)

## 📋 Table of Contents

- [Features](#-features)
- [Tools Available](#-tools-available)
- [Technology Stack](#-technology-stack)
- [API Integration](#-api-integration)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Development](#-development)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Features
- **25+ Professional Tools** - Comprehensive suite of office productivity tools
- **100% Free** - No registration, no hidden costs, no limitations
- **Secure Processing** - Files processed on secure servers with automatic cleanup
- **Mobile Responsive** - Perfect experience on all devices and screen sizes
- **Dark Mode Support** - Toggle between light and dark themes
- **Progressive Web App** - Install and use offline on mobile devices
- **Real-time Search** - Global search across all tools with instant results
- **Drag & Drop Support** - Easy file uploads with visual feedback

### 🛡️ Security & Privacy
- **Client-Side Processing** where possible for maximum privacy
- **Secure API Integration** with professional-grade servers
- **Automatic File Cleanup** - Files deleted immediately after processing
- **No Data Storage** - We never store or access your documents
- **HTTPS Encryption** - All communications encrypted end-to-end

### 🎨 User Experience
- **Modern shadcn/ui Design** - Clean, professional interface
- **Responsive Layout** - Optimized for desktop, tablet, and mobile
- **Fast Loading** - Optimized performance with Next.js static generation
- **Accessibility** - WCAG compliant with keyboard navigation support
- **Toast Notifications** - Clear feedback for all user actions

## 🔧 Tools Available

### 📄 PDF Tools (10 Tools)
- **PDF to Word** - Convert PDF to editable DOCX documents
- **PDF to Excel** - Extract tables and data to Excel spreadsheets
- **PDF Merger** - Combine multiple PDFs into single document
- **Split PDF** - Separate PDF pages into individual files
- **PDF Compressor** - Reduce PDF file size while maintaining quality
- **Protect PDF** - Add password protection to PDF files
- **PDF Password Remover** - Remove passwords from protected PDFs
- **PDF Viewer** - View PDF files directly in browser
- **PDF Editor** - Edit PDF content, add text and annotations
- **Rotate PDF** - Rotate PDF pages to correct orientation

### 🔧 Utility Tools (8 Tools)
- **QR Code Generator** - Create QR codes for text, URLs, WiFi, and more
- **Password Generator** - Generate secure passwords with customizable options
- **Color Picker** - Pick and convert colors between different formats
- **JSON Formatter** - Format, validate, and beautify JSON data
- **Base64 Encoder/Decoder** - Encode and decode Base64 text
- **URL Encoder/Decoder** - Encode and decode URLs and query parameters
- **Text Case Converter** - Convert text between 10+ different cases
- **URL Shortener** - Create short, shareable links

### 🖼️ Image Tools (2 Tools)
- **Image Converter** - Convert between different image formats
- **Image to PDF** - Convert images to PDF documents

### 📝 Text Tools (5+ Tools)
- **Text Case Converter** - Transform text to various cases (upper, lower, camel, etc.)
- **Word Counter** - Count words, characters, and paragraphs
- **Text Formatter** - Format and clean up text content
- **Markdown Converter** - Convert between Markdown and HTML
- **Text Difference Checker** - Compare two texts and highlight differences

## 🏗️ Technology Stack

### Frontend Framework
- **Next.js 15** - Latest React framework with App Router
- **React 18** - Latest React with Concurrent Features
- **TypeScript** - Type-safe development experience
- **Tailwind CSS 3.4+** - Utility-first CSS framework
- **shadcn/ui** - Modern component library built on Radix UI
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Beautiful & consistent icon library

### Build & Development Tools
- **Turbopack** - Ultra-fast bundler (Next.js 15)
- **PostCSS** - CSS processing with autoprefixer
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting (recommended)
- **pnpm** - Fast, disk space efficient package manager

### Deployment & Hosting
- **GitHub Pages** - Static site hosting
- **GitHub Actions** - Automated CI/CD pipeline
- **Static Export** - Pre-rendered static files for optimal performance

## 🔌 API Integration

### Primary API Endpoints

**Base URL:** `https://api.tundasportsclub.com`

#### PDF Conversion APIs
```javascript
// Synchronous PDF to Word conversion
POST /api/pdf/convert
Content-Type: multipart/form-data
Body: { file: PDF_FILE }
Response: application/octet-stream (DOCX file)

// Asynchronous conversion for large files
POST /api/pdf/convert-async
Content-Type: multipart/form-data
Body: { file: PDF_FILE }
Response: { job_id: "unique_id" }

// Check conversion status
GET /api/pdf/status/{job_id}
Response: { status: "processing|completed|failed", progress: 85 }

// Download converted file
GET /api/pdf/download/{job_id}
Response: application/octet-stream (DOCX file)
```

#### Legacy Endpoints
```javascript
// Fallback endpoint for compatibility
POST /convert
Content-Type: multipart/form-data
Body: { file: PDF_FILE }
```

### API Features
- **Smart File Processing** - Automatic optimization for different PDF types
- **Async Processing** - Handle large files (up to 100MB) with progress tracking
- **Error Handling** - Comprehensive error responses with helpful messages
- **Rate Limiting** - Fair usage policies to ensure service availability
- **CORS Support** - Cross-origin requests properly configured

### Error Handling & Fallbacks
```javascript
// Multiple fallback strategies
1. Primary API: api.tundasportsclub.com/api/pdf/convert
2. Legacy API: api.tundasportsclub.com/convert
3. Client-side alternatives when server unavailable
4. Helpful error messages with alternative solutions
```

## � Project Structure

```
office-tools-web/
├── app/                          # Next.js App Router
│   ├── (tools)/                 # Tool pages group
│   │   ├── pdf-to-docx/         # PDF to Word converter
│   │   ├── pdf-merger/          # PDF merger tool
│   │   ├── qr-generator/        # QR code generator
│   │   ├── password-generator/  # Password generator
│   │   ├── pdf-unlock/          # PDF password remover
│   │   └── image-to-pdf/        # Image to PDF converter
│   ├── globals.css              # Global styles with Tailwind
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Homepage
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   └── ...
│   ├── header.tsx               # Site header with navigation
│   ├── footer.tsx               # Site footer
│   ├── hero.tsx                 # Homepage hero section
│   ├── tools-grid.tsx           # Tools grid component
│   ├── features.tsx             # Features section
│   └── theme-provider.tsx       # Theme context provider
├── lib/                         # Utility libraries
│   ├── api.ts                   # API client and helpers
│   └── utils.ts                 # Utility functions
├── .github/workflows/           # GitHub Actions
│   └── deploy.yml               # Automated deployment
├── public/                      # Static assets
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## 🚀 Deployment to Custom Domain (office-tools.in)

### Automatic Deployment with GitHub Actions

This project is configured to automatically deploy to your custom domain `office-tools.in` using GitHub Actions.

### Setup Instructions

1. **GitHub Pages Configuration**
   - Go to your repository settings: `https://github.com/Recentlystarted/office-tools/settings/pages`
   - Under "Source", select **"GitHub Actions"**
   - The site will automatically deploy to `office-tools.in`

2. **Domain DNS Configuration**
   Make sure your domain `office-tools.in` DNS points to GitHub Pages:
   ```
   # Add these DNS records at your domain registrar:
   
   # For apex domain (office-tools.in):
   A    185.199.108.153
   A    185.199.109.153  
   A    185.199.110.153
   A    185.199.111.153
   
   # For HTTPS and verification:
   AAAA 2606:50c0:8000::153
   AAAA 2606:50c0:8001::153
   AAAA 2606:50c0:8002::153
   AAAA 2606:50c0:8003::153
   ```

3. **Verify Domain**
   - In repository settings → Pages → Custom domain
   - Enter: `office-tools.in` 
   - Wait for DNS check to pass (can take up to 24 hours)
   - Enable "Enforce HTTPS" once verification completes

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to office-tools.in"
   git push origin main
   ```
   
   The GitHub Action will automatically build and deploy your site to `https://office-tools.in`

### GitHub Actions Workflow

The deployment is handled by `.github/workflows/deploy.yml` which:
- ✅ Builds the Next.js application when you push to main
- ✅ Exports static files optimized for GitHub Pages  
- ✅ Deploys to your custom domain automatically
- ✅ Handles CNAME file for domain routing
- ✅ Optimizes build with caching for faster deployments

### Monitoring Deployment

1. **Check workflow status**: Go to Actions tab in your repository
2. **View deployment**: Visit [https://office-tools.in](https://office-tools.in)
3. **Debug issues**: Check the Actions logs if deployment fails

### Manual Deployment

```bash
# Build and export static files
pnpm build

# The 'out' directory contains the static site
# Upload the contents to your hosting provider
```

## 🔧 API Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE=https://api.tundasportsclub.com
NEXT_PUBLIC_MAX_FILE_SIZE=52428800  # 50MB in bytes
NEXT_PUBLIC_API_TIMEOUT=600000      # 10 minutes in milliseconds
```

### CORS Configuration

**Important:** Make sure your Flask API server allows requests from your GitHub Pages domain:

```python
# In your Flask API server
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    'https://office-tools.in',
    'https://www.office-tools.in',    # If using www subdomain
    'http://localhost:3000'            # For development
])
```

### API Endpoints Used

- `POST /api/pdf/convert` - PDF to Word conversion
- `POST /api/pdf-merger/merge` - PDF merging
- `POST /api/pdf-unlock` - PDF password removal
- `POST /api/image/to-pdf` - Image to PDF conversion
- `POST /api/text/password` - Password generation
- `POST /api/generator/qr-generate` - QR code generation

## 🛠️ Development

### Adding New Tools

1. **Create a new page**
   ```bash
   mkdir app/\(tools\)/your-tool-name
   touch app/\(tools\)/your-tool-name/page.tsx
   ```

2. **Follow the existing pattern**
   ```typescript
   'use client'
   
   import { useState } from 'react'
   import { Button } from '@/components/ui/button'
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
   // ... other imports
   
   export default function YourToolPage() {
     // Tool implementation
   }
   ```

3. **Update the tools list**
   ```typescript
   // In components/header.tsx and components/tools-grid.tsx
   const tools = [
     // ... existing tools
     { 
       name: 'Your Tool', 
       slug: 'your-tool-name', 
       description: 'Tool description',
       icon: YourIcon,
       category: 'Category'
     }
   ]
   ```

### Styling Guidelines

- Use **Tailwind CSS** utility classes
- Follow **shadcn/ui** component patterns
- Ensure **responsive design** (mobile-first)
- Test **dark mode** compatibility
- Use **semantic HTML** for accessibility

### Component Architecture

- **Page Components**: `'use client'` for interactivity
- **UI Components**: Reusable shadcn/ui components
- **Layout Components**: Header, Footer, Navigation
- **Feature Components**: Tools grid, Hero, Features
- **Utility Functions**: API helpers, formatting utilities

## 🔧 Development

### Adding New Tools

1. **Create tool definition file**
   ```bash
   # Create new file in _tools/
   touch _tools/new-tool.md
   ```

2. **Add tool frontmatter**
   ```yaml
   ---
   layout: tool
   title: "Tool Name - Description"
   description: "SEO-optimized description"
   keywords: "keyword1, keyword2, keyword3"
   tool_name: "Tool Name"
   tool_category: "Category Name"
   ---
   ```

3. **Implement tool functionality**
   ```html
   <!-- Tool HTML structure with shadcn/ui classes -->
   <div class="card">
     <div class="card-content">
       <!-- Tool implementation -->
     </div>
   </div>
   
   <script>
   // Tool JavaScript functionality
   </script>
   ```

### CSS/Styling Guidelines

- **Use Tailwind CSS classes** for consistent styling
- **Follow shadcn/ui patterns** for component design
- **Maintain responsive design** with mobile-first approach
- **Use CSS custom properties** for theme colors
- **Test dark mode compatibility** for all components

### JavaScript Guidelines

- **Vanilla JavaScript preferred** for optimal performance
- **Modular functions** with clear responsibilities
- **Error handling** with user-friendly messages
- **Progressive enhancement** for accessibility
- **API integration** with proper fallbacks

## 📖 API Documentation

### Authentication
```javascript
// No authentication required for public endpoints
// Rate limiting: 100 requests per minute per IP
```

### Request Format
```javascript
// All file upload endpoints expect multipart/form-data
const formData = new FormData();
formData.append('file', file);

fetch('https://api.tundasportsclub.com/api/pdf/convert', {
  method: 'POST',
  body: formData,
  headers: {
    'Accept': 'application/octet-stream'
  }
});
```

### Response Formats
```javascript
// Success response (binary file)
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="converted.docx"

// Error response (JSON)
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Detailed error information"
}
```

### Error Codes
- **400** - Bad Request (invalid file format)
- **413** - File too large (>50MB)
- **429** - Rate limit exceeded
- **500** - Server error during conversion
- **502/503** - Server temporarily unavailable
- **504** - Request timeout (complex files)

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Process
1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-tool`)
3. **Commit changes** (`git commit -m 'Add amazing tool'`)
4. **Push to branch** (`git push origin feature/amazing-tool`)
5. **Open Pull Request**

### Contribution Guidelines
- **Follow existing code style** and patterns
- **Add comprehensive tests** for new functionality
- **Update documentation** for any changes
- **Ensure responsive design** for all devices
- **Test API integrations** thoroughly

### Code Review Process
- **All PRs reviewed** by maintainers
- **Automated tests** must pass
- **Performance impact** assessed
- **Security review** for sensitive changes

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Community** - For the excellent React framework
- **Tailwind CSS Team** - For the utility-first CSS framework
- **shadcn** - For the beautiful UI component library
- **API Contributors** - For maintaining the conversion services
- **Open Source Community** - For tools and libraries used

## 📞 Support

- **Website:** [office-tools.in](https://office-tools.in)
- **Issues:** [GitHub Issues](https://github.com/Recentlystarted/office-tools/issues)
- **Email:** support@office-tools.in
- **Documentation:** Available in the `/docs` folder

---

**Made with ❤️ for the productivity community**

*Last updated: July 2025*
