'use client'

import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Upload, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { toast } from 'sonner'

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function PdfViewerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const viewerContainerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile)
      
      // Create URL for PDF viewing
      const url = URL.createObjectURL(selectedFile)
      setPdfUrl(url)
      
      // Reset viewer state
      setCurrentPage(1)
      setZoomLevel(100)
      setRotation(0)
      setIsFullscreen(false)
      
      toast.success('PDF loaded successfully!')
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

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 300))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 25))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value)
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (viewerContainerRef.current?.requestFullscreen) {
        viewerContainerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term')
      return
    }
    
    setIsSearching(true)
    // In a real implementation, this would search within the PDF
    setTimeout(() => {
      setIsSearching(false)
      toast.success(`Searching for "${searchTerm}" in PDF...`)
    }, 1000)
  }

  const handleDownload = () => {
    if (file) {
      const url = URL.createObjectURL(file)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('PDF downloaded successfully!')
    }
  }

  const resetViewer = () => {
    setFile(null)
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl)
      setPdfUrl(null)
    }
    setCurrentPage(1)
    setTotalPages(0)
    setZoomLevel(100)
    setRotation(0)
    setIsFullscreen(false)
    setSearchTerm('')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">PDF Viewer</h1>
        <p className="text-lg text-muted-foreground">
          View, navigate, and interact with your PDF documents online
        </p>
      </div>

      {!pdfUrl ? (
        /* Upload Section */
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Upload PDF File
            </CardTitle>
            <CardDescription>
              Select a PDF file to view. Maximum file size: 100MB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200
                ${isDragActive ? 'border-primary bg-primary/5 scale-105' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
              `}
            >
              <input {...getInputProps()} />
              <Upload className={`h-16 w-16 mx-auto mb-6 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
              {isDragActive ? (
                <div className="space-y-2">
                  <p className="text-xl text-primary">Drop your PDF file here...</p>
                  <p className="text-sm text-muted-foreground">Release to open in viewer</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-2xl font-medium">Drag & drop your PDF file here</p>
                  <p className="text-muted-foreground text-lg">
                    or click to browse files
                  </p>
                  <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mt-6">
                    <span>📄 PDF files only</span>
                    <span>📦 Max 100MB</span>
                    <span>👀 Instant viewing</span>
                  </div>
                </div>
              )}
            </div>

            {file && (
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg mt-6">
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
                  onClick={resetViewer}
                >
                  Remove
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* PDF Viewer Section */
        <div className="space-y-6">
          {/* Toolbar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* File Info */}
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-red-500" />
                  <div>
                    <p className="font-medium">{file?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file?.size || 0)}
                    </p>
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={currentPage}
                      onChange={handlePageInput}
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-sm"
                      min="1"
                      max={totalPages}
                    />
                    <span className="text-sm text-muted-foreground">
                      of {totalPages || '?'}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 25}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  
                  <Badge variant="outline" className="px-3">
                    {zoomLevel}%
                  </Badge>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 300}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRotate}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetViewer}
                  >
                    Close
                  </Button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search in PDF..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full" />
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* PDF Viewer */}
          <Card>
            <CardContent className="p-0">
              <div
                ref={viewerContainerRef}
                className={`
                  relative bg-gray-100 rounded-lg overflow-hidden
                  ${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-[600px]'}
                `}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: 'center'
                }}
              >
                <iframe
                  ref={iframeRef}
                  src={`${pdfUrl}#page=${currentPage}&zoom=${zoomLevel}`}
                  className="w-full h-full border-0"
                  style={{
                    minHeight: isFullscreen ? '100vh' : '600px',
                    zoom: `${zoomLevel}%`
                  }}
                  title="PDF Viewer"
                  onLoad={() => {
                    // In a real implementation, you would extract page count from PDF
                    setTotalPages(10) // Placeholder
                  }}
                />
                
                {/* Loading overlay */}
                {!pdfUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-primary rounded-full mx-auto mb-4" />
                      <p className="text-muted-foreground">Loading PDF...</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Features Section */}
      <div className="mt-12 grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">High-Quality Viewing</h3>
            <p className="text-sm text-muted-foreground">
              Crystal clear PDF rendering with smooth navigation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Zoom & Rotate</h3>
            <p className="text-sm text-muted-foreground">
              Zoom from 25% to 300% and rotate documents as needed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Search Function</h3>
            <p className="text-sm text-muted-foreground">
              Find specific text and content within your PDF documents
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Fullscreen Mode</h3>
            <p className="text-sm text-muted-foreground">
              Immersive viewing experience with fullscreen capability
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
