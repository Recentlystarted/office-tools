'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { FileText, Upload, Download, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { getApiUrl, apiRequest, ApiError } from '@/lib/api'

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

export default function PdfToDocxPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null)
  const [convertedFileName, setConvertedFileName] = useState<string>('')

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
      const formData = new FormData()
      formData.append('file', file)

      const response = await apiRequest(getApiUrl('pdfToWord'), {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.blob()
      
      // Success - prepare download
      const filename = file.name.replace(/\.pdf$/i, '.docx')
      setConvertedBlob(result)
      setConvertedFileName(filename)
      toast.success('PDF converted to Word successfully! Click download to save the file.')

    } catch (error) {
      console.error('Conversion error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Conversion failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsConverting(false)
      setProgress(0)
    }
  }

  const resetForm = () => {
    setFile(null)
    setError(null)
    setProgress(0)
    setConvertedBlob(null)
    setConvertedFileName('')
  }

  const handleDownload = () => {
    if (convertedBlob && convertedFileName) {
      downloadBlob(convertedBlob, convertedFileName)
      toast.success('File downloaded successfully!')
    }
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

          {/* Download Success Section */}
          {convertedBlob && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">PDF Converted Successfully!</h3>
                    <p className="text-green-700 text-sm">
                      Your PDF has been converted to an editable Word document
                    </p>
                    <p className="text-green-600 text-xs mt-1">
                      File: {convertedFileName}
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
                    Download DOCX
                  </Button>
                  <Button 
                    onClick={resetForm}
                    variant="outline"
                    size="lg"
                  >
                    Convert Another File
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Convert Button */}
          {!convertedBlob && (
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
          )}
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
