import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CancellationRefundsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Cancellation & Refunds Policy</h1>
        <p className="text-lg text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Donation Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Office Tools is a free service. Any payments made are voluntary donations to support 
              the development and maintenance of our free tools.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Refund Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Since all payments are voluntary donations:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Donations are non-refundable</li>
              <li>• All tools remain free regardless of donation status</li>
              <li>• Donations help us maintain and improve our services</li>
              <li>• No additional features are unlocked with donations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cancellation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              There are no subscriptions or recurring payments. All donations are one-time payments.
              You can stop using our services at any time without any cancellation process.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact for Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              If you have any questions about this policy, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-medium">Email: support@office-tools.in</p>
              <p className="text-sm text-muted-foreground mt-1">
                We typically respond within 24 hours
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update this policy from time to time. Any changes will be posted on this page 
              with an updated revision date.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
