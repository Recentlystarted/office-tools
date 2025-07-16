import { Hero } from '@/components/hero'
import { ToolsGrid } from '@/components/tools-grid'
import { Features } from '@/components/features'
import { CallToAction } from '@/components/cta'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="w-full px-4 py-8 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <Hero />
        </div>
      </div>
      
      {/* Tools Grid */}
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <ToolsGrid />
        </div>
      </div>
      
      {/* Features */}
      <div className="w-full">
        <Features />
      </div>
      
      {/* Call to Action */}
      <div className="w-full">
        <CallToAction />
      </div>
    </div>
  )
}
