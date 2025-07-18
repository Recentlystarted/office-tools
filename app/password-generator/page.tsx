'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { getApiUrl, apiRequest, ApiError } from '@/lib/api'
import ApiStatus from '@/components/api-status'
import { 
  Key,
  Copy,
  Check,
  RefreshCw,
  Shield,
  Eye,
  EyeOff,
  Zap,
  Settings,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

interface PasswordResult {
  password: string
  strength: string
  length: number
}

export default function PasswordGeneratorPage() {
  const [passwordResult, setPasswordResult] = useState<PasswordResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(true)
  
  // Password settings
  const [length, setLength] = useState([12])
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)

  const generatePasswordLocal = (
    length: number,
    includeUppercase: boolean,
    includeLowercase: boolean,
    includeNumbers: boolean,
    includeSymbols: boolean,
    excludeSimilar: boolean,
    excludeAmbiguous: boolean
  ) => {
    let charset = ''
    
    if (includeUppercase) {
      charset += excludeSimilar ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }
    if (includeLowercase) {
      charset += excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz'
    }
    if (includeNumbers) {
      charset += excludeSimilar ? '23456789' : '0123456789'
    }
    if (includeSymbols) {
      const symbols = excludeAmbiguous 
        ? '!@#$%^&*_+-=|.?' 
        : '!@#$%^&*()_+-=[]{}|;:,.<>?'
      charset += symbols
    }

    let password = ''
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    // Calculate password strength
    let strength = 'Weak'
    if (length >= 12 && charset.length >= 70) strength = 'Very Strong'
    else if (length >= 10 && charset.length >= 50) strength = 'Strong'
    else if (length >= 8 && charset.length >= 30) strength = 'Good'
    else if (length >= 6 && charset.length >= 20) strength = 'Fair'

    return { password, strength, length }
  }

  const generatePassword = async () => {
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      toast.error('Please select at least one character type')
      return
    }

    setIsLoading(true)
    try {
      // Try API first, fallback to local generation
      try {
        const response = await apiRequest(getApiUrl('passwordGenerator'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            length: length[0],
            uppercase: includeUppercase,
            lowercase: includeLowercase,
            numbers: includeNumbers,
            symbols: includeSymbols,
            exclude_similar: excludeSimilar,
            exclude_ambiguous: excludeAmbiguous
          }),
        })

        if (response.ok) {
          const result = await response.json()
          setPasswordResult(result)
          toast.success('Password generated successfully!')
          return
        }
      } catch (apiError) {
        // API failed, fallback to local generation
        toast.info('Using local password generation')
      }

      // Fallback to local generation
      const result = generatePasswordLocal(
        length[0],
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
        excludeSimilar,
        excludeAmbiguous
      )
      
      setPasswordResult(result)
      toast.success('Password generated successfully!')
    } catch (error) {
      toast.error('Failed to generate password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyPassword = async () => {
    if (!passwordResult) return
    
    try {
      await navigator.clipboard.writeText(passwordResult.password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Password copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy password')
    }
  }

  const getStrengthColor = (strength: string) => {
    switch (strength?.toLowerCase()) {
      case 'very weak':
        return 'text-red-500'
      case 'weak':
        return 'text-orange-500'
      case 'fair':
        return 'text-yellow-500'
      case 'good':
        return 'text-blue-500'
      case 'strong':
        return 'text-green-500'
      case 'very strong':
        return 'text-emerald-500'
      default:
        return 'text-muted-foreground'
    }
  }

  const getStrengthBadgeVariant = (strength: string) => {
    switch (strength?.toLowerCase()) {
      case 'very weak':
      case 'weak':
        return 'destructive'
      case 'fair':
        return 'secondary'
      case 'good':
      case 'strong':
      case 'very strong':
        return 'default'
      default:
        return 'outline'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Key className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Password Generator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate strong, secure passwords with customizable length and character sets
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary">Secure</Badge>
            <Badge variant="secondary">Customizable</Badge>
            <Badge variant="secondary">No Logging</Badge>
          </div>
        </div>

        <ApiStatus />

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Settings Section */}
          <div className="space-y-6">
            {/* Password Length */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Password Settings
                </CardTitle>
                <CardDescription>
                  Customize your password requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Password Length: {length[0]}</Label>
                  <Slider
                    value={length}
                    onValueChange={setLength}
                    max={128}
                    min={4}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>4</span>
                    <span>128</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Character Types */}
            <Card>
              <CardHeader>
                <CardTitle>Character Types</CardTitle>
                <CardDescription>
                  Select which character types to include
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="uppercase">Uppercase Letters (A-Z)</Label>
                    <p className="text-sm text-muted-foreground">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                  </div>
                  <Switch
                    id="uppercase"
                    checked={includeUppercase}
                    onCheckedChange={setIncludeUppercase}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="lowercase">Lowercase Letters (a-z)</Label>
                    <p className="text-sm text-muted-foreground">abcdefghijklmnopqrstuvwxyz</p>
                  </div>
                  <Switch
                    id="lowercase"
                    checked={includeLowercase}
                    onCheckedChange={setIncludeLowercase}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="numbers">Numbers (0-9)</Label>
                    <p className="text-sm text-muted-foreground">0123456789</p>
                  </div>
                  <Switch
                    id="numbers"
                    checked={includeNumbers}
                    onCheckedChange={setIncludeNumbers}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="symbols">Symbols</Label>
                    <p className="text-sm text-muted-foreground">!@#$%^&*()_+-=[]{}|;:,.</p>
                  </div>
                  <Switch
                    id="symbols"
                    checked={includeSymbols}
                    onCheckedChange={setIncludeSymbols}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Advanced Options */}
            <Card>
              <CardHeader>
                <CardTitle>Advanced Options</CardTitle>
                <CardDescription>
                  Additional security options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="exclude-similar">Exclude Similar Characters</Label>
                    <p className="text-sm text-muted-foreground">Exclude i, l, 1, L, o, 0, O</p>
                  </div>
                  <Switch
                    id="exclude-similar"
                    checked={excludeSimilar}
                    onCheckedChange={setExcludeSimilar}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="exclude-ambiguous">Exclude Ambiguous Characters</Label>
                    <p className="text-sm text-muted-foreground">Exclude {`{ } [ ] ( ) / \\ ' " ~ , ; < >`}</p>
                  </div>
                  <Switch
                    id="exclude-ambiguous"
                    checked={excludeAmbiguous}
                    onCheckedChange={setExcludeAmbiguous}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button 
              onClick={generatePassword} 
              size="lg" 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Password...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Password
                </>
              )}
            </Button>
          </div>

          {/* Result Section */}
          <div className="lg:sticky lg:top-8">
            <Card>
              <CardHeader>
                <CardTitle>Generated Password</CardTitle>
                <CardDescription>
                  Your secure password will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {passwordResult ? (
                  <div className="space-y-6">
                    {/* Password Display */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Password</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="relative">
                        <Input
                          value={passwordResult.password}
                          type={showPassword ? "text" : "password"}
                          readOnly
                          className="font-mono text-lg pr-12"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyPassword}
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Password Info */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Length:</span>
                        <span className="font-medium">{passwordResult.length} characters</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Strength:</span>
                        <Badge 
                          variant={getStrengthBadgeVariant(passwordResult.strength)}
                          className={getStrengthColor(passwordResult.strength)}
                        >
                          {passwordResult.strength}
                        </Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                      <Button onClick={copyPassword} variant="outline" className="w-full">
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
                      <Button onClick={generatePassword} variant="outline" className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        New Password
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Key className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Password Generated</h3>
                    <p className="text-muted-foreground">
                      Configure your settings and click "Generate Password" to create a secure password
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Password Security Tips</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-lg border bg-card">
              <Shield className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Use Unique Passwords</h3>
              <p className="text-sm text-muted-foreground">
                Never reuse passwords across multiple accounts. Each account should have its own unique password.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Zap className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Make It Long</h3>
              <p className="text-sm text-muted-foreground">
                Longer passwords are exponentially harder to crack. Aim for at least 12-16 characters.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Key className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Use a Password Manager</h3>
              <p className="text-sm text-muted-foreground">
                Store your passwords securely with a password manager to avoid having to remember them all.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
