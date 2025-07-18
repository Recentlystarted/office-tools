import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, MessageCircle, Clock, Globe } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          We're here to help! Get in touch with our support team.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Support
            </CardTitle>
            <CardDescription>
              Get help with any questions or issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">support@office-tools.in</p>
              <p className="text-sm text-muted-foreground mt-1">
                Primary support channel
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Response time: Usually within 24 hours
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Quick Questions
            </CardTitle>
            <CardDescription>
              For general inquiries and feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">hello@office-tools.in</p>
              <p className="text-sm text-muted-foreground mt-1">
                General inquiries
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Available worldwide
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>What can we help you with?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Technical Support</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Tool not working properly</li>
                  <li>• File conversion issues</li>
                  <li>• Browser compatibility</li>
                  <li>• Upload or download problems</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">General Inquiries</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Feature requests</li>
                  <li>• Business partnerships</li>
                  <li>• Privacy and security</li>
                  <li>• Donation questions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Office Tools</p>
                <p className="text-sm text-muted-foreground">
                  A free online toolkit for document processing and conversion
                </p>
              </div>
              <div>
                <p className="font-medium">Website</p>
                <p className="text-sm text-muted-foreground">
                  https://office-tools.in
                </p>
              </div>
              <div>
                <p className="font-medium">Service Area</p>
                <p className="text-sm text-muted-foreground">
                  Global - Available worldwide
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Technical Issues</span>
                <Badge variant="default">Within 24 hours</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">General Questions</span>
                <Badge variant="secondary">1-2 business days</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Feature Requests</span>
                <Badge variant="outline">2-3 business days</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
