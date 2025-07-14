'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { 
  Download,
  QrCode, 
  Smartphone, 
  Wifi, 
  Mail, 
  Phone, 
  MessageSquare, 
  CreditCard,
  User,
  Globe,
  Type,
  Loader2,
  Copy,
  Check,
  Palette,
  Settings,
  MessageCircle,
  Instagram,
  Youtube,
  MapPin,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'

interface QRResult {
  qr_code: string
  text: string
  size: string
  border?: string
  format?: string
}

export default function QRCodeGeneratorPage() {
  const [activeTab, setActiveTab] = useState('text')
  const [qrResult, setQrResult] = useState<QRResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // QR Settings
  const [qrSize, setQrSize] = useState([10])
  const [qrBorder, setQrBorder] = useState([4])
  const [errorCorrection, setErrorCorrection] = useState('L')
  
  // Form data for different types
  const [formData, setFormData] = useState({
    text: '',
    url: '',
    email: {
      to: '',
      subject: '',
      body: ''
    },
    phone: '',
    sms: {
      number: '',
      message: ''
    },
    wifi: {
      ssid: '',
      password: '',
      security: 'WPA',
      hidden: false
    },
    upi: {
      vpa: '',
      name: '',
      amount: '',
      note: ''
    },
    contact: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      organization: '',
      url: ''
    },
    whatsapp: {
      number: '',
      message: ''
    },
    location: {
      latitude: '',
      longitude: '',
      name: ''
    }
  })

  const generateQRContent = () => {
    switch (activeTab) {
      case 'text':
        return formData.text
      case 'url':
        return formData.url
      case 'email':
        const { to, subject, body } = formData.email
        return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      case 'phone':
        return `tel:${formData.phone}`
      case 'sms':
        return `sms:${formData.sms.number}?body=${encodeURIComponent(formData.sms.message)}`
      case 'wifi':
        const { ssid, password, security, hidden } = formData.wifi
        return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`
      case 'upi':
        const { vpa, name: payeeName, amount, note } = formData.upi
        return `upi://pay?pa=${vpa}&pn=${encodeURIComponent(payeeName)}&am=${amount}&tn=${encodeURIComponent(note)}`
      case 'contact':
        const { firstName, lastName, phone, email, organization, url } = formData.contact
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${firstName} ${lastName}\nTEL:${phone}\nEMAIL:${email}\nORG:${organization}\nURL:${url}\nEND:VCARD`
      case 'whatsapp':
        return `https://wa.me/${formData.whatsapp.number}?text=${encodeURIComponent(formData.whatsapp.message)}`
      case 'location':
        const { latitude, longitude, name: locationName } = formData.location
        return `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(locationName)})`
      default:
        return formData.text
    }
  }

  const generateQR = async () => {
    const content = generateQRContent()
    if (!content.trim()) {
      toast.error('Please enter content to generate QR code')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/generator/qr-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: content,
          size: qrSize[0],
          border: qrBorder[0],
          error_correction: errorCorrection
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate QR code')
      }

      // The API returns the image directly as PNG blob
      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      
      setQrResult({
        qr_code: imageUrl,
        text: content,
        size: qrSize[0].toString(),
        border: qrBorder[0].toString(),
        format: 'PNG'
      })
      
      toast.success('QR code generated successfully!')
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast.error('Failed to generate QR code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadQR = () => {
    if (!qrResult) return
    
    const link = document.createElement('a')
    link.href = qrResult.qr_code
    link.download = `qr-code-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('QR code downloaded!')
  }

  const copyQRToClipboard = async () => {
    if (!qrResult) return
    
    try {
      const response = await fetch(qrResult.qr_code)
      const blob = await response.blob()
      
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success('QR code copied to clipboard!')
      } else {
        toast.error('Clipboard not supported in this browser')
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast.error('Failed to copy QR code')
    }
  }

  const qrTypes = [
    { id: 'text', label: 'Text', icon: Type },
    { id: 'url', label: 'Website URL', icon: Globe },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'phone', label: 'Phone', icon: Phone },
    { id: 'sms', label: 'SMS', icon: MessageSquare },
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'upi', label: 'UPI Payment', icon: CreditCard },
    { id: 'contact', label: 'Contact Card', icon: User },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'location', label: 'Location', icon: MapPin },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <QrCode className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">QR Code Generator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create custom QR codes for text, URLs, contact information, WiFi passwords, UPI payments, and more
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary">Free</Badge>
            <Badge variant="secondary">No Registration</Badge>
            <Badge variant="secondary">Instant Download</Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <div className="space-y-6">
            {/* QR Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  QR Code Type
                </CardTitle>
                <CardDescription>
                  Choose the type of content for your QR code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {qrTypes.map((type) => {
                    const IconComponent = type.icon
                    return (
                      <Button
                        key={type.id}
                        variant={activeTab === type.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveTab(type.id)}
                        className="h-auto p-3 flex flex-col gap-2"
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="text-xs">{type.label}</span>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Content Input Forms */}
            <Card>
              <CardContent className="pt-6">
                <Tabs value={activeTab} className="w-full">
                  {/* Text Input */}
                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <Label htmlFor="text-content">Text Content</Label>
                      <Textarea
                        id="text-content"
                        placeholder="Enter your text here..."
                        value={formData.text}
                        onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                        rows={4}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  {/* URL Input */}
                  <TabsContent value="url" className="space-y-4">
                    <div>
                      <Label htmlFor="url-content">Website URL</Label>
                      <Input
                        id="url-content"
                        type="url"
                        placeholder="https://example.com"
                        value={formData.url}
                        onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  {/* Email Input */}
                  <TabsContent value="email" className="space-y-4">
                    <div>
                      <Label htmlFor="email-to">Email Address</Label>
                      <Input
                        id="email-to"
                        type="email"
                        placeholder="contact@example.com"
                        value={formData.email.to}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          email: { ...prev.email, to: e.target.value }
                        }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-subject">Subject (Optional)</Label>
                      <Input
                        id="email-subject"
                        placeholder="Email subject"
                        value={formData.email.subject}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          email: { ...prev.email, subject: e.target.value }
                        }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-body">Message (Optional)</Label>
                      <Textarea
                        id="email-body"
                        placeholder="Email message"
                        value={formData.email.body}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          email: { ...prev.email, body: e.target.value }
                        }))}
                        rows={3}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  {/* Phone Input */}
                  <TabsContent value="phone" className="space-y-4">
                    <div>
                      <Label htmlFor="phone-number">Phone Number</Label>
                      <Input
                        id="phone-number"
                        type="tel"
                        placeholder="+1234567890"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  {/* SMS Input */}
                  <TabsContent value="sms" className="space-y-4">
                    <div>
                      <Label htmlFor="sms-number">Phone Number</Label>
                      <Input
                        id="sms-number"
                        type="tel"
                        placeholder="+1234567890"
                        value={formData.sms.number}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          sms: { ...prev.sms, number: e.target.value }
                        }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sms-message">Message</Label>
                      <Textarea
                        id="sms-message"
                        placeholder="SMS message"
                        value={formData.sms.message}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          sms: { ...prev.sms, message: e.target.value }
                        }))}
                        rows={3}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  {/* WiFi Input */}
                  <TabsContent value="wifi" className="space-y-4">
                    <div>
                      <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
                      <Input
                        id="wifi-ssid"
                        placeholder="My WiFi Network"
                        value={formData.wifi.ssid}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          wifi: { ...prev.wifi, ssid: e.target.value }
                        }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="wifi-password">Password</Label>
                      <Input
                        id="wifi-password"
                        type="password"
                        placeholder="WiFi password"
                        value={formData.wifi.password}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          wifi: { ...prev.wifi, password: e.target.value }
                        }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="wifi-security">Security Type</Label>
                      <select
                        id="wifi-security"
                        value={formData.wifi.security}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          wifi: { ...prev.wifi, security: e.target.value }
                        }))}
                        className="mt-2 w-full p-2 border border-input rounded-md bg-background"
                      >
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">No Password</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="wifi-hidden"
                        checked={formData.wifi.hidden}
                        onCheckedChange={(checked: boolean) => setFormData(prev => ({ 
                          ...prev, 
                          wifi: { ...prev.wifi, hidden: checked }
                        }))}
                      />
                      <Label htmlFor="wifi-hidden">Hidden Network</Label>
                    </div>
                  </TabsContent>

                  {/* UPI Input */}
                  <TabsContent value="upi" className="space-y-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        💰 <strong>UPI Payment QR:</strong> Generate QR codes for instant UPI payments. Payers can edit the amount if you leave it blank.
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="upi-vpa">UPI ID *</Label>
                      <Input
                        id="upi-vpa"
                        placeholder="yourname@paytm"
                        value={formData.upi.vpa}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          upi: { ...prev.upi, vpa: e.target.value }
                        }))}
                        className="mt-2"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Your UPI ID (e.g., name@paytm, phone@ybl, name@upi)
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="upi-name">Payee Name *</Label>
                      <Input
                        id="upi-name"
                        placeholder="Your Name"
                        value={formData.upi.name}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          upi: { ...prev.upi, name: e.target.value }
                        }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="upi-amount">Amount (Optional - Payer can edit if blank)</Label>
                      <Input
                        id="upi-amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Leave blank for payer to enter amount"
                        value={formData.upi.amount}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          upi: { ...prev.upi, amount: e.target.value }
                        }))}
                        className="mt-2"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.upi.amount ? 
                          `Fixed amount: ₹${formData.upi.amount}` : 
                          'Payer can enter any amount'
                        }
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="upi-note">Payment Note (Optional)</Label>
                      <Input
                        id="upi-note"
                        placeholder="Payment for services, donation, etc."
                        value={formData.upi.note}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          upi: { ...prev.upi, note: e.target.value }
                        }))}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  {/* Contact Input */}
                  <TabsContent value="contact" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-first">First Name</Label>
                        <Input
                          id="contact-first"
                          placeholder="John"
                          value={formData.contact.firstName}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            contact: { ...prev.contact, firstName: e.target.value }
                          }))}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-last">Last Name</Label>
                        <Input
                          id="contact-last"
                          placeholder="Doe"
                          value={formData.contact.lastName}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            contact: { ...prev.contact, lastName: e.target.value }
                          }))}
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="contact-phone">Phone</Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        placeholder="+1234567890"
                        value={formData.contact.phone}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          contact: { ...prev.contact, phone: e.target.value }
                        }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.contact.email}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          contact: { ...prev.contact, email: e.target.value }
                        }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-org">Organization</Label>
                      <Input
                        id="contact-org"
                        placeholder="Company Name"
                        value={formData.contact.organization}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          contact: { ...prev.contact, organization: e.target.value }
                        }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-url">Website</Label>
                      <Input
                        id="contact-url"
                        type="url"
                        placeholder="https://example.com"
                        value={formData.contact.url}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          contact: { ...prev.contact, url: e.target.value }
                        }))}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  {/* WhatsApp Input */}
                  <TabsContent value="whatsapp" className="space-y-4">
                    <div>
                      <Label htmlFor="whatsapp-number">Phone Number (with country code)</Label>
                      <Input
                        id="whatsapp-number"
                        placeholder="919876543210"
                        value={formData.whatsapp.number}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          whatsapp: { ...prev.whatsapp, number: e.target.value }
                        }))}
                        className="mt-2"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Include country code without + (e.g., 919876543210 for India)
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="whatsapp-message">Pre-filled Message (Optional)</Label>
                      <Textarea
                        id="whatsapp-message"
                        placeholder="Hello! I found your contact..."
                        value={formData.whatsapp.message}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          whatsapp: { ...prev.whatsapp, message: e.target.value }
                        }))}
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  {/* Location Input */}
                  <TabsContent value="location" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location-lat">Latitude</Label>
                        <Input
                          id="location-lat"
                          type="number"
                          step="any"
                          placeholder="19.0760"
                          value={formData.location.latitude}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            location: { ...prev.location, latitude: e.target.value }
                          }))}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location-lng">Longitude</Label>
                        <Input
                          id="location-lng"
                          type="number"
                          step="any"
                          placeholder="72.8777"
                          value={formData.location.longitude}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            location: { ...prev.location, longitude: e.target.value }
                          }))}
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location-name">Location Name (Optional)</Label>
                      <Input
                        id="location-name"
                        placeholder="My Office, Mumbai"
                        value={formData.location.name}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          location: { ...prev.location, name: e.target.value }
                        }))}
                        className="mt-2"
                      />
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        💡 <strong>Tip:</strong> You can get coordinates from Google Maps by right-clicking on a location and selecting the coordinates.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* QR Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  QR Code Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Size: {qrSize[0]}</Label>
                  <Slider
                    value={qrSize}
                    onValueChange={setQrSize}
                    max={20}
                    min={5}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Small</span>
                    <span>Large</span>
                  </div>
                </div>
                
                <div>
                  <Label>Border: {qrBorder[0]}</Label>
                  <Slider
                    value={qrBorder}
                    onValueChange={setQrBorder}
                    max={10}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>No border</span>
                    <span>Thick border</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button 
              onClick={generateQR} 
              size="lg" 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating QR Code...
                </>
              ) : (
                <>
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate QR Code
                </>
              )}
            </Button>
          </div>

          {/* Result Section */}
          <div className="lg:sticky lg:top-8">
            <Card>
              <CardHeader>
                <CardTitle>Generated QR Code</CardTitle>
                <CardDescription>
                  Your QR code will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {qrResult ? (
                  <div className="space-y-6">
                    {/* QR Code Display */}
                    <div className="flex justify-center">
                      <div className="p-4 bg-white rounded-lg border-2 border-border">
                        <Image
                          src={qrResult.qr_code}
                          alt="Generated QR Code"
                          width={300}
                          height={300}
                          className="rounded"
                        />
                      </div>
                    </div>

                    {/* QR Info */}
                    <div className="text-center text-sm text-muted-foreground">
                      <p>Size: {qrResult.size}</p>
                      <p className="mt-1 break-all">{qrResult.text.substring(0, 100)}{qrResult.text.length > 100 ? '...' : ''}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                      <Button onClick={downloadQR} variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button onClick={copyQRToClipboard} variant="outline" className="w-full">
                        {copied ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <QrCode className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No QR Code Yet</h3>
                    <p className="text-muted-foreground">
                      Fill in the form and click "Generate QR Code" to create your custom QR code
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Features</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-lg border bg-card">
              <Smartphone className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Multiple Types</h3>
              <p className="text-sm text-muted-foreground">
                Support for text, URLs, WiFi, contacts, UPI payments, and more
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Settings className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Customizable</h3>
              <p className="text-sm text-muted-foreground">
                Adjust size, border, and error correction to fit your needs
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Download className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Instant Download</h3>
              <p className="text-sm text-muted-foreground">
                Generate and download your QR codes instantly in PNG format
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
