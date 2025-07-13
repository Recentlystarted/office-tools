import { Hero } from '@/components/hero'
import { ToolsGrid } from '@/components/tools-grid'
import { Features } from '@/components/features'
import { CallToAction } from '@/components/cta'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Hero />
      </div>
      <div className="container mx-auto px-4">
        <ToolsGrid />
      </div>
      <Features />
      <CallToAction />
    </div>
  )
}
