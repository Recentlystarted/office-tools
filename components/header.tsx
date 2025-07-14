'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/theme-toggle'
import { Menu, Search, X, FileText, Combine, QrCode, Key, ChevronDown } from 'lucide-react'

const tools = [
  { name: 'PDF to Word', slug: 'pdf-to-docx', description: 'Convert PDF to DOCX', icon: FileText, category: 'PDF Tools', popular: true },
  { name: 'PDF Merger', slug: 'pdf-merger', description: 'Combine multiple PDFs', icon: Combine, category: 'PDF Tools', popular: true },
  { name: 'QR Generator', slug: 'qr-code-generator', description: 'Create QR codes', icon: QrCode, category: 'Generators', popular: true },
  { name: 'Password Generator', slug: 'password-generator', description: 'Generate secure passwords', icon: Key, category: 'Generators', popular: true },
  { name: 'PDF Compressor', slug: 'pdf-compressor', description: 'Reduce PDF file size', icon: FileText, category: 'PDF Tools', popular: false },
  { name: 'Image to PDF', slug: 'image-to-pdf', description: 'Convert images to PDF', icon: FileText, category: 'Converters', popular: false },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center">
              <img 
                src="/favicon.svg" 
                alt="Office Tools" 
                className="h-8 w-8" 
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl">Office Tools</span>
              <Badge variant="secondary" className="ml-2 text-xs">Pro</Badge>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  Tools
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80">
                <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                  Popular Tools
                </DropdownMenuLabel>
                {tools.map((tool) => {
                  const IconComponent = tool.icon
                  return (
                    <DropdownMenuItem key={tool.slug} asChild>
                      <Link href={`/${tool.slug}`} className="flex items-center gap-3 p-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{tool.name}</span>
                            {tool.popular && (
                              <Badge variant="secondary" className="text-xs">Popular</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{tool.description}</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/#tools" className="flex items-center justify-center p-3 font-medium text-primary">
                    View All Tools
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
              {searchQuery && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search Results Dropdown */}
        {searchQuery && (
          <div className="hidden md:block absolute top-full left-0 right-0 bg-popover border-b shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <div className="text-sm text-muted-foreground mb-2">
                Search results for "{searchQuery}"
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/${tool.slug}`}
                      className="block p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setSearchQuery('')}
                    >
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-sm text-muted-foreground">{tool.description}</div>
                    </Link>
                  ))
                ) : (
                  <div className="p-3 text-muted-foreground">No tools found</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Separator />
            
            {/* Mobile Menu Items */}
            <div className="space-y-3">
              <Link
                href="/"
                className="block font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/#tools"
                className="block font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                All Tools
              </Link>
              <Link
                href="/#features"
                className="block font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
            </div>
            
            <Separator />
            
            {/* Mobile Popular Tools */}
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-3">Popular Tools</div>
              <div className="space-y-2">
                {tools.map((tool) => {
                  const IconComponent = tool.icon
                  return (
                    <Link
                      key={tool.slug}
                      href={`/${tool.slug}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{tool.name}</div>
                        <div className="text-sm text-muted-foreground">{tool.description}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
