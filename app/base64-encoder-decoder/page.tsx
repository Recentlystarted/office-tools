'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  FileCode,
  Copy,
  Check,
  RotateCcw,
  Upload,
  Download,
  ArrowUpDown,
  Lock,
  Unlock,
  FileText,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { getApiUrl, apiRequest, ApiError } from '@/lib/api'
import ApiStatus from '@/components/api-status'

export default function Base64EncoderDecoderPage() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [urlSafe, setUrlSafe] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isValidBase64, setIsValidBase64] = useState(true)

  const isBase64 = (str: string): boolean => {
    try {
      // Basic Base64 pattern check
      const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/
      const urlSafePattern = /^[A-Za-z0-9_-]*={0,2}$/
      
      if (!str) return false
      
      // Check if length is multiple of 4 (for standard base64)
      if (str.length % 4 !== 0 && !urlSafe) return false
      
      const pattern = urlSafe ? urlSafePattern : base64Pattern
      return pattern.test(str)
    } catch {
      return false
    }
  }

  const encodeBase64 = (text: string): string => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(text)))
      if (urlSafe) {
        return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
      }
      return encoded
    } catch (error) {
      throw new Error('Failed to encode text to Base64')
    }
  }

  const decodeBase64 = (base64: string): string => {
    try {
      let processedBase64 = base64
      
      if (urlSafe) {
        // Convert URL-safe Base64 to standard Base64
        processedBase64 = base64.replace(/-/g, '+').replace(/_/g, '/')
        
        // Add padding if needed
        while (processedBase64.length % 4) {
          processedBase64 += '='
        }
      }
      
      return decodeURIComponent(escape(atob(processedBase64)))
    } catch (error) {
      throw new Error('Failed to decode Base64 text')
    }
  }

  const processText = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter text to process')
      return
    }

    try {
      // Try API first
      const response = await apiRequest(getApiUrl('base64Encoder'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: inputText.trim(), 
          operation: mode,
          urlSafe: urlSafe
        })
      })

      if (response.ok) {
        const result = await response.json()
        setOutputText(result.result)
        setIsValidBase64(true)
        toast.success(`Text ${mode}d successfully via API!`)
        return
      }
    } catch (error) {
      // API failed, use local processing
    }

    // Local fallback processing
    try {
      if (mode === 'encode') {
        const encoded = encodeBase64(inputText)
        setOutputText(encoded)
        setIsValidBase64(true)
        toast.success('Text encoded to Base64!')
      } else {
        if (!isBase64(inputText.trim())) {
          setIsValidBase64(false)
          toast.error('Invalid Base64 input')
          return
        }
        
        const decoded = decodeBase64(inputText.trim())
        setOutputText(decoded)
        setIsValidBase64(true)
        toast.success('Base64 decoded successfully!')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Processing failed'
      toast.error(errorMessage)
      setOutputText('')
      setIsValidBase64(false)
    }
  }

  const switchMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode'
    setMode(newMode)
    
    // Swap input and output if there's content
    if (outputText) {
      setInputText(outputText)
      setOutputText('')
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
    setIsValidBase64(true)
    toast.success('All text cleared')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 1024 * 1024) { // 1MB limit
      toast.error('File size should be less than 1MB')
      return
    }

    const reader = new FileReader()
    
    if (mode === 'encode') {
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInputText(content)
        toast.success('File content loaded')
      }
      reader.readAsText(file)
    } else {
      reader.onload = (e) => {
        const result = e.target?.result as ArrayBuffer
        const base64 = btoa(String.fromCharCode(...new Uint8Array(result)))
        setInputText(base64)
        toast.success('File loaded as Base64')
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const downloadResult = () => {
    if (!outputText) {
      toast.error('No result to download')
      return
    }

    const blob = new Blob([outputText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('File downloaded')
  }

  const sampleTexts = {
    encode: [
      { name: 'Simple Text', text: 'Hello, World!' },
      { name: 'JSON Data', text: '{"name": "John", "age": 30, "city": "New York"}' },
      { name: 'Special Characters', text: 'Special chars: áéíóú ñç @#$%^&*()' },
      { name: 'Multiline', text: 'Line 1\nLine 2\nLine 3\n\nEnd of text' }
    ],
    decode: [
      { name: 'Simple Text', text: 'SGVsbG8sIFdvcmxkIQ==' },
      { name: 'JSON Data', text: 'eyJuYW1lIjogIkpvaG4iLCAiYWdlIjogMzAsICJjaXR5IjogIk5ldyBZb3JrIn0=' },
      { name: 'URL Safe', text: 'SGVsbG8sIFdvcmxkIQ' },
      { name: 'Long Text', text: 'VGhpcyBpcyBhIGxvbmdlciB0ZXh0IHRoYXQgd2lsbCBkZW1vbnN0cmF0ZSBob3cgQmFzZTY0IGVuY29kaW5nIHdvcmtzIHdpdGggbGFyZ2VyIGNvbnRlbnQu' }
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <FileCode className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Base64 Encoder/Decoder</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encode text to Base64 or decode Base64 strings back to readable text. Supports both standard and URL-safe formats.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary">
              {mode === 'encode' ? <Lock className="h-3 w-3 mr-1" /> : <Unlock className="h-3 w-3 mr-1" />}
              {mode === 'encode' ? 'Encoding' : 'Decoding'}
            </Badge>
            <Badge variant="secondary">File Support</Badge>
            <Badge variant="secondary">API Enhanced</Badge>
          </div>
          <div className="mt-6">
            <ApiStatus />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {mode === 'encode' ? <FileText className="h-5 w-5" /> : <FileCode className="h-5 w-5" />}
                  {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
                </CardTitle>
                <CardDescription>
                  {mode === 'encode' 
                    ? 'Enter plain text to convert to Base64 format'
                    : 'Enter Base64 encoded text to decode back to readable format'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="input-text">
                    {mode === 'encode' ? 'Plain Text' : 'Base64 Text'}
                  </Label>
                  <Textarea
                    id="input-text"
                    placeholder={mode === 'encode' 
                      ? 'Enter your text here...' 
                      : 'Enter Base64 encoded text here...'
                    }
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[200px] mt-2 font-mono text-sm"
                  />
                </div>

                {/* Validation for decode mode */}
                {mode === 'decode' && inputText && !isValidBase64 && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg dark:bg-red-950 dark:border-red-800 dark:text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Invalid Base64 format</span>
                  </div>
                )}

                {/* URL Safe Option */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="space-y-0.5">
                    <Label>URL Safe Base64</Label>
                    <p className="text-sm text-muted-foreground">
                      Use URL and filename safe alphabet (- and _ instead of + and /)
                    </p>
                  </div>
                  <Switch
                    checked={urlSafe}
                    onCheckedChange={setUrlSafe}
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Upload File</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept={mode === 'encode' ? '.txt,.json,.xml,.csv' : '*/*'}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer" asChild>
                        <span>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload File
                        </span>
                      </Button>
                    </label>
                    <span className="text-sm text-muted-foreground">Max 1MB</span>
                  </div>
                </div>

                {/* Sample Texts */}
                <div className="space-y-2">
                  <Label>Try Sample:</Label>
                  <div className="flex flex-wrap gap-2">
                    {sampleTexts[mode].map((sample) => (
                      <Button
                        key={sample.name}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputText(sample.text)}
                      >
                        {sample.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={processText} disabled={!inputText.trim()}>
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
                  <Button onClick={switchMode} variant="outline">
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
                  {mode === 'encode' ? <FileCode className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                  {mode === 'encode' ? 'Base64 Result' : 'Decoded Result'}
                </CardTitle>
                <CardDescription>
                  {mode === 'encode' 
                    ? 'Your text encoded in Base64 format'
                    : 'Your Base64 text decoded to readable format'
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
                        className="min-h-[200px] mt-2 font-mono text-sm bg-muted/50"
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
                        <div className="text-muted-foreground">Format:</div>
                        <div className="font-medium">{urlSafe ? 'URL Safe' : 'Standard'}</div>
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
                      <Button onClick={downloadResult} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
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
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Base64 Features</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-lg border bg-card">
              <Lock className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Encoding</h3>
              <p className="text-sm text-muted-foreground">
                Convert plain text to Base64 encoded format
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Unlock className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Decoding</h3>
              <p className="text-sm text-muted-foreground">
                Convert Base64 back to readable text
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <ArrowUpDown className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">URL Safe</h3>
              <p className="text-sm text-muted-foreground">
                Support for URL and filename safe Base64 format
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Upload className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">File Support</h3>
              <p className="text-sm text-muted-foreground">
                Upload files to encode or decode content
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
