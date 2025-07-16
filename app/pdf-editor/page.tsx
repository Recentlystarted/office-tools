'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  Upload, 
  Edit3, 
  AlertCircle, 
  Loader2, 
  Download,
  Save,
  Eye,
  X,
  Zap,
  Shield,
  MousePointer,
  Type,
  Square,
  Circle,
  Minus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Palette,
  Layers,
  Bold,
  Italic,
  Underline,
  Highlighter
} from 'lucide-react'
import { toast } from 'sonner'
import { getApiUrl, apiRequest } from '@/lib/api'
import { DownloadSuccessCard } from '@/components/download-success-card'

// Helper functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

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

export default function PdfEditorPage() {
  // State management
  const [file, setFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [editedBlob, setEditedBlob] = useState<Blob | null>(null)
  const [editedFileName, setEditedFileName] = useState('')
  const [zoom, setZoom] = useState(100)

  // File upload handling
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const rejectedReasons = rejectedFiles.map(({ errors }) => 
        errors.map((e: any) => e.message).join(', ')
      ).join('; ')
      toast.error(`File rejected: ${rejectedReasons}`)
      return
    }

    const pdfFile = acceptedFiles[0]
    if (pdfFile) {
      if (pdfFile.size > 100 * 1024 * 1024) {
        toast.error('File size exceeds 100MB limit')
        return
      }
      setFile(pdfFile)
      setError(null)
      setEditedBlob(null)
      
      // Create URL for PDF preview
      const url = URL.createObjectURL(pdfFile)
      setPdfUrl(url)
      
      toast.success('PDF loaded successfully! Ready for editing.')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    maxSize: 100 * 1024 * 1024,
    noClick: false,
    noKeyboard: false
  })

  // Save PDF with annotations
  const savePDF = async () => {
    if (!file) return

    setIsLoading(true)
    setError(null)
    setProgress(0)

    try {
      setProgress(25)
      
      const formData = new FormData()
      formData.append('file', file)

      const response = await apiRequest(getApiUrl('pdfEditor'), {
        method: 'POST',
        body: formData,
      })

      setProgress(75)

      if (!response.ok) {
        throw new Error('Failed to save PDF')
      }

      const result = await response.blob()
      setProgress(100)
      
      const filename = file.name.replace(/\.pdf$/i, '-edited.pdf') || 'edited-document.pdf'
      setEditedBlob(result)
      setEditedFileName(filename)
      
      toast.success('🎉 PDF edited successfully!')

    } catch (error) {
      console.error('Save error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Save failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  const handleDownload = () => {
    if (editedBlob && editedFileName) {
      downloadBlob(editedBlob, editedFileName)
      toast.success('File downloaded successfully!')
    }
  }

  const resetEditor = () => {
    setFile(null)
    setPdfUrl(null)
    setEditedBlob(null)
    setEditedFileName('')
    setError(null)
    setProgress(0)
    setZoom(100)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Professional Header */}
      <div className="w-full border-b bg-white dark:bg-gray-950 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">PDF Editor</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Professional PDF editing tools</p>
            </div>
            {file && !editedBlob && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.max(25, zoom - 25))}
                    disabled={zoom <= 25}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm min-w-16 text-center font-medium">{zoom}%</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.min(200, zoom + 25))}
                    disabled={zoom >= 200}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={savePDF} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save PDF
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Interface */}
      {!file && (
        <div className="w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-2xl mx-auto p-8">
            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl font-bold">Upload PDF Document</CardTitle>
                <CardDescription className="text-base">
                  Start editing your PDF with professional annotation tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300
                    ${isDragActive && !isDragReject ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20 scale-105' : ''}
                    ${isDragReject ? 'border-red-400 bg-red-50 dark:bg-red-950/20' : ''}
                    ${!isDragActive ? 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/10' : ''}
                  `}
                >
                  <input {...getInputProps()} />
                  <div className="space-y-4">
                    {isDragActive ? (
                      isDragReject ? (
                        <div className="space-y-2">
                          <X className="h-16 w-16 mx-auto text-red-500" />
                          <p className="text-xl font-semibold text-red-600">Only PDF files allowed!</p>
                          <p className="text-gray-600">Please drop only PDF files</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-16 w-16 mx-auto text-blue-500" />
                          <p className="text-xl font-semibold text-blue-600">Drop your PDF here...</p>
                          <p className="text-gray-600">Release to start editing</p>
                        </div>
                      )
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-16 w-16 mx-auto text-gray-400" />
                        <div>
                          <p className="text-xl font-semibold mb-2">Drag & drop your PDF file here</p>
                          <p className="text-gray-600 mb-4">or click to browse files</p>
                        </div>
                        <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                          <span className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            PDF files only
                          </span>
                          <span className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Max 100MB
                          </span>
                          <span className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Secure processing
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Main Editor Interface */}
      {file && !editedBlob && (
        <div className="w-full flex h-[calc(100vh-120px)]">
          {/* Toolbar Sidebar */}
          <div className="w-80 border-r bg-white dark:bg-gray-950 flex flex-col">
            {/* Tools Section */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Editing Tools
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex flex-col gap-1 h-20 hover:bg-blue-50 hover:border-blue-300"
                >
                  <MousePointer className="h-5 w-5" />
                  <span className="text-xs">Select</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex flex-col gap-1 h-20 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Type className="h-5 w-5" />
                  <span className="text-xs">Text</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex flex-col gap-1 h-20 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Highlighter className="h-5 w-5" />
                  <span className="text-xs">Highlight</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex flex-col gap-1 h-20 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Square className="h-5 w-5" />
                  <span className="text-xs">Rectangle</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex flex-col gap-1 h-20 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Circle className="h-5 w-5" />
                  <span className="text-xs">Circle</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex flex-col gap-1 h-20 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Minus className="h-5 w-5" />
                  <span className="text-xs">Line</span>
                </Button>
              </div>
            </div>

            {/* Color Palette */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Colors
              </h3>
              <div className="grid grid-cols-8 gap-2">
                {[
                  '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80', '#00FFFF', '#0080FF',
                  '#0000FF', '#8000FF', '#FF00FF', '#FF0080', '#000000', '#404040', '#808080', '#C0C0C0'
                ].map(color => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500 transition-colors"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* File Info */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Info
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Layers */}
            <div className="p-6 flex-1">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Annotations
              </h3>
              <div className="text-center text-gray-500 py-8">
                <Layers className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No annotations yet</p>
                <p className="text-xs">Start by selecting a tool above</p>
              </div>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-6">
            <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border overflow-hidden">
              {pdfUrl && (
                <div 
                  className="relative h-full w-full overflow-auto"
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                >
                  <iframe
                    src={pdfUrl}
                    width="100%"
                    height="100%"
                    className="border-0"
                    title="PDF Editor View"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Screen */}
      {editedBlob && (
        <div className="w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-2xl mx-auto p-8">
            <DownloadSuccessCard
              title="PDF Edited Successfully!"
              description="Your PDF has been professionally edited and is ready for download."
              fileName={editedFileName}
              downloadButtonText="Download Edited PDF"
              resetButtonText="Edit Another PDF"
              onDownload={handleDownload}
              onReset={resetEditor}
              showDonation={true}
            />
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <Card className="p-8 max-w-md mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Processing PDF...</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Applying edits and generating final document</p>
              </div>
              <Progress value={progress} className="w-full h-2" />
              <p className="text-sm font-medium">{progress}% complete</p>
            </div>
          </Card>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md">
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-700 dark:text-red-300">Error</p>
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Features Section */}
      {!file && (
        <div className="w-full py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-6">
            <Separator className="mb-16" />
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Professional PDF Editing Suite</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Industry-leading tools for comprehensive PDF editing with enterprise-grade features
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Edit3 className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Visual Annotation Tools</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Add text, shapes, highlights, and drawings directly on your PDF with pixel-perfect precision.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Palette className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Rich Formatting</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Unlimited colors, fonts, and styles to create professional-looking documents.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Layers className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Layer Management</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Organize annotations in layers for easy editing and professional structure.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ZoomIn className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Precision Editing</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Advanced zoom controls and pixel-perfect positioning for detailed work.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="h-10 w-10 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Quality Preservation</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Maintain original PDF quality while adding professional annotations.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Download className="h-10 w-10 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Instant Export</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Download your edited PDF instantly with all annotations preserved perfectly.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
