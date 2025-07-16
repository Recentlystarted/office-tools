import { Metadata } from 'next'

export interface ToolSEOConfig {
  name: string
  description: string
  keywords: string[]
  category: string
  features: string[]
  pathname: string
}

const baseUrl = 'https://office-tools.in'

// Tool configurations for SEO
export const toolsConfig: Record<string, ToolSEOConfig> = {
  'image-converter': {
    name: 'Image Converter',
    description: 'Free online image converter supporting JPG, PNG, WebP, GIF, BMP, TIFF, SVG, and ICO formats. Convert images with quality control and batch processing.',
    keywords: ['image converter', 'format converter', 'jpg to png', 'png to jpg', 'webp converter', 'svg converter', 'ico converter', 'image format', 'online converter'],
    category: 'ImageProcessing',
    features: [
      'Convert between JPG, PNG, WebP, GIF, BMP, TIFF, SVG, ICO formats',
      'Batch conversion of multiple images',
      'Quality control and resizing options',
      'No registration required',
      'Free unlimited usage'
    ],
    pathname: '/image-converter'
  },
  'pdf-merger': {
    name: 'PDF Merger',
    description: 'Merge multiple PDF files into one document online. Free PDF merger tool with drag-and-drop interface.',
    keywords: ['pdf merger', 'combine pdf', 'merge pdf files', 'pdf joiner', 'pdf combine', 'online pdf merger'],
    category: 'DocumentProcessing',
    features: [
      'Merge unlimited PDF files',
      'Drag and drop interface',
      'Maintain original quality',
      'No watermarks',
      'Secure processing'
    ],
    pathname: '/pdf-merger'
  },
  'qr-code-generator': {
    name: 'QR Code Generator',
    description: 'Generate QR codes for text, URLs, WiFi, emails, phone numbers, and more. Free online QR code maker with customization options.',
    keywords: ['qr code generator', 'qr maker', 'qr code creator', 'wifi qr code', 'url qr code', 'barcode generator'],
    category: 'UtilityApplication',
    features: [
      'Generate QR codes for various content types',
      'WiFi, Email, Phone, URL QR codes',
      'Customizable colors and sizes',
      'High-resolution downloads',
      'No registration required'
    ],
    pathname: '/qr-code-generator'
  },
  'password-generator': {
    name: 'Password Generator',
    description: 'Generate strong, secure passwords with customizable options. Free online password creator with symbols, numbers, and letters.',
    keywords: ['password generator', 'secure password', 'random password', 'strong password', 'password creator', 'password maker'],
    category: 'SecurityApplication',
    features: [
      'Generate strong passwords',
      'Customizable length and complexity',
      'Include symbols, numbers, letters',
      'Multiple passwords at once',
      'Copy to clipboard'
    ],
    pathname: '/password-generator'
  },
  'text-case-converter': {
    name: 'Text Case Converter',
    description: 'Convert text between different cases: uppercase, lowercase, title case, sentence case, and more. Free online text transformer.',
    keywords: ['text case converter', 'uppercase', 'lowercase', 'title case', 'sentence case', 'text transformer', 'case changer'],
    category: 'TextProcessing',
    features: [
      'Multiple case conversion options',
      'Uppercase, lowercase, title case',
      'Sentence case and camelCase',
      'Real-time conversion',
      'Copy to clipboard'
    ],
    pathname: '/text-case-converter'
  },
  'word-counter': {
    name: 'Word Counter',
    description: 'Count words, characters, paragraphs, and sentences in your text. Free online word count tool with detailed statistics.',
    keywords: ['word counter', 'character counter', 'text counter', 'word count', 'character count', 'text statistics'],
    category: 'TextProcessing',
    features: [
      'Count words and characters',
      'Reading time estimation',
      'Paragraph and sentence count',
      'Real-time counting',
      'Detailed text statistics'
    ],
    pathname: '/word-counter'
  },
  'url-shortener': {
    name: 'URL Shortener',
    description: 'Shorten long URLs for free. Create short links with custom aliases and track clicks. Professional URL shortening service.',
    keywords: ['url shortener', 'short link', 'link shortener', 'shorten url', 'tiny url', 'custom short links'],
    category: 'UtilityApplication',
    features: [
      'Shorten long URLs instantly',
      'Custom short link aliases',
      'Click tracking and analytics',
      'QR codes for short links',
      'Bulk URL shortening'
    ],
    pathname: '/url-shortener'
  },
  'hash-generator': {
    name: 'Hash Generator',
    description: 'Generate MD5, SHA1, SHA256, SHA512 hashes from text or files. Free online hash calculator and checksum generator.',
    keywords: ['hash generator', 'md5 generator', 'sha256 generator', 'checksum generator', 'hash calculator', 'file hash'],
    category: 'SecurityApplication',
    features: [
      'Multiple hash algorithms',
      'MD5, SHA1, SHA256, SHA512',
      'Text and file hashing',
      'Real-time generation',
      'Compare hash values'
    ],
    pathname: '/hash-generator'
  },
  'base64-encoder-decoder': {
    name: 'Base64 Encoder Decoder',
    description: 'Encode and decode Base64 strings online. Free Base64 converter for text and files with real-time processing.',
    keywords: ['base64 encoder', 'base64 decoder', 'base64 converter', 'encode decode', 'base64 online'],
    category: 'UtilityApplication',
    features: [
      'Encode text to Base64',
      'Decode Base64 to text',
      'File Base64 conversion',
      'Real-time processing',
      'Copy to clipboard'
    ],
    pathname: '/base64-encoder-decoder'
  },
  'json-formatter': {
    name: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data online. Free JSON formatter with syntax highlighting and error detection.',
    keywords: ['json formatter', 'json validator', 'json beautifier', 'json pretty print', 'json minifier', 'json parser'],
    category: 'DeveloperTool',
    features: [
      'Format and beautify JSON',
      'Validate JSON syntax',
      'Minify JSON data',
      'Syntax highlighting',
      'Error detection and fixing'
    ],
    pathname: '/json-formatter'
  },
  'color-picker': {
    name: 'Color Picker',
    description: 'Pick colors and get HEX, RGB, HSL color codes. Free online color picker tool with palette generator and color converter.',
    keywords: ['color picker', 'hex color', 'rgb color', 'hsl color', 'color converter', 'color palette', 'color codes'],
    category: 'DesignTool',
    features: [
      'Pick colors visually',
      'HEX, RGB, HSL codes',
      'Color palette generator',
      'Color format conversion',
      'Save favorite colors'
    ],
    pathname: '/color-picker'
  },
  'uuid-generator': {
    name: 'UUID Generator',
    description: 'Generate UUID/GUID strings online. Free UUID generator supporting v1, v4, and other versions with bulk generation.',
    keywords: ['uuid generator', 'guid generator', 'unique id', 'uuid v4', 'random uuid', 'identifier generator'],
    category: 'DeveloperTool',
    features: [
      'Generate UUID v1, v4',
      'Bulk UUID generation',
      'Copy to clipboard',
      'Validate existing UUIDs',
      'Different UUID formats'
    ],
    pathname: '/uuid-generator'
  },
  'timestamp-converter': {
    name: 'Timestamp Converter',
    description: 'Convert Unix timestamps to human-readable dates and vice versa. Free online timestamp converter with timezone support.',
    keywords: ['timestamp converter', 'unix timestamp', 'epoch converter', 'date converter', 'time converter', 'unix time'],
    category: 'UtilityApplication',
    features: [
      'Unix timestamp conversion',
      'Human-readable dates',
      'Timezone support',
      'Current timestamp',
      'Batch conversion'
    ],
    pathname: '/timestamp-converter'
  },
  'lorem-generator': {
    name: 'Lorem Ipsum Generator',
    description: 'Generate Lorem Ipsum placeholder text for your designs. Free Lorem generator with words, sentences, and paragraph options.',
    keywords: ['lorem ipsum', 'placeholder text', 'dummy text', 'lorem generator', 'filler text', 'sample text'],
    category: 'DesignTool',
    features: [
      'Generate Lorem Ipsum text',
      'Words, sentences, paragraphs',
      'Customizable length',
      'Multiple text formats',
      'Copy to clipboard'
    ],
    pathname: '/lorem-generator'
  },
  'url-encoder-decoder': {
    name: 'URL Encoder Decoder',
    description: 'Encode and decode URLs online. Free URL encoder/decoder for handling special characters in web addresses.',
    keywords: ['url encoder', 'url decoder', 'percent encoding', 'url escape', 'url unescape', 'uri encoder'],
    category: 'DeveloperTool',
    features: [
      'Encode URLs and components',
      'Decode percent-encoded URLs',
      'Handle special characters',
      'Real-time processing',
      'Copy encoded/decoded URLs'
    ],
    pathname: '/url-encoder-decoder'
  }
}

