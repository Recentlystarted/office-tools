import Link from 'next/link'
import { Github, Heart, ExternalLink, Globe } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <img 
                src="/favicon.svg" 
                alt="Office Tools" 
                className="h-6 w-6" 
              />
              <span className="font-semibold">Office Tools</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional online tools for PDF processing, document conversion, and office productivity.
            </p>
            <div className="flex items-center space-x-2">
              <Link 
                href="https://office-tools.in" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Globe className="h-4 w-4" />
                <span>office-tools.in</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* PDF Tools */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm sm:text-base">PDF Tools</h3>
            <div className="space-y-2 text-sm">
              <Link href="/pdf-to-docx" className="block text-muted-foreground hover:text-foreground transition-colors">
                PDF to Word
              </Link>
              <Link href="/pdf-merger" className="block text-muted-foreground hover:text-foreground transition-colors">
                PDF Merger
              </Link>
              <Link href="/pdf-compressor" className="block text-muted-foreground hover:text-foreground transition-colors">
                PDF Compressor
              </Link>
              <Link href="/pdf-unlock" className="block text-muted-foreground hover:text-foreground transition-colors">
                PDF Unlock
              </Link>
              <Link href="/rotate-pdf" className="block text-muted-foreground hover:text-foreground transition-colors">
                Rotate PDF
              </Link>
            </div>
          </div>

          {/* Generators & Tools */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm sm:text-base">Generators & Tools</h3>
            <div className="space-y-2 text-sm">
              <Link href="/qr-code-generator" className="block text-muted-foreground hover:text-foreground transition-colors">
                QR Code Generator
              </Link>
              <Link href="/password-generator" className="block text-muted-foreground hover:text-foreground transition-colors">
                Password Generator
              </Link>
              <Link href="/uuid-generator" className="block text-muted-foreground hover:text-foreground transition-colors">
                UUID Generator
              </Link>
              <Link href="/hash-generator" className="block text-muted-foreground hover:text-foreground transition-colors">
                Hash Generator
              </Link>
              <Link href="/color-picker" className="block text-muted-foreground hover:text-foreground transition-colors">
                Color Picker
              </Link>
            </div>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm sm:text-base">Company & Legal</h3>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link href="/donations" className="block text-muted-foreground hover:text-foreground transition-colors">
                Support Us
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
              <Link href="/privacy" className="block text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/cancellation-refunds" className="block text-muted-foreground hover:text-foreground transition-colors">
                Cancellation & Refunds
              </Link>
              <Link href="/shipping" className="block text-muted-foreground hover:text-foreground transition-colors">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 mx-1 text-red-500" />
              <span>for the productivity community</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Link 
                href="https://github.com/Recentlystarted/office-tools" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
                <span className="text-sm">GitHub</span>
              </Link>
              <span className="text-sm text-muted-foreground text-center">
                © 2025 Office Tools. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
