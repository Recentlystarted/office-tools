'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { 
  Code,
  Copy,
  Check,
  RotateCcw,
  FileText,
  Minimize2,
  Maximize2,
  CheckCircle,
  XCircle,
  Info,
  AlertCircle,
  Download
} from 'lucide-react'
import { toast } from 'sonner'
import { getApiUrl, apiRequest, ApiError } from '@/lib/api'
import ApiStatus from '@/components/api-status'

interface JsonValidationResult {
  isValid: boolean
  error?: string
  lineNumber?: number
  size?: string
  objectCount?: number
  arrayCount?: number
  stringCount?: number
  numberCount?: number
  depth?: number
}

export default function JsonFormatterPage() {
  const [inputJson, setInputJson] = useState('')
  const [formattedJson, setFormattedJson] = useState('')
  const [minifiedJson, setMinifiedJson] = useState('')
  const [validation, setValidation] = useState<JsonValidationResult>({ isValid: false })
  const [indentSize, setIndentSize] = useState([2])
  const [copied, setCopied] = useState<string | null>(null)

  // Auto-correct common JSON issues
  const autoCorrectJson = (jsonString: string): { corrected: string; corrections: string[] } => {
    let corrected = jsonString.trim()
    const corrections: string[] = []

    // Fix common issues
    const fixes = [
      {
        pattern: /,(\s*[}\]])/g,
        replacement: '$1',
        description: 'Removed trailing commas'
      },
      {
        pattern: /([{,]\s*)(\w+)(\s*:)/g,
        replacement: '$1"$2"$3',
        description: 'Added quotes to property names'
      },
      {
        pattern: /:\s*'([^']*)'/g,
        replacement: ': "$1"',
        description: 'Changed single quotes to double quotes'
      },
      {
        pattern: /([^\\])\\([^"\\\/bfnrt])/g,
        replacement: '$1\\\\$2',
        description: 'Fixed escape sequences'
      }
    ]

    fixes.forEach(fix => {
      const before = corrected
      corrected = corrected.replace(fix.pattern, fix.replacement)
      if (before !== corrected) {
        corrections.push(fix.description)
      }
    })

    // Try to fix missing braces/brackets
    const openBrace = (corrected.match(/\{/g) || []).length
    const closeBrace = (corrected.match(/\}/g) || []).length
    const openBracket = (corrected.match(/\[/g) || []).length
    const closeBracket = (corrected.match(/\]/g) || []).length

    if (openBrace > closeBrace) {
      corrected += '}'.repeat(openBrace - closeBrace)
      corrections.push(`Added ${openBrace - closeBrace} missing closing brace(s)`)
    }
    if (openBracket > closeBracket) {
      corrected += ']'.repeat(openBracket - closeBracket)
      corrections.push(`Added ${openBracket - closeBracket} missing closing bracket(s)`)
    }

    return { corrected, corrections }
  }

  const analyzeJson = (jsonString: string): JsonValidationResult => {
    if (!jsonString.trim()) {
      return { isValid: false, error: 'Please enter JSON data' }
    }

    try {
      const parsed = JSON.parse(jsonString)
      
      // Calculate size
      const size = new Blob([jsonString]).size
      const sizeStr = size < 1024 ? `${size} B` : 
                     size < 1024 * 1024 ? `${Math.round(size / 1024)} KB` : 
                     `${Math.round(size / (1024 * 1024) * 10) / 10} MB`

      // Count elements
      let objectCount = 0
      let arrayCount = 0
      let stringCount = 0
      let numberCount = 0
      let maxDepth = 0

      const countElements = (obj: any, depth = 0): void => {
        maxDepth = Math.max(maxDepth, depth)
        
        if (Array.isArray(obj)) {
          arrayCount++
          obj.forEach(item => countElements(item, depth + 1))
        } else if (typeof obj === 'object' && obj !== null) {
          objectCount++
          Object.values(obj).forEach(value => countElements(value, depth + 1))
        } else if (typeof obj === 'string') {
          stringCount++
        } else if (typeof obj === 'number') {
          numberCount++
        }
      }

      countElements(parsed)

      return {
        isValid: true,
        size: sizeStr,
        objectCount,
        arrayCount,
        stringCount,
        numberCount,
        depth: maxDepth
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON'
      const lineMatch = errorMessage.match(/line (\d+)/) || errorMessage.match(/position (\d+)/)
      const lineNumber = lineMatch ? parseInt(lineMatch[1]) : undefined

      return {
        isValid: false,
        error: errorMessage,
        lineNumber
      }
    }
  }

  const formatJson = () => {
    if (!inputJson.trim()) {
      toast.error('Please enter JSON to format')
      return
    }

    try {
      const parsed = JSON.parse(inputJson)
      const formatted = JSON.stringify(parsed, null, indentSize[0])
      const minified = JSON.stringify(parsed)
      
      setFormattedJson(formatted)
      setMinifiedJson(minified)
      setValidation(analyzeJson(inputJson))
      toast.success('JSON formatted successfully!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON'
      setValidation({ isValid: false, error: errorMessage })
      setFormattedJson('')
      setMinifiedJson('')
      toast.error('Invalid JSON: ' + errorMessage)
    }
  }

  const validateJson = () => {
    if (!inputJson.trim()) {
      setValidation({ isValid: false, error: 'Please enter JSON data' })
      return
    }

    const result = analyzeJson(inputJson.trim())
    setValidation(result)
    
    if (result.isValid) {
      toast.success('JSON is valid!')
    } else {
      toast.error('JSON is invalid: ' + result.error)
    }
  }

  const autoCorrectAndFormat = () => {
    if (!inputJson.trim()) {
      toast.error('Please enter JSON to auto-correct')
      return
    }

    const { corrected, corrections } = autoCorrectJson(inputJson)
    
    try {
      const parsed = JSON.parse(corrected)
      const formatted = JSON.stringify(parsed, null, indentSize[0])
      const minified = JSON.stringify(parsed)
      
      setInputJson(corrected)
      setFormattedJson(formatted)
      setMinifiedJson(minified)
      setValidation(analyzeJson(corrected))
      
      if (corrections.length > 0) {
        toast.success(`Auto-corrected and formatted! Fixes: ${corrections.join(', ')}`)
      } else {
        toast.success('JSON formatted successfully!')
      }
    } catch (error) {
      // If auto-correction failed, show the corrections that were attempted
      if (corrections.length > 0) {
        setInputJson(corrected)
        toast.info(`Applied fixes: ${corrections.join(', ')}, but JSON still has errors`)
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON'
      setValidation({ isValid: false, error: errorMessage })
      toast.error('Unable to auto-correct: ' + errorMessage)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
      toast.success(`${type} copied to clipboard!`)
    } catch (error) {
      // Console output removed for production
      toast.error('Failed to copy to clipboard')
    }
  }

  const clearJson = () => {
    setInputJson('')
    setFormattedJson('')
    setMinifiedJson('')
    setValidation({ isValid: false })
    toast.success('JSON cleared')
  }

  const downloadJson = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`${filename} downloaded`)
  }

  const sampleJsons = [
    {
      name: 'Simple Object',
      json: `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "active": true
}`
    },
    {
      name: 'Array with Objects',
      json: `[
  {
    "id": 1,
    "name": "Product 1",
    "price": 99.99,
    "tags": ["electronics", "gadget"]
  },
  {
    "id": 2,
    "name": "Product 2",
    "price": 149.99,
    "tags": ["software", "app"]
  }
]`
    },
    {
      name: 'Nested Structure',
      json: `{
  "company": {
    "name": "Tech Corp",
    "address": {
      "street": "123 Main St",
      "city": "San Francisco",
      "country": "USA"
    },
    "employees": [
      {
        "name": "Alice",
        "department": "Engineering",
        "skills": ["JavaScript", "Python", "React"]
      },
      {
        "name": "Bob",
        "department": "Design",
        "skills": ["Figma", "Photoshop", "UI/UX"]
      }
    ]
  }
}`
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 sm:p-3 rounded-xl bg-primary/10 text-primary">
              <Code className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">JSON Formatter</h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Format, validate, and auto-fix JSON data with advanced error correction
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <Badge variant="secondary">Auto-Fix</Badge>
            <Badge variant="secondary">Validate</Badge>
            <Badge variant="secondary">Format</Badge>
            <Badge variant="secondary">Minify</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  JSON Input
                </CardTitle>
                <CardDescription>
                  Paste your JSON data here to format and validate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="input-json">JSON Data</Label>
                  <Textarea
                    id="input-json"
                    placeholder='{"key": "value", "array": [1, 2, 3]}'
                    value={inputJson}
                    onChange={(e) => setInputJson(e.target.value)}
                    className="min-h-[300px] mt-2 font-mono text-sm"
                  />
                </div>

                {/* Validation Status */}
                {inputJson && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    validation.isValid 
                      ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200'
                      : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200'
                  }`}>
                    {validation.isValid ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Valid JSON</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Invalid JSON: {validation.error}
                        </span>
                      </>
                    )}
                  </div>
                )}

                {/* Sample JSON Buttons */}
                <div className="space-y-2">
                  <Label>Try Sample JSON:</Label>
                  <div className="flex flex-wrap gap-2">
                    {sampleJsons.map((sample) => (
                      <Button
                        key={sample.name}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputJson(sample.json)}
                      >
                        {sample.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Indent Settings */}
                <div className="space-y-2">
                  <Label>Indent Size: {indentSize[0]} spaces</Label>
                  <Slider
                    value={indentSize}
                    onValueChange={setIndentSize}
                    max={8}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button onClick={autoCorrectAndFormat} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Code className="mr-2 h-4 w-4" />
                    Auto-Fix & Format
                  </Button>
                  <Button onClick={formatJson} variant="outline" disabled={!inputJson.trim()}>
                    <Maximize2 className="mr-2 h-4 w-4" />
                    Format Only
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button onClick={validateJson} variant="outline" disabled={!inputJson.trim()}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Validate
                  </Button>
                  <Button onClick={clearJson} variant="outline" disabled={!inputJson}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {/* JSON Analysis */}
            {validation.isValid && validation.size && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    JSON Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size:</span>
                        <span className="font-medium">{validation.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Objects:</span>
                        <span className="font-medium">{validation.objectCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Arrays:</span>
                        <span className="font-medium">{validation.arrayCount}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Strings:</span>
                        <span className="font-medium">{validation.stringCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Numbers:</span>
                        <span className="font-medium">{validation.numberCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Depth:</span>
                        <span className="font-medium">{validation.depth}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Formatted Output */}
            <Tabs defaultValue="formatted" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="formatted">
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Formatted
                </TabsTrigger>
                <TabsTrigger value="minified">
                  <Minimize2 className="h-4 w-4 mr-2" />
                  Minified
                </TabsTrigger>
              </TabsList>

              <TabsContent value="formatted" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Formatted JSON</CardTitle>
                    <CardDescription>
                      Beautified JSON with proper indentation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {formattedJson ? (
                      <div className="space-y-4">
                        <Textarea
                          value={formattedJson}
                          readOnly
                          className="min-h-[300px] font-mono text-sm"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => copyToClipboard(formattedJson, 'Formatted JSON')}
                            variant="outline"
                            className="flex-1"
                          >
                            {copied === 'Formatted JSON' ? (
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
                          <Button
                            onClick={() => downloadJson(formattedJson, 'formatted.json')}
                            variant="outline"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Code className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Formatted JSON</h3>
                        <p className="text-muted-foreground">
                          Enter valid JSON and click "Format" to see the beautified output
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="minified" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Minified JSON</CardTitle>
                    <CardDescription>
                      Compressed JSON with no whitespace
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {minifiedJson ? (
                      <div className="space-y-4">
                        <Textarea
                          value={minifiedJson}
                          readOnly
                          className="min-h-[300px] font-mono text-sm"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => copyToClipboard(minifiedJson, 'Minified JSON')}
                            variant="outline"
                            className="flex-1"
                          >
                            {copied === 'Minified JSON' ? (
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
                          <Button
                            onClick={() => downloadJson(minifiedJson, 'minified.json')}
                            variant="outline"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Minimize2 className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Minified JSON</h3>
                        <p className="text-muted-foreground">
                          Enter valid JSON and click "Format" to see the minified output
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">JSON Formatter Features</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-lg border bg-card">
              <CheckCircle className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Validation</h3>
              <p className="text-sm text-muted-foreground">
                Validate JSON syntax and show detailed error messages
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Maximize2 className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Formatting</h3>
              <p className="text-sm text-muted-foreground">
                Beautify JSON with customizable indentation
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Minimize2 className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Minification</h3>
              <p className="text-sm text-muted-foreground">
                Compress JSON by removing unnecessary whitespace
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Info className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Get detailed statistics about your JSON structure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
