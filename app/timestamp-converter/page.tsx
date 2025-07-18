'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Clock,
  Copy,
  CheckCircle,
  Calendar,
  RefreshCw,
  Globe,
  MapPin,
  Zap,
  History,
  Timer,
  Sunrise,
  Sun,
  Sunset,
  Moon
} from 'lucide-react'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TimestampConversion {
  unix: number
  iso: string
  utc: string
  local: string
  readable: string
  day: string
  timezone: string
}

export default function TimestampConverterPage() {
  const [timestamp, setTimestamp] = useState('')
  const [humanDate, setHumanDate] = useState('')
  const [timezone, setTimezone] = useState('UTC')
  const [currentTime, setCurrentTime] = useState<TimestampConversion | null>(null)
  const [conversion, setConversion] = useState<TimestampConversion | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('convert')

  // Common timezones
  const timezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'EST/EDT (Eastern Time)' },
    { value: 'America/Chicago', label: 'CST/CDT (Central Time)' },
    { value: 'America/Denver', label: 'MST/MDT (Mountain Time)' },
    { value: 'America/Los_Angeles', label: 'PST/PDT (Pacific Time)' },
    { value: 'Europe/London', label: 'GMT/BST (London)' },
    { value: 'Europe/Paris', label: 'CET/CEST (Paris)' },
    { value: 'Europe/Berlin', label: 'CET/CEST (Berlin)' },
    { value: 'Asia/Tokyo', label: 'JST (Tokyo)' },
    { value: 'Asia/Shanghai', label: 'CST (Shanghai)' },
    { value: 'Asia/Dubai', label: 'GST (Dubai)' },
    { value: 'Asia/Kolkata', label: 'IST (India)' },
    { value: 'Australia/Sydney', label: 'AEST/AEDT (Sydney)' }
  ]

  // Update current time every second
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = Date.now()
      const nowSeconds = Math.floor(now / 1000)
      const date = new Date(now)
      
      setCurrentTime({
        unix: nowSeconds,
        iso: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toLocaleString(),
        readable: date.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        }),
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      })
    }

    updateCurrentTime()
    const interval = setInterval(updateCurrentTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Convert timestamp
  const convertTimestamp = () => {
    if (!timestamp.trim()) {
      toast.error('Please enter a timestamp')
      return
    }

    try {
      let date: Date
      const input = timestamp.trim()

      // Detect input format and convert
      if (/^\d{10}$/.test(input)) {
        // Unix timestamp (seconds)
        date = new Date(parseInt(input) * 1000)
      } else if (/^\d{13}$/.test(input)) {
        // Unix timestamp (milliseconds)
        date = new Date(parseInt(input))
      } else if (/^\d{16}$/.test(input)) {
        // Unix timestamp (microseconds)
        date = new Date(parseInt(input) / 1000)
      } else {
        // Try parsing as date string
        date = new Date(input)
      }

      if (isNaN(date.getTime())) {
        toast.error('Invalid timestamp format')
        return
      }

      const unixSeconds = Math.floor(date.getTime() / 1000)
      
      const result: TimestampConversion = {
        unix: unixSeconds,
        iso: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toLocaleString(),
        readable: date.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        }),
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        timezone: timezone
      }

      setConversion(result)
      toast.success('Timestamp converted successfully!')
    } catch (error) {
      // Console output removed for production
      toast.error('Failed to convert timestamp')
    }
  }

  // Convert human date to timestamp
  const convertHumanDate = () => {
    if (!humanDate.trim()) {
      toast.error('Please enter a date')
      return
    }

    try {
      const date = new Date(humanDate.trim())
      
      if (isNaN(date.getTime())) {
        toast.error('Invalid date format')
        return
      }

      const unixSeconds = Math.floor(date.getTime() / 1000)
      
      const result: TimestampConversion = {
        unix: unixSeconds,
        iso: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toLocaleString(),
        readable: date.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        }),
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        timezone: timezone
      }

      setConversion(result)
      toast.success('Date converted to timestamp successfully!')
    } catch (error) {
      // Console output removed for production
      toast.error('Failed to convert date')
    }
  }

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text)
      setTimeout(() => setCopied(null), 2000)
      toast.success(`${label} copied to clipboard!`)
    })
  }

  // Get current timestamp in different formats
  const getCurrentTimestamp = (format: 'seconds' | 'milliseconds' | 'iso' | 'utc') => {
    if (!currentTime) return ''
    
    switch (format) {
      case 'seconds':
        return currentTime.unix.toString()
      case 'milliseconds':
        return (currentTime.unix * 1000).toString()
      case 'iso':
        return currentTime.iso
      case 'utc':
        return currentTime.utc
      default:
        return ''
    }
  }

  // Sample timestamps for testing
  const sampleTimestamps = [
    {
      name: 'Current Time',
      value: currentTime?.unix.toString() || '',
      description: 'Right now'
    },
    {
      name: 'Unix Epoch',
      value: '0',
      description: 'January 1, 1970'
    },
    {
      name: 'Y2K',
      value: '946684800',
      description: 'January 1, 2000'
    },
    {
      name: 'Bitcoin Genesis',
      value: '1231006505',
      description: 'First Bitcoin block'
    }
  ]

  const getTimeIcon = () => {
    if (!currentTime) return <Clock className="h-5 w-5" />
    
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) return <Sunrise className="h-5 w-5" />
    if (hour >= 12 && hour < 18) return <Sun className="h-5 w-5" />
    if (hour >= 18 && hour < 22) return <Sunset className="h-5 w-5" />
    return <Moon className="h-5 w-5" />
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Clock className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
          Timestamp Converter
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Convert between Unix timestamps and human-readable dates. Perfect for developers, system administrators, and data analysts.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-7xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="convert" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Convert
          </TabsTrigger>
          <TabsTrigger value="current" className="flex items-center gap-2">
            {getTimeIcon()}
            Current Time
          </TabsTrigger>
          <TabsTrigger value="batch" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            Batch Convert
          </TabsTrigger>
        </TabsList>

        <TabsContent value="convert" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            {/* Conversion Input */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Timestamp to Date
                  </CardTitle>
                  <CardDescription>
                    Convert Unix timestamp to human-readable date
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="timestamp-input">Unix Timestamp</Label>
                    <Input
                      id="timestamp-input"
                      placeholder="1640995200 (seconds) or 1640995200000 (milliseconds)"
                      value={timestamp}
                      onChange={(e) => setTimestamp(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports seconds (10 digits), milliseconds (13 digits), or microseconds (16 digits)
                    </p>
                  </div>

                  <Button onClick={convertTimestamp} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Convert Timestamp
                  </Button>

                  {/* Sample Timestamps */}
                  <div className="space-y-2">
                    <Label>Try Sample Timestamps:</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {sampleTimestamps.map((sample) => (
                        <Button
                          key={sample.name}
                          variant="outline"
                          size="sm"
                          onClick={() => setTimestamp(sample.value)}
                          className="justify-start text-left h-auto p-3"
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{sample.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {sample.description} • {sample.value}
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Date to Timestamp
                  </CardTitle>
                  <CardDescription>
                    Convert human-readable date to Unix timestamp
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="date-input">Date & Time</Label>
                    <Input
                      id="date-input"
                      type="datetime-local"
                      value={humanDate}
                      onChange={(e) => setHumanDate(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Or enter any date format like "December 31, 2023 23:59:59"
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="timezone-select">Timezone</Label>
                    <select
                      id="timezone-select"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                    >
                      {timezones.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button onClick={convertHumanDate} className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    Convert to Timestamp
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Conversion Results */}
            <div className="space-y-6">
              {conversion ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Conversion Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium">Unix Timestamp (seconds)</div>
                          <div className="text-sm text-muted-foreground">Most common format</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                            {conversion.unix}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(conversion.unix.toString(), 'Unix timestamp')}
                          >
                            {copied === conversion.unix.toString() ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium">Milliseconds</div>
                          <div className="text-sm text-muted-foreground">JavaScript format</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                            {conversion.unix * 1000}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard((conversion.unix * 1000).toString(), 'Milliseconds')}
                          >
                            {copied === (conversion.unix * 1000).toString() ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium">ISO 8601</div>
                          <div className="text-sm text-muted-foreground">International standard</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                            {conversion.iso}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(conversion.iso, 'ISO 8601')}
                          >
                            {copied === conversion.iso ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium">UTC String</div>
                          <div className="text-sm text-muted-foreground">Coordinated Universal Time</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                            {conversion.utc}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(conversion.utc, 'UTC string')}
                          >
                            {copied === conversion.utc ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium">Local Time</div>
                          <div className="text-sm text-muted-foreground">Your timezone</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                            {conversion.local}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(conversion.local, 'Local time')}
                          >
                            {copied === conversion.local ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-lg font-semibold mb-2">{conversion.readable}</div>
                      <Badge variant="outline">{conversion.day}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Convert</h3>
                    <p className="text-muted-foreground">
                      Enter a timestamp or date on the left to see the conversion results here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="current" className="space-y-6">
          {/* Current Time Display */}
          {currentTime && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {getCurrentTimestamp('seconds')}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">Unix Seconds</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(getCurrentTimestamp('seconds'), 'Current timestamp (seconds)')}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {getCurrentTimestamp('milliseconds')}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">Milliseconds</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(getCurrentTimestamp('milliseconds'), 'Current timestamp (milliseconds)')}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-bold text-blue-600 mb-1">
                    {currentTime.day}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">Day of Week</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(currentTime.readable, 'Current date/time')}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getTimeIcon()}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">Time Period</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(currentTime.iso, 'Current ISO 8601')}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy ISO
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Current Time in Different Formats
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentTime && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Readable Format</span>
                    <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                      {currentTime.readable}
                    </code>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">ISO 8601</span>
                    <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                      {currentTime.iso}
                    </code>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">UTC String</span>
                    <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                      {currentTime.utc}
                    </code>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Local String</span>
                    <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                      {currentTime.local}
                    </code>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Batch Timestamp Converter
              </CardTitle>
              <CardDescription>
                Convert multiple timestamps at once (coming soon)
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Timer className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Batch Conversion</h3>
              <p className="text-muted-foreground">
                This feature will allow you to convert multiple timestamps in a single operation. Coming soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
