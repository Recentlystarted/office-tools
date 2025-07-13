'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { QrCode, Download, AlertCircle } from 'lucide-react'
import { apiClient } from '@/lib/api'

export default function QrGeneratorPage() {
  const [text, setText] = useState('')
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!text.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const result = await apiClient.postJson('/api/generator/qr-generate', {
        text: text.trim(),
        size: 256,
        format: 'png'
      })

      if (result.qr_code_base64) {
        setQrImage(`data:image/png;base64,${result.qr_code_base64}`)
      } else if (result.qr_url) {
        setQrImage(result.qr_url)
      } else {
        throw new Error('Invalid response format')
      }

    } catch (error) {
      console.error('QR generation error:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate QR code')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQrCode = () => {
    if (!qrImage) return

    const link = document.createElement('a')
    link.href = qrImage
    link.download = 'qr-code.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetForm = () => {
    setText('')
    setQrImage(null)
    setError(null)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">QR Code Generator</h1>
        <p className="text-lg text-muted-foreground">
          Generate QR codes for text, URLs, WiFi credentials, and more
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Enter Text or URL
            </CardTitle>
            <CardDescription>
              Enter any text, URL, or data you want to encode in the QR code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr-text">Text or URL</Label>
              <Textarea
                id="qr-text"
                placeholder="Enter text, URL, email, phone number, or any data..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleGenerate}
                disabled={!text.trim() || isGenerating}
                className="flex-1"
              >
                {isGenerating ? 'Generating...' : 'Generate QR Code'}
              </Button>
              {qrImage && (
                <Button variant="outline" onClick={resetForm}>
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* QR Code Display */}
        <Card>
          <CardHeader>
            <CardTitle>Generated QR Code</CardTitle>
            <CardDescription>
              {qrImage ? 'Your QR code is ready to download' : 'QR code will appear here after generation'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {qrImage ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <img
                      src={qrImage}
                      alt="Generated QR Code"
                      className="w-64 h-64"
                    />
                  </div>
                </div>
                <Button onClick={downloadQrCode} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
                <div className="text-center text-muted-foreground">
                  <QrCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Enter text and click "Generate QR Code"</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Examples */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>Click any example to try it out</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Website URL', value: 'https://example.com' },
              { label: 'Email', value: 'mailto:hello@example.com' },
              { label: 'Phone', value: 'tel:+1234567890' },
              { label: 'WiFi', value: 'WIFI:T:WPA;S:MyNetwork;P:password123;;' },
            ].map((example) => (
              <Button
                key={example.label}
                variant="outline"
                className="h-auto p-4 text-left justify-start"
                onClick={() => setText(example.value)}
              >
                <div>
                  <div className="font-medium">{example.label}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {example.value}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
