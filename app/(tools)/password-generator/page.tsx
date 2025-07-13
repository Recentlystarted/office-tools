'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Key, Copy, RefreshCw, AlertCircle } from 'lucide-react'
import { apiClient } from '@/lib/api'

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState([12])
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generatePassword = async () => {
    setIsGenerating(true)
    setError(null)
    setCopied(false)

    try {
      const result = await apiClient.postJson('/api/text/password', {
        length: length[0],
        uppercase: includeUppercase,
        lowercase: includeLowercase,
        numbers: includeNumbers,
        symbols: includeSymbols
      })

      if (result.password) {
        setPassword(result.password)
      } else {
        throw new Error('Invalid response format')
      }

    } catch (error) {
      console.error('Password generation error:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate password')
      
      // Fallback: generate password client-side
      const clientPassword = generateClientSidePassword()
      setPassword(clientPassword)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateClientSidePassword = () => {
    let chars = ''
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
    if (includeNumbers) chars += '0123456789'
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz' // fallback
    
    let result = ''
    for (let i = 0; i < length[0]; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const copyPassword = async () => {
    if (!password) return
    
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy password:', error)
    }
  }

  const getPasswordStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[^a-zA-Z\d]/.test(pwd)) score++
    
    if (score <= 2) return { label: 'Weak', color: 'text-red-500', bgColor: 'bg-red-100' }
    if (score <= 4) return { label: 'Medium', color: 'text-yellow-500', bgColor: 'bg-yellow-100' }
    return { label: 'Strong', color: 'text-green-500', bgColor: 'bg-green-100' }
  }

  const strength = password ? getPasswordStrength(password) : null

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Password Generator</h1>
        <p className="text-lg text-muted-foreground">
          Generate secure, customizable passwords for your accounts
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Password Settings
            </CardTitle>
            <CardDescription>
              Customize your password requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Length Slider */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Password Length</Label>
                <span className="text-sm font-medium">{length[0]} characters</span>
              </div>
              <Slider
                value={length}
                onValueChange={setLength}
                max={50}
                min={4}
                step={1}
                className="w-full"
              />
            </div>

            {/* Character Options */}
            <div className="space-y-3">
              <Label>Character Types</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uppercase"
                    checked={includeUppercase}
                    onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
                  />
                  <Label htmlFor="uppercase">Uppercase Letters (A-Z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lowercase"
                    checked={includeLowercase}
                    onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
                  />
                  <Label htmlFor="lowercase">Lowercase Letters (a-z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numbers"
                    checked={includeNumbers}
                    onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
                  />
                  <Label htmlFor="numbers">Numbers (0-9)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="symbols"
                    checked={includeSymbols}
                    onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
                  />
                  <Label htmlFor="symbols">Symbols (!@#$%^&*)</Label>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button 
              onClick={generatePassword}
              disabled={isGenerating || (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols)}
              className="w-full"
            >
              {isGenerating ? (
                <>Generating...</>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate Password
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Password */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Password</CardTitle>
            <CardDescription>
              {password ? 'Your secure password is ready' : 'Password will appear here after generation'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {password ? (
              <>
                {/* Password Display */}
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      value={password}
                      readOnly
                      className="font-mono text-lg pr-12"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={copyPassword}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {copied && (
                    <p className="text-sm text-green-600">Password copied to clipboard!</p>
                  )}
                </div>

                {/* Password Strength */}
                {strength && (
                  <div className={`p-3 rounded-lg ${strength.bgColor}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Strength:</span>
                      <span className={`text-sm font-semibold ${strength.color}`}>
                        {strength.label}
                      </span>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button onClick={copyPassword} variant="outline" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button onClick={generatePassword} variant="outline" className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-32 border-2 border-dashed border-border rounded-lg">
                <div className="text-center text-muted-foreground">
                  <Key className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Click "Generate Password" to create a secure password</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security Tips */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Security Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">Use Long Passwords</h4>
              <p className="text-muted-foreground">Minimum 12 characters for better security</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Mix Character Types</h4>
              <p className="text-muted-foreground">Include letters, numbers, and symbols</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Unique for Each Account</h4>
              <p className="text-muted-foreground">Never reuse passwords across sites</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Use Password Manager</h4>
              <p className="text-muted-foreground">Store passwords securely with a manager</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
