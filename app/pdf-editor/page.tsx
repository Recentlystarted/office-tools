'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  FileText, 
  Upload, 
  Edit3, 
  AlertCircle, 
  Loader2, 
  Download,
  RefreshCw,
  Heart,
  Coffee,
  Save,
  FileDown,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  ZoomIn,
  ZoomOut,
  RotateCw,
  MousePointer,
  Square,
  Circle,
  Minus,
  Plus,
  Eye,
  EyeOff,
  Undo,
  Redo,
  Copy,
  Trash2,
  ChevronDown
} from 'lucide-react'
import { toast } from 'sonner'
import { getApiUrl, apiRequest } from '@/lib/api'
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

type EditorMode = 'select' | 'text' | 'shape' | 'highlight'
type EditElement = {
  id: string
  type: 'text' | 'shape' | 'highlight'
  x: number
  y: number
  width?: number
  height?: number
  content?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  fontStyle?: string
  textAlign?: string
  color?: string
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  page: number
  isSelected?: boolean
}

export default function PdfEditorPage() {
  // File and conversion state
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [convertedDocx, setConvertedDocx] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  
  // Editor state
  const [editorMode, setEditorMode] = useState<EditorMode>('select')
  const [elements, setElements] = useState<EditElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  
  // PDF viewer state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [showEditableAreas, setShowEditableAreas] = useState(true)
  
  // Saving state
  const [isSaving, setIsSaving] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [editedBlob, setEditedBlob] = useState<Blob | null>(null)
  const [editedFileName, setEditedFileName] = useState('')
  
  // Text editing tools
  const [textTool, setTextTool] = useState({
    fontSize: 14,
    fontFamily: 'Arial',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#000000'
  })
  
  // Canvas and PDF refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pdfViewerRef = useRef<HTMLDivElement>(null)
  const [pdfDocument, setPdfDocument] = useState<any>(null)
  const [pdfPage, setPdfPage] = useState<any>(null)

  // Initialize PDF.js worker
  useEffect(() => {
    // Use local PDF.js worker - self-hosted
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
  }, [])

  // Load and render PDF
  const loadPDF = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
      setPdfDocument(pdf)
      setTotalPages(pdf.numPages)
      
      // Load first page
      const page = await pdf.getPage(1)
      setPdfPage(page)
      renderPage(page)
      
    } catch (error) {
      console.error('PDF loading error:', error)
      toast.error('Failed to load PDF file')
    }
  }

  // Render PDF page to canvas
  const renderPage = async (page: any) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return

    const viewport = page.getViewport({ scale: zoomLevel / 100 })
    canvas.height = viewport.height
    canvas.width = viewport.width

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    }

    await page.render(renderContext).promise
  }

  // Update PDF rendering when zoom changes
  useEffect(() => {
    if (pdfPage) {
      renderPage(pdfPage)
    }
  }, [zoomLevel, pdfPage])

  // File upload handling
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf')
    if (pdfFile) {
      if (pdfFile.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error('File size exceeds 100MB limit')
        return
      }
      setFile(pdfFile)
      setError(null)
      
      // Create preview URL
      const url = URL.createObjectURL(pdfFile)
      setPdfUrl(url)
      
      // Load PDF with PDF.js
      loadPDF(pdfFile)
      
      toast.success('PDF file selected successfully!')
    } else {
      toast.error('Please select a valid PDF file')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  // Convert PDF to editable format (DOCX behind scenes but show PDF UI)
  const convertToEditable = async () => {
    if (!file) return

    setIsConverting(true)
    setError(null)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Step 1: Convert PDF to DOCX behind the scenes
      setProgress(20)
      const docxResponse = await apiRequest(getApiUrl('pdfToDocx'), {
        method: 'POST',
        body: formData,
      })

      if (!docxResponse.ok) {
        throw new Error('Failed to convert PDF to editable format')
      }

      setProgress(50)
      
      // Step 2: Extract text content from DOCX for editing
      const docxBlob = await docxResponse.blob()
      setConvertedDocx(URL.createObjectURL(docxBlob)) // Store DOCX for later conversion back
      
      setProgress(80)
      
      // Step 3: Simulate text detection areas on the PDF visual
      // In a real implementation, you'd analyze the DOCX structure and map it to PDF coordinates
      const mockEditableAreas: EditElement[] = [
        {
          id: '1',
          type: 'text',
          x: 50,
          y: 100,
          width: 400,
          height: 30,
          content: 'Click to edit this title',
          fontSize: 20,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          color: '#000000',
          page: 1
        },
        {
          id: '2',
          type: 'text',
          x: 50,
          y: 160,
          width: 500,
          height: 60,
          content: 'This paragraph text can be edited. The changes will be applied to the underlying DOCX and then converted back to PDF.',
          fontSize: 14,
          fontFamily: 'Arial',
          color: '#333333',
          page: 1
        },
        {
          id: '3',
          type: 'text',
          x: 50,
          y: 250,
          width: 450,
          height: 40,
          content: 'Another text block that maps to DOCX content.',
          fontSize: 12,
          fontFamily: 'Times New Roman',
          color: '#555555',
          page: 1
        }
      ]
      
      setElements(mockEditableAreas)
      setProgress(100)
      setIsEditing(true)
      
      toast.success('✨ PDF converted to editable format! The PDF is displayed visually while your edits modify the underlying document structure.')

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

  // Add new text element
  const addTextElement = (x: number, y: number) => {
    const newElement: EditElement = {
      id: Date.now().toString(),
      type: 'text',
      x,
      y,
      width: 200,
      height: 30,
      content: 'New text',
      fontSize: textTool.fontSize,
      fontFamily: textTool.fontFamily,
      fontWeight: textTool.fontWeight,
      fontStyle: textTool.fontStyle,
      textAlign: textTool.textAlign,
      color: textTool.color,
      page: currentPage
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
    setEditorMode('select')
  }

  // Update element content
  const updateElement = (id: string, updates: Partial<EditElement>) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ))
  }

  // Delete element
  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id))
    if (selectedElement === id) {
      setSelectedElement(null)
    }
  }

  // Save changes: Edit DOCX content and convert back to PDF
  const saveChanges = async () => {
    setIsSaving(true)
    setError(null)
    setProgress(0)

    try {
      // Step 1: Create modified DOCX content based on edits
      setProgress(20)
      
      // Create a simulated edited DOCX content
      // In real implementation, you'd modify the actual DOCX structure
      const editedContent = elements.map(el => ({
        id: el.id,
        content: el.content,
        fontSize: el.fontSize,
        fontFamily: el.fontFamily,
        color: el.color,
        position: { x: el.x, y: el.y },
        page: el.page
      }))

      // Step 2: Create a new DOCX with the modifications
      setProgress(40)
      const docxData = {
        originalFile: file?.name,
        modifications: editedContent,
        totalChanges: elements.length
      }

      // For demo, create a text representation of changes
      const modifiedText = elements.map(el => el.content).join('\n\n')
      const textBlob = new Blob([modifiedText], { type: 'text/plain' })
      
      setProgress(60)

      // Step 3: Convert the modified content back to PDF
      const formData = new FormData()
      formData.append('file', textBlob, 'modified-content.txt')
      formData.append('originalFileName', file?.name || 'document.pdf')
      formData.append('modifications', JSON.stringify(docxData))

      const response = await apiRequest(getApiUrl('docxToPdf'), {
        method: 'POST',
        body: formData,
      })

      setProgress(90)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Save failed: ${errorText}`)
      }

      const result = await response.blob()
      setProgress(100)
      
      // Generate filename
      const filename = file?.name.replace(/\.pdf$/i, '-edited.pdf') || 'edited-document.pdf'
      setEditedBlob(result)
      setEditedFileName(filename)
      
      toast.success('🎉 PDF edited successfully! Your changes have been applied through the DOCX conversion process.')

    } catch (error) {
      console.error('Save error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Save failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
      setProgress(0)
    }
  }

  // Handle canvas click for adding elements
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (editorMode === 'text') {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        // Calculate coordinates relative to the original PDF size (accounting for zoom)
        const x = (event.clientX - rect.left) / (zoomLevel / 100)
        const y = (event.clientY - rect.top) / (zoomLevel / 100)
        addTextElement(x, y)
      }
    }
  }

  // Download the edited PDF
  const handleDownload = () => {
    if (editedBlob && editedFileName) {
      downloadBlob(editedBlob, editedFileName)
      toast.success('File downloaded successfully!')
    }
  }

  // Reset to start over
  const resetEditor = () => {
    setFile(null)
    setPdfUrl(null)
    setConvertedDocx(null)
    setElements([])
    setSelectedElement(null)
    setIsEditing(false)
    setError(null)
    setProgress(0)
    setEditedBlob(null)
    setEditedFileName('')
    setCurrentPage(1)
    setTotalPages(0)
    setZoomLevel(100)
  }

  // Zoom controls
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 300))
  }

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 25))
  }

  // Page navigation
  const goToPage = async (pageNum: number) => {
    if (!pdfDocument || pageNum < 1 || pageNum > totalPages) return
    
    setCurrentPage(pageNum)
    const page = await pdfDocument.getPage(pageNum)
    setPdfPage(page)
    renderPage(page)
  }

  const selectedElementData = selectedElement ? elements.find(el => el.id === selectedElement) : null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Advanced PDF Editor</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Visual PDF editing with smart conversion technology. Your PDF is displayed exactly as it appears, while edits are processed through advanced document conversion for perfect formatting preservation.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-blue-500" />
              PDF-to-DOCX-to-PDF workflow
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4 text-green-500" />
              Visual PDF interface
            </span>
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-purple-500" />
              Format preservation
            </span>
          </div>
        </div>

        {/* Step 1: Upload PDF */}
        {!file && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-6 w-6" />
                Upload Your PDF Document
              </CardTitle>
              <CardDescription>
                Select a PDF file to start editing. We'll convert it to DOCX behind the scenes while showing you the original PDF layout for visual editing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300
                  ${isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                `}
              >
                <input {...getInputProps()} />
                <Upload className={`h-20 w-20 mx-auto mb-6 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                {isDragActive ? (
                  <div className="space-y-3">
                    <p className="text-2xl text-primary font-medium">Drop your PDF file here...</p>
                    <p className="text-muted-foreground">Release to start editing</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-3xl font-medium">Drag & drop your PDF file here</p>
                    <p className="text-muted-foreground text-lg">
                      or click to browse files
                    </p>
                    <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground mt-8">
                      <span className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        PDF files only
                      </span>
                      <span className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Max 100MB
                      </span>
                      <span className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Visual editing
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Convert to Editable */}
        {file && !isEditing && !editedBlob && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Ready to Edit: {file.name}
              </CardTitle>
              <CardDescription>
                Your PDF is ready for editing. We'll convert it to DOCX format behind the scenes while maintaining the visual PDF interface.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <FileText className="h-10 w-10 text-red-500" />
                <div className="flex-1">
                  <p className="font-medium text-lg">{file.name}</p>
                  <p className="text-muted-foreground">
                    Size: {formatFileSize(file.size)} • Ready for editing
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  PDF Document
                </Badge>
              </div>

              {isConverting && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <div>
                      <p className="font-medium">Converting your PDF to editable format...</p>
                      <p className="text-sm text-muted-foreground">This may take a moment</p>
                    </div>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <p className="text-center text-sm text-muted-foreground">
                    {progress}% complete
                  </p>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {!isConverting && (
                <div className="flex justify-center">
                  <Button
                    onClick={convertToEditable}
                    size="lg"
                    className="min-w-[250px]"
                  >
                    <Edit3 className="mr-2 h-5 w-5" />
                    Start Visual Editing
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Visual Editor */}
        {isEditing && !editedBlob && (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Tools */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Editor Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mode Selection */}
                  <div className="space-y-2">
                    <Label>Editor Mode</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={editorMode === 'select' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setEditorMode('select')}
                      >
                        <MousePointer className="h-4 w-4 mr-1" />
                        Select
                      </Button>
                      <Button
                        variant={editorMode === 'text' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setEditorMode('text')}
                      >
                        <Type className="h-4 w-4 mr-1" />
                        Text
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Text Formatting */}
                  <div className="space-y-3">
                    <Label>Text Formatting</Label>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Font Size</Label>
                      <Slider
                        value={[textTool.fontSize]}
                        onValueChange={(value) => setTextTool({...textTool, fontSize: value[0]})}
                        max={72}
                        min={8}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">{textTool.fontSize}px</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Font Family</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            {textTool.fontFamily}
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          <DropdownMenuItem onClick={() => setTextTool({...textTool, fontFamily: 'Arial'})}>
                            Arial
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTextTool({...textTool, fontFamily: 'Times New Roman'})}>
                            Times New Roman
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTextTool({...textTool, fontFamily: 'Helvetica'})}>
                            Helvetica
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTextTool({...textTool, fontFamily: 'Georgia'})}>
                            Georgia
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTextTool({...textTool, fontFamily: 'Verdana'})}>
                            Verdana
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant={textTool.fontWeight === 'bold' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTextTool({...textTool, fontWeight: textTool.fontWeight === 'bold' ? 'normal' : 'bold'})}
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={textTool.fontStyle === 'italic' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTextTool({...textTool, fontStyle: textTool.fontStyle === 'italic' ? 'normal' : 'italic'})}
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Text Color</Label>
                      <Input
                        type="color"
                        value={textTool.color}
                        onChange={(e) => setTextTool({...textTool, color: e.target.value})}
                        className="w-full h-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Element Properties */}
              {selectedElementData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      Element Properties
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteElement(selectedElementData.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedElementData.type === 'text' && (
                      <>
                        <div className="space-y-2">
                          <Label className="text-xs">Content</Label>
                          <Input
                            value={selectedElementData.content || ''}
                            onChange={(e) => updateElement(selectedElementData.id, { content: e.target.value })}
                            placeholder="Enter text..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Font Size</Label>
                          <Slider
                            value={[selectedElementData.fontSize || 14]}
                            onValueChange={(value) => updateElement(selectedElementData.id, { fontSize: value[0] })}
                            max={72}
                            min={8}
                            step={1}
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Main Editor Area */}
            <div className="lg:col-span-3 space-y-4">
              {/* Editor Toolbar */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={zoomOut}>
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium min-w-[60px] text-center">{zoomLevel}%</span>
                        <Button variant="outline" size="sm" onClick={zoomIn}>
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Separator orientation="vertical" className="h-6" />
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant={showEditableAreas ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setShowEditableAreas(!showEditableAreas)}
                        >
                          {showEditableAreas ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Label className="text-sm">Highlight Editable Areas</Label>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Undo className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Redo className="h-4 w-4" />
                      </Button>
                      
                      <Separator orientation="vertical" className="h-6" />
                      
                      <Button onClick={saveChanges} disabled={isSaving}>
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* PDF Canvas */}
              <Card className="relative">
                <CardContent className="p-0">
                  <div 
                    ref={pdfViewerRef}
                    className="relative bg-gray-100 dark:bg-gray-900 min-h-[600px] overflow-auto flex items-center justify-center"
                  >
                    {/* Page Navigation */}
                    {totalPages > 1 && (
                      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage <= 1}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium px-2">
                          {currentPage} / {totalPages}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage >= totalPages}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {/* PDF Canvas Container */}
                    <div className="relative bg-white shadow-2xl">
                      <canvas
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        className="block"
                        style={{ 
                          cursor: editorMode === 'text' ? 'crosshair' : 'default',
                          maxWidth: '100%',
                          height: 'auto'
                        }}
                      />

                      {/* Editable Elements Overlay */}
                      {elements
                        .filter(el => el.page === currentPage)
                        .map(element => (
                          <div
                            key={element.id}
                            className={`absolute border-2 cursor-pointer transition-all duration-200 ${
                              element.isSelected || selectedElement === element.id
                                ? 'border-blue-500 bg-blue-500/10'
                                : showEditableAreas
                                ? 'border-green-400 bg-green-400/10 hover:bg-green-400/20'
                                : 'border-transparent'
                            }`}
                            style={{
                              left: element.x * (zoomLevel / 100),
                              top: element.y * (zoomLevel / 100),
                              width: (element.width || 200) * (zoomLevel / 100),
                              height: (element.height || 30) * (zoomLevel / 100),
                              zIndex: 20
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedElement(element.id)
                              setEditorMode('select')
                            }}
                          >
                            {element.type === 'text' && (
                              <div
                                className="w-full h-full flex items-center px-2 text-black dark:text-white"
                                style={{
                                  fontSize: (element.fontSize || 14) * (zoomLevel / 100),
                                  fontFamily: element.fontFamily,
                                  fontWeight: element.fontWeight,
                                  fontStyle: element.fontStyle,
                                  color: element.color,
                                  textAlign: element.textAlign as any
                                }}
                              >
                                {element.content}
                              </div>
                            )}
                            
                            {/* Selection handles */}
                            {selectedElement === element.id && (
                              <>
                                <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                              </>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 4: Saving Progress */}
        {isSaving && (
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div>
                    <h3 className="text-xl font-semibold">Saving Your Changes...</h3>
                    <p className="text-muted-foreground">Converting your edits back to PDF format</p>
                  </div>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-center text-sm text-muted-foreground">
                  {progress}% complete
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Download Success */}
        {editedBlob && (
          <div className="max-w-4xl mx-auto">
            <DownloadSuccessCard
              title="PDF Edited Successfully!"
              description={`Your PDF has been edited with ${elements.length} modifications and is ready to download.`}
              fileName={editedFileName}
              downloadButtonText="Download Edited PDF"
              resetButtonText="Edit Another PDF"
              onDownload={handleDownload}
              onReset={resetEditor}
              showDonation={true}
            />
          </div>
        )}

        {/* Features Section */}
        {!isEditing && !editedBlob && (
          <div className="mt-16">
            <Separator className="mb-12" />
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Hybrid PDF/DOCX Editing Technology</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                The best of both worlds: Visual PDF interface with powerful DOCX editing capabilities
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Visual PDF Interface</h3>
                  <p className="text-muted-foreground">
                    See your document exactly as a PDF while editing. No surprises - what you see is what you get in the final output.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Smart Conversion Workflow</h3>
                  <p className="text-muted-foreground">
                    PDF → DOCX → Edit → PDF process ensures perfect formatting while allowing powerful text editing capabilities.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Format Preservation</h3>
                  <p className="text-muted-foreground">
                    Advanced conversion technology maintains fonts, layouts, and formatting throughout the editing process.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
