/**
 * Template for File Conversion Tools with Download Button Pattern
 * 
 * This template provides a consistent pattern for all file conversion tools
 * that includes:
 * - File upload/input
 * - Processing state
 * - Success state with download button
 * - Reset functionality
 * 
 * Usage: Copy this template and customize for your specific conversion tool
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { FileText, Upload, Download, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { DownloadSuccessCard } from '@/components/download-success-card'

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

export default function ConversionToolTemplate() {
  // State management
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [resultFileName, setResultFileName] = useState<string>('')

  // File processing function
  const handleProcess = async () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Update this endpoint for your specific tool
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/your-endpoint`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.blob()
      
      // Customize filename generation for your tool
      const filename = file.name.replace(/\.[^/.]+$/, '.new-extension')
      setResultBlob(result)
      setResultFileName(filename)
      
      toast.success('File processed successfully! Click download to save the file.')

    } catch (error) {
      console.error('Processing error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Processing failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  // Reset form
  const resetForm = () => {
    setFile(null)
    setError(null)
    setProgress(0)
    setResultBlob(null)
    setResultFileName('')
  }

  // Handle download
  const handleDownload = () => {
    if (resultBlob && resultFileName) {
      downloadBlob(resultBlob, resultFileName)
      toast.success('File downloaded successfully!')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Your Tool Name</h1>
        <p className="text-lg text-muted-foreground">
          Description of what your tool does
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload File
          </CardTitle>
          <CardDescription>
            Select a file to process. Maximum file size: 50MB
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area - Customize accept types */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx" // Customize for your tool
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg">Click to select file</p>
              <p className="text-sm text-muted-foreground">
                Supported formats: PDF, DOC, DOCX
              </p>
            </label>
          </div>

          {/* Selected File Display */}
          {file && (
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <FileText className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
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

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing file...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Download Success Section */}
          {resultBlob && (
            <DownloadSuccessCard
              title="File Processed Successfully!"
              description="Your file has been processed and is ready for download"
              fileName={resultFileName}
              downloadButtonText="Download File"
              resetButtonText="Process Another File"
              onDownload={handleDownload}
              onReset={resetForm}
            />
          )}

          {/* Process Button */}
          {!resultBlob && (
            <div className="flex justify-center">
              <Button
                onClick={handleProcess}
                disabled={!file || isProcessing}
                size="lg"
                className="min-w-[200px]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Process File
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
            <h3 className="font-semibold mb-2">Feature 1</h3>
            <p className="text-sm text-muted-foreground">
              Description of feature 1
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Feature 2</h3>
            <p className="text-sm text-muted-foreground">
              Description of feature 2
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Feature 3</h3>
            <p className="text-sm text-muted-foreground">
              Description of feature 3
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/**
 * Customization Guide:
 * 
 * 1. Replace "ConversionToolTemplate" with your component name
 * 2. Update the page title and description
 * 3. Modify file accept types for your specific use case
 * 4. Update the API endpoint URL
 * 5. Customize filename generation logic
 * 6. Update success messages and button text
 * 7. Modify features section content
 * 8. Add any tool-specific state or functionality
 */
