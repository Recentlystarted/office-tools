'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Database, 
  QrCode, 
  Key, 
  Combine,
  Scissors,
  Shield,
  Unlock,
  Archive,
  RotateCcw,
  Edit3,
  Eye,
  FileImage,
  Image,
  Type,
  Calculator,
  Code,
  FileCode,
  Globe,
  Link2,
  Palette,
  Settings,
  Clock,
  Hash,
  Star,
  ArrowRight,
  Brain
} from 'lucide-react'

const tools = [
  // PDF Tools
  {
    name: 'PDF Tools Suite',
    description: 'Professional PDF processing with smart API fallback - convert, compress, merge, split, and secure PDFs',
    slug: 'pdf-tools',
    icon: Settings,
    category: 'PDF Tools',
    popular: true,
    status: 'active',
    featured: true
  },
  {
    name: 'PDF to Word',
    description: 'Convert PDF documents to editable Word files with perfect formatting preservation',
    slug: 'pdf-to-docx',
    icon: FileText,
    category: 'PDF Tools',
    popular: true,
    status: 'active'
  },
  {
    name: 'PDF Merger',
    description: 'Combine multiple PDF files into a single document with drag-and-drop reordering',
    slug: 'pdf-merger',
    icon: Combine,
    category: 'PDF Tools',
    popular: true,
    status: 'active'
  },
  {
    name: 'PDF to Excel',
    description: 'Extract tables and data from PDF files to Excel spreadsheets',
    slug: 'pdf-to-excel',
    icon: Database,
    category: 'PDF Tools',
    popular: true,
    status: 'coming-soon'
  },
  {
    name: 'Word to PDF',
    description: 'Convert Word documents (DOC, DOCX) to PDF format with perfect formatting',
    slug: 'word-to-pdf',
    icon: FileText,
    category: 'PDF Tools',
    popular: false,
    status: 'coming-soon'
  },
  {
    name: 'Split PDF',
    description: 'Split large PDF files into smaller documents or extract specific pages',
    slug: 'split-pdf',
    icon: Scissors,
    category: 'PDF Tools',
    popular: false,
    status: 'coming-soon'
  },
  {
    name: 'Protect PDF',
    description: 'Add password protection and security settings to your PDF documents',
    slug: 'protect-pdf',
    icon: Shield,
    category: 'PDF Tools',
    popular: false,
    status: 'coming-soon'
  },
  {
    name: 'PDF Password Remover',
    description: 'Remove password protection from PDF files when you have the password',
    slug: 'pdf-unlock',
    icon: Unlock,
    category: 'PDF Tools',
    popular: false,
    status: 'active'
  },
  {
    name: 'PDF Compressor',
    description: 'Reduce PDF file size while maintaining quality for easier sharing',
    slug: 'pdf-compressor',
    icon: Archive,
    category: 'PDF Tools',
    popular: true,
    status: 'active'
  },
  {
    name: 'Rotate PDF',
    description: 'Rotate PDF pages to the correct orientation (90°, 180°, 270°)',
    slug: 'rotate-pdf',
    icon: RotateCcw,
    category: 'PDF Tools',
    popular: false,
    status: 'active'
  },
  {
    name: 'PDF Viewer',
    description: 'View and navigate PDF files directly in your browser',
    slug: 'pdf-viewer',
    icon: Eye,
    category: 'PDF Tools',
    popular: false,
    status: 'active'
  },

  // Converters
  {
    name: 'Image to PDF',
    description: 'Convert JPG, PNG, and other image formats to PDF documents',
    slug: 'image-to-pdf',
    icon: FileImage,
    category: 'Converters',
    popular: true,
    status: 'active'
  },
  {
    name: 'Image Converter',
    description: 'Convert between different image formats (JPG, PNG, WebP, etc.)',
    slug: 'image-converter',
    icon: Image,
    category: 'Converters',
    popular: true,
    status: 'active'
  },

  // Generators
  {
    name: 'QR Code Generator',
    description: 'Create QR codes for text, URLs, WiFi, contact info, and more',
    slug: 'qr-code-generator',
    icon: QrCode,
    category: 'Generators',
    popular: true,
    status: 'active'
  },
  {
    name: 'Password Generator',
    description: 'Generate secure passwords with customizable length and complexity',
    slug: 'password-generator',
    icon: Key,
    category: 'Generators',
    popular: true,
    status: 'active'
  },
  {
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for design and development projects',
    slug: 'lorem-generator',
    icon: Type,
    category: 'Generators',
    popular: false,
    status: 'active'
  },
  {
    name: 'UUID Generator',
    description: 'Generate unique identifiers (UUIDs) for applications and databases',
    slug: 'uuid-generator',
    icon: Hash,
    category: 'Generators',
    popular: false,
    status: 'active'
  },

  // Text Tools
  {
    name: 'Text Case Converter',
    description: 'Convert text between uppercase, lowercase, title case, and more',
    slug: 'text-case-converter',
    icon: Type,
    category: 'Text Tools',
    popular: false,
    status: 'active'
  },
  {
    name: 'Word Counter',
    description: 'Count words, characters, paragraphs, and reading time',
    slug: 'word-counter',
    icon: Calculator,
    category: 'Text Tools',
    popular: false,
    status: 'active'
  },
  {
    name: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data with syntax highlighting',
    slug: 'json-formatter',
    icon: Code,
    category: 'Text Tools',
    popular: false,
    status: 'active'
  },
  {
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 text for data transmission',
    slug: 'base64-encoder-decoder',
    icon: FileCode,
    category: 'Text Tools',
    popular: false,
    status: 'active'
  },
  {
    name: 'AI Text Analyzer',
    description: 'Advanced AI-powered text analysis with sentiment, readability, and SEO insights',
    slug: 'ai-text-analyzer',
    icon: Brain,
    category: 'Text Tools',
    popular: true,
    status: 'active'
  },

  // Web Tools
  {
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs and query parameters for web development',
    slug: 'url-encoder-decoder',
    icon: Globe,
    category: 'Web Tools',
    popular: false,
    status: 'active'
  },
  {
    name: 'URL Shortener',
    description: 'Create short, shareable links from long URLs with click tracking',
    slug: 'url-shortener',
    icon: Link2,
    category: 'Web Tools',
    popular: true,
    status: 'active'
  },
  {
    name: 'Color Picker',
    description: 'Pick colors and convert between HEX, RGB, HSL, and other formats',
    slug: 'color-picker',
    icon: Palette,
    category: 'Web Tools',
    popular: false,
    status: 'coming-soon'
  },

  // Utility Tools
  {
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and other hash checksums',
    slug: 'hash-generator',
    icon: Settings,
    category: 'Utility Tools',
    popular: false,
    status: 'active'
  },
  {
    name: 'Timestamp Converter',
    description: 'Convert between Unix timestamps and human-readable dates with timezone support',
    slug: 'timestamp-converter',
    icon: Clock,
    category: 'Utility Tools',
    popular: true,
    status: 'active'
  }
]