export function generateToolMetadata(toolKey: string): Metadata {
  const tool = toolsConfig[toolKey]
  if (!tool) {
    return {}
  }

  const fullUrl = `${baseUrl}${tool.pathname}`
  
  return {
    title: `${tool.name} - Free Online Tool | Office Tools`,
    description: tool.description,
    keywords: tool.keywords.join(', '),
    authors: [{ name: 'Office Tools Team' }],
    creator: 'Office Tools',
    publisher: 'Office Tools',
    robots: 'index, follow',
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: `${tool.name} - Free Online Tool`,
      description: tool.description,
      url: fullUrl,
      siteName: 'Office Tools',
      images: [
        {
          url: `${baseUrl}/og-${toolKey}.png`,
          width: 1200,
          height: 630,
          alt: `${tool.name} - Office Tools`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} - Free Online Tool`,
      description: tool.description,
      images: [`${baseUrl}/og-${toolKey}.png`],
      creator: '@OfficeToolsIn',
    },
    other: {
      'google-adsense-account': 'ca-pub-5696950830848605',
    },
  }
}

export function generateStructuredData(toolKey: string) {
  const tool = toolsConfig[toolKey]
  if (!tool) {
    return null
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool.name,
    "description": tool.description,
    "url": `${baseUrl}${tool.pathname}`,
    "applicationCategory": tool.category,
    "operatingSystem": "Any",
    "browserRequirements": "HTML5, JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": tool.features,
    "publisher": {
      "@type": "Organization",
      "name": "Office Tools",
      "url": baseUrl
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
    }
  }
}

// Generate sitemap data
export function generateSitemapData() {
  return Object.entries(toolsConfig).map(([key, tool]) => ({
    url: `${baseUrl}${tool.pathname}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
}
