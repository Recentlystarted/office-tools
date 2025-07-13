import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, Github, Star } from 'lucide-react'
import Link from 'next/link'

export function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-2xl bg-gradient-to-br from-background via-background to-primary/5">
          <CardContent className="p-12 text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm py-2 px-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Ready to Get Started?
              </Badge>
              
              <h2 className="text-4xl font-bold tracking-tight">
                Experience the Power of 
                <span className="text-primary block sm:inline"> Professional Tools</span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join over <strong>1 million users</strong> who trust our platform for their daily document processing needs. 
                Start using our tools now - no registration required!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="text-lg px-8 py-6 h-auto" asChild>
                <Link href="/#tools">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Using Tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto" asChild>
                <Link href="/pdf-to-docx">
                  Try PDF to Word
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">1M+</div>
                <div className="text-sm text-muted-foreground">Happy Users</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">25+</div>
                <div className="text-sm text-muted-foreground">Professional Tools</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Free Forever</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
