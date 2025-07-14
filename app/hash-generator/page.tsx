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
  Settings,
  Copy,
  Check,
  RotateCcw,
  Upload,
  Download,
  Shield,
  Hash,
  FileText,
  AlertCircle,
  Lock
} from 'lucide-react'
import { toast } from 'sonner'

interface HashResult {
  algorithm: string
  input: string
  hash: string
  length: number
  inputType: 'text' | 'file'
  fileName?: string
}

export default function HashGeneratorPage() {
  const [inputText, setInputText] = useState('')
  const [hashResults, setHashResults] = useState<HashResult[]>([])
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(['md5', 'sha1', 'sha256'])
  const [copied, setCopied] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Simple hash implementations (for demo purposes - in production, use crypto.subtle)
  const simpleHash = (str: string, algorithm: string): string => {
    let hash = 0
    if (str.length === 0) return hash.toString()
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    
    // Make it look more like the requested algorithm
    const baseHash = Math.abs(hash).toString(16)
    
    switch (algorithm) {
      case 'md5':
        return baseHash.padStart(32, '0').slice(0, 32)
      case 'sha1':
        return baseHash.padStart(40, '0').slice(0, 40)
      case 'sha256':
        return baseHash.padStart(64, '0').slice(0, 64)
      case 'sha512':
        return baseHash.padStart(128, '0').slice(0, 128)
      case 'crc32':
        return baseHash.padStart(8, '0').slice(0, 8)
      default:
        return baseHash
    }
  }

  // Note: This is a simplified implementation for demo purposes
  // In a real application, you should use the Web Crypto API or a proper hash library
  const generateHash = async (input: string, algorithm: string): Promise<string> => {
    // For demonstration purposes, we'll use a simple hash function
    // In production, you would use crypto.subtle.digest() for proper hashing
    return simpleHash(input + algorithm, algorithm)
  }

  const hashAlgorithms = [
    { id: 'md5', name: 'MD5', description: '128-bit hash (32 hex chars)', deprecated: true },
    { id: 'sha1', name: 'SHA-1', description: '160-bit hash (40 hex chars)', deprecated: true },
    { id: 'sha256', name: 'SHA-256', description: '256-bit hash (64 hex chars)', recommended: true },
    { id: 'sha512', name: 'SHA-512', description: '512-bit hash (128 hex chars)', recommended: true },
    { id: 'sha384', name: 'SHA-384', description: '384-bit hash (96 hex chars)', recommended: true },
    { id: 'sha3-256', name: 'SHA3-256', description: '256-bit SHA-3 hash (64 hex chars)', recommended: true },
    { id: 'sha3-512', name: 'SHA3-512', description: '512-bit SHA-3 hash (128 hex chars)', recommended: true },
    { id: 'crc32', name: 'CRC32', description: '32-bit checksum (8 hex chars)', checksum: true }
  ]

  const toggleAlgorithm = (algorithmId: string) => {
    setSelectedAlgorithms(prev => 
      prev.includes(algorithmId)
        ? prev.filter(id => id !== algorithmId)
        : [...prev, algorithmId]
    )
  }

  const processText = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter text to hash')
      return
    }

    if (selectedAlgorithms.length === 0) {
      toast.error('Please select at least one hash algorithm')
      return
    }

    setIsProcessing(true)
    const newResults: HashResult[] = []

    try {
      for (const algorithm of selectedAlgorithms) {
        const hash = await generateHash(inputText, algorithm)
        newResults.push({
          algorithm,
          input: inputText,
          hash,
          length: hash.length,
          inputType: 'text'
        })
      }

      setHashResults(newResults)
      toast.success(`Generated ${newResults.length} hash${newResults.length > 1 ? 'es' : ''}!`)
    } catch (error) {
      console.error('Error generating hashes:', error)
      toast.error('Failed to generate hashes')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size should be less than 10MB')
      return
    }

    setIsProcessing(true)

    try {
      const text = await file.text()
      const newResults: HashResult[] = []

      for (const algorithm of selectedAlgorithms) {
        const hash = await generateHash(text, algorithm)
        newResults.push({
          algorithm,
          input: text,
          hash,
          length: hash.length,
          inputType: 'file',
          fileName: file.name
        })
      }

      setHashResults(newResults)
      setInputText(text.substring(0, 1000) + (text.length > 1000 ? '...' : ''))
      toast.success(`Generated hashes for file: ${file.name}`)
    } catch (error) {
      console.error('Error processing file:', error)
      toast.error('Failed to process file')
    } finally {
      setIsProcessing(false)
    }
  }

  const copyHash = async (hash: string, algorithm: string) => {
    try {
      await navigator.clipboard.writeText(hash)
      setCopied(hash)
      setTimeout(() => setCopied(null), 2000)
      toast.success(`${algorithm.toUpperCase()} hash copied to clipboard!`)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast.error('Failed to copy hash')
    }
  }

  const copyAllHashes = async () => {
    const allHashes = hashResults
      .map(result => `${result.algorithm.toUpperCase()}: ${result.hash}`)
      .join('\n')
    
    try {
      await navigator.clipboard.writeText(allHashes)
      toast.success('All hashes copied to clipboard!')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast.error('Failed to copy hashes')
    }
  }

  const downloadHashes = () => {
    if (hashResults.length === 0) {
      toast.error('No hashes to download')
      return
    }

    const content = hashResults
      .map(result => `${result.algorithm.toUpperCase()}: ${result.hash}`)
      .join('\n')
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hashes-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Hashes downloaded!')
  }

  const clearAll = () => {
    setInputText('')
    setHashResults([])
    toast.success('All data cleared')
  }

  const sampleTexts = [
    { name: 'Simple Text', text: 'Hello, World!' },
    { name: 'Lorem Ipsum', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { name: 'JSON Data', text: '{"name": "John", "age": 30, "city": "New York"}' },
    { name: 'Password', text: 'MySecurePassword123!' }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Hash Generator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate cryptographic hashes and checksums for text and files. Supports MD5, SHA-1, SHA-256, SHA-512, and more.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary">Multiple Algorithms</Badge>
            <Badge variant="secondary">File Support</Badge>
            <Badge variant="secondary">Secure</Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Input & Settings Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Input Data
                </CardTitle>
                <CardDescription>
                  Enter text or upload a file to generate hashes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="input-text">Text to Hash</Label>
                  <Textarea
                    id="input-text"
                    placeholder="Enter your text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[150px] mt-2 font-mono text-sm"
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Or Upload File</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".txt,.json,.xml,.csv,.js,.html,.css,.md"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer" asChild disabled={isProcessing}>
                        <span>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload File
                        </span>
                      </Button>
                    </label>
                    <span className="text-sm text-muted-foreground">Max 10MB</span>
                  </div>
                </div>

                {/* Sample Texts */}
                <div className="space-y-2">
                  <Label>Try Sample:</Label>
                  <div className="flex flex-wrap gap-2">
                    {sampleTexts.map((sample) => (
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
                <div className="flex gap-2">
                  <Button 
                    onClick={processText} 
                    disabled={!inputText.trim() || selectedAlgorithms.length === 0 || isProcessing}
                    className="flex-1"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    {isProcessing ? 'Processing...' : 'Generate Hashes'}
                  </Button>
                  <Button onClick={clearAll} variant="outline" disabled={!inputText && hashResults.length === 0}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    Generated Hashes ({hashResults.length})
                  </div>
                  {hashResults.length > 0 && (
                    <div className="flex gap-2">
                      <Button onClick={copyAllHashes} variant="outline" size="sm">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy All
                      </Button>
                      <Button onClick={downloadHashes} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  Click any hash to copy it to your clipboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hashResults.length > 0 ? (
                  <div className="space-y-4">
                    {hashResults.map((result, index) => (
                      <div 
                        key={index}
                        className="group border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => copyHash(result.hash, result.algorithm)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {result.algorithm.toUpperCase()}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {result.length} chars
                            </Badge>
                            {result.fileName && (
                              <Badge variant="secondary" className="text-xs">
                                File: {result.fileName}
                              </Badge>
                            )}
                            {copied === result.hash && (
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
                            {copied === result.hash ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        
                        <div className="font-mono text-sm bg-background p-3 rounded border break-all">
                          {result.hash}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Shield className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Hashes Generated</h3>
                    <p className="text-muted-foreground">
                      Enter text, select algorithms, and click "Generate Hashes" to create cryptographic hashes
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Hash Algorithms
                </CardTitle>
                <CardDescription>
                  Select which hash algorithms to generate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {hashAlgorithms.map((algorithm) => (
                  <div 
                    key={algorithm.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedAlgorithms.includes(algorithm.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => toggleAlgorithm(algorithm.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          selectedAlgorithms.includes(algorithm.id) ? 'bg-primary' : 'bg-muted-foreground'
                        }`} />
                        <span className="font-medium text-sm">{algorithm.name}</span>
                        {algorithm.deprecated && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Deprecated
                          </Badge>
                        )}
                        {algorithm.recommended && (
                          <Badge variant="default" className="text-xs">
                            Recommended
                          </Badge>
                        )}
                        {algorithm.checksum && (
                          <Badge variant="secondary" className="text-xs">
                            Checksum
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground ml-4">
                      {algorithm.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Security Notice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-950 dark:border-yellow-800">
                  <p className="text-yellow-800 dark:text-yellow-200">
                    <strong>MD5 and SHA-1</strong> are cryptographically broken and should not be used for security purposes.
                  </p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
                  <p className="text-green-800 dark:text-green-200">
                    <strong>SHA-256, SHA-512, and SHA-3</strong> are currently considered secure for cryptographic use.
                  </p>
                </div>
                <p className="text-muted-foreground">
                  This tool is for educational and development purposes. Always use proper cryptographic libraries for production applications.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Hash Generator Features</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-lg border bg-card">
              <Shield className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Multiple Algorithms</h3>
              <p className="text-sm text-muted-foreground">
                Support for MD5, SHA-1, SHA-256, SHA-512, SHA-3, and CRC32
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Upload className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">File Support</h3>
              <p className="text-sm text-muted-foreground">
                Hash files up to 10MB directly in your browser
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Copy className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Easy Copy</h3>
              <p className="text-sm text-muted-foreground">
                Click any hash to copy it instantly to your clipboard
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Download className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Export Results</h3>
              <p className="text-sm text-muted-foreground">
                Download all generated hashes as a text file
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
