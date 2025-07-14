'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Link2,
  Copy,
  CheckCircle,
  ExternalLink,
  BarChart3,
  Eye,
  Calendar,
  Globe,
  Trash2,
  Download,
  QrCode,
  Settings,
  Star
} from 'lucide-react'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ShortenedUrl {
  id: string
  originalUrl: string
  shortUrl: string
  shortCode: string
  clicks: number
  createdAt: Date
  expiresAt?: Date
  title?: string
  description?: string
}

export default function URLShortenerPage() {
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isShortening, setIsShortening] = useState(false)
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  // Generate random short code
  const generateShortCode = (length: number = 6): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Validate URL
  const isValidUrl = (string: string): boolean => {
    try {
      const url = new URL(string)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch (_) {
      return false
    }
  }

  // Shorten URL
  const shortenUrl = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL to shorten')
      return
    }

    if (!isValidUrl(url)) {
      toast.error('Please enter a valid URL (including http:// or https://)')
      return
    }

    setIsShortening(true)

    try {
      // Simulate API call
      setTimeout(() => {
        const shortCode = customCode.trim() || generateShortCode()
        
        // Check if custom code already exists
        const existingUrl = shortenedUrls.find(u => u.shortCode === shortCode)
        if (existingUrl && customCode.trim()) {
          toast.error('Custom code already exists. Please choose a different one.')
          setIsShortening(false)
          return
        }

        const newShortenedUrl: ShortenedUrl = {
          id: Date.now().toString(),
          originalUrl: url,
          shortUrl: `https://short.ly/${shortCode}`,
          shortCode,
          clicks: 0,
          createdAt: new Date(),
          title: title.trim() || undefined,
          description: description.trim() || undefined
        }

        setShortenedUrls(prev => [newShortenedUrl, ...prev])
        
        // Clear form
        setUrl('')
        setCustomCode('')
        setTitle('')
        setDescription('')
        
        toast.success('URL shortened successfully!')
        setIsShortening(false)
      }, 1000)
    } catch (error) {
      console.error('Error shortening URL:', error)
      toast.error('Failed to shorten URL. Please try again.')
      setIsShortening(false)
    }
  }

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text)
      setTimeout(() => setCopied(null), 2000)
      toast.success(`${label} copied to clipboard!`)
    })
  }

  // Delete shortened URL
  const deleteUrl = (id: string) => {
    setShortenedUrls(prev => prev.filter(u => u.id !== id))
    toast.success('URL deleted successfully')
  }

  // Export URLs as CSV
  const exportUrls = () => {
    if (shortenedUrls.length === 0) {
      toast.error('No URLs to export')
      return
    }

    const csvContent = [
      ['Title', 'Short URL', 'Original URL', 'Clicks', 'Created Date'],
      ...shortenedUrls.map(url => [
        url.title || 'Untitled',
        url.shortUrl,
        url.originalUrl,
        url.clicks.toString(),
        url.createdAt.toLocaleDateString()
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = 'shortened-urls.csv'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    toast.success('URLs exported successfully!')
  }

  // Sample URLs for testing
  const sampleUrls = [
    {
      name: 'Google',
      url: 'https://www.google.com',
      description: 'Search engine'
    },
    {
      name: 'GitHub',
      url: 'https://github.com',
      description: 'Code repository platform'
    },
    {
      name: 'Stack Overflow',
      url: 'https://stackoverflow.com',
      description: 'Developer Q&A community'
    }
  ]

  const totalClicks = shortenedUrls.reduce((sum, url) => sum + url.clicks, 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Link2 className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
          URL Shortener
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create short, shareable links from long URLs. Track clicks and manage all your shortened links in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {/* URL Shortener Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Shorten URL
              </CardTitle>
              <CardDescription>
                Enter a long URL to create a short, shareable link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="url-input">Original URL</Label>
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com/very-long-url-that-needs-shortening"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="title-input">Title (Optional)</Label>
                <Input
                  id="title-input"
                  placeholder="Give your link a memorable title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description-input">Description (Optional)</Label>
                <Input
                  id="description-input"
                  placeholder="Brief description of the link"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="custom-code-input">Custom Code (Optional)</Label>
                <div className="flex mt-2">
                  <span className="inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 border-border rounded-l-md">
                    short.ly/
                  </span>
                  <Input
                    id="custom-code-input"
                    placeholder="mylink"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                    className="rounded-l-none"
                    maxLength={20}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Leave blank for auto-generated code. Only letters and numbers allowed.
                </p>
              </div>

              <Button 
                onClick={shortenUrl} 
                disabled={isShortening || !url.trim()}
                className="w-full"
              >
                {isShortening ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Shortening...
                  </>
                ) : (
                  <>
                    <Link2 className="mr-2 h-4 w-4" />
                    Shorten URL
                  </>
                )}
              </Button>

              {/* Sample URLs */}
              <div className="space-y-2">
                <Label>Try Sample URLs:</Label>
                <div className="grid grid-cols-1 gap-2">
                  {sampleUrls.map((sample) => (
                    <Button
                      key={sample.name}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setUrl(sample.url)
                        setTitle(sample.name)
                        setDescription(sample.description)
                      }}
                      className="justify-start text-left h-auto p-3"
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{sample.name}</span>
                        <span className="text-xs text-muted-foreground break-all">
                          {sample.url}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          {shortenedUrls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{shortenedUrls.length}</div>
                    <div className="text-xs text-muted-foreground">Total URLs</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{totalClicks}</div>
                    <div className="text-xs text-muted-foreground">Total Clicks</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Shortened URLs Management */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Shortened URLs ({shortenedUrls.length})
                </CardTitle>
                <CardDescription>
                  Manage and track your shortened links
                </CardDescription>
              </div>
              {shortenedUrls.length > 0 && (
                <Button onClick={exportUrls} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {shortenedUrls.length === 0 ? (
                <div className="text-center py-12">
                  <Link2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No URLs yet</h3>
                  <p className="text-muted-foreground">
                    Shorten your first URL to see it appear here with click tracking and management options.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {shortenedUrls.map((shortenedUrl) => (
                    <div key={shortenedUrl.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          {shortenedUrl.title && (
                            <h4 className="font-semibold text-sm mb-1 truncate">
                              {shortenedUrl.title}
                            </h4>
                          )}
                          {shortenedUrl.description && (
                            <p className="text-xs text-muted-foreground mb-2">
                              {shortenedUrl.description}
                            </p>
                          )}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                Short
                              </Badge>
                              <code className="text-sm font-medium bg-muted px-2 py-1 rounded">
                                {shortenedUrl.shortUrl}
                              </code>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                Original
                              </Badge>
                              <span className="text-xs text-muted-foreground break-all">
                                {shortenedUrl.originalUrl}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteUrl(shortenedUrl.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {shortenedUrl.clicks} clicks
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {shortenedUrl.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(shortenedUrl.shortUrl, 'Short URL')}
                        >
                          {copied === shortenedUrl.shortUrl ? (
                            <>
                              <CheckCircle className="mr-2 h-3 w-3" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-3 w-3" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(shortenedUrl.originalUrl, '_blank')}
                        >
                          <ExternalLink className="mr-2 h-3 w-3" />
                          Visit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
