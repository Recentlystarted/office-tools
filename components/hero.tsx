import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, FileText, Zap, Shield, Play, Heart } from 'lucide-react'
import Link from 'next/link'
import DonationModal from '@/components/donation-modal'

export function Hero() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      <div className="relative">
        <div className="text-center space-y-8 max-w-5xl mx-auto">
          {/* Badge */}
          <Badge variant="secondary" className="text-sm py-2 px-4">
            ✨ Now with 25+ Professional Tools
          </Badge>
          
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
              Professional 
              <span className="text-primary block lg:inline"> Office Tools</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your workflow with our comprehensive suite of <strong>25+ professional tools</strong> for 
              PDF processing, document conversion, and office productivity. 100% free, secure, and browser-based.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" className="text-lg px-8 py-6 h-auto" asChild>
              <Link href="#tools">
                Explore All Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto" asChild>
              <Link href="/pdf-to-docx">
                <Play className="mr-2 h-5 w-5" />
                Try PDF to Word
              </Link>
            </Button>
            <DonationModal 
              trigger={
                <Button size="lg" className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  <Heart className="mr-2 h-5 w-5" />
                  Support Us
                </Button>
              } 
            />
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-6 pt-12">
            <div className="flex items-center gap-3 px-6 py-3 rounded-full border-2 bg-background/80 backdrop-blur-sm hover:bg-primary/5 transition-colors">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-medium">100% Free Forever</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-full border-2 bg-background/80 backdrop-blur-sm hover:bg-primary/5 transition-colors">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-medium">Secure & Private</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-full border-2 bg-background/80 backdrop-blur-sm hover:bg-primary/5 transition-colors">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium">No Registration</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
