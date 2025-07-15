'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { FileText, Upload, Edit3, AlertCircle, Loader2, Type, Image, Square, Circle, Minus } from 'lucide-react'
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

interface EditOperation {
  type: 'text' | 'image' | 'shape' | 'annotation'
  data: any
}

export default function PdfEditorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [editedBlob, setEditedBlob] = useState<Blob | null>(null)
  const [editedFileName, setEditedFileName] = useState<string>('')
  const [editOperations, setEditOperations] = useState<EditOperation[]>([])
  const [activeTab, setActiveTab] = useState('text')

  // Text editing state
  const [textToAdd, setTextToAdd] = useState('')
  const [textSize, setTextSize] = useState('12')
  const [textColor, setTextColor] = useState('#000000')
  const [textX, setTextX] = useState('100')
  const [textY, setTextY] = useState('100')
  const [textPage, setTextPage] = useState('1')

  // Shape editing state
  const [shapeType, setShapeType] = useState<'rectangle' | 'circle' | 'line'>('rectangle')
  const [shapeColor, setShapeColor] = useState('#000000')
  const [shapeX, setShapeX] = useState('100')
  const [shapeY, setShapeY] = useState('100')
  const [shapeWidth, setShapeWidth] = useState('100')
  const [shapeHeight, setShapeHeight] = useState('50')
  const [shapePage, setShapePage] = useState('1')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setEditedBlob(null)
      setEditedFileName('')
      setEditOperations([])
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

  const addTextOperation = () => {
    if (!textToAdd.trim()) {
      toast.error('Please enter text to add')
      return
    }

    const operation: EditOperation = {
      type: 'text',
      data: {
        text: textToAdd,
        x: parseInt(textX),
        y: parseInt(textY),
        size: parseInt(textSize),
        color: textColor,
        page: parseInt(textPage)
      }
    }

    setEditOperations([...editOperations, operation])
    toast.success('Text annotation added to edit queue')
    
    // Reset form
    setTextToAdd('')
    setTextX('100')
    setTextY('100')
  }

  const addShapeOperation = () => {
    const operation: EditOperation = {
      type: 'shape',
      data: {
        shapeType,
        x: parseInt(shapeX),
        y: parseInt(shapeY),
        width: parseInt(shapeWidth),
        height: parseInt(shapeHeight),
        color: shapeColor,
        page: parseInt(shapePage)
      }
    }

    setEditOperations([...editOperations, operation])
    toast.success(`${shapeType} shape added to edit queue`)
    
    // Reset form
    setShapeX('100')
    setShapeY('100')
  }

  const removeOperation = (index: number) => {
    const newOperations = editOperations.filter((_, i) => i !== index)
    setEditOperations(newOperations)
    toast.success('Edit operation removed')
  }

  const handleEdit = async () => {
    if (!file) return
    
    if (editOperations.length === 0) {
      toast.error('Please add at least one edit operation')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('operations', JSON.stringify(editOperations))

      const response = await apiRequest(getApiUrl('pdfEditor'), {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const result = await response.blob()
      
      // Generate filename
      const filename = file.name.replace(/\.pdf$/i, '-edited.pdf')
      setEditedBlob(result)
      setEditedFileName(filename)
      
      toast.success(`PDF edited successfully! ${editOperations.length} edits applied. Click download to save.`)

    } catch (error) {
      console.error('Edit error:', error)
      const errorMessage = error instanceof Error ? error.message : 'PDF editing failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const resetForm = () => {
    setFile(null)
    setError(null)
    setProgress(0)
    setEditedBlob(null)
    setEditedFileName('')
    setEditOperations([])
    setTextToAdd('')
    setTextX('100')
    setTextY('100')
    setShapeX('100')
    setShapeY('100')
  }

  const handleDownload = () => {
    if (editedBlob && editedFileName) {
      downloadBlob(editedBlob, editedFileName)
      toast.success('File downloaded successfully!')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">PDF Editor</h1>
        <p className="text-lg text-muted-foreground">
          Add text, shapes, and annotations to your PDF documents
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - File Upload & Edit Queue */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Upload PDF File
              </CardTitle>
              <CardDescription>
                Select a PDF file to edit. Maximum file size: 100MB
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
                      <span>✏️ Full editing</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected File Display */}
              {file && (
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg mt-4">
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
            </CardContent>
          </Card>

          {/* Edit Queue */}
          {editOperations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Queue ({editOperations.length})</CardTitle>
                <CardDescription>
                  Pending edit operations to be applied
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {editOperations.map((operation, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        {operation.type === 'text' && <Type className="h-4 w-4" />}
                        {operation.type === 'shape' && <Square className="h-4 w-4" />}
                        <div>
                          <p className="text-sm font-medium">
                            {operation.type === 'text' && `Text: "${operation.data.text}"`}
                            {operation.type === 'shape' && `Shape: ${operation.data.shapeType}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Page {operation.data.page} • Position ({operation.data.x}, {operation.data.y})
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeOperation(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Edit Tools */}
        <div className="space-y-6">
          {file && !editedBlob && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Tools</CardTitle>
                <CardDescription>
                  Add text, shapes, and annotations to your PDF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text" className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="shapes" className="flex items-center gap-2">
                      <Square className="h-4 w-4" />
                      Shapes
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="textToAdd">Text Content</Label>
                        <textarea
                          id="textToAdd"
                          value={textToAdd}
                          onChange={(e) => setTextToAdd(e.target.value)}
                          placeholder="Enter text to add..."
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary min-h-[80px]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="textSize">Font Size</Label>
                          <input
                            id="textSize"
                            type="number"
                            value={textSize}
                            onChange={(e) => setTextSize(e.target.value)}
                            min="8"
                            max="72"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <Label htmlFor="textColor">Text Color</Label>
                          <input
                            id="textColor"
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="mt-1 block w-full h-10 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor="textX">X Position</Label>
                          <input
                            id="textX"
                            type="number"
                            value={textX}
                            onChange={(e) => setTextX(e.target.value)}
                            min="0"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <Label htmlFor="textY">Y Position</Label>
                          <input
                            id="textY"
                            type="number"
                            value={textY}
                            onChange={(e) => setTextY(e.target.value)}
                            min="0"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <Label htmlFor="textPage">Page</Label>
                          <input
                            id="textPage"
                            type="number"
                            value={textPage}
                            onChange={(e) => setTextPage(e.target.value)}
                            min="1"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                      </div>

                      <Button onClick={addTextOperation} className="w-full">
                        <Type className="h-4 w-4 mr-2" />
                        Add Text
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="shapes" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label>Shape Type</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <Button
                            variant={shapeType === 'rectangle' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setShapeType('rectangle')}
                          >
                            <Square className="h-4 w-4 mr-1" />
                            Rectangle
                          </Button>
                          <Button
                            variant={shapeType === 'circle' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setShapeType('circle')}
                          >
                            <Circle className="h-4 w-4 mr-1" />
                            Circle
                          </Button>
                          <Button
                            variant={shapeType === 'line' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setShapeType('line')}
                          >
                            <Minus className="h-4 w-4 mr-1" />
                            Line
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="shapeColor">Shape Color</Label>
                        <input
                          id="shapeColor"
                          type="color"
                          value={shapeColor}
                          onChange={(e) => setShapeColor(e.target.value)}
                          className="mt-1 block w-full h-10 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="shapeX">X Position</Label>
                          <input
                            id="shapeX"
                            type="number"
                            value={shapeX}
                            onChange={(e) => setShapeX(e.target.value)}
                            min="0"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <Label htmlFor="shapeY">Y Position</Label>
                          <input
                            id="shapeY"
                            type="number"
                            value={shapeY}
                            onChange={(e) => setShapeY(e.target.value)}
                            min="0"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor="shapeWidth">Width</Label>
                          <input
                            id="shapeWidth"
                            type="number"
                            value={shapeWidth}
                            onChange={(e) => setShapeWidth(e.target.value)}
                            min="1"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <Label htmlFor="shapeHeight">Height</Label>
                          <input
                            id="shapeHeight"
                            type="number"
                            value={shapeHeight}
                            onChange={(e) => setShapeHeight(e.target.value)}
                            min="1"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <Label htmlFor="shapePage">Page</Label>
                          <input
                            id="shapePage"
                            type="number"
                            value={shapePage}
                            onChange={(e) => setShapePage(e.target.value)}
                            min="1"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                      </div>

                      <Button onClick={addShapeOperation} className="w-full">
                        {shapeType === 'rectangle' && <Square className="h-4 w-4 mr-2" />}
                        {shapeType === 'circle' && <Circle className="h-4 w-4 mr-2" />}
                        {shapeType === 'line' && <Minus className="h-4 w-4 mr-2" />}
                        Add {shapeType}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
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
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing PDF edits...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Download Success Section */}
          {editedBlob && (
            <DownloadSuccessCard
              title="PDF Edited Successfully!"
              description={`Applied ${editOperations.length} edit operations to your PDF`}
              fileName={editedFileName}
              downloadButtonText="Download Edited PDF"
              resetButtonText="Edit Another File"
              onDownload={handleDownload}
              onReset={resetForm}
              icon={<Edit3 className="h-5 w-5 text-green-600" />}
            />
          )}

          {/* Edit Button */}
          {file && !editedBlob && editOperations.length > 0 && (
            <div className="flex justify-center">
              <Button
                onClick={handleEdit}
                disabled={isProcessing}
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
                    <Edit3 className="h-4 w-4 mr-2" />
                    Apply Edits ({editOperations.length})
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Text Annotations</h3>
            <p className="text-sm text-muted-foreground">
              Add custom text with different fonts, sizes, and colors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Shape Drawing</h3>
            <p className="text-sm text-muted-foreground">
              Insert rectangles, circles, and lines for highlighting and marking
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Precise Positioning</h3>
            <p className="text-sm text-muted-foreground">
              Control exact placement of elements with coordinate positioning
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
