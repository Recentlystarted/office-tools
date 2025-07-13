import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Combine, 
  QrCode, 
  Key, 
  Unlock, 
  Image,
  Scissors,
  Shield,
  Eye,
  RotateCcw,
  ArrowRight,
  Star,
  FileImage,
  Database,
  Palette,
  Type,
  Link2,
  Archive,
  Edit3,
  Download,
  Upload,
  Hash,
  Globe
} from 'lucide-react'
import Link from 'next/link'

const tools = [
  // PDF Tools
  {
    name: 'PDF to Word',
    description: 'Convert PDF files to editable DOCX documents while preserving formatting',
    slug: 'pdf-to-word',
    icon: FileText,
    category: 'PDF Tools',
    popular: true
  },
  {
    name: 'PDF Merger',
    description: 'Combine multiple PDF files into a single document with drag-and-drop reordering',
    slug: 'pdf-merger',
    icon: Combine,
    category: 'PDF Tools',
    popular: true
  },
  {
    name: 'Word to PDF',
    description: 'Convert Word documents (DOCX, DOC) to PDF format easily',
    slug: 'word-to-pdf',
    icon: FileText,
    category: 'PDF Tools'
  },
  {
    name: 'PDF to Excel',
    description: 'Extract tables and data from PDF files to Excel spreadsheets',
    slug: 'pdf-to-excel',
    icon: Database,
    category: 'PDF Tools'
  },
  {
    name: 'Split PDF',
    description: 'Split PDF files into individual pages or extract specific page ranges',
    slug: 'split-pdf',
    icon: Scissors,
    category: 'PDF Tools'
  },
  {
    name: 'Protect PDF',
    description: 'Add password protection and security settings to your PDF files',
    slug: 'protect-pdf',
    icon: Shield,
    category: 'PDF Tools'
  },
  {
    name: 'PDF Password Remover',
    description: 'Remove password protection from PDF files quickly and securely',
    slug: 'pdf-password-remover',
    icon: Unlock,
    category: 'PDF Tools'
  },
  {
    name: 'PDF Compressor',
    description: 'Reduce PDF file size while maintaining quality',
    slug: 'pdf-compressor',
    icon: Archive,
    category: 'PDF Tools'
  },
  {
    name: 'Rotate PDF',
    description: 'Rotate PDF pages to the correct orientation (90°, 180°, 270°)',
    slug: 'rotate-pdf',
    icon: RotateCcw,
    category: 'PDF Tools'
  },
  {
    name: 'PDF Editor',
    description: 'Edit PDF files by adding text, images, and annotations',
    slug: 'pdf-editor',
    icon: Edit3,
    category: 'PDF Tools'
  },
  {
    name: 'PDF Viewer',
    description: 'View and browse PDF files directly in your browser without downloading',
    slug: 'pdf-viewer',
    icon: Eye,
    category: 'PDF Tools'
  },
  
  // Converters
  {
    name: 'Image to PDF',
    description: 'Convert images (JPG, PNG, WEBP, TIFF) to PDF documents with customizable settings',
    slug: 'image-to-pdf',
    icon: FileImage,
    category: 'Converters'
  },
  {
    name: 'Image Converter',
    description: 'Convert between different image formats (JPG, PNG, WEBP, GIF)',
    slug: 'image-converter',
    icon: Image,
    category: 'Converters'
  },
  
  // Generators
  {
    name: 'QR Code Generator',
    description: 'Create QR codes for text, URLs, WiFi credentials, and more',
    slug: 'qr-code-generator',
    icon: QrCode,
    category: 'Generators',
    popular: true
  },
  {
    name: 'Password Generator',
    description: 'Generate secure, customizable passwords with various character options',
    slug: 'password-generator',
    icon: Key,
    category: 'Generators',
    popular: true
  },
  {
    name: 'Color Picker',
    description: 'Pick colors from images or generate color palettes for design projects',
    slug: 'color-picker',
    icon: Palette,
    category: 'Generators'
  },
  
  // Text Tools
  {
    name: 'Text Case Converter',
    description: 'Convert text between different cases: UPPER, lower, Title Case, and more',
    slug: 'text-case-converter',
    icon: Type,
    category: 'Text Tools'
  },
  {
    name: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data with syntax highlighting',
    slug: 'json-formatter',
    icon: Database,
    category: 'Text Tools'
  },
  {
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings for data transmission and storage',
    slug: 'base64-encoder-decoder',
    icon: Hash,
    category: 'Text Tools'
  },
  {
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs for safe transmission and processing',
    slug: 'url-encoder-decoder',
    icon: Link2,
    category: 'Text Tools'
  },
  
  // Web Tools
  {
    name: 'URL Shortener',
    description: 'Create short, shareable links from long URLs',
    slug: 'url-shortener',
    icon: Globe,
    category: 'Web Tools'
  }
]

export function ToolsGrid() {
  const popularTools = tools.filter(tool => tool.popular)
  const pdfTools = tools.filter(tool => tool.category === 'PDF Tools')
  const converters = tools.filter(tool => tool.category === 'Converters')
  const generators = tools.filter(tool => tool.category === 'Generators')
  const textTools = tools.filter(tool => tool.category === 'Text Tools')
  const webTools = tools.filter(tool => tool.category === 'Web Tools')

  const renderToolCard = (tool: typeof tools[0], variant: 'featured' | 'compact' = 'compact') => {
    const IconComponent = tool.icon
    
    if (variant === 'featured') {
      return (
        <Card key={tool.slug} className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <IconComponent className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  {tool.popular && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {tool.category}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-sm mb-4">
              {tool.description}
            </CardDescription>
            <Button asChild className="w-full">
              <Link href={`/${tool.slug}`}>
                Use Tool
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card key={tool.slug} className="group hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <IconComponent className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{tool.name}</h3>
                {tool.popular && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {tool.description}
              </p>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/${tool.slug}`}>
                  Try Now
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <section id="tools" className="py-16">
      <div className="space-y-12">
        {/* Popular Tools */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Popular Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Most trusted and frequently used tools by thousands of users worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {popularTools.map((tool) => renderToolCard(tool, 'featured'))}
          </div>
        </div>

        {/* All Tools by Category */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">All Tools</h2>
            <p className="text-muted-foreground">
              Browse our complete collection organized by category
            </p>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-6 max-w-3xl mx-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pdf">PDF</TabsTrigger>
              <TabsTrigger value="converters">Convert</TabsTrigger>
              <TabsTrigger value="generators">Generate</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="web">Web</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool) => renderToolCard(tool))}
              </div>
            </TabsContent>
            
            <TabsContent value="pdf" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pdfTools.map((tool) => renderToolCard(tool))}
              </div>
            </TabsContent>
            
            <TabsContent value="converters" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {converters.map((tool) => renderToolCard(tool))}
              </div>
            </TabsContent>
            
            <TabsContent value="generators" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generators.map((tool) => renderToolCard(tool))}
              </div>
            </TabsContent>
            
            <TabsContent value="text" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {textTools.map((tool) => renderToolCard(tool))}
              </div>
            </TabsContent>
            
            <TabsContent value="web" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {webTools.map((tool) => renderToolCard(tool))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
