import Link from 'next/link'
import { Github, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
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
          </div>

          {/* PDF Tools */}
          <div className="space-y-3">
            <h3 className="font-semibold">PDF Tools</h3>
            <div className="space-y-2 text-sm">
              <Link href="/pdf-to-docx" className="block text-muted-foreground hover:text-foreground">
                PDF to Word
              </Link>
              <Link href="/pdf-merger" className="block text-muted-foreground hover:text-foreground">
                PDF Merger
              </Link>
              <Link href="/pdf-unlock" className="block text-muted-foreground hover:text-foreground">
                PDF Unlock
              </Link>
            </div>
          </div>

          {/* Generators */}
          <div className="space-y-3">
            <h3 className="font-semibold">Generators</h3>
            <div className="space-y-2 text-sm">
              <Link href="/qr-code-generator" className="block text-muted-foreground hover:text-foreground">
                QR Code Generator
              </Link>
              <Link href="/password-generator" className="block text-muted-foreground hover:text-foreground">
                Password Generator
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h3 className="font-semibold">Company</h3>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block text-muted-foreground hover:text-foreground">
                About Us
              </Link>
              <Link href="/privacy" className="block text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 mx-1 text-red-500" />
              <span>for the productivity community</span>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link 
                href="https://github.com/your-username/office-tools" 
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </Link>
              <span className="text-sm text-muted-foreground">
                © 2025 Office Tools. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
