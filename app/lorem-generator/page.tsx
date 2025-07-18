'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { 
  Type,
  Copy,
  Check,
  RefreshCw,
  Download,
  FileText,
  AlignLeft,
  List,
  Hash
} from 'lucide-react'
import { toast } from 'sonner'

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
  'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
  'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
  'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo',
  'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'odit', 'fugit', 'sed',
  'consequuntur', 'magni', 'dolores', 'ratione', 'sequi', 'nesciunt', 'neque',
  'porro', 'quisquam', 'dolorem', 'adipisci', 'numquam', 'eius', 'modi',
  'tempora', 'incidunt', 'magnam', 'quaerat', 'voluptatem', 'fuga', 'harum',
  'quidem', 'rerum', 'facilis', 'expedita', 'distinctio', 'nam', 'libero',
  'tempore', 'cum', 'soluta', 'nobis', 'eligendi', 'optio', 'cumque', 'nihil',
  'impedit', 'quo', 'minus', 'maxime', 'placeat', 'facere', 'possimus', 'omnis',
  'assumenda', 'repellendus', 'autem', 'vel', 'illum', 'dolore', 'eu', 'feugiat'
]

const classicLorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?`

export default function LoremGeneratorPage() {
  const [generatedText, setGeneratedText] = useState('')
  const [outputType, setOutputType] = useState<'paragraphs' | 'sentences' | 'words' | 'bytes'>('paragraphs')
  const [quantity, setQuantity] = useState([3])
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [copied, setCopied] = useState(false)

  const generateRandomText = (type: string, count: number): string => {
    switch (type) {
      case 'words':
        return generateWords(count)
      case 'sentences':
        return generateSentences(count)
      case 'bytes':
        return generateBytes(count)
      default:
        return generateParagraphs(count)
    }
  }

  const generateWords = (count: number): string => {
    const words: string[] = []
    
    if (startWithLorem && count >= 2) {
      words.push('Lorem', 'ipsum')
      count -= 2
    }
    
    for (let i = 0; i < count; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)])
    }
    
    return words.join(' ') + '.'
  }

  const generateSentences = (count: number): string => {
    const sentences: string[] = []
    
    for (let i = 0; i < count; i++) {
      const sentenceLength = Math.floor(Math.random() * 15) + 8 // 8-22 words per sentence
      let words: string[] = []
      
      if (i === 0 && startWithLorem) {
        words.push('Lorem', 'ipsum')
        for (let j = 2; j < sentenceLength; j++) {
          words.push(loremWords[Math.floor(Math.random() * loremWords.length)])
        }
      } else {
        for (let j = 0; j < sentenceLength; j++) {
          words.push(loremWords[Math.floor(Math.random() * loremWords.length)])
        }
      }
      
      // Capitalize first word
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
      
      sentences.push(words.join(' ') + '.')
    }
    
    return sentences.join(' ')
  }

  const generateParagraphs = (count: number): string => {
    const paragraphs: string[] = []
    
    for (let i = 0; i < count; i++) {
      const sentenceCount = Math.floor(Math.random() * 5) + 3 // 3-7 sentences per paragraph
      paragraphs.push(generateSentences(sentenceCount))
    }
    
    return paragraphs.join('\n\n')
  }

  const generateBytes = (count: number): string => {
    let text = ''
    let wordIndex = 0
    
    if (startWithLorem) {
      text = 'Lorem ipsum '
    }
    
    while (text.length < count) {
      const word = loremWords[wordIndex % loremWords.length]
      
      if (text.length + word.length + 1 <= count) {
        text += word + ' '
      } else {
        text += word.substring(0, count - text.length)
        break
      }
      
      wordIndex++
      
      // Add sentence endings occasionally
      if (Math.random() < 0.1 && text.length < count - 20) {
        text = text.trim() + '. '
        if (text.length < count) {
          const nextWord = loremWords[wordIndex % loremWords.length]
          text += nextWord.charAt(0).toUpperCase() + nextWord.slice(1) + ' '
          wordIndex++
        }
      }
    }
    
    return text.trim()
  }

  const handleGenerate = () => {
    const text = generateRandomText(outputType, quantity[0])
    setGeneratedText(text)
    toast.success(`Generated ${quantity[0]} ${outputType}!`)
  }

  const useClassicLorem = () => {
    setGeneratedText(classicLorem)
    toast.success('Classic Lorem Ipsum loaded!')
  }

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(generatedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Text copied to clipboard!')
    } catch (error) {
      // Console output removed for production
      toast.error('Failed to copy text')
    }
  }

  const downloadText = () => {
    if (!generatedText) {
      toast.error('No text to download')
      return
    }

    const blob = new Blob([generatedText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lorem-ipsum-${outputType}-${quantity[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Text downloaded!')
  }

  const clearText = () => {
    setGeneratedText('')
    toast.success('Text cleared')
  }

  const getQuantityLabel = () => {
    switch (outputType) {
      case 'words': return `${quantity[0]} word${quantity[0] !== 1 ? 's' : ''}`
      case 'sentences': return `${quantity[0]} sentence${quantity[0] !== 1 ? 's' : ''}`
      case 'bytes': return `${quantity[0]} byte${quantity[0] !== 1 ? 's' : ''}`
      default: return `${quantity[0]} paragraph${quantity[0] !== 1 ? 's' : ''}`
    }
  }

  const getMaxQuantity = () => {
    switch (outputType) {
      case 'words': return 1000
      case 'sentences': return 100
      case 'bytes': return 10000
      default: return 20
    }
  }

  const wordCount = generatedText.trim() ? generatedText.trim().split(/\s+/).length : 0
  const charCount = generatedText.length
  const charCountNoSpaces = generatedText.replace(/\s/g, '').length
  const paragraphCount = generatedText.trim() ? generatedText.split(/\n\s*\n/).length : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Type className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Lorem Ipsum Generator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate placeholder text for your design and development projects. Create custom lorem ipsum in paragraphs, sentences, words, or bytes.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary">Custom Length</Badge>
            <Badge variant="secondary">Multiple Formats</Badge>
            <Badge variant="secondary">Classic Lorem</Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Settings Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Generator Settings
                </CardTitle>
                <CardDescription>
                  Configure your lorem ipsum generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Output Type */}
                <div className="space-y-3">
                  <Label>Output Type</Label>
                  <Tabs value={outputType} onValueChange={(value) => setOutputType(value as any)}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="paragraphs" className="text-xs">
                        <AlignLeft className="h-3 w-3 mr-1" />
                        Paragraphs
                      </TabsTrigger>
                      <TabsTrigger value="sentences" className="text-xs">
                        <List className="h-3 w-3 mr-1" />
                        Sentences
                      </TabsTrigger>
                    </TabsList>
                    <TabsList className="grid w-full grid-cols-2 mt-2">
                      <TabsTrigger value="words" className="text-xs">
                        <Type className="h-3 w-3 mr-1" />
                        Words
                      </TabsTrigger>
                      <TabsTrigger value="bytes" className="text-xs">
                        <Hash className="h-3 w-3 mr-1" />
                        Bytes
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label>Quantity: {getQuantityLabel()}</Label>
                  <Slider
                    value={quantity}
                    onValueChange={setQuantity}
                    max={getMaxQuantity()}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>{getMaxQuantity()}</span>
                  </div>
                </div>

                {/* Start with Lorem */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Start with "Lorem ipsum"</Label>
                    <p className="text-sm text-muted-foreground">
                      Begin generated text with the classic lorem ipsum words
                    </p>
                  </div>
                  <Switch
                    checked={startWithLorem}
                    onCheckedChange={setStartWithLorem}
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button onClick={handleGenerate} className="w-full" size="lg">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate Lorem Ipsum
                  </Button>
                  
                  <Button onClick={useClassicLorem} variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Use Classic Lorem
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Text Statistics */}
            {generatedText && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Text Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Words:</span>
                        <span className="font-medium">{wordCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Characters:</span>
                        <span className="font-medium">{charCount}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">No spaces:</span>
                        <span className="font-medium">{charCountNoSpaces}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paragraphs:</span>
                        <span className="font-medium">{paragraphCount}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Output Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    Generated Text
                  </div>
                  {generatedText && (
                    <div className="flex gap-2">
                      <Button onClick={copyText} variant="outline" size="sm">
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
                      <Button onClick={downloadText} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button onClick={clearText} variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Clear
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  Your generated lorem ipsum text will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedText ? (
                  <div className="space-y-4">
                    <Textarea
                      value={generatedText}
                      readOnly
                      className="min-h-[400px] font-serif text-base leading-relaxed"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Type className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Text Generated</h3>
                    <p className="text-muted-foreground mb-4">
                      Configure your settings and click "Generate Lorem Ipsum" to create placeholder text
                    </p>
                    <Button onClick={useClassicLorem} variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Load Classic Lorem Ipsum
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Lorem Ipsum Features</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-lg border bg-card">
              <AlignLeft className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Multiple Formats</h3>
              <p className="text-sm text-muted-foreground">
                Generate by paragraphs, sentences, words, or specific byte count
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <FileText className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Classic Lorem</h3>
              <p className="text-sm text-muted-foreground">
                Use the traditional lorem ipsum text or generate custom variations
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <RefreshCw className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Customizable</h3>
              <p className="text-sm text-muted-foreground">
                Control length, format, and whether to start with "Lorem ipsum"
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Download className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Export Ready</h3>
              <p className="text-sm text-muted-foreground">
                Copy to clipboard or download as text file for your projects
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
