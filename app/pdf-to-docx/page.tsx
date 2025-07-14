'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { FileText, Upload, Download, AlertCircle } from 'lucide-react'
import { apiClient, downloadBlob, formatFileSize } from '@/lib/api'

export default function PdfToDocxPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const handleConvert = async () => {
    if (!file) return

    setIsConverting(true)
    setProgress(0)
    setError(null)

    try {
      // Try primary endpoint first
      let result
      try {
        result = await apiClient.uploadFile({
          endpoint: '/api/pdf/convert',
          file,
          onProgress: setProgress,
        })
      } catch (primaryError) {
        // Fallback to legacy endpoint
        result = await apiClient.uploadFile({
          endpoint: '/convert',
          file,
          onProgress: setProgress,
        })
      }

      if (result instanceof Blob) {
        // Success - download the converted file
        const filename = file.name.replace(/\.pdf$/i, '.docx')
        downloadBlob(result, filename)
      } else {
        // Unexpected response format
        throw new Error('Unexpected response format from server')
      }

    } catch (error) {
      console.error('Conversion error:', error)
      setError(error instanceof Error ? error.message : 'Conversion failed. Please try again.')
    } finally {
      setIsConverting(false)
      setProgress(0)
    }
  }

  const resetForm = () => {
    setFile(null)
    setError(null)
    setProgress(0)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">PDF to Word Converter</h1>
        <p className="text-lg text-muted-foreground">
          Convert your PDF files to editable Word documents (.docx) instantly and for free
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload PDF File
          </CardTitle>
          <CardDescription>
            Select a PDF file to convert to Word format. Maximum file size: 50MB
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              ${file ? 'bg-muted/50' : ''}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg">Drop your PDF file here...</p>
            ) : file ? (
              <div className="space-y-2">
                <p className="text-lg font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  Size: {formatFileSize(file.size)}
                </p>
                <Button variant="outline" onClick={resetForm} className="mt-2">
                  Choose Different File
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg">Drag & drop your PDF file here</p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Progress Bar */}
          {isConverting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Converting PDF to Word...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Convert Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleConvert}
              disabled={!file || isConverting}
              size="lg"
              className="min-w-[200px]"
            >
              {isConverting ? (
                <>Converting...</>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Convert to Word
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features Section */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">High Quality</h3>
            <p className="text-sm text-muted-foreground">
              Advanced conversion engine preserves formatting, fonts, and layout
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Fast & Secure</h3>
            <p className="text-sm text-muted-foreground">
              Files are processed on secure servers and automatically deleted
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">100% Free</h3>
            <p className="text-sm text-muted-foreground">
              No registration required, no watermarks, completely free to use
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
