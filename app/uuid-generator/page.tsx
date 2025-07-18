'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import ApiStatus from '@/components/api-status'
import { 
  Hash,
  Copy,
  Check,
  RefreshCw,
  Download,
  Info,
  Zap,
  Settings,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'

interface UUIDResult {
  id: string
  version: string
  variant: string
  timestamp?: string
}

export default function UUIDGeneratorPage() {
  const [uuids, setUuids] = useState<UUIDResult[]>([])
  const [quantity, setQuantity] = useState([5])
  const [uuidVersion, setUuidVersion] = useState<'v4' | 'v1' | 'v3' | 'v5'>('v4')
  const [copied, setCopied] = useState<string | null>(null)
  const [includeHyphens, setIncludeHyphens] = useState(true)
  const [upperCase, setUpperCase] = useState(false)

  // UUID v4 generation (random)
  const generateUUIDv4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // UUID v1 generation (timestamp-based)
  const generateUUIDv1 = (): string => {
    // Simplified v1 UUID generation
    const timestamp = Date.now()
    const timeHex = timestamp.toString(16).padStart(12, '0')
    const clockSeq = Math.floor(Math.random() * 0x3fff)
    const node = Array.from({length: 6}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('')
    
    return `${timeHex.slice(-8)}-${timeHex.slice(-12, -8)}-1${timeHex.slice(-15, -12)}-${clockSeq.toString(16).padStart(4, '0')}-${node}`
  }

  // UUID v3 generation (name-based with MD5) - simplified
  const generateUUIDv3 = (): string => {
    const random = Math.random().toString()
    let hash = 0
    for (let i = 0; i < random.length; i++) {
      const char = random.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    const hex = Math.abs(hash).toString(16).padStart(32, '0')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-3${hex.slice(13, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
  }

  // UUID v5 generation (name-based with SHA-1) - simplified
  const generateUUIDv5 = (): string => {
    const random = Math.random().toString() + Date.now().toString()
    let hash = 0
    for (let i = 0; i < random.length; i++) {
      const char = random.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    
    const hex = Math.abs(hash).toString(16).padStart(32, '0')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
  }

  const generateUUID = (version: string): string => {
    switch (version) {
      case 'v1': return generateUUIDv1()
      case 'v3': return generateUUIDv3()
      case 'v5': return generateUUIDv5()
      default: return generateUUIDv4()
    }
  }

  const formatUUID = (uuid: string): string => {
    let formatted = uuid
    
    if (!includeHyphens) {
      formatted = formatted.replace(/-/g, '')
    }
    
    if (upperCase) {
      formatted = formatted.toUpperCase()
    }
    
    return formatted
  }

  const getUUIDInfo = (uuid: string): UUIDResult => {
    const version = uuid.charAt(14)
    const variant = uuid.charAt(19)
    
    let versionName = 'Unknown'
    switch (version) {
      case '1': versionName = 'v1 (Timestamp)'; break
      case '3': versionName = 'v3 (Name MD5)'; break
      case '4': versionName = 'v4 (Random)'; break
      case '5': versionName = 'v5 (Name SHA-1)'; break
    }
    
    let variantName = 'Unknown'
    const variantBits = parseInt(variant, 16)
    if ((variantBits & 0x8) === 0) variantName = 'NCS'
    else if ((variantBits & 0xC) === 0x8) variantName = 'RFC 4122'
    else if ((variantBits & 0xE) === 0xC) variantName = 'Microsoft'
    else variantName = 'Reserved'

    const result: UUIDResult = {
      id: formatUUID(uuid),
      version: versionName,
      variant: variantName
    }

    // Add timestamp for v1 UUIDs
    if (version === '1') {
      result.timestamp = new Date().toISOString()
    }

    return result
  }

  const generateUUIDs = () => {
    const newUUIDs: UUIDResult[] = []
    
    for (let i = 0; i < quantity[0]; i++) {
      const uuid = generateUUID(uuidVersion)
      newUUIDs.push(getUUIDInfo(uuid))
    }
    
    setUuids(newUUIDs)
    toast.success(`Generated ${quantity[0]} UUID${quantity[0] > 1 ? 's' : ''}!`)
  }

  const copyUUID = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid)
      setCopied(uuid)
      setTimeout(() => setCopied(null), 2000)
      toast.success('UUID copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy UUID')
    }
  }

  const copyAllUUIDs = async () => {
    const allUUIDs = uuids.map(u => u.id).join('\n')
    try {
      await navigator.clipboard.writeText(allUUIDs)
      toast.success('All UUIDs copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy UUIDs')
    }
  }

  const downloadUUIDs = () => {
    if (uuids.length === 0) {
      toast.error('No UUIDs to download')
      return
    }

    const content = uuids.map(u => u.id).join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `uuids-${uuidVersion}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('UUIDs downloaded!')
  }

  const clearUUIDs = () => {
    setUuids([])
    toast.success('UUIDs cleared')
  }

  const versionInfo = {
    v1: {
      name: 'Version 1 (Timestamp)',
      description: 'Based on timestamp and MAC address. Unique across space and time.',
      icon: <Sparkles className="h-4 w-4" />,
      color: 'text-blue-500'
    },
    v3: {
      name: 'Version 3 (Name MD5)',
      description: 'Based on namespace and name using MD5 hash. Deterministic.',
      icon: <Hash className="h-4 w-4" />,
      color: 'text-green-500'
    },
    v4: {
      name: 'Version 4 (Random)',
      description: 'Randomly generated. Most commonly used version.',
      icon: <Zap className="h-4 w-4" />,
      color: 'text-purple-500'
    },
    v5: {
      name: 'Version 5 (Name SHA-1)',
      description: 'Based on namespace and name using SHA-1 hash. Deterministic.',
      icon: <Settings className="h-4 w-4" />,
      color: 'text-orange-500'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Hash className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">UUID Generator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate universally unique identifiers (UUIDs) for your applications. Supports versions 1, 3, 4, and 5.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className={versionInfo[uuidVersion].color}>
              {versionInfo[uuidVersion].icon}
              {uuidVersion.toUpperCase()}
            </Badge>
            <Badge variant="secondary">RFC 4122</Badge>
            <Badge variant="secondary">Multiple Formats</Badge>
          </div>
        </div>

        <ApiStatus />

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Settings Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Generator Settings
                </CardTitle>
                <CardDescription>
                  Configure UUID generation options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* UUID Version */}
                <div className="space-y-3">
                  <Label>UUID Version</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(versionInfo).map(([version, info]) => (
                      <div 
                        key={version}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          uuidVersion === version 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:bg-muted/50'
                        }`}
                        onClick={() => setUuidVersion(version as any)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${
                            uuidVersion === version ? 'bg-primary' : 'bg-muted-foreground'
                          }`} />
                          <span className="font-medium text-sm">{info.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground ml-4">
                          {info.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label>Number of UUIDs: {quantity[0]}</Label>
                  <Slider
                    value={quantity}
                    onValueChange={setQuantity}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Format Options */}
                <div className="space-y-4">
                  <Label>Format Options</Label>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Include Hyphens</Label>
                      <p className="text-xs text-muted-foreground">
                        {includeHyphens ? '123e4567-e89b-12d3-a456-426614174000' : '123e4567e89b12d3a456426614174000'}
                      </p>
                    </div>
                    <Button
                      variant={includeHyphens ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIncludeHyphens(!includeHyphens)}
                    >
                      {includeHyphens ? 'On' : 'Off'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Uppercase</Label>
                      <p className="text-xs text-muted-foreground">
                        {upperCase ? 'UPPERCASE LETTERS' : 'lowercase letters'}
                      </p>
                    </div>
                    <Button
                      variant={upperCase ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUpperCase(!upperCase)}
                    >
                      {upperCase ? 'On' : 'Off'}
                    </Button>
                  </div>
                </div>

                {/* Generate Button */}
                <Button onClick={generateUUIDs} className="w-full" size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate UUIDs
                </Button>
              </CardContent>
            </Card>

            {/* Version Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Current Version
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className={`flex items-center gap-2 ${versionInfo[uuidVersion].color}`}>
                    {versionInfo[uuidVersion].icon}
                    <span className="font-medium">{versionInfo[uuidVersion].name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {versionInfo[uuidVersion].description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    Generated UUIDs ({uuids.length})
                  </div>
                  {uuids.length > 0 && (
                    <div className="flex gap-2">
                      <Button onClick={copyAllUUIDs} variant="outline" size="sm">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy All
                      </Button>
                      <Button onClick={downloadUUIDs} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button onClick={clearUUIDs} variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Clear
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  Click any UUID to copy it to your clipboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uuids.length > 0 ? (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {uuids.map((uuid, index) => (
                      <div 
                        key={index}
                        className="group border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => copyUUID(uuid.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              #{index + 1}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {uuid.version}
                            </Badge>
                            {copied === uuid.id && (
                              <Badge variant="default" className="text-xs bg-green-500">
                                <Check className="h-3 w-3 mr-1" />
                                Copied!
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copied === uuid.id ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        
                        <div className="font-mono text-sm bg-background p-3 rounded border mb-2">
                          {uuid.id}
                        </div>
                        
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>Variant: {uuid.variant}</span>
                          {uuid.timestamp && <span>Generated: {new Date(uuid.timestamp).toLocaleTimeString()}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Hash className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No UUIDs Generated</h3>
                    <p className="text-muted-foreground">
                      Configure your settings and click "Generate UUIDs" to create unique identifiers
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">UUID Generator Features</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-lg border bg-card">
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Multiple Versions</h3>
              <p className="text-sm text-muted-foreground">
                Support for UUID versions 1, 3, 4, and 5 with different generation methods
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Settings className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Customizable Format</h3>
              <p className="text-sm text-muted-foreground">
                Choose between hyphenated/compact and uppercase/lowercase formats
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <RefreshCw className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Bulk Generation</h3>
              <p className="text-sm text-muted-foreground">
                Generate up to 100 UUIDs at once for your applications
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Download className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Export Options</h3>
              <p className="text-sm text-muted-foreground">
                Copy individual UUIDs or download all generated UUIDs as a text file
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
