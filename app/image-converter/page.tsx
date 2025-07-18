'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { getApiUrl, apiRequest, ApiError } from '@/lib/api'
import { generateStructuredData } from '@/lib/seo'
import ApiStatus from '@/components/api-status'
import { 
  ImageIcon, 
  Upload, 
  RefreshCw, 
  AlertCircle, 
  Loader2, 
  Settings,
  Download,
  X
} from 'lucide-react'
import { toast } from 'sonner'

// Structured Data for SEO
const structuredData = generateStructuredData('image-converter')

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

// Helper function to get file extension
const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || ''
}

interface ConvertedFile {
  blob: Blob
  filename: string
  originalName: string
}

export default function ImageConverterPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([])
  const [outputFormat, setOutputFormat] = useState<'jpg' | 'png' | 'webp' | 'gif' | 'bmp' | 'tiff' | 'svg' | 'ico'>('jpg')
  const [quality, setQuality] = useState([85])
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [resizeWidth, setResizeWidth] = useState('')
  const [resizeHeight, setResizeHeight] = useState('')

  const supportedFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg', 'ico']
  
  // Get unique input formats from selected files
  const getInputFormats = () => {
    const formats = new Set<string>()
    files.forEach(file => {
      const ext = getFileExtension(file.name)
      if (ext) formats.add(ext)
    })
    return Array.from(formats)
  }

  // Check if conversion makes sense (not same format)
  const isValidConversion = () => {
    if (files.length === 0) return false
    const inputFormats = getInputFormats()
    // Allow conversion if we have multiple input formats OR output format is different from all inputs
    return inputFormats.length > 1 || !inputFormats.includes(outputFormat) || inputFormats.includes('jpeg') && outputFormat === 'jpg'
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => {
      const extension = getFileExtension(file.name)
      return supportedFormats.includes(extension)
    })

    if (imageFiles.length !== acceptedFiles.length) {
      toast.error('Some files were rejected. Only image files are supported.')
    }

    setFiles(prev => [...prev, ...imageFiles])
    setError(null)
    setConvertedFiles([])
    
    if (imageFiles.length > 0) {
      toast.success(`${imageFiles.length} image(s) added for conversion`)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.svg']
    },
    maxFiles: 20,
    maxSize: 50 * 1024 * 1024, // 50MB per file
  })

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleConvert = async () => {
    if (files.length === 0) return

    setIsConverting(true)
    setProgress(0)
    setError(null)
    setConvertedFiles([])

    try {
      const formData = new FormData()
      
      files.forEach((file, index) => {
        formData.append(`files`, file)
      })
      
      formData.append('output_format', outputFormat)
      formData.append('quality', quality[0].toString())
      formData.append('maintain_aspect_ratio', maintainAspectRatio.toString())
      
      if (resizeWidth) formData.append('width', resizeWidth)
      if (resizeHeight) formData.append('height', resizeHeight)

      const response = await apiRequest(getApiUrl('imageConverter'), {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      // Check if response is a zip file (multiple files) or single file
      const contentType = response.headers.get('content-type')
      const result = await response.blob()
      
      if (files.length === 1) {
        // Single file conversion
        const originalName = files[0].name
        const nameWithoutExt = originalName.split('.').slice(0, -1).join('.')
        const filename = `${nameWithoutExt}.${outputFormat}`
        
        setConvertedFiles([{
          blob: result,
          filename,
          originalName
        }])
      } else {
        // Multiple files - always return as zip to avoid browser blocking
        const filename = `converted-images-${outputFormat}.zip`
        setConvertedFiles([{
          blob: result,
          filename,
          originalName: 'multiple files'
        }])
      }
      
      toast.success(`${files.length} image(s) converted successfully to ${outputFormat.toUpperCase()}!`)

    } catch (error) {
      // Console output removed for production
      const errorMessage = error instanceof Error ? error.message : 'Image conversion failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsConverting(false)
      setProgress(0)
    }
  }

  const resetForm = () => {
    setFiles([])
    setError(null)
    setProgress(0)
    setConvertedFiles([])
    setResizeWidth('')
    setResizeHeight('')
  }

  const handleDownload = (convertedFile: ConvertedFile) => {
    downloadBlob(convertedFile.blob, convertedFile.filename)
    toast.success('File downloaded successfully!')
  }

  const handleDownloadAll = () => {
    convertedFiles.forEach(file => {
      setTimeout(() => downloadBlob(file.blob, file.filename), 100)
    })
    toast.success('All files downloaded successfully!')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="text-center mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 lg:mb-4">Image Converter</h1>
        <p className="text-base lg:text-lg text-muted-foreground px-4">
          Convert images between different formats - JPG, PNG, WebP, GIF, BMP, TIFF, SVG, and ICO
        </p>
      </div>

      <ApiStatus />

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column - Upload & Files */}
        <div className="space-y-4 lg:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Upload Image Files
              </CardTitle>
              <CardDescription>
                Select up to 20 image files to convert. Maximum 50MB per file.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                    <p className="text-lg text-primary">Drop your image files here...</p>
                    <p className="text-sm text-muted-foreground">Release to select files</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xl font-medium">Drag & drop image files here</p>
                    <p className="text-muted-foreground">
                      or click to browse files
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-4">
                      <span>🖼️ Multiple formats</span>
                      <span>📦 Up to 20 files</span>
                      <span>🔄 Batch conversion</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Files Display */}
              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Selected Files ({files.length})</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFiles([])}
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <ImageIcon className="h-6 w-6 text-blue-500" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{formatFileSize(file.size)}</span>
                            <Badge variant="secondary" className="text-xs">
                              {getFileExtension(file.name).toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Conversion Settings */}
        <div className="space-y-4 lg:space-y-6">
          {files.length > 0 && convertedFiles.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Conversion Settings
                </CardTitle>
                <CardDescription>
                  Configure output format and quality settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Format Conversion Overview */}
                {files.length > 0 && (
                  <div className="mb-4 lg:mb-6 p-3 sm:p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium mb-2 text-sm sm:text-base">Conversion Preview</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                      <span className="font-medium">From:</span>
                      <div className="flex flex-wrap gap-1">
                        {getInputFormats().map(format => (
                          <Badge key={format} variant="outline" className="text-xs">
                            {format.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                      <span className="hidden sm:inline mx-2">→</span>
                      <span className="sm:hidden text-center py-1">↓</span>
                      <span className="font-medium">To:</span>
                      <Badge variant="default" className="text-xs">
                        {outputFormat.toUpperCase()}
                      </Badge>
                    </div>
                    {!isValidConversion() && (
                      <p className="text-amber-600 text-sm mt-2 flex items-start gap-1">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>Select a different output format - converting to the same format is not needed</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Output Format */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Output Format</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3">
                    {[
                      { value: 'jpg', label: 'JPG', description: 'Small file size' },
                      { value: 'png', label: 'PNG', description: 'With transparency' },
                      { value: 'webp', label: 'WebP', description: 'Modern format' },
                      { value: 'gif', label: 'GIF', description: 'Animated images' },
                      { value: 'bmp', label: 'BMP', description: 'Uncompressed' },
                      { value: 'tiff', label: 'TIFF', description: 'High quality' },
                      { value: 'svg', label: 'SVG', description: 'Vector graphics' },
                      { value: 'ico', label: 'ICO', description: 'Icon format' }
                    ].map((format) => {
                      const isSelected = outputFormat === format.value
                      const isInputFormat = getInputFormats().includes(format.value)
                      const isDisabled = files.length > 0 && isInputFormat && getInputFormats().length === 1
                      
                      return (
                        <Button
                          key={format.value}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          disabled={isDisabled}
                          className={`p-2 sm:p-3 h-auto flex flex-col items-center justify-center space-y-1 relative min-h-[80px] text-center ${
                            isSelected ? 'ring-2 ring-primary' : ''
                          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => !isDisabled && setOutputFormat(format.value as any)}
                        >
                          {isInputFormat && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                          )}
                          <span className="font-medium text-sm">{format.label}</span>
                          <span className="text-xs text-muted-foreground text-center hidden sm:block">
                            {format.description}
                          </span>
                          {isDisabled && (
                            <span className="text-xs text-amber-600 dark:text-amber-400 hidden sm:block">Source format</span>
                          )}
                        </Button>
                      )
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      Blue dot indicates your source format(s)
                    </span>
                  </p>
                </div>

                {/* Quality Setting */}
                {(outputFormat === 'jpg' || outputFormat === 'webp') && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      Quality: {quality[0]}%
                    </Label>
                    <Slider
                      value={quality}
                      onValueChange={setQuality}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Lower size</span>
                      <span>Higher quality</span>
                    </div>
                  </div>
                )}

                {/* Resize Options */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Resize (Optional)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="width" className="text-sm">Width (px)</Label>
                      <Input
                        id="width"
                        type="number"
                        value={resizeWidth}
                        onChange={(e) => setResizeWidth(e.target.value)}
                        placeholder="Auto"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-sm">Height (px)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={resizeHeight}
                        onChange={(e) => setResizeHeight(e.target.value)}
                        placeholder="Auto"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="aspectRatio"
                      checked={maintainAspectRatio}
                      onCheckedChange={(checked) => setMaintainAspectRatio(checked as boolean)}
                    />
                    <Label htmlFor="aspectRatio" className="text-sm">
                      Maintain aspect ratio
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                <span>Converting images...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Download Success Section */}
          {convertedFiles.length > 0 && (
            <div className="space-y-4">
              {convertedFiles.length === 1 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <RefreshCw className="h-5 w-5" />
                      Image Converted Successfully!
                    </CardTitle>
                    <CardDescription>
                      Converted to {outputFormat.toUpperCase()} format
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">File ready for download:</p>
                      <p className="text-sm font-mono break-all">{convertedFiles[0].filename}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button onClick={() => handleDownload(convertedFiles[0])} className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download Converted Image
                      </Button>
                      <Button variant="outline" onClick={resetForm} className="flex-1 sm:flex-none">
                        Convert More Images
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <RefreshCw className="h-5 w-5" />
                      Images Converted Successfully!
                    </CardTitle>
                    <CardDescription>
                      {files.length} images converted to {outputFormat.toUpperCase()} format
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button onClick={handleDownloadAll} className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download All ({convertedFiles.length})
                      </Button>
                      <Button variant="outline" onClick={resetForm} className="flex-1 sm:flex-none">
                        Convert More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Convert Button */}
          {files.length > 0 && convertedFiles.length === 0 && (
            <div className="flex justify-center px-4">
              <Button
                onClick={handleConvert}
                disabled={isConverting || !isValidConversion()}
                size="lg"
                className="w-full sm:w-auto min-w-[200px] max-w-sm"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span className="hidden sm:inline">Converting...</span>
                    <span className="sm:hidden">Converting...</span>
                  </>
                ) : !isValidConversion() ? (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Choose Different Format</span>
                    <span className="sm:hidden">Choose Different Format</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Convert to {outputFormat.toUpperCase()} ({files.length})</span>
                    <span className="sm:hidden">Convert ({files.length})</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-8 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Multiple Formats</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Support for JPG, PNG, WebP, GIF, BMP, TIFF, SVG, and ICO formats
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Batch Processing</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Convert up to 20 images at once with bulk download
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Quality Control</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Adjust compression quality and resize images as needed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Fast & Reliable</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              High-speed conversion with maintained image quality
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
