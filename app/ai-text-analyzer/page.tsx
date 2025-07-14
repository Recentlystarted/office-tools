'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Brain,
  Eye,
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  BookOpen,
  Users,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Sparkles,
  Copy,
  Download,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'

interface TextAnalysis {
  // Basic Stats
  wordCount: number
  characterCount: number
  characterCountNoSpaces: number
  sentenceCount: number
  paragraphCount: number
  averageWordsPerSentence: number
  
  // Readability Scores
  fleschKincaidGrade: number
  fleschReadingEase: number
  readabilityLevel: string
  readingTime: number // in minutes
  
  // Sentiment Analysis
  sentimentScore: number // -1 to 1
  sentimentLabel: 'Very Negative' | 'Negative' | 'Neutral' | 'Positive' | 'Very Positive'
  emotionalTone: string[]
  
  // Advanced Analysis
  complexityScore: number
  formalityScore: number
  keywordDensity: { word: string; count: number; percentage: number }[]
  mostCommonWords: { word: string; count: number }[]
  longestSentence: { text: string; wordCount: number }
  shortestSentence: { text: string; wordCount: number }
  
  // SEO & Content Analysis
  uniqueWords: number
  vocabularyRichness: number
  passiveVoicePercentage: number
  adverbPercentage: number
  
  // Recommendations
  recommendations: string[]
  strengths: string[]
  improvements: string[]
}

