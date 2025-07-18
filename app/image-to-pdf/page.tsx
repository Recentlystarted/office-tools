'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { FileImage, Upload, Download, AlertCircle, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { DownloadSuccessCard } from '@/components/download-success-card'
import { getApiUrl, apiRequest, ApiError } from '@/lib/api'
import ApiStatus from '@/components/api-status'

interface ImageWithId {
  id: string
  file: File
  name: string
  size: number
  type: string
  preview: string
}

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

export default function ImageToPdfPage() {
  const [images, setImages] = useState<ImageWithId[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null)
  const [convertedFileName, setConvertedFileName] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejectedReasons = rejectedFiles.map(({ errors }) => 
        errors.map((e: any) => e.message).join(', ')
      ).join('; ')
      toast.error(`Some files were rejected: ${rejectedReasons}`)
    }

    // Filter and process accepted image files
    const imageFiles = acceptedFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        return false
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`${file.name} is too large (max 10MB)`)
        return false
      }
      return true
    })
    
    if (imageFiles.length === 0) return

    const newImages: ImageWithId[] = imageFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file)
    }))
    
    setImages(prev => [...prev, ...newImages])
    setError(null)
    
    toast.success(`${newImages.length} image${newImages.length > 1 ? 's' : ''} added successfully`)
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB per file
    maxFiles: 20, // Maximum 20 files
    noClick: false,
    noKeyboard: false
  })

  const removeImage = (imageId: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== imageId)
      // Clean up object URLs
      const removed = prev.find(img => img.id === imageId)
      if (removed) {
        URL.revokeObjectURL(removed.preview)
      }
      return updated
    })
  }

  const moveImage = (imageId: string, direction: 'up' | 'down') => {
    setImages(prev => {
      const index = prev.findIndex(img => img.id === imageId)
      if (index === -1) return prev
      
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev
      
      const newImages = [...prev]
      const [movedImage] = newImages.splice(index, 1)
      newImages.splice(newIndex, 0, movedImage)
      
      return newImages
    })
  }

  const handleConvert = async () => {
    if (images.length === 0) {
      toast.error('Please select at least 1 image to convert')
      return
    }

    setIsConverting(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      images.forEach((imageWithId) => {
        formData.append('images', imageWithId.file, imageWithId.name)
      })

      const response = await apiRequest(getApiUrl('imageToPdf'), {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const blob = await response.blob()
      const fileName = `images-to-pdf-${images.length}-images-${Date.now()}.pdf`
      setConvertedBlob(blob)
      setConvertedFileName(fileName)
      
      toast.success('Images converted to PDF successfully! Click download to save the file.')

    } catch (error) {
      // Console output removed for production
      const errorMessage = error instanceof Error ? error.message : 'Conversion failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsConverting(false)
      setProgress(0)
    }
  }

  const resetForm = () => {
    // Clean up object URLs
    images.forEach(img => URL.revokeObjectURL(img.preview))
    setImages([])
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

  const totalSize = images.reduce((sum, img) => sum + img.size, 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Image to PDF Converter</h1>
        <p className="text-lg text-muted-foreground">
          Convert your images (JPG, PNG, GIF, etc.) to PDF documents with custom layout options
        </p>
      </div>

      <ApiStatus />

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            Upload Images
          </CardTitle>
          <CardDescription>
            Select multiple images to convert to PDF. You can reorder them by dragging or using arrow buttons.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Upload Area */}
          {images.length === 0 && (
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
                ${isDragActive && !isDragReject ? 'border-primary bg-primary/5 scale-105' : ''}
                ${isDragReject ? 'border-destructive bg-destructive/5' : ''}
                ${!isDragActive ? 'border-border hover:border-primary/50 hover:bg-muted/50' : ''}
              `}
            >
              <input {...getInputProps()} />
              <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
              {isDragActive ? (
                isDragReject ? (
                  <div className="space-y-2">
                    <p className="text-lg text-destructive">Only image files are allowed!</p>
                    <p className="text-sm text-muted-foreground">Please drop only image files</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-lg text-primary">Drop your images here...</p>
                    <p className="text-sm text-muted-foreground">Release to add images</p>
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  <p className="text-xl font-medium">Drag & drop your images here</p>
                  <p className="text-muted-foreground">
                    or click to browse files (select multiple images)
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-4">
                    <span>🖼️ JPG, PNG, GIF, WebP</span>
                    <span>📦 Max 10MB per image</span>
                    <span>🔢 Up to 20 images</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Selected Images Display */}
          {images.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Selected Images ({images.length})</h3>
                  <p className="text-sm text-muted-foreground">
                    Total size: {formatFileSize(totalSize)}
                  </p>
                </div>
                <Button variant="outline" onClick={resetForm}>
                  Clear All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className="group relative border rounded-lg p-3 bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                        {index + 1}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                          onClick={() => moveImage(image.id, 'up')}
                          disabled={index === 0}
                          title="Move up"
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                          onClick={() => moveImage(image.id, 'down')}
                          disabled={index === images.length - 1}
                          title="Move down"
                        >
                          ↓
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(image.id)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-60 hover:opacity-100 ml-auto"
                        title="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="aspect-video bg-muted rounded overflow-hidden mb-2">
                      <img 
                        src={image.preview} 
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <p className="font-medium text-sm truncate" title={image.name}>
                        {image.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(image.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <div
                  {...getRootProps()}
                  className="flex-1 border border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <input {...getInputProps()} />
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm font-medium">Add more images</span>
                  </div>
                </div>
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

          {/* Convert Action */}
          {images.length >= 1 && !convertedBlob && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Ready to Convert</h3>
                  <p className="text-muted-foreground text-sm">
                    {images.length} image{images.length > 1 ? 's' : ''} will be converted to PDF
                  </p>
                </div>
                <Button 
                  onClick={handleConvert} 
                  disabled={isConverting}
                  size="lg"
                  className="min-w-[140px]"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Convert to PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Download Success Section */}
          {convertedBlob && (
            <DownloadSuccessCard
              title="Images Converted Successfully!"
              description={`Your ${images.length} image${images.length > 1 ? 's have' : ' has'} been converted to a PDF document`}
              fileName={convertedFileName}
              downloadButtonText="Download PDF"
              resetButtonText="Convert More Images"
              onDownload={handleDownload}
              onReset={resetForm}
              icon={<FileImage className="h-5 w-5 text-green-600" />}
            />
          )}

          {/* Progress Bar */}
          {isConverting && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div>
                  <p className="font-medium">Converting images to PDF...</p>
                  <p className="text-sm text-muted-foreground">This may take a few moments</p>
                </div>
              </div>
              <Progress value={33} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features Section */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Multiple Formats</h3>
            <p className="text-sm text-muted-foreground">
              Supports JPG, PNG, GIF, WebP, and other popular image formats
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Custom Order</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop or use arrows to arrange images in your preferred order
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">High Quality</h3>
            <p className="text-sm text-muted-foreground">
              Maintains image quality while creating optimized PDF documents
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
