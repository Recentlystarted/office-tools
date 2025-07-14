import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">About Office Tools</h1>
        <p className="text-lg text-muted-foreground">
          Your comprehensive suite of online productivity tools
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Office Tools provides free, fast, and secure online tools to help you work more efficiently. 
              From PDF processing to text formatting, password generation to QR codes, we offer essential 
              utilities that work right in your browser without any downloads or registrations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>• 100% Free to use</li>
              <li>• No registration required</li>
              <li>• Works entirely in your browser</li>
              <li>• Secure and private processing</li>
              <li>• Mobile-friendly interface</li>
              <li>• Fast and reliable tools</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your privacy is our priority. Files are processed securely and are not stored on our servers. 
              All processing happens either in your browser or on secure servers that automatically delete 
              files after processing.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
