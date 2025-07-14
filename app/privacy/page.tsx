import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-lg text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We collect minimal information to provide our services:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Files you upload for processing (temporarily)</li>
              <li>• Basic usage analytics (anonymized)</li>
              <li>• Browser information for compatibility</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Process your files using our tools</li>
              <li>• Improve our services</li>
              <li>• Ensure website security</li>
              <li>• Display relevant advertisements</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>File Processing & Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Files uploaded to our tools are processed temporarily and automatically deleted. 
              We do not store, share, or retain your files after processing is complete.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We use Google AdSense to display advertisements. Google may collect information 
              as described in their privacy policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us through our website.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
