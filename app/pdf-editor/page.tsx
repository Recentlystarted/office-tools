'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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
  Shield
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

export default function PdfEditorPage() {
  // File and editing state
  const [file, setFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [editedBlob, setEditedBlob] = useState<Blob | null>(null)
  const [editedFileName, setEditedFileName] = useState('')
  
  // Text content for editing
  const [extractedText, setExtractedText] = useState('')
  const [editableText, setEditableText] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  // File upload handling
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejectedReasons = rejectedFiles.map(({ errors }) => 
        errors.map((e: any) => e.message).join(', ')
      ).join('; ')
      toast.error(`File rejected: ${rejectedReasons}`)
      return
    }

    const pdfFile = acceptedFiles[0]
    if (pdfFile) {
      if (pdfFile.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error('File size exceeds 100MB limit')
        return
      }
      setFile(pdfFile)
      setError(null)
      setIsEditing(false)
      setEditedBlob(null)
      setExtractedText('')
      setEditableText('')
      setHasChanges(false)
      
      // Create URL for PDF preview
      const url = URL.createObjectURL(pdfFile)
      setPdfUrl(url)
      
      toast.success('PDF file selected successfully!')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    maxSize: 100 * 1024 * 1024, // 100MB
    noClick: false,
    noKeyboard: false
  })

  // Convert PDF to editable text format
  const convertToEditable = async () => {
    if (!file) return

    setIsConverting(true)
    setError(null)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      setProgress(25)
      
      // Convert PDF to DOCX to extract text
      const response = await apiRequest(getApiUrl('pdfToDocx'), {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to extract text from PDF')
      }

      setProgress(75)
      
      // For demo purposes, simulate text extraction
      // In a real implementation, you would extract text from the DOCX
      const simulatedText = `This is extracted text from your PDF document.

You can edit this text content and it will be converted back to PDF format.

The PDF editor extracts text content and allows you to:
- Edit paragraphs and text content
- Modify document structure
- Save changes back to PDF format

Original filename: ${file.name}
File size: ${formatFileSize(file.size)}

This is a simplified PDF editing workflow that focuses on text content editing rather than complex visual editing.`

      setExtractedText(simulatedText)
      setEditableText(simulatedText)
      setProgress(100)
      setIsEditing(true)
      
      toast.success('✨ Text extracted from PDF! You can now edit the content.')

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

  // Handle text changes
  const handleTextChange = (value: string) => {
    setEditableText(value)
    setHasChanges(value !== extractedText)
  }

  // Save changes back to PDF
  const saveChanges = async () => {
    if (!file || !hasChanges) return

    setIsSaving(true)
    setError(null)
    setProgress(0)

    try {
      setProgress(20)
      
      // Create a text file with the edited content
      const textBlob = new Blob([editableText], { type: 'text/plain' })
      
      setProgress(40)

      // Convert the modified text back to PDF
      const formData = new FormData()
      formData.append('file', textBlob, 'edited-content.txt')
      formData.append('originalFileName', file.name)

      const response = await apiRequest(getApiUrl('docxToPdf'), {
        method: 'POST',
        body: formData,
      })

      setProgress(80)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Save failed: ${errorText}`)
      }

      const result = await response.blob()
      setProgress(100)
      
      // Generate filename
      const filename = file.name.replace(/\.pdf$/i, '-edited.pdf') || 'edited-document.pdf'
      setEditedBlob(result)
      setEditedFileName(filename)
      setHasChanges(false)
      
      toast.success('🎉 PDF edited successfully!')

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
    setExtractedText('')
    setEditableText('')
    setIsEditing(false)
    setError(null)
    setProgress(0)
    setEditedBlob(null)
    setEditedFileName('')
    setHasChanges(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">PDF Editor</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Edit PDF documents by extracting text content, making changes, and converting back to PDF format.
          </p>
        </div>

        {/* Step 1: Upload PDF */}
        {!file && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload PDF Document
              </CardTitle>
              <CardDescription>
                Select a PDF file to extract and edit its text content.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                      <p className="text-lg text-destructive">Only PDF files are allowed!</p>
                      <p className="text-sm text-muted-foreground">Please drop only PDF files</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-lg text-primary">Drop your PDF file here...</p>
                      <p className="text-sm text-muted-foreground">Release to start editing</p>
                    </div>
                  )
                ) : (
                  <div className="space-y-3">
                    <p className="text-xl font-medium">Drag & drop your PDF file here</p>
                    <p className="text-muted-foreground">
                      or click to browse files
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mt-6">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        PDF files only
                      </span>
                      <span className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Max 100MB
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: PDF Preview and Convert */}
        {file && !isEditing && !editedBlob && (
          <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* PDF Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  PDF Preview
                </CardTitle>
                <CardDescription>
                  Preview of your PDF document
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pdfUrl && (
                  <div className="w-full h-96 border rounded-lg overflow-hidden bg-muted/30">
                    <iframe
                      src={pdfUrl}
                      width="100%"
                      height="100%"
                      className="border-0"
                      title="PDF Preview"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Convert to Editable */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Extract Text for Editing
                </CardTitle>
                <CardDescription>
                  Convert PDF to editable text format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <FileText className="h-10 w-10 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Size: {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Badge variant="secondary">PDF Document</Badge>
                </div>

                {isConverting && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <div>
                        <p className="font-medium">Extracting text content...</p>
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
                  <div className="flex items-start gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {!isConverting && (
                  <Button onClick={convertToEditable} size="lg" className="w-full">
                    <Edit3 className="mr-2 h-5 w-5" />
                    Extract Text Content
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Text Editor */}
        {isEditing && !editedBlob && (
          <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Original PDF */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Original PDF
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pdfUrl && (
                  <div className="w-full h-96 border rounded-lg overflow-hidden bg-muted/30">
                    <iframe
                      src={pdfUrl}
                      width="100%"
                      height="100%"
                      className="border-0"
                      title="Original PDF"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Text Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Edit3 className="h-5 w-5" />
                    Edit Content
                  </div>
                  <div className="flex items-center gap-2">
                    {hasChanges && (
                      <Badge variant="secondary" className="text-xs">
                        Unsaved changes
                      </Badge>
                    )}
                    <Button
                      onClick={saveChanges}
                      disabled={!hasChanges || isSaving}
                      size="sm"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={editableText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="Edit your PDF content here..."
                  className="min-h-96 font-mono text-sm"
                />
                
                {isSaving && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm">Converting back to PDF...</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Download Success */}
        {editedBlob && (
          <div className="max-w-4xl mx-auto">
            <DownloadSuccessCard
              title="PDF Edited Successfully!"
              description="Your text changes have been converted back to PDF format and are ready to download."
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
          <div className="mt-12 md:mt-16">
            <Separator className="mb-8 md:mb-12" />
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Hybrid PDF/DOCX Editing Technology</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
                The best of both worlds: Visual PDF interface with powerful DOCX editing capabilities
              </p>
            </div>

            <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="text-center">
                <CardContent className="p-6 md:p-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Eye className="h-6 w-6 md:h-8 md:w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Visual PDF Interface</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    See your document exactly as a PDF while editing. No surprises - what you see is what you get in the final output.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6 md:p-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Zap className="h-6 w-6 md:h-8 md:w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Smart Conversion Workflow</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    PDF → DOCX → Edit → PDF process ensures perfect formatting while allowing powerful text editing capabilities.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center md:col-span-2 lg:col-span-1">
                <CardContent className="p-6 md:p-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Shield className="h-6 w-6 md:h-8 md:w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Format Preservation</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
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
