'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FileText, Upload, RotateCw, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { DownloadSuccessCard } from '@/components/download-success-card'
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

export default function RotatePdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isRotating, setIsRotating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [rotatedBlob, setRotatedBlob] = useState<Blob | null>(null)
  const [rotatedFileName, setRotatedFileName] = useState<string>('')
  const [rotationAngle, setRotationAngle] = useState<'90' | '180' | '270'>('90')
  const [pageRange, setPageRange] = useState<'all' | 'specific'>('all')
  const [specificPages, setSpecificPages] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setRotatedBlob(null)
      setRotatedFileName('')
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

  const handleRotate = async () => {
    if (!file) return

    // Validate specific pages input if needed
    if (pageRange === 'specific' && !specificPages.trim()) {
      setError('Please specify page numbers (e.g., 1,3,5 or 1-3)')
      return
    }

    setIsRotating(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('rotation_angle', rotationAngle)
      formData.append('page_range', pageRange)
      if (pageRange === 'specific') {
        formData.append('specific_pages', specificPages.trim())
      }

      const response = await apiRequest(getApiUrl('pdfRotate'), {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const result = await response.blob()
      
      // Generate filename
      const filename = file.name.replace(/\.pdf$/i, `-rotated-${rotationAngle}deg.pdf`)
      setRotatedBlob(result)
      setRotatedFileName(filename)
      
      toast.success(`PDF rotated successfully! Pages rotated ${rotationAngle}°. Click download to save.`)

    } catch (error) {
      console.error('Rotation error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Rotation failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsRotating(false)
      setProgress(0)
    }
  }

  const resetForm = () => {
    setFile(null)
    setError(null)
    setProgress(0)
    setRotatedBlob(null)
    setRotatedFileName('')
    setSpecificPages('')
  }

  const handleDownload = () => {
    if (rotatedBlob && rotatedFileName) {
      downloadBlob(rotatedBlob, rotatedFileName)
      toast.success('File downloaded successfully!')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">PDF Rotate</h1>
        <p className="text-lg text-muted-foreground">
          Rotate PDF pages to the correct orientation - 90°, 180°, or 270°
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCw className="h-5 w-5" />
            Upload PDF File
          </CardTitle>
          <CardDescription>
            Select a PDF file to rotate its pages. Maximum file size: 100MB
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
                  <span>🔄 All rotations</span>
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

          {/* Rotation Options */}
          {file && !rotatedBlob && (
            <div className="space-y-6">
              {/* Rotation Angle */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Rotation Angle</Label>
                <RadioGroup value={rotationAngle} onValueChange={(value: string) => setRotationAngle(value as '90' | '180' | '270')}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="90" id="90" />
                      <div className="flex-1">
                        <Label htmlFor="90" className="font-medium">90° Clockwise</Label>
                        <p className="text-sm text-muted-foreground">Quarter turn right</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="180" id="180" />
                      <div className="flex-1">
                        <Label htmlFor="180" className="font-medium">180° Rotation</Label>
                        <p className="text-sm text-muted-foreground">Half turn (upside down)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="270" id="270" />
                      <div className="flex-1">
                        <Label htmlFor="270" className="font-medium">270° Clockwise</Label>
                        <p className="text-sm text-muted-foreground">Quarter turn left</p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Page Range Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Pages to Rotate</Label>
                <RadioGroup value={pageRange} onValueChange={(value: string) => setPageRange(value as 'all' | 'specific')}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="all" id="all" />
                      <div className="flex-1">
                        <Label htmlFor="all" className="font-medium">All Pages</Label>
                        <p className="text-sm text-muted-foreground">Rotate all pages in the document</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="specific" id="specific" />
                      <div className="flex-1">
                        <Label htmlFor="specific" className="font-medium">Specific Pages</Label>
                        <p className="text-sm text-muted-foreground">Rotate only selected pages</p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                {/* Specific Pages Input */}
                {pageRange === 'specific' && (
                  <div className="mt-3">
                    <Label htmlFor="specificPages" className="text-sm font-medium">Page Numbers</Label>
                    <input
                      id="specificPages"
                      type="text"
                      value={specificPages}
                      onChange={(e) => setSpecificPages(e.target.value)}
                      placeholder="e.g., 1,3,5 or 1-3,7-9"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use commas for individual pages (1,3,5) or hyphens for ranges (1-3,7-9)
                    </p>
                  </div>
                )}
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
          {isRotating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Rotating PDF pages...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Download Success Section */}
          {rotatedBlob && (
            <DownloadSuccessCard
              title="PDF Rotated Successfully!"
              description={`Pages rotated ${rotationAngle}° ${pageRange === 'all' ? 'for entire document' : 'for selected pages'}`}
              fileName={rotatedFileName}
              downloadButtonText="Download Rotated PDF"
              resetButtonText="Rotate Another File"
              onDownload={handleDownload}
              onReset={resetForm}
              icon={<RotateCw className="h-5 w-5 text-green-600" />}
            />
          )}

          {/* Rotate Button */}
          {file && !rotatedBlob && (
            <div className="flex justify-center">
              <Button
                onClick={handleRotate}
                disabled={isRotating}
                size="lg"
                className="min-w-[200px]"
              >
                {isRotating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Rotating...
                  </>
                ) : (
                  <>
                    <RotateCw className="h-4 w-4 mr-2" />
                    Rotate PDF
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
            <h3 className="font-semibold mb-2">Multiple Angles</h3>
            <p className="text-sm text-muted-foreground">
              Rotate pages by 90°, 180°, or 270° to fix orientation issues
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Selective Rotation</h3>
            <p className="text-sm text-muted-foreground">
              Rotate all pages or choose specific pages to rotate individually
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Quality Preserved</h3>
            <p className="text-sm text-muted-foreground">
              Rotation maintains original document quality and formatting
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
