'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { FileText, Upload, Download, AlertCircle, Loader2, Unlock, Lock, Shield, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { getApiUrl, apiRequest } from '@/lib/api'

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Helper function to download blob
const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export default function PdfUnlockPage() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [unlockedBlob, setUnlockedBlob] = useState<Blob | null>(null)
  const [unlockedFileName, setUnlockedFileName] = useState('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setPassword('')
      toast.success('PDF file selected successfully!')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
  })

  const handleUnlock = async () => {
    if (!file) {
      toast.error('Please select a PDF file first')
      return
    }

    if (!password.trim()) {
      toast.error('Please enter the PDF password')
      return
    }

    setIsUnlocking(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('password', password.trim())

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await apiRequest(getApiUrl('pdfUnlock'), {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const errorText = await response.text()
        if (response.status === 401) {
          throw new Error('Invalid password. Please check your password and try again.')
        }
        throw new Error(`Unlock failed: ${errorText}`)
      }

      const result = await response.blob()
      
      // Generate filename
      const filename = file.name.replace(/\.pdf$/i, '-unlocked.pdf')
      setUnlockedBlob(result)
      setUnlockedFileName(filename)
      
      toast.success('PDF password removed successfully! Click download to save the unlocked file.')

    } catch (error) {
      console.error('Unlock error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Password removal failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsUnlocking(false)
      setProgress(0)
    }
  }

  const resetForm = () => {
    setFile(null)
    setPassword('')
    setError(null)
    setProgress(0)
    setUnlockedBlob(null)
    setUnlockedFileName('')
  }

  const handleDownload = () => {
    if (unlockedBlob && unlockedFileName) {
      downloadBlob(unlockedBlob, unlockedFileName)
      toast.success('File downloaded successfully!')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">PDF Password Remover</h1>
        <p className="text-lg text-muted-foreground">
          Remove password protection from PDF files when you have the correct password
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Unlock className="h-5 w-5" />
            Upload Password-Protected PDF
          </CardTitle>
          <CardDescription>
            Select a password-protected PDF file. We'll remove the password protection for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
              ${isDragActive ? 'border-primary bg-primary/5 scale-105' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
            `}
          >
            <input {...getInputProps()} />
            <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            {isDragActive ? (
              <div className="space-y-2">
                <p className="text-lg text-primary">Drop your PDF file here...</p>
                <p className="text-sm text-muted-foreground">Release to select file</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xl font-medium">Drag & drop your PDF file here</p>
                <p className="text-muted-foreground">
                  or click to browse files
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-4">
                  <span className="flex items-center gap-1">
                    <Lock className="h-4 w-4" />
                    Password-protected PDFs
                  </span>
                  <span>📦 Max 100MB</span>
                  <span className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    Secure processing
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Selected File Display */}
          {file && (
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <FileText className="h-8 w-8 text-red-500" />
              <div className="flex-1">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  Size: {formatFileSize(file.size)} • PDF Document
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFile(null)}
              >
                Remove
              </Button>
            </div>
          )}

          {/* Password Input */}
          {file && !unlockedBlob && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">PDF Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter the PDF password..."
                    className="pr-10"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && password.trim()) {
                        handleUnlock()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the password that was used to protect this PDF file
                </p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Progress Bar */}
          {isUnlocking && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Removing password protection...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Download Success Section */}
          {unlockedBlob && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Unlock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">Password Removed Successfully!</h3>
                    <p className="text-green-700 text-sm">
                      Your PDF is now unlocked and ready to use without password
                    </p>
                    <p className="text-green-600 text-xs mt-1">
                      File: {unlockedFileName}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleDownload}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Unlocked PDF
                  </Button>
                  <Button 
                    onClick={resetForm}
                    variant="outline"
                    size="lg"
                  >
                    Unlock Another File
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Unlock Button */}
          {file && !unlockedBlob && (
            <div className="flex justify-center">
              <Button
                onClick={handleUnlock}
                disabled={!password.trim() || isUnlocking}
                size="lg"
                className="min-w-[200px]"
              >
                {isUnlocking ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Removing Password...
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4 mr-2" />
                    Remove Password
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features Section */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Secure Process
            </h3>
            <p className="text-sm text-muted-foreground">
              Your files are processed securely and automatically deleted after conversion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Unlock className="h-5 w-5 text-green-500" />
              Password Required
            </h3>
            <p className="text-sm text-muted-foreground">
              You must have the correct password to remove protection from the PDF
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-500" />
              Download Ready
            </h3>
            <p className="text-sm text-muted-foreground">
              Get your unlocked PDF file instantly after password removal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Notice */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Privacy & Security</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your PDF files and passwords are never stored on our servers</li>
              <li>• All processing happens securely and files are deleted immediately</li>
              <li>• We don't have access to your passwords or document content</li>
              <li>• This tool only works if you already know the correct password</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
