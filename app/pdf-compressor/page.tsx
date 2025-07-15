'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FileText, Upload, Download, AlertCircle, Loader2, Archive } from 'lucide-react'
import { toast } from 'sonner'
import { DownloadSuccessCard } from '@/components/download-success-card'

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

export default function PdfCompressorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null)
  const [compressedFileName, setCompressedFileName] = useState<string>('')
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium')
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [compressedSize, setCompressedSize] = useState<number>(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile)
      setOriginalSize(selectedFile.size)
      setError(null)
      setCompressedBlob(null)
      setCompressedFileName('')
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

  const handleCompress = async () => {
    if (!file) return

    setIsCompressing(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('compression_level', compressionLevel)

      if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
        throw new Error('API configuration not available. Please check your environment settings.')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pdf-compressor/compress`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const result = await response.blob()
      
      // Generate filename
      const filename = file.name.replace(/\.pdf$/i, '-compressed.pdf')
      setCompressedBlob(result)
      setCompressedFileName(filename)
      setCompressedSize(result.size)
      
      const savedPercentage = Math.round((1 - result.size / file.size) * 100)
      toast.success(`PDF compressed successfully! File size reduced by ${savedPercentage}%. Click download to save.`)

    } catch (error) {
      console.error('Compression error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Compression failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsCompressing(false)
      setProgress(0)
    }
  }

  const resetForm = () => {
    setFile(null)
    setError(null)
    setProgress(0)
    setCompressedBlob(null)
    setCompressedFileName('')
    setOriginalSize(0)
    setCompressedSize(0)
  }

  const handleDownload = () => {
    if (compressedBlob && compressedFileName) {
      downloadBlob(compressedBlob, compressedFileName)
      toast.success('File downloaded successfully!')
    }
  }

  const compressionSaved = compressedSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">PDF Compressor</h1>
        <p className="text-lg text-muted-foreground">
          Reduce PDF file size while maintaining quality for easier sharing and storage
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Upload PDF File
          </CardTitle>
          <CardDescription>
            Select a PDF file to compress. Maximum file size: 100MB
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
                  <span>📄 PDF files only</span>
                  <span>📦 Max 100MB</span>
                  <span>🗜️ High compression</span>
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

          {/* Compression Level Selection */}
          {file && !compressedBlob && (
            <div className="space-y-3">
              <Label className="text-base font-medium">Compression Level</Label>
              <RadioGroup value={compressionLevel} onValueChange={(value: string) => setCompressionLevel(value as 'low' | 'medium' | 'high')}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="low" id="low" />
                    <div className="flex-1">
                      <Label htmlFor="low" className="font-medium">Low Compression</Label>
                      <p className="text-sm text-muted-foreground">Best quality, larger file size</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="medium" id="medium" />
                    <div className="flex-1">
                      <Label htmlFor="medium" className="font-medium">Medium Compression</Label>
                      <p className="text-sm text-muted-foreground">Balanced quality and size</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="high" id="high" />
                    <div className="flex-1">
                      <Label htmlFor="high" className="font-medium">High Compression</Label>
                      <p className="text-sm text-muted-foreground">Smallest file, reduced quality</p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
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
          {isCompressing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Compressing PDF...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Download Success Section */}
          {compressedBlob && (
            <div className="space-y-4">
              {/* Compression Stats */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Compression Results</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-blue-600">Original Size</p>
                    <p className="font-medium text-blue-900">{formatFileSize(originalSize)}</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Compressed Size</p>
                    <p className="font-medium text-blue-900">{formatFileSize(compressedSize)}</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Size Reduction</p>
                    <p className="font-medium text-blue-900">{compressionSaved}%</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Space Saved</p>
                    <p className="font-medium text-blue-900">{formatFileSize(originalSize - compressedSize)}</p>
                  </div>
                </div>
              </div>

              <DownloadSuccessCard
                title="PDF Compressed Successfully!"
                description={`File size reduced by ${compressionSaved}% with ${compressionLevel} compression`}
                fileName={compressedFileName}
                downloadButtonText="Download Compressed PDF"
                resetButtonText="Compress Another File"
                onDownload={handleDownload}
                onReset={resetForm}
                icon={<Archive className="h-5 w-5 text-green-600" />}
              />
            </div>
          )}

          {/* Compress Button */}
          {file && !compressedBlob && (
            <div className="flex justify-center">
              <Button
                onClick={handleCompress}
                disabled={isCompressing}
                size="lg"
                className="min-w-[200px]"
              >
                {isCompressing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Compressing...
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4 mr-2" />
                    Compress PDF
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
            <h3 className="font-semibold mb-2">Smart Compression</h3>
            <p className="text-sm text-muted-foreground">
              Advanced algorithms reduce file size while preserving document quality
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Multiple Levels</h3>
            <p className="text-sm text-muted-foreground">
              Choose from low, medium, or high compression based on your needs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">
              Files are processed securely and automatically deleted after compression
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