const categories = [
  'All',
  'PDF Tools',
  'Converters', 
  'Generators',
  'Text Tools',
  'Web Tools',
  'Utility Tools'
]

export function ToolsGrid() {
  return (
    <section id="tools" className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            Professional Office Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access 25+ powerful tools for PDF processing, document conversion, 
            text manipulation, and office productivity. All free and secure.
          </p>
        </div>

        <Tabs defaultValue="All" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-4xl grid-cols-3 lg:grid-cols-7 h-auto p-1">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="text-xs lg:text-sm px-2 lg:px-4 py-2"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {tools
                  .filter(tool => category === 'All' || tool.category === category)
                  .map((tool) => {
                    const IconComponent = tool.icon
                    return (
                      <Card 
                        key={tool.slug} 
                        className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div className="flex flex-col gap-1">
                                {tool.popular && (
                                  <Badge variant="secondary" className="w-fit text-xs">
                                    <Star className="h-3 w-3 mr-1" />
                                    Popular
                                  </Badge>
                                )}
                                {tool.status === 'coming-soon' && (
                                  <Badge variant="outline" className="w-fit text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Coming Soon
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                            {tool.name}
                          </CardTitle>
                          <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                            {tool.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {tool.status === 'active' ? (
                            <Link href={`/${tool.slug}`}>
                              <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                Use Tool
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          ) : (
                            <Button disabled className="w-full">
                              Coming Soon
                              <Clock className="ml-2 h-4 w-4" />
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
              
              {tools.filter(tool => category === 'All' || tool.category === category).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No tools found in this category.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Statistics */}
        <div className="mt-16 lg:mt-24 text-center">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-primary">25+</div>
              <div className="text-sm text-muted-foreground">Professional Tools</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Free to Use</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-primary">Secure</div>
              <div className="text-sm text-muted-foreground">Privacy Protected</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Always Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
