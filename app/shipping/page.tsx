import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Shipping Policy</h1>
        <p className="text-lg text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Digital Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Office Tools is a completely digital service. We do not ship any physical products.
              All our tools are web-based and accessible through your browser.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>No Physical Shipping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Since we provide digital services only:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• No physical products are shipped</li>
              <li>• No shipping addresses are required</li>
              <li>• No shipping fees apply</li>
              <li>• All services are delivered instantly online</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our services are delivered instantly through our website:
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <ul className="space-y-2 text-muted-foreground">
                <li>• PDF conversion tools</li>
                <li>• Image processing tools</li>
                <li>• Text manipulation tools</li>
                <li>• Generator tools</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Access and Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our services are available 24/7 from anywhere in the world with an internet connection.
              No downloads, installations, or physical deliveries required.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              If you have any questions about our digital services, please contact us:
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-medium">Email: support@office-tools.in</p>
              <p className="text-sm text-muted-foreground mt-1">
                We're here to help with any questions about our online tools
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
