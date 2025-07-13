import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Zap, Smartphone, Globe, Lock, Clock, Users, Award } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: '100% Free',
    description: 'No registration required, no hidden costs, no limitations on usage'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Files are processed securely and automatically deleted after conversion'
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Works perfectly on all devices - desktop, tablet, and mobile'
  },
  {
    icon: Globe,
    title: 'No Downloads',
    description: 'Everything works in your browser, no software installation required'
  },
  {
    icon: Lock,
    title: 'Data Protection',
    description: 'We never store or access your documents, complete privacy guaranteed'
  },
  {
    icon: Clock,
    title: 'Fast Processing',
    description: 'Lightning-fast conversion and processing powered by optimized servers'
  }
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mb-2">
            Why Choose Our Platform?
          </Badge>
          <h2 className="text-4xl font-bold">Built for Professionals</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Experience the perfect blend of powerful functionality, robust security, and seamless user experience. 
            Trusted by professionals worldwide for critical document processing needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-bold text-xl">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold">1M+</span>
              </div>
              <p className="text-muted-foreground">Happy Users</p>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold">100%</span>
              </div>
              <p className="text-muted-foreground">Secure Processing</p>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold">25+</span>
              </div>
              <p className="text-muted-foreground">Professional Tools</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
