# Office Tools - Professional Document Processing Platform

![Office Tools](https://img.shields.io/badge/Office%20Tools-Pro-blue?style=for-the-badge&logo=nextdotjs)
![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)

A modern, professional web platform offering 25+ essential document processing tools. Built with Next.js 15, TypeScript, and shadcn/ui for a premium user experience.

## ✨ Features

### 🔧 **25+ Professional Tools**
- **PDF Tools**: Convert, merge, split, protect, unlock, rotate PDF files
- **Document Converters**: PDF to Word, Image to PDF, and more
- **Generators**: QR codes, secure passwords, and utility tools
- **Text Tools**: Advanced text manipulation and processing

### 🎨 **Modern UI/UX**
- **shadcn/ui Components**: Professional, accessible component library
- **Dark/Light Mode**: System-aware theme switching with dropdown options
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Smooth Animations**: Polished transitions and micro-interactions

### 🔒 **Security & Privacy**
- **100% Client-Side**: No data stored on servers
- **Secure Processing**: Files processed locally and securely
- **No Registration**: Use all tools without account creation
- **Privacy First**: Complete data protection guaranteed

### ⚡ **Performance**
- **Static Export**: Lightning-fast loading with Next.js static generation
- **Optimized Bundle**: Efficient code splitting and lazy loading
- **PWA Ready**: Progressive web app capabilities
- **SEO Optimized**: Perfect search engine optimization

## 🚀 Tech Stack

### **Frontend Framework**
- **Next.js 15.3.5** - Latest React framework with App Router
- **React 18.3.1** - Modern React with concurrent features
- **TypeScript 5.8.3** - Full type safety and developer experience

### **Styling & Components**
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **Radix UI** - Primitive components for complex interactions
- **Lucide React** - Beautiful, customizable icons

### **Development Tools**
- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality control

## 📦 Installation

### Prerequisites
- **Node.js** 18+ 
- **pnpm** (recommended) or npm/yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/office-tools-next.git

# Navigate to project directory
cd office-tools-next

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Export static files
pnpm run export
```

### Development Server
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🏗️ Project Structure

```
office-tools-next/
├── app/                          # Next.js App Router
│   ├── (tools)/                  # Tool pages group
│   │   ├── pdf-to-docx/         # PDF to Word converter
│   │   ├── pdf-merger/          # PDF merger tool
│   │   ├── qr-generator/        # QR code generator
│   │   └── password-generator/   # Password generator
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles
│
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx           # Button component
│   │   ├── card.tsx             # Card component
│   │   ├── input.tsx            # Input component
│   │   ├── dropdown-menu.tsx    # Dropdown menu
│   │   ├── tabs.tsx             # Tabs component
│   │   ├── badge.tsx            # Badge component
│   │   ├── separator.tsx        # Separator component
│   │   ├── toast.tsx            # Toast notifications
│   │   └── ...                  # Other UI components
│   │
│   ├── header.tsx               # Navigation header
│   ├── footer.tsx               # Footer component
│   ├── hero.tsx                 # Hero section
│   ├── tools-grid.tsx           # Tools showcase grid
│   ├── features.tsx             # Features section
│   ├── cta.tsx                  # Call-to-action section
│   ├── theme-provider.tsx       # Theme context provider
│   └── theme-toggle.tsx         # Dark/light mode toggle
│
├── lib/                         # Utility functions
│   ├── api.ts                   # API helper functions
│   └── utils.ts                 # Common utilities
│
├── hooks/                       # Custom React hooks
│   └── use-toast.ts             # Toast notification hook
│
├── public/                      # Static assets
├── .github/workflows/           # GitHub Actions CI/CD
└── Configuration files...
```

## 🛠️ Available Scripts

```bash
# Development
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run export       # Export static files

# Code Quality
pnpm run lint         # Run ESLint
pnpm run type-check   # Run TypeScript compiler check

# Deployment
pnpm run deploy       # Deploy to GitHub Pages
```

## 🎨 Design System

### **Colors**
- **Primary**: Blue-based theme with excellent contrast
- **Secondary**: Muted grays for subtle elements
- **Accent**: Carefully chosen highlight colors
- **Dark Mode**: True dark theme with proper contrast ratios

### **Typography**
- **Font Family**: System fonts for optimal performance
- **Scale**: Harmonious type scale from 12px to 72px
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### **Components**
All components follow shadcn/ui design principles:
- **Accessible**: Full keyboard navigation and screen reader support
- **Customizable**: Easy theming with CSS variables
- **Consistent**: Unified design language across all tools
- **Responsive**: Mobile-first responsive design

## 🔧 Tools Overview

### **PDF Tools**
| Tool | Description | Status |
|------|-------------|---------|
| PDF to Word | Convert PDF files to editable DOCX | ✅ Available |
| PDF Merger | Combine multiple PDFs into one | ✅ Available |
| PDF Splitter | Split PDF into separate pages | 🚧 Coming Soon |
| PDF Protector | Add password protection | 🚧 Coming Soon |
| PDF Unlock | Remove password protection | 🚧 Coming Soon |

### **Generators**
| Tool | Description | Status |
|------|-------------|---------|
| QR Code Generator | Create QR codes for various content | ✅ Available |
| Password Generator | Generate secure passwords | ✅ Available |
| Lorem Ipsum | Generate placeholder text | 🚧 Coming Soon |
| Color Palette | Generate color schemes | 🚧 Coming Soon |

### **Converters**
| Tool | Description | Status |
|------|-------------|---------|
| Image to PDF | Convert images to PDF format | 🚧 Coming Soon |
| Text to QR | Convert text to QR code | ✅ Available |
| JSON Formatter | Format and validate JSON | 🚧 Coming Soon |

## 🚀 Deployment

### **GitHub Pages**
The project is configured for automatic deployment to GitHub Pages:

1. **Automatic Deployment**: Push to `main` branch triggers deployment
2. **Static Export**: Next.js generates optimized static files
3. **Custom Domain**: Configure your domain in repository settings
4. **HTTPS**: Automatic HTTPS with GitHub Pages

### **Manual Deployment**
```bash
# Build and export
pnpm run build
pnpm run export

# Deploy the 'out' directory to your hosting provider
```

### **Environment Variables**
Create a `.env.local` file for local development:
```env
NEXT_PUBLIC_API_URL=https://api.tundasportsclub.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit using conventional commits: `git commit -m 'feat: add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### **Code Style**
- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use shadcn/ui components when possible
- Ensure accessibility compliance
- Add proper error handling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **shadcn** - For the beautiful component library
- **Radix UI** - For accessible primitive components
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon library

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/office-tools-next/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/office-tools-next/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/office-tools-next/discussions)
- **Email**: support@yourcompany.com

---

<div align="center">
  <p>Built with ❤️ using Next.js, TypeScript, and shadcn/ui</p>
  <p>© 2024 Office Tools. All rights reserved.</p>
</div>
