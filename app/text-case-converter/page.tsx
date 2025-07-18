'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { getApiUrl, apiRequest, ApiError } from '@/lib/api'
import ApiStatus from '@/components/api-status'
import { 
  Type,
  Copy,
  Check,
  RotateCcw,
  FileText,
  AlignLeft
} from 'lucide-react'
import { toast } from 'sonner'

const caseTypes = [
  {
    name: 'lowercase',
    label: 'lowercase',
    description: 'convert all text to lowercase letters',
    example: 'hello world'
  },
  {
    name: 'UPPERCASE',
    label: 'UPPERCASE', 
    description: 'CONVERT ALL TEXT TO UPPERCASE LETTERS',
    example: 'HELLO WORLD'
  },
  {
    name: 'Title Case',
    label: 'Title Case',
    description: 'Capitalize The First Letter Of Each Word',
    example: 'Hello World'
  },
  {
    name: 'Sentence case',
    label: 'Sentence case',
    description: 'Capitalize only the first letter of each sentence',
    example: 'Hello world. This is another sentence.'
  },
  {
    name: 'camelCase',
    label: 'camelCase',
    description: 'removeSpacesAndCapitalizeFirstLetterOfEachWord',
    example: 'helloWorld'
  },
  {
    name: 'PascalCase',
    label: 'PascalCase',
    description: 'RemoveSpacesAndCapitalizeFirstLetterOfAllWords',
    example: 'HelloWorld'
  },
  {
    name: 'snake_case',
    label: 'snake_case',
    description: 'replace_spaces_with_underscores_and_lowercase',
    example: 'hello_world'
  },
  {
    name: 'kebab-case',
    label: 'kebab-case',
    description: 'replace-spaces-with-hyphens-and-lowercase',
    example: 'hello-world'
  },
  {
    name: 'CONSTANT_CASE',
    label: 'CONSTANT_CASE',
    description: 'REPLACE_SPACES_WITH_UNDERSCORES_AND_UPPERCASE',
    example: 'HELLO_WORLD'
  },
  {
    name: 'dot.case',
    label: 'dot.case',
    description: 'replace.spaces.with.dots.and.lowercase',
    example: 'hello.world'
  }
]

export default function TextCaseConverterPage() {
  const [inputText, setInputText] = useState('')
  const [results, setResults] = useState<{[key: string]: string}>({})
  const [copied, setCopied] = useState<string | null>(null)

  const convertText = async (text: string) => {
    if (!text.trim()) {
      setResults({})
      return
    }

    const newResults: { [key: string]: string } = {}

    // Try API first for each case type, fallback to local
    const caseTypesToConvert = [
      'lower', 'upper', 'title', 'sentence', 'camel', 'pascal', 
      'snake', 'kebab', 'constant', 'dot'
    ]

    for (const caseType of caseTypesToConvert) {
      try {
        // Try API conversion
        const response = await apiRequest(getApiUrl('textCaseConverter'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, type: caseType })
        })

        if (response.ok) {
          const result = await response.json()
          const displayName = getDisplayName(caseType)
          newResults[displayName] = result.converted
          continue
        }
      } catch (error) {
        // API failed, use local conversion
      }

      // Local fallback conversion
      const displayName = getDisplayName(caseType)
      newResults[displayName] = convertLocalCase(text, caseType)
    }

    setResults(newResults)
  }

  const getDisplayName = (caseType: string): string => {
    const mapping: { [key: string]: string } = {
      'lower': 'lowercase',
      'upper': 'UPPERCASE',
      'title': 'Title Case',
      'sentence': 'Sentence case',
      'camel': 'camelCase',
      'pascal': 'PascalCase',
      'snake': 'snake_case',
      'kebab': 'kebab-case',
      'constant': 'CONSTANT_CASE',
      'dot': 'dot.case'
    }
    return mapping[caseType] || caseType
  }

  const convertLocalCase = (text: string, caseType: string): string => {
    switch (caseType) {
      case 'lower':
        return text.toLowerCase()
      case 'upper':
        return text.toUpperCase()
      case 'title':
        return text.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        )
      case 'sentence':
        return text.toLowerCase().replace(/(^\w|\.\s+\w)/g, (match) => 
          match.toUpperCase()
        )
      case 'camel':
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
            index === 0 ? word.toLowerCase() : word.toUpperCase()
          )
          .replace(/\s+/g, '')
      case 'pascal':
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
          .replace(/\s+/g, '')
      case 'snake':
        return text
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^\w]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '')
      case 'kebab':
        return text
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
      case 'constant':
        return text
          .toUpperCase()
          .replace(/\s+/g, '_')
          .replace(/[^\w]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '')
      case 'dot':
        return text
          .toLowerCase()
          .replace(/\s+/g, '.')
          .replace(/[^\w.]/g, '.')
          .replace(/\.+/g, '.')
          .replace(/^\.|\.$/g, '')
      default:
        return text
    }
  }

  const handleInputChange = async (value: string) => {
    setInputText(value)
    await convertText(value)
  }

  const copyResult = async (caseType: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(caseType)
      setTimeout(() => setCopied(null), 2000)
      toast.success(`${caseType} copied to clipboard!`)
    } catch (error) {
      // Console output removed for production
      toast.error('Failed to copy text')
    }
  }

  const clearText = () => {
    setInputText('')
    setResults({})
    toast.success('Text cleared')
  }

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0
  const charCount = inputText.length
  const charCountNoSpaces = inputText.replace(/\s/g, '').length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Type className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Text Case Converter</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Convert text between different cases including uppercase, lowercase, title case, camelCase, snake_case, and more
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary">10 Cases</Badge>
            <Badge variant="secondary">Instant</Badge>
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
                  <FileText className="h-5 w-5" />
                  Input Text
                </CardTitle>
                <CardDescription>
                  Enter your text to convert between different cases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="input-text">Text to Convert</Label>
                  <Textarea
                    id="input-text"
                    placeholder="Enter your text here..."
                    value={inputText}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="min-h-[200px] mt-2 font-mono"
                  />
                </div>

                {/* Text Statistics */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{wordCount}</div>
                    <div className="text-sm text-muted-foreground">Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{charCount}</div>
                    <div className="text-sm text-muted-foreground">Characters</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{charCountNoSpaces}</div>
                    <div className="text-sm text-muted-foreground">No Spaces</div>
                  </div>
                </div>

                <Button 
                  onClick={clearText} 
                  variant="outline" 
                  className="w-full"
                  disabled={!inputText}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Clear Text
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlignLeft className="h-5 w-5" />
                  Converted Results
                </CardTitle>
                <CardDescription>
                  Click any result to copy it to your clipboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inputText ? (
                  <div className="space-y-4">
                    {caseTypes.map((caseType) => (
                      <div 
                        key={caseType.name}
                        className="group border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => copyResult(caseType.name, results[caseType.name] || '')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {caseType.label}
                            </Badge>
                            {copied === caseType.name && (
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
                            {copied === caseType.name ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <div className="font-mono text-sm bg-background p-3 rounded border">
                          {results[caseType.name] || ''}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {caseType.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Type className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Text to Convert</h3>
                    <p className="text-muted-foreground">
                      Enter some text in the input field to see all case conversions
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Supported Case Types</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {caseTypes.slice(0, 10).map((caseType) => (
              <div key={caseType.name} className="p-4 rounded-lg border bg-card">
                <Badge variant="outline" className="mb-2">
                  {caseType.label}
                </Badge>
                <p className="text-sm text-muted-foreground font-mono">
                  {caseType.example}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
