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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  RefreshCw,
  Mail,
  MessageSquare,
  Edit,
  Zap,
  Shield,
  FileText,
  PenTool,
  Target
} from 'lucide-react'
import { toast } from 'sonner'
import { getApiUrl, apiRequest, ApiError } from '@/lib/api'
import ApiStatus from '@/components/api-status'

interface GrammarError {
  type: 'grammar' | 'spelling' | 'punctuation' | 'style'
  message: string
  suggestion: string
  position: { start: number; end: number }
  severity: 'error' | 'warning' | 'suggestion'
}

interface RewriteOption {
  title: string
  description: string
  text: string
  tone: 'professional' | 'casual' | 'formal' | 'friendly' | 'concise'
}

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
  
  // Grammar & Writing Quality
  grammarErrors: GrammarError[]
  correctedText: string
  rewriteOptions: RewriteOption[]
  writingScore: number // 0-100
  
  // Recommendations
  recommendations: string[]
  strengths: string[]
  improvements: string[]
}

export default function AITextAnalyzerPage() {
  const [text, setText] = useState('')
  const [analysis, setAnalysis] = useState<TextAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isRewriting, setIsRewriting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('analysis')
  const [selectedRewrite, setSelectedRewrite] = useState<string>('')

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

  // Advanced Grammar and Spelling Check
  const checkGrammarAndSpelling = (text: string): { errors: GrammarError[]; correctedText: string; writingScore: number } => {
    const errors: GrammarError[] = []
    let correctedText = text
    
    // Common spelling mistakes and corrections
    const spellingCorrections: { [key: string]: string } = {
      // Basic corrections
      'recieve': 'receive',
      'seperate': 'separate',
      'definately': 'definitely',
      'occured': 'occurred',
      'begining': 'beginning',
      'accomodate': 'accommodate',
      'neccessary': 'necessary',
      'occassion': 'occasion',
      'recomend': 'recommend',
      'tommorrow': 'tomorrow',
      'untill': 'until',
      'wich': 'which',
      'reccomend': 'recommend',
      'sucessful': 'successful',
      'buisness': 'business',
      'managment': 'management',
      'thier': 'their',
      'youre': "you're",
      'its': "it's",
      'cant': "can't",
      'wont': "won't",
      'dont': "don't",
      'isnt': "isn't",
      'wasnt': "wasn't",
      'hasnt': "hasn't",
      'shouldnt': "shouldn't",
      'couldnt': "couldn't",
      'wouldnt': "wouldn't",
      
      // Common typos you mentioned
      'teh': 'the',
      'hte': 'the',
      'taht': 'that',
      'thsi': 'this',
      'tihs': 'this',
      'adn': 'and',
      'andd': 'and',
      'ofr': 'for',
      'fro': 'for',
      'form': 'from',
      'frmo': 'from',
      'whne': 'when',
      'wehn': 'when',
      'waht': 'what',
      'whta': 'what',
      'whit': 'with',
      'wtih': 'with',
      'wiht': 'with',
      'wuld': 'would',
      'woudl': 'would',
      'shoudl': 'should',
      'shuold': 'should',
      'coudl': 'could',
      'cuold': 'could',
      'yuo': 'you',
      'yuor': 'your',
      'oyur': 'your',
      'youe': 'you',
      'tot': 'to',
      'ont': 'not',
      'nto': 'not',
      'fi': 'if',
      'fo': 'of',
      'abotu': 'about',
      'aboute': 'about',
      'aobut': 'about',
      'jsut': 'just',
      'juts': 'just',
      'geting': 'getting',
      'comeing': 'coming',
      'goign': 'going',
      'doign': 'doing',
      'makign': 'making',
      'takign': 'taking',
      'givign': 'giving',
      'workign': 'working',
      'lookign': 'looking',
      'beign': 'being',
      'havign': 'having',
      'sayign': 'saying',
      'playign': 'playing',
      'tryign': 'trying',
      'knowign': 'knowing',
      'thigns': 'things',
      'somethign': 'something',
      'everythign': 'everything',
      'anythign': 'anything',
      'nothign': 'nothing'
    }
    
    // Grammar patterns to check
    const grammarPatterns = [
      { pattern: /\bi\s/gi, correction: 'I ', type: 'grammar' as const, message: 'Always capitalize "I"' },
      { pattern: /\s{2,}/g, correction: ' ', type: 'style' as const, message: 'Remove extra spaces' },
      { pattern: /([.!?])\s*([a-z])/g, correction: '$1 $2', type: 'punctuation' as const, message: 'Add space after punctuation and capitalize' },
      { pattern: /([a-z])([.!?])/g, correction: '$1$2', type: 'punctuation' as const, message: 'No space before punctuation' },
      { pattern: /\s+([.!?,:;])/g, correction: '$1', type: 'punctuation' as const, message: 'Remove space before punctuation' },
      { pattern: /([.!?]){2,}/g, correction: '$1', type: 'punctuation' as const, message: 'Avoid repeated punctuation' },
      
      // Enhanced grammar checking
      { pattern: /\ba\s+(?=[aeiouAEIOU])/g, correction: 'an ', type: 'grammar' as const, message: 'Use "an" before vowel sounds' },
      { pattern: /\ban\s+(?=[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ])/g, correction: 'a ', type: 'grammar' as const, message: 'Use "a" before consonant sounds' },
      { pattern: /\byour\s+welcome\b/gi, correction: "you're welcome", type: 'grammar' as const, message: 'Use "you\'re welcome" not "your welcome"' },
      { pattern: /\bits\s+(?=(?:been|being|going|coming|working|playing|saying|doing|making|taking|looking|having|getting|trying|knowing))/gi, correction: "it's ", type: 'grammar' as const, message: 'Use "it\'s" (it is) instead of "its"' },
      { pattern: /\btheir\s+(?=(?:are|is|was|were|will|going|coming|working|playing|saying|doing|making|taking|looking|having|getting|trying|knowing))/gi, correction: "they're ", type: 'grammar' as const, message: 'Use "they\'re" (they are) instead of "their"' },
      { pattern: /\bto\s+(?=(?:many|much|few|little|often|rarely|always|never|sometimes|usually|frequently))/gi, correction: "too ", type: 'grammar' as const, message: 'Use "too" (also/excessively) instead of "to"' },
      { pattern: /\bthen\s+(?=(?:is|are|was|were|will|going|coming|working|playing|saying|doing|making|taking|looking|having|getting|trying|knowing))/gi, correction: "than ", type: 'grammar' as const, message: 'Use "than" for comparisons instead of "then"' }
    ]
    
    // Check spelling with better detection
    const words = text.split(/(\b\w+\b)/g)
    let textPosition = 0
    
    words.forEach((word) => {
      if (/^\w+$/.test(word)) { // Only check actual words
        const cleanWord = word.toLowerCase()
        if (spellingCorrections[cleanWord]) {
          const originalCase = word
          let correctedWord = spellingCorrections[cleanWord]
          
          // Preserve original capitalization
          if (originalCase[0] === originalCase[0].toUpperCase()) {
            correctedWord = correctedWord.charAt(0).toUpperCase() + correctedWord.slice(1)
          }
          if (originalCase === originalCase.toUpperCase() && originalCase.length > 1) {
            correctedWord = correctedWord.toUpperCase()
          }
          
          errors.push({
            type: 'spelling',
            message: `"${originalCase}" should be "${correctedWord}"`,
            suggestion: correctedWord,
            position: { start: textPosition, end: textPosition + word.length },
            severity: 'error'
          })
          
          // Apply correction to text
          correctedText = correctedText.replace(
            new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g'), 
            correctedWord
          )
        }
      }
      textPosition += word.length
    })
    
    // Check grammar patterns
    grammarPatterns.forEach(pattern => {
      const matches = Array.from(text.matchAll(pattern.pattern))
      matches.forEach(match => {
        if (match.index !== undefined) {
          errors.push({
            type: pattern.type,
            message: pattern.message,
            suggestion: match[0].replace(pattern.pattern, pattern.correction),
            position: { start: match.index, end: match.index + match[0].length },
            severity: pattern.type === 'grammar' ? 'error' : 'warning'
          })
        }
      })
      correctedText = correctedText.replace(pattern.pattern, pattern.correction)
    })
    
    // Calculate writing score
    const totalWords = text.split(/\s+/).length
    const errorCount = errors.length
    const writingScore = Math.max(0, Math.min(100, 100 - (errorCount / totalWords) * 100))
    
    return { errors, correctedText, writingScore }
  }

  // Generate rewrite options for emails/messages
  const generateRewriteOptions = (text: string): RewriteOption[] => {
    const options: RewriteOption[] = []
    
    // Professional version
    const professionalText = text
      .replace(/hey|hi|hello/gi, 'Dear')
      .replace(/thanks|thx/gi, 'Thank you')
      .replace(/asap/gi, 'as soon as possible')
      .replace(/can't/gi, 'cannot')
      .replace(/won't/gi, 'will not')
      .replace(/don't/gi, 'do not')
      .replace(/\?+/g, '?')
      .replace(/!+/g, '.')
    
    options.push({
      title: 'Professional & Formal',
      description: 'Perfect for business emails and formal communication',
      text: professionalText,
      tone: 'professional'
    })
    
    // Friendly version
    const friendlyText = text
      .replace(/dear/gi, 'Hi')
      .replace(/thank you/gi, 'Thanks')
      .replace(/i am writing to/gi, 'I wanted to')
      .replace(/please find attached/gi, 'I\'ve attached')
      .replace(/i would appreciate/gi, 'I\'d love')
    
    options.push({
      title: 'Friendly & Approachable',
      description: 'Warm and personal while maintaining professionalism',
      text: friendlyText,
      tone: 'friendly'
    })
    
    // Concise version
    const sentences = text.split(/[.!?]+/).filter(s => s.trim())
    const conciseText = sentences
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => {
        // Remove redundant words
        return s
          .replace(/\bin order to\b/gi, 'to')
          .replace(/\bdue to the fact that\b/gi, 'because')
          .replace(/\bat this point in time\b/gi, 'now')
          .replace(/\bin the event that\b/gi, 'if')
          .replace(/\bfor the purpose of\b/gi, 'for')
      })
      .join('. ')
    
    options.push({
      title: 'Concise & Direct',
      description: 'Clear and to the point without unnecessary words',
      text: conciseText,
      tone: 'concise'
    })
    
    return options
  }

  const performAnalysis = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to analyze')
      return
    }

    setIsAnalyzing(true)

    try {
      // Call our Python API for comprehensive text analysis
      // Console output removed for production
      
      const response = await apiRequest(getApiUrl('textAnalyzer'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim()
        })
      })

      const result = await response.json()
      
      // Debug: Log the API response structure in development
      // Console output removed for production
      
      if (!result || !result.success) {
        // Console output removed for production
        throw new ApiError(result?.message || 'Analysis failed')
      }

      const data = result.data
      
      // Transform API response to match our frontend interface with safe fallbacks
      const analysis: TextAnalysis = {
        wordCount: data.basic_stats?.word_count || 0,
        characterCount: data.basic_stats?.character_count || 0,
        characterCountNoSpaces: data.basic_stats?.character_count_no_spaces || 0,
        sentenceCount: data.basic_stats?.sentence_count || 0,
        paragraphCount: data.basic_stats?.paragraph_count || 0,
        averageWordsPerSentence: data.basic_stats?.average_words_per_sentence || 0,
        fleschKincaidGrade: data.readability?.grade_level || 0,
        fleschReadingEase: data.readability?.flesch_score || 0,
        readabilityLevel: data.readability?.readability_level || 'Unknown',
        readingTime: data.basic_stats?.reading_time_minutes || 0,
        sentimentScore: data.sentiment?.sentiment_score || 0,
        sentimentLabel: data.sentiment?.sentiment_label || 'Neutral',
        emotionalTone: [], // Not provided by current API
        complexityScore: data.quality_metrics?.grade_level || data.readability?.grade_level || 0,
        formalityScore: 50, // Default middle value since not provided
        keywordDensity: data.keywords?.keyword_density || [],
        mostCommonWords: (data.keywords?.keyword_density || []).map((kw: any) => ({ word: kw.word, count: kw.count })),
        longestSentence: {
          text: `Longest sentence (${data.quality_metrics?.longest_sentence_words || 0} words)`,
          wordCount: data.quality_metrics?.longest_sentence_words || 0
        },
        shortestSentence: {
          text: `Shortest sentence (${data.quality_metrics?.shortest_sentence_words || 0} words)`,
          wordCount: data.quality_metrics?.shortest_sentence_words || 0
        },
        uniqueWords: data.keywords?.unique_words || 0,
        vocabularyRichness: data.keywords?.vocabulary_richness || 0,
        passiveVoicePercentage: data.quality_metrics?.passive_voice_percentage || 0,
        adverbPercentage: data.quality_metrics?.adverb_percentage || 0,
        grammarErrors: [], // Will be filled by grammar check
        correctedText: text, // Will be filled by grammar check
        rewriteOptions: [], // Will be filled by rewrite service
        writingScore: Math.max(0, 100 - ((data.quality_metrics?.passive_voice_percentage || 0) * 0.5) - ((data.quality_metrics?.adverb_percentage || 0) * 0.3)),
        recommendations: data.recommendations?.recommendations || [],
        strengths: data.recommendations?.strengths || [],
        improvements: data.recommendations?.improvements || []
      }

      setAnalysis(analysis)
      toast.success('Text analysis completed successfully!')
      
    } catch (error) {
      // Console output removed for production
      
      // More detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('network')) {
        toast.error('Network error. Please check your internet connection and try again.')
      } else if (errorMessage.includes('API error: 404')) {
        toast.error('API endpoint not found. Please contact support.')
      } else if (errorMessage.includes('API error: 500')) {
        toast.error('Server error. Please try again later.')
      } else {
        toast.error(`Analysis failed: ${errorMessage}`)
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const performGrammarCheck = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to check')
      return
    }

    try {
      // Console output removed for production
      
      const response = await apiRequest(getApiUrl('grammarCheck'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim()
        })
      })

      const result = await response.json()
      
      // Debug: Log the API response structure in development
      // Console output removed for production
      
      if (!result || !result.success) {
        // Console output removed for production
        throw new ApiError(result?.message || 'Grammar check failed')
      }

      const data = result.data

      // Transform API response to match our frontend interface with safe fallbacks
      const grammarErrors: GrammarError[] = [
        ...(data.grammar_issues || []).map((error: any) => ({
          type: 'grammar' as const,
          message: error.message || error.rule || 'Grammar issue',
          suggestion: error.suggestion || error.replacement || 'Check grammar',
          position: error.position || { start: 0, end: 0 },
          severity: 'error' as const
        })),
        ...(data.spelling_issues || []).map((error: any) => ({
          type: 'spelling' as const,
          message: error.message || 'Spelling error',
          suggestion: error.suggestion || error.replacement || 'Check spelling',
          position: error.position || { start: 0, end: 0 },
          severity: 'error' as const
        })),
        ...(data.style_issues || []).map((error: any) => ({
          type: 'style' as const,
          message: error.message || error.rule || 'Style issue',
          suggestion: error.suggestion || error.replacement || 'Check style',
          position: error.position || { start: 0, end: 0 },
          severity: 'warning' as const
        }))
      ]

      // Update analysis if it exists
      if (analysis) {
        setAnalysis({
          ...analysis,
          grammarErrors,
          correctedText: data.corrected_text || text,
          writingScore: data.scores?.overall_score || analysis.writingScore
        })
      }

      toast.success(`Grammar check completed! Found ${grammarErrors.length} issues.`)
      
    } catch (error) {
      // Console output removed for production
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Grammar check failed: ${errorMessage}`)
    }
  }

  const performRewrite = async (style: string = 'professional') => {
    if (!text.trim()) {
      toast.error('Please enter text to rewrite')
      return
    }

    setIsRewriting(true)

    try {
      // Console output removed for production
      
      const response = await apiRequest(getApiUrl('textRewrite'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          style: style,
          options: {}
        })
      })

      const result = await response.json()
      
      // Debug: Log the API response structure in development
      // Console output removed for production
      
      if (!result || !result.success) {
        // Console output removed for production
        throw new ApiError(result?.message || 'Rewrite failed')
      }

      const data = result.data

      // Transform API response to match our frontend interface with safe fallbacks
      const rewriteOptions: RewriteOption[] = data.rewritten_versions ? 
        Object.entries(data.rewritten_versions).map(([styleName, rewriteText]: [string, any]) => ({
          title: styleName === 'primary' ? 'Enhanced Professional' : 
                 styleName === 'concise' ? 'Concise & Direct' :
                 styleName === 'detailed' ? 'Detailed & Comprehensive' :
                 styleName === 'alternative_1' ? 'Alternative Style 1' :
                 styleName === 'alternative_2' ? 'Alternative Style 2' :
                 styleName.charAt(0).toUpperCase() + styleName.slice(1),
          description: styleName === 'primary' ? 'Enhanced professional version with improved flow' :
                      styleName === 'concise' ? 'Clear and to the point without unnecessary words' :
                      styleName === 'detailed' ? 'Comprehensive version with additional context' :
                      styleName === 'alternative_1' ? 'Alternative phrasing and structure' :
                      styleName === 'alternative_2' ? 'Different approach and tone' :
                      `Rewritten in ${styleName} style`,
          text: rewriteText || text,
          tone: (styleName === 'primary' ? 'professional' : 
                styleName === 'concise' ? 'concise' : 
                styleName === 'detailed' ? 'formal' : 
                'friendly') as 'professional' | 'casual' | 'formal' | 'friendly' | 'concise'
        })).filter(option => option.text.trim().length > 0) : []

      // Update analysis if it exists
      if (analysis) {
        setAnalysis({
          ...analysis,
          rewriteOptions
        })
      }

      toast.success(`Text rewritten in ${data.rewritten_versions ? Object.keys(data.rewritten_versions).length : 0} different styles!`)
      
    } catch (error) {
      // Console output removed for production
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      // Fallback to local rewrite if API fails
      // Console output removed for production
      
      const localRewriteOptions = generateRewriteOptions(text)
      
      if (analysis) {
        setAnalysis({
          ...analysis,
          rewriteOptions: localRewriteOptions
        })
      }
      
      toast.success(`Generated ${localRewriteOptions.length} local rewrite options`)
      
    } finally {
      setIsRewriting(false)
    }
  }

  // Enhanced analysis that includes grammar check and rewrite
  const performCompleteAnalysis = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to analyze')
      return
    }

    setIsAnalyzing(true)

    try {
      // Perform main analysis
      await performAnalysis()
      
      // Perform grammar check
      await performGrammarCheck()
      
      // Perform rewrite with all styles
      await performRewrite('all')
      
    } catch (error) {
      // Console output removed for production
      toast.error('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
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
    setSelectedRewrite('')
    setActiveTab('analysis')
    toast.success('All content cleared')
  }

  const copyText = (textToCopy: string, label: string) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success(`${label} copied to clipboard!`)
    })
  }

  const applyRewrite = (rewriteText: string) => {
    setText(rewriteText)
    setSelectedRewrite(rewriteText)
    toast.success('Rewrite applied to editor!')
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

        <ApiStatus />

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
                    onClick={performCompleteAnalysis} 
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
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="analysis" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Analysis
                  </TabsTrigger>
                  <TabsTrigger value="grammar" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Grammar ({analysis.grammarErrors.length})
                  </TabsTrigger>
                  <TabsTrigger value="rewrite" className="flex items-center gap-2">
                    <PenTool className="h-4 w-4" />
                    Rewrite
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="space-y-6">
                  {/* Writing Score Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Writing Quality Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-2">
                        <div className="text-4xl font-bold text-primary">
                          {analysis.writingScore.toFixed(0)}/100
                        </div>
                        <Progress value={analysis.writingScore} className="h-3" />
                        <p className="text-sm text-muted-foreground">
                          {analysis.writingScore >= 90 ? 'Excellent' : 
                           analysis.writingScore >= 80 ? 'Very Good' :
                           analysis.writingScore >= 70 ? 'Good' :
                           analysis.writingScore >= 60 ? 'Fair' : 'Needs Improvement'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

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
                </TabsContent>

                <TabsContent value="grammar" className="space-y-6">
                  {/* Grammar and Spelling Check */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Grammar & Spelling Check
                      </CardTitle>
                      <CardDescription>
                        Found {analysis.grammarErrors.length} issues that can be improved
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {analysis.grammarErrors.length === 0 ? (
                        <div className="text-center py-8">
                          <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
                          <h3 className="text-lg font-semibold text-green-600 mb-2">Perfect!</h3>
                          <p className="text-muted-foreground">No grammar or spelling errors detected.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {analysis.grammarErrors.map((error, index) => (
                            <div key={index} className={`p-4 rounded-lg border ${
                              error.severity === 'error' ? 'border-red-200 bg-red-50' :
                              error.severity === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                              'border-blue-200 bg-blue-50'
                            }`}>
                              <div className="flex items-start gap-3">
                                <div className={`p-1 rounded ${
                                  error.severity === 'error' ? 'bg-red-100 text-red-600' :
                                  error.severity === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                  'bg-blue-100 text-blue-600'
                                }`}>
                                  {error.type === 'spelling' ? '📝' : 
                                   error.type === 'grammar' ? '📖' : 
                                   error.type === 'punctuation' ? '❗' : '✨'}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium capitalize">{error.type} {error.severity}</div>
                                  <div className="text-sm text-muted-foreground">{error.message}</div>
                                  {error.suggestion && (
                                    <div className="mt-1">
                                      <span className="text-sm font-medium">Suggestion: </span>
                                      <span className="text-sm">{error.suggestion}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Corrected Text */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        Auto-Corrected Text
                      </CardTitle>
                      <CardDescription>
                        Text with suggested corrections applied
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {analysis.correctedText}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => copyText(analysis.correctedText, 'Corrected text')}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Corrected Text
                        </Button>
                        <Button 
                          onClick={() => applyRewrite(analysis.correctedText)}
                          size="sm"
                        >
                          <Zap className="mr-2 h-4 w-4" />
                          Apply to Editor
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="rewrite" className="space-y-6">
                  {/* Email/Message Rewriter */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email & Message Rewriter
                      </CardTitle>
                      <CardDescription>
                        Get different versions of your text optimized for various communication styles
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {analysis.rewriteOptions.length > 0 ? (
                        analysis.rewriteOptions.map((option, index) => (
                          <div key={index} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{option.title}</h4>
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                              </div>
                              <Badge variant="outline" className="capitalize">
                                {option.tone}
                              </Badge>
                            </div>
                            
                            <div className="p-3 bg-muted/50 rounded-md">
                              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                {option.text}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => copyText(option.text, option.title)}
                                variant="outline"
                                size="sm"
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy
                              </Button>
                              <Button 
                                onClick={() => applyRewrite(option.text)}
                                size="sm"
                                variant={selectedRewrite === option.text ? "default" : "outline"}
                              >
                                <Zap className="mr-2 h-4 w-4" />
                                {selectedRewrite === option.text ? 'Applied' : 'Apply'}
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <PenTool className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Generate Rewrites</h3>
                          <p className="text-muted-foreground mb-4">
                            Click the button below to generate different versions of your text optimized for various communication styles.
                          </p>
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <Button 
                                onClick={() => performRewrite('professional')}
                                variant="outline"
                                size="sm"
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Professional
                              </Button>
                              <Button 
                                onClick={() => performRewrite('casual')}
                                variant="outline"
                                size="sm"
                              >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Casual
                              </Button>
                              <Button 
                                onClick={() => performRewrite('creative')}
                                variant="outline"
                                size="sm"
                              >
                                <Sparkles className="mr-2 h-4 w-4" />
                                Creative
                              </Button>
                            </div>
                            <Button 
                              onClick={() => performRewrite('all')}
                              className="w-full"
                              disabled={isRewriting}
                            >
                              {isRewriting ? (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <PenTool className="mr-2 h-4 w-4" />
                                  Generate All Styles
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground">
                    Enter your text on the left and click "Analyze Text" to get detailed insights about readability, sentiment, keywords, grammar checking, and AI-powered rewriting options.
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