export default function AITextAnalyzerPage() {
  const [text, setText] = useState('')
  const [analysis, setAnalysis] = useState<TextAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [copied, setCopied] = useState(false)

  // Real-time basic analysis for immediate feedback
  const [basicStats, setBasicStats] = useState({
    words: 0,
    characters: 0,
    sentences: 0,
    paragraphs: 0
  })

  useEffect(() => {
    if (text.trim()) {
      const words = text.trim().split(/\s+/).length
      const characters = text.length
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || 1
      
      setBasicStats({ words, characters, sentences, paragraphs })
    } else {
      setBasicStats({ words: 0, characters: 0, sentences: 0, paragraphs: 0 })
    }
  }, [text])

  // Advanced sentiment analysis
  const analyzeSentiment = (text: string): { score: number; label: any; emotions: string[] } => {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'perfect', 'love', 'like', 'happy', 'joy', 'success', 'win', 'best', 'awesome', 'brilliant', 'outstanding', 'superb', 'magnificent']
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'sad', 'angry', 'fail', 'worst', 'disaster', 'nightmare', 'stupid', 'dumb', 'useless', 'pathetic', 'disgusting', 'annoying']
    
    const words = text.toLowerCase().split(/\W+/)
    let score = 0
    const emotions: string[] = []
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 1
      if (negativeWords.includes(word)) score -= 1
    })
    
    score = Math.max(-1, Math.min(1, score / words.length * 10))
    
    let label: any
    if (score <= -0.6) label = 'Very Negative'
    else if (score <= -0.2) label = 'Negative'
    else if (score <= 0.2) label = 'Neutral'
    else if (score <= 0.6) label = 'Positive'
    else label = 'Very Positive'
    
    // Detect emotional tones
    if (words.some(w => ['exciting', 'thrilling', 'energetic'].includes(w))) emotions.push('Energetic')
    if (words.some(w => ['calm', 'peaceful', 'serene'].includes(w))) emotions.push('Calm')
    if (words.some(w => ['professional', 'formal', 'business'].includes(w))) emotions.push('Professional')
    if (words.some(w => ['urgent', 'important', 'critical'].includes(w))) emotions.push('Urgent')
    
    return { score, label, emotions }
  }

  // Flesch Reading Ease calculation
  const calculateReadability = (text: string, sentences: number, words: number) => {
    const syllables = text.toLowerCase().split(/[aeiou]+/).length - 1
    const avgWordsPerSentence = words / sentences
    const avgSyllablesPerWord = syllables / words
    
    const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    const gradeLevel = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59
    
    let level = ''
    if (fleschScore >= 90) level = 'Very Easy'
    else if (fleschScore >= 80) level = 'Easy'
    else if (fleschScore >= 70) level = 'Fairly Easy'
    else if (fleschScore >= 60) level = 'Standard'
    else if (fleschScore >= 50) level = 'Fairly Difficult'
    else if (fleschScore >= 30) level = 'Difficult'
    else level = 'Very Difficult'
    
    return { fleschScore, gradeLevel, level }
  }

  const performAnalysis = () => {
    if (!text.trim()) {
      toast.error('Please enter text to analyze')
      return
    }

    setIsAnalyzing(true)

    setTimeout(() => {
      try {
        const words = text.trim().split(/\s+/)
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
        
        const wordCount = words.length
        const characterCount = text.length
        const characterCountNoSpaces = text.replace(/\s/g, '').length
        const sentenceCount = sentences.length
        const paragraphCount = paragraphs.length || 1
        const averageWordsPerSentence = wordCount / sentenceCount
        
        // Readability
        const readability = calculateReadability(text, sentenceCount, wordCount)
        const readingTime = Math.ceil(wordCount / 200) // 200 words per minute average
        
        // Sentiment
        const sentiment = analyzeSentiment(text)
        
        // Keyword analysis
        const wordFreq: { [key: string]: number } = {}
        words.forEach(word => {
          const cleanWord = word.toLowerCase().replace(/[^\w]/g, '')
          if (cleanWord.length > 3) { // Only words longer than 3 characters
            wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1
          }
        })
        
        const keywordDensity = Object.entries(wordFreq)
          .map(([word, count]) => ({
            word,
            count,
            percentage: (count / wordCount) * 100
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
        
        const mostCommonWords = Object.entries(wordFreq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([word, count]) => ({ word, count }))
        
        // Sentence analysis
        const sentenceLengths = sentences.map(s => ({
          text: s.trim(),
          wordCount: s.trim().split(/\s+/).length
        }))
        
        const longestSentence = sentenceLengths.reduce((max, current) => 
          current.wordCount > max.wordCount ? current : max, sentenceLengths[0])
        
        const shortestSentence = sentenceLengths.reduce((min, current) => 
          current.wordCount < min.wordCount ? current : min, sentenceLengths[0])
        
        // Advanced metrics
        const uniqueWords = new Set(words.map(w => w.toLowerCase())).size
        const vocabularyRichness = (uniqueWords / wordCount) * 100
        
        // Simple passive voice detection
        const passiveIndicators = text.match(/\b(was|were|been|being)\s+\w+ed\b/gi) || []
        const passiveVoicePercentage = (passiveIndicators.length / sentenceCount) * 100
        
        // Adverb detection
        const adverbs = text.match(/\w+ly\b/gi) || []
        const adverbPercentage = (adverbs.length / wordCount) * 100
        
        // Generate recommendations
        const recommendations: string[] = []
        const strengths: string[] = []
        const improvements: string[] = []
        
        if (averageWordsPerSentence > 20) {
          improvements.push('Consider shortening sentences for better readability')
        } else if (averageWordsPerSentence < 15) {
          strengths.push('Good sentence length for readability')
        }
        
        if (readability.fleschScore > 70) {
          strengths.push('Text is easy to read and understand')
        } else if (readability.fleschScore < 50) {
          improvements.push('Simplify language to improve readability')
        }
        
        if (vocabularyRichness > 60) {
          strengths.push('Rich vocabulary with diverse word choice')
        } else if (vocabularyRichness < 40) {
          improvements.push('Consider using more varied vocabulary')
        }
        
        if (passiveVoicePercentage > 20) {
          improvements.push('Reduce passive voice usage for more engaging content')
        }
        
        if (adverbPercentage > 5) {
          improvements.push('Consider reducing adverb usage for stronger prose')
        }
        
        recommendations.push('Content is well-structured with clear paragraphs')
        if (sentiment.score > 0.3) {
          strengths.push('Positive and engaging tone')
        }
        
        const analysis: TextAnalysis = {
          wordCount,
          characterCount,
          characterCountNoSpaces,
          sentenceCount,
          paragraphCount,
          averageWordsPerSentence,
          fleschKincaidGrade: readability.gradeLevel,
          fleschReadingEase: readability.fleschScore,
          readabilityLevel: readability.level,
          readingTime,
          sentimentScore: sentiment.score,
          sentimentLabel: sentiment.label,
          emotionalTone: sentiment.emotions,
          complexityScore: Math.min(100, (averageWordsPerSentence * 2) + (readability.gradeLevel * 5)),
          formalityScore: Math.min(100, (passiveVoicePercentage * 2) + (averageWordsPerSentence * 1.5)),
          keywordDensity,
          mostCommonWords,
          longestSentence,
          shortestSentence,
          uniqueWords,
          vocabularyRichness,
          passiveVoicePercentage,
          adverbPercentage,
          recommendations,
          strengths,
          improvements
        }
        
        setAnalysis(analysis)
        toast.success('Text analysis completed successfully!')
        
      } catch (error) {
        console.error('Analysis error:', error)
        toast.error('Analysis failed. Please try again.')
      } finally {
        setIsAnalyzing(false)
      }
    }, 1000) // Simulate processing time
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Very Positive': return 'text-green-600 bg-green-50 border-green-200'
      case 'Positive': return 'text-green-500 bg-green-50 border-green-200'
      case 'Neutral': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'Negative': return 'text-red-500 bg-red-50 border-red-200'
      case 'Very Negative': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Very Positive': return <TrendingUp className="h-4 w-4" />
      case 'Positive': return <TrendingUp className="h-4 w-4" />
      case 'Neutral': return <Minus className="h-4 w-4" />
      case 'Negative': return <TrendingDown className="h-4 w-4" />
      case 'Very Negative': return <TrendingDown className="h-4 w-4" />
      default: return <Minus className="h-4 w-4" />
    }
  }

  const copyAnalysis = () => {
    if (!analysis) return
    
    const report = `
TEXT ANALYSIS REPORT
===================

BASIC STATISTICS:
• Words: ${analysis.wordCount}
• Characters: ${analysis.characterCount}
• Sentences: ${analysis.sentenceCount}
• Paragraphs: ${analysis.paragraphCount}
• Average words per sentence: ${analysis.averageWordsPerSentence.toFixed(1)}

READABILITY:
• Flesch Reading Ease: ${analysis.fleschReadingEase.toFixed(1)} (${analysis.readabilityLevel})
• Grade Level: ${analysis.fleschKincaidGrade.toFixed(1)}
• Estimated reading time: ${analysis.readingTime} minutes

SENTIMENT & TONE:
• Sentiment: ${analysis.sentimentLabel}
• Score: ${analysis.sentimentScore.toFixed(2)}
• Emotional tones: ${analysis.emotionalTone.join(', ') || 'None detected'}

CONTENT QUALITY:
• Vocabulary richness: ${analysis.vocabularyRichness.toFixed(1)}%
• Unique words: ${analysis.uniqueWords}
• Passive voice: ${analysis.passiveVoicePercentage.toFixed(1)}%
• Adverb usage: ${analysis.adverbPercentage.toFixed(1)}%

TOP KEYWORDS:
${analysis.keywordDensity.slice(0, 5).map(kw => `• ${kw.word}: ${kw.count} times (${kw.percentage.toFixed(1)}%)`).join('\n')}

STRENGTHS:
${analysis.strengths.map(s => `• ${s}`).join('\n')}

IMPROVEMENTS:
${analysis.improvements.map(i => `• ${i}`).join('\n')}
    `.trim()
    
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Analysis report copied to clipboard!')
    })
  }

  const clearAll = () => {
    setText('')
    setAnalysis(null)
    toast.success('All content cleared')
  }

  const sampleTexts = [
    {
      name: 'Business Email',
      text: `Dear Valued Customer,

We are excited to announce the launch of our revolutionary new product that will transform the way you work. After months of careful development and testing, we are confident that this solution will exceed your expectations and deliver exceptional value to your organization.

Our team has worked tirelessly to ensure that every feature has been designed with your needs in mind. We believe this product represents a significant advancement in the industry and will help you achieve your business objectives more efficiently than ever before.

We would be delighted to schedule a demonstration at your convenience. Please don't hesitate to contact us if you have any questions or would like to learn more about how this innovative solution can benefit your company.

Best regards,
The Product Team`
    },
    {
      name: 'Academic Abstract',
      text: `This study investigates the computational complexity of machine learning algorithms in distributed systems environments. Through extensive empirical analysis involving multiple datasets and performance metrics, we demonstrate that parallel processing architectures significantly enhance algorithmic efficiency while maintaining statistical accuracy. Our methodology incorporates novel optimization techniques that reduce computational overhead by approximately 35% compared to traditional approaches. The findings suggest that hybrid architectures combining cloud computing resources with edge computing capabilities offer optimal performance characteristics for large-scale machine learning applications. These results have important implications for the design of next-generation artificial intelligence systems.`
    },
    {
      name: 'Creative Writing',
      text: `The ancient lighthouse stood majestically on the rocky cliff, its weathered stone walls telling stories of countless storms weathered and ships safely guided home. Emily approached the towering structure with a mixture of excitement and reverence, her grandmother's mysterious letter clutched tightly in her hand.

The massive wooden door creaked open at her touch, revealing a spiral staircase that seemed to ascend into darkness. Each step echoed through the hollow interior as she climbed, her heart pounding with anticipation. What secrets had her grandmother hidden in this forgotten place?

Sunlight streamed through the lantern room windows, illuminating dust particles that danced like tiny spirits in the golden beams. And there, on the ancient desk, lay an ornate chest that would change everything she thought she knew about her family's past.`
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 text-purple-600">
              <Brain className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Text Analyzer
            </h1>
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
            Advanced AI-powered text analysis with sentiment detection, readability scoring, SEO insights, and personalized recommendations
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <Badge variant="secondary" className="text-xs sm:text-sm">AI Sentiment</Badge>
            <Badge variant="secondary" className="text-xs sm:text-sm">Readability</Badge>
            <Badge variant="secondary" className="text-xs sm:text-sm">SEO Analysis</Badge>
            <Badge variant="secondary" className="text-xs sm:text-sm">Smart Insights</Badge>
          </div>
        </div>

        {/* Real-time Stats Bar */}
        {text && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Card className="p-3">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{basicStats.words}</div>
                <div className="text-xs text-muted-foreground">Words</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-600">{basicStats.characters}</div>
                <div className="text-xs text-muted-foreground">Characters</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">{basicStats.sentences}</div>
                <div className="text-xs text-muted-foreground">Sentences</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-orange-600">{basicStats.paragraphs}</div>
                <div className="text-xs text-muted-foreground">Paragraphs</div>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Text to Analyze
                </CardTitle>
                <CardDescription>
                  Paste your text below for comprehensive AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="text-input">Your Text</Label>
                  <Textarea
                    id="text-input"
                    placeholder="Enter your text here for analysis... (minimum 10 words for accurate results)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[250px] sm:min-h-[300px] mt-2 text-sm leading-relaxed"
                  />
                </div>

                {/* Sample Texts */}
                <div className="space-y-2">
                  <Label>Try Sample Text:</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {sampleTexts.map((sample) => (
                      <Button
                        key={sample.name}
                        variant="outline"
                        size="sm"
                        onClick={() => setText(sample.text)}
                        className="justify-start text-left h-auto p-3 overflow-hidden"
                      >
                        <div className="w-full overflow-hidden">
                          <div className="font-medium text-sm">{sample.name}</div>
                          <div className="text-xs text-muted-foreground break-all line-clamp-1 overflow-hidden text-ellipsis">
                            {sample.text.substring(0, 60)}...
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button 
                    onClick={performAnalysis} 
                    disabled={!text.trim() || text.trim().split(/\s+/).length < 10 || isAnalyzing}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Analyze Text
                      </>
                    )}
                  </Button>
                  <Button onClick={clearAll} variant="outline" disabled={!text && !analysis}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                </div>

                {text.trim() && text.trim().split(/\s+/).length < 10 && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">Please enter at least 10 words for accurate analysis</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {analysis ? (
              <>
                {/* Sentiment Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Sentiment & Tone Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`flex items-center gap-3 p-4 rounded-lg border ${getSentimentColor(analysis.sentimentLabel)}`}>
                      {getSentimentIcon(analysis.sentimentLabel)}
                      <div>
                        <div className="font-semibold">{analysis.sentimentLabel}</div>
                        <div className="text-sm opacity-80">Score: {analysis.sentimentScore.toFixed(2)}</div>
                      </div>
                    </div>

                    {analysis.emotionalTone.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Emotional Tones</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {analysis.emotionalTone.map((tone) => (
                            <Badge key={tone} variant="outline" className="text-xs">
                              {tone}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Readability Scores */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Readability Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {analysis.fleschReadingEase.toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Flesch Score</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {analysis.fleschKincaidGrade.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">Grade Level</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Reading Level: {analysis.readabilityLevel}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {analysis.readingTime} min read
                        </span>
                      </div>
                      <Progress value={Math.max(0, Math.min(100, analysis.fleschReadingEase))} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Content Quality Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Content Quality
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex justify-between">
                          <span>Vocabulary Richness</span>
                          <span className="font-medium">{analysis.vocabularyRichness.toFixed(1)}%</span>
                        </div>
                        <Progress value={analysis.vocabularyRichness} className="h-1 mt-1" />
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <span>Passive Voice</span>
                          <span className="font-medium">{analysis.passiveVoicePercentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={analysis.passiveVoicePercentage} className="h-1 mt-1" />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-lg font-bold">{analysis.uniqueWords}</div>
                        <div className="text-muted-foreground">Unique Words</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{analysis.averageWordsPerSentence.toFixed(1)}</div>
                        <div className="text-muted-foreground">Avg Words/Sentence</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Keywords */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Top Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.keywordDensity.slice(0, 5).map((keyword, index) => (
                        <div key={keyword.word} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              #{index + 1}
                            </Badge>
                            <span className="font-medium">{keyword.word}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{keyword.count}x</span>
                            <span className="text-muted-foreground">({keyword.percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      AI Insights & Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.strengths.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-600">Strengths</span>
                        </div>
                        <ul className="space-y-1 ml-6">
                          {analysis.strengths.map((strength, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              • {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.improvements.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <span className="font-medium text-orange-600">Improvements</span>
                        </div>
                        <ul className="space-y-1 ml-6">
                          {analysis.improvements.map((improvement, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              • {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button onClick={copyAnalysis} variant="outline" className="w-full">
                      {copied ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Full Report
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground">
                    Enter your text on the left and click "Analyze Text" to get detailed insights about readability, sentiment, keywords, and more.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
