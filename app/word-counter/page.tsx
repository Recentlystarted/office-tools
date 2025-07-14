'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calculator,
  FileText,
  Clock,
  BarChart3,
  Copy,
  Check,
  RotateCcw,
  Eye,
  Hash,
  AlignLeft
} from 'lucide-react'
import { toast } from 'sonner'

interface TextStats {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  lines: number
  readingTime: number
  speakingTime: number
  mostCommonWords: Array<{ word: string; count: number }>
  longestWord: string
  averageWordsPerSentence: number
}

export default function WordCounterPage() {
  const [inputText, setInputText] = useState('')
  const [copied, setCopied] = useState(false)

  const stats: TextStats = useMemo(() => {
    if (!inputText.trim()) {
      return {
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        readingTime: 0,
        speakingTime: 0,
        mostCommonWords: [],
        longestWord: '',
        averageWordsPerSentence: 0
      }
    }

    const text = inputText.trim()
    
    // Basic counts
    const characters = inputText.length
    const charactersNoSpaces = inputText.replace(/\s/g, '').length
    const words = text ? text.split(/\s+/).filter(word => word.length > 0).length : 0
    const sentences = text ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0
    const paragraphs = text ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0
    const lines = text ? text.split('\n').length : 0

    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200)
    
    // Speaking time (average 130 words per minute)
    const speakingTime = Math.ceil(words / 130)

    // Word analysis
    const wordArray = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0)

    // Most common words
    const wordCount: { [key: string]: number } = {}
    wordArray.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })

    const mostCommonWords = Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }))

    // Longest word
    const longestWord = wordArray.reduce((longest, current) => 
      current.length > longest.length ? current : longest, ''
    )

    // Average words per sentence
    const averageWordsPerSentence = sentences > 0 ? Math.round((words / sentences) * 10) / 10 : 0

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime,
      speakingTime,
      mostCommonWords,
      longestWord,
      averageWordsPerSentence
    }
  }, [inputText])

  const copyStats = async () => {
    const statsText = `Text Statistics:
Words: ${stats.words}
Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Lines: ${stats.lines}
Reading Time: ${stats.readingTime} minute(s)
Speaking Time: ${stats.speakingTime} minute(s)
Longest Word: ${stats.longestWord}
Average Words per Sentence: ${stats.averageWordsPerSentence}`

    try {
      await navigator.clipboard.writeText(statsText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Statistics copied to clipboard!')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast.error('Failed to copy statistics')
    }
  }

  const clearText = () => {
    setInputText('')
    toast.success('Text cleared')
  }

  const sampleTexts = [
    {
      name: 'Lorem Ipsum',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
      name: 'Business Email',
      text: 'Dear Team,\n\nI hope this email finds you well. I wanted to update you on the progress of our quarterly project. We have successfully completed the initial phase and are now moving into the implementation stage.\n\nThe key milestones achieved include:\n- Requirements gathering and analysis\n- System design and architecture\n- Resource allocation and team assignments\n\nOur next steps will focus on development and testing phases. Please let me know if you have any questions or concerns.\n\nBest regards,\nProject Manager'
    },
    {
      name: 'Technical Article',
      text: 'Machine learning algorithms have revolutionized the way we process and analyze data. From recommendation systems to autonomous vehicles, these powerful tools are reshaping industries across the globe. The fundamental principle behind machine learning is the ability to learn patterns from data without being explicitly programmed for every possible scenario. This capability has opened up unprecedented opportunities for automation and intelligent decision-making in various domains.'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Calculator className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Word Counter</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Count words, characters, sentences, and analyze your text with detailed statistics and reading time estimates
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary">Real-time</Badge>
            <Badge variant="secondary">Detailed Analysis</Badge>
            <Badge variant="secondary">Reading Time</Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Text Input
                </CardTitle>
                <CardDescription>
                  Paste or type your text to get instant word count and analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="input-text">Your Text</Label>
                  <Textarea
                    id="input-text"
                    placeholder="Paste or type your text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[300px] mt-2 font-mono"
                  />
                </div>

                {/* Sample Text Buttons */}
                <div className="space-y-2">
                  <Label>Try Sample Text:</Label>
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

                <div className="flex gap-2">
                  <Button 
                    onClick={copyStats} 
                    variant="outline" 
                    className="flex-1"
                    disabled={!inputText}
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Stats
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={clearText} 
                    variant="outline"
                    disabled={!inputText}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Section */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{stats.words}</div>
                    <div className="text-sm text-muted-foreground">Words</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{stats.characters}</div>
                    <div className="text-sm text-muted-foreground">Characters</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{stats.sentences}</div>
                    <div className="text-sm text-muted-foreground">Sentences</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{stats.paragraphs}</div>
                    <div className="text-sm text-muted-foreground">Paragraphs</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <Tabs defaultValue="detailed" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="detailed" className="text-xs">
                  <Hash className="h-4 w-4 mr-1" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="reading" className="text-xs">
                  <Clock className="h-4 w-4 mr-1" />
                  Time
                </TabsTrigger>
                <TabsTrigger value="analysis" className="text-xs">
                  <Eye className="h-4 w-4 mr-1" />
                  Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="detailed" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Detailed Count</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Characters (no spaces):</span>
                      <span className="font-medium">{stats.charactersNoSpaces}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lines:</span>
                      <span className="font-medium">{stats.lines}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg words/sentence:</span>
                      <span className="font-medium">{stats.averageWordsPerSentence}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Longest word:</span>
                      <span className="font-medium font-mono">{stats.longestWord}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reading" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reading Time</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {stats.readingTime}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        minute(s) to read
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        ~200 words/min
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {stats.speakingTime}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        minute(s) to speak
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        ~130 words/min
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Word Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.mostCommonWords.length > 0 ? (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Most Common Words:</Label>
                        {stats.mostCommonWords.slice(0, 5).map((item, index) => (
                          <div key={item.word} className="flex justify-between items-center">
                            <span className="font-mono text-sm">{item.word}</span>
                            <Badge variant="secondary">{item.count}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No text to analyze
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
          <h2 className="text-2xl font-bold mb-8">Word Counter Features</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-lg border bg-card">
              <Calculator className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Real-time Counting</h3>
              <p className="text-sm text-muted-foreground">
                Get instant word, character, and sentence counts as you type
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Reading Time</h3>
              <p className="text-sm text-muted-foreground">
                Estimate reading and speaking time based on average speeds
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <BarChart3 className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Detailed Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Advanced statistics including word frequency and text patterns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
