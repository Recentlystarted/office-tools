'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Globe,
  Copy,
  Check,
  RotateCcw,
  ArrowUpDown,
  Link,
  Unlock,
  Lock,
  ExternalLink,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface URLParts {
  protocol?: string
  hostname?: string
  port?: string
  pathname?: string
  search?: string
  hash?: string
  full?: string
}

export default function URLEncoderDecoderPage() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [encodeType, setEncodeType] = useState<'component' | 'full'>('component')
  const [copied, setCopied] = useState(false)
  const [urlParts, setUrlParts] = useState<URLParts>({})

  const parseURL = (url: string): URLParts => {
    try {
      const parsed = new URL(url)
      return {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port,
        pathname: parsed.pathname,
        search: parsed.search,
        hash: parsed.hash,
        full: url
      }
    } catch {
      return {}
    }
  }

  const isValidURL = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const encodeURL = (text: string, type: 'component' | 'full'): string => {
    try {
      if (type === 'component') {
        return encodeURIComponent(text)
      } else {
        return encodeURI(text)
      }
    } catch (error) {
      throw new Error('Failed to encode URL')
    }
  }

  const decodeURL = (text: string): string => {
    try {
      return decodeURIComponent(text)
    } catch (error) {
      throw new Error('Failed to decode URL')
    }
  }

  const processText = () => {
    if (!inputText.trim()) {
      toast.error('Please enter text to process')
      return
    }

    try {
      if (mode === 'encode') {
        const encoded = encodeURL(inputText, encodeType)
        setOutputText(encoded)
        
        // If input looks like a URL, parse it
        if (isValidURL(inputText)) {
          setUrlParts(parseURL(inputText))
        } else {
          setUrlParts({})
        }
        
        toast.success('Text encoded successfully!')
      } else {
        const decoded = decodeURL(inputText.trim())
        setOutputText(decoded)
        
        // If decoded result looks like a URL, parse it
        if (isValidURL(decoded)) {
          setUrlParts(parseURL(decoded))
        } else {
          setUrlParts({})
        }
        
        toast.success('URL decoded successfully!')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Processing failed'
      toast.error(errorMessage)
      setOutputText('')
      setUrlParts({})
    }
  }

  const switchMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode'
    setMode(newMode)
    
    // Swap input and output if there's content
    if (outputText) {
      setInputText(outputText)
      setOutputText('')
      setUrlParts({})
    }
    
    toast.success(`Switched to ${newMode} mode`)
  }

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(outputText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Result copied to clipboard!')
    } catch (error) {
      // Console output removed for production
      toast.error('Failed to copy result')
    }
  }

  const clearAll = () => {
    setInputText('')
    setOutputText('')
    setUrlParts({})
    toast.success('All text cleared')
  }

  const openURL = () => {
    if (outputText && isValidURL(outputText)) {
      window.open(outputText, '_blank')
    } else if (inputText && isValidURL(inputText)) {
      window.open(inputText, '_blank')
    }
  }

  const sampleTexts = {
    encode: [
      { 
        name: 'Simple URL', 
        text: 'https://example.com/search?q=hello world&category=web tools' 
      },
      { 
        name: 'Special Characters', 
        text: 'This string has special characters: @#$%^&*()+={}[]|\\:";\'<>?,./' 
      },
      { 
        name: 'Non-English Text', 
        text: 'こんにちは世界 мир español français' 
      },
      { 
        name: 'Query Parameters', 
        text: 'name=John Doe&email=john@example.com&message=Hello, how are you?' 
      }
    ],
    decode: [
      { 
        name: 'Encoded URL', 
        text: 'https%3A//example.com/search%3Fq%3Dhello%20world%26category%3Dweb%20tools' 
      },
      { 
        name: 'Special Characters', 
        text: 'This%20string%20has%20special%20characters%3A%20%40%23%24%25%5E%26*()%2B%3D%7B%7D%5B%5D%7C%5C%3A%22%3B%27%3C%3E%3F%2C./' 
      },
      { 
        name: 'Non-English', 
        text: '%E3%81%93%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF%E4%B8%96%E7%95%8C%20%D0%BC%D0%B8%D1%80%20espa%C3%B1ol%20fran%C3%A7ais' 
      },
      { 
        name: 'Query String', 
        text: 'name%3DJohn%20Doe%26email%3Djohn%40example.com%26message%3DHello%2C%20how%20are%20you%3F' 
      }
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 sm:p-3 rounded-xl bg-primary/10 text-primary">
              <Globe className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">URL Encoder/Decoder</h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Encode and decode URLs and query parameters for web development with advanced parsing
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <Badge variant="secondary" className="text-xs sm:text-sm">
              {mode === 'encode' ? <Lock className="h-3 w-3 mr-1" /> : <Unlock className="h-3 w-3 mr-1" />}
              {mode === 'encode' ? 'Encoding' : 'Decoding'}
            </Badge>
            <Badge variant="secondary" className="text-xs sm:text-sm">URL Parser</Badge>
            <Badge variant="secondary" className="text-xs sm:text-sm">Component Mode</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {mode === 'encode' ? <Link className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                  {mode === 'encode' ? 'Text/URL to Encode' : 'Encoded URL to Decode'}
                </CardTitle>
                <CardDescription>
                  {mode === 'encode' 
                    ? 'Enter text or URL to encode for safe transmission'
                    : 'Enter URL-encoded text to decode back to readable format'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="input-text">
                    {mode === 'encode' ? 'Text/URL to Encode' : 'Encoded Text'}
                  </Label>
                  <Textarea
                    id="input-text"
                    placeholder={mode === 'encode' 
                      ? 'Enter URL or text with special characters...' 
                      : 'Enter URL-encoded text here...'
                    }
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[150px] mt-2 font-mono text-sm"
                  />
                </div>

                {/* Encoding Type Selection (only for encode mode) */}
                {mode === 'encode' && (
                  <div className="space-y-3">
                    <Label>Encoding Type</Label>
                    <div className="grid grid-cols-1 gap-3">
                      <div 
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          encodeType === 'component' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:bg-muted/50'
                        }`}
                        onClick={() => setEncodeType('component')}
                      >
                        <div className="flex items-start gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                            encodeType === 'component' ? 'bg-primary' : 'bg-muted-foreground'
                          }`} />
                          <span className="font-medium text-sm">Component Encoding</span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground ml-4 pr-2">
                          Encode special characters for query parameters and form data
                        </p>
                      </div>
                      
                      <div 
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          encodeType === 'full' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:bg-muted/50'
                        }`}
                        onClick={() => setEncodeType('full')}
                      >
                        <div className="flex items-start gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                            encodeType === 'full' ? 'bg-primary' : 'bg-muted-foreground'
                          }`} />
                          <span className="font-medium text-sm">Full URI Encoding</span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground ml-4 pr-2">
                          Encode complete URLs while preserving URL structure
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* URL Validation */}
                {inputText && (mode === 'encode' ? isValidURL(inputText) : isValidURL(outputText)) && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg dark:bg-green-950 dark:border-green-800 dark:text-green-200">
                    <ExternalLink className="h-4 w-4" />
                    <span className="text-sm">Valid URL detected</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={openURL}
                      className="ml-auto h-auto p-1 text-green-800 hover:text-green-900 dark:text-green-200"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {/* Sample Texts */}
                <div className="space-y-2">
                  <Label>Try Sample:</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {sampleTexts[mode].map((sample) => (
                      <Button
                        key={sample.name}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputText(sample.text)}
                        className="justify-start text-left h-auto p-3 overflow-hidden"
                      >
                        <div className="w-full overflow-hidden">
                          <div className="font-medium text-sm">{sample.name}</div>
                          <div className="text-xs text-muted-foreground font-mono break-all line-clamp-2 overflow-hidden text-ellipsis">
                            {sample.text.length > 50 ? sample.text.substring(0, 50) + '...' : sample.text}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button onClick={processText} disabled={!inputText.trim()} className="w-full">
                    {mode === 'encode' ? (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Encode
                      </>
                    ) : (
                      <>
                        <Unlock className="mr-2 h-4 w-4" />
                        Decode
                      </>
                    )}
                  </Button>
                  <Button onClick={switchMode} variant="outline" className="w-full">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Switch Mode
                  </Button>
                </div>

                <Button onClick={clearAll} variant="outline" className="w-full" disabled={!inputText && !outputText}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {mode === 'encode' ? <Globe className="h-5 w-5" /> : <Link className="h-5 w-5" />}
                  {mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
                </CardTitle>
                <CardDescription>
                  {mode === 'encode' 
                    ? 'Your text encoded for safe URL transmission'
                    : 'Your URL-encoded text decoded to readable format'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {outputText ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="output-text">Result</Label>
                      <Textarea
                        id="output-text"
                        value={outputText}
                        readOnly
                        className="min-h-[150px] mt-2 font-mono text-sm bg-muted/50"
                      />
                    </div>

                    {/* Result Info */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg text-sm">
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Input Length:</div>
                        <div className="font-medium">{inputText.length} chars</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Output Length:</div>
                        <div className="font-medium">{outputText.length} chars</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Size Change:</div>
                        <div className="font-medium">
                          {mode === 'encode' 
                            ? `+${Math.round(((outputText.length - inputText.length) / inputText.length) * 100)}%`
                            : `${Math.round(((outputText.length - inputText.length) / inputText.length) * 100)}%`
                          }
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Type:</div>
                        <div className="font-medium">{mode === 'encode' ? encodeType : 'Decoded'}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button onClick={copyResult} variant="outline" className="flex-1">
                        {copied ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Result
                          </>
                        )}
                      </Button>
                      {(isValidURL(outputText) || isValidURL(inputText)) && (
                        <Button onClick={openURL} variant="outline">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    {mode === 'encode' ? (
                      <Lock className="h-16 w-16 text-muted-foreground mb-4" />
                    ) : (
                      <Unlock className="h-16 w-16 text-muted-foreground mb-4" />
                    )}
                    <h3 className="text-lg font-semibold mb-2">No Result Yet</h3>
                    <p className="text-muted-foreground">
                      Enter text and click "{mode === 'encode' ? 'Encode' : 'Decode'}" to see the result
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* URL Parser */}
            {Object.keys(urlParts).length > 0 && urlParts.full && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">URL Components</CardTitle>
                  <CardDescription>
                    Parsed components of the detected URL
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {urlParts.protocol && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Protocol:</span>
                      <span className="col-span-2 font-mono">{urlParts.protocol}</span>
                    </div>
                  )}
                  {urlParts.hostname && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Hostname:</span>
                      <span className="col-span-2 font-mono">{urlParts.hostname}</span>
                    </div>
                  )}
                  {urlParts.port && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Port:</span>
                      <span className="col-span-2 font-mono">{urlParts.port}</span>
                    </div>
                  )}
                  {urlParts.pathname && urlParts.pathname !== '/' && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Path:</span>
                      <span className="col-span-2 font-mono break-all">{urlParts.pathname}</span>
                    </div>
                  )}
                  {urlParts.search && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Query:</span>
                      <span className="col-span-2 font-mono break-all">{urlParts.search}</span>
                    </div>
                  )}
                  {urlParts.hash && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Hash:</span>
                      <span className="col-span-2 font-mono break-all">{urlParts.hash}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">URL Encoder Features</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-lg border bg-card">
              <Lock className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">URL Encoding</h3>
              <p className="text-sm text-muted-foreground">
                Encode special characters for safe URL transmission
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Unlock className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">URL Decoding</h3>
              <p className="text-sm text-muted-foreground">
                Decode percent-encoded URLs back to readable text
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Globe className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">URL Parser</h3>
              <p className="text-sm text-muted-foreground">
                Parse URLs into protocol, host, path, and query components
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <ArrowUpDown className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Dual Mode</h3>
              <p className="text-sm text-muted-foreground">
                Switch between component and full URI encoding modes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
