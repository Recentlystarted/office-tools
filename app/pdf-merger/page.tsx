'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { FileText, Upload, Download, AlertCircle, X, GripVertical, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface FileWithId extends File {
  id: string
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function PdfMergerPage() {
  const [files, setFiles] = useState<FileWithId[]>([])
  const [isMerging, setIsMerging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejectedReasons = rejectedFiles.map(({ errors }) => 
        errors.map((e: any) => e.message).join(', ')
      ).join('; ')
      toast.error(`Some files were rejected: ${rejectedReasons}`)
    }

    // Filter and process accepted PDF files
    const pdfFiles = acceptedFiles.filter(file => {
      if (file.type !== 'application/pdf') {
        toast.error(`${file.name} is not a PDF file`)
        return false
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error(`${file.name} is too large (max 50MB)`)
        return false
      }
      return true
    })
    
    if (pdfFiles.length === 0) return

    const newFiles: FileWithId[] = pdfFiles.map(file => ({
      ...file,
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      name: file.name,
      size: file.size,
      type: file.type
    }))
    
    setFiles(prev => [...prev, ...newFiles])
    setError(null)
    
    toast.success(`${newFiles.length} PDF file${newFiles.length > 1 ? 's' : ''} added successfully`)
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB per file
    maxFiles: 20, // Maximum 20 files
    noClick: false,
    noKeyboard: false
  })

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const moveFile = (fileId: string, direction: 'up' | 'down') => {
    setFiles(prev => {
      const index = prev.findIndex(f => f.id === fileId)
      if (index === -1) return prev
      
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev
      
      const newFiles = [...prev]
      const [movedFile] = newFiles.splice(index, 1)
      newFiles.splice(newIndex, 0, movedFile)
      
      return newFiles
    })
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error('Please select at least 2 PDF files to merge')
      return
    }

    setIsMerging(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append('files', file)
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pdf-merger/merge`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const blob = await response.blob()
      downloadBlob(blob, 'merged-document.pdf')
      
      toast.success('PDFs merged successfully!')
      resetForm()

    } catch (error) {
      console.error('Merge error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Merge failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsMerging(false)
      setProgress(0)
    }
  }

  const resetForm = () => {
    setFiles([])
    setError(null)
    setProgress(0)
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">PDF Merger</h1>
        <p className="text-lg text-muted-foreground">
          Combine multiple PDF files into a single document. Drag and drop to reorder files.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload PDF Files
          </CardTitle>
          <CardDescription>
            Select multiple PDF files to merge. You can reorder them by dragging or using the arrow buttons.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          {files.length === 0 && (
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
                    <p className="text-lg text-primary">Drop your PDF files here...</p>
                    <p className="text-sm text-muted-foreground">Release to add files</p>
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  <p className="text-xl font-medium">Drag & drop your PDF files here</p>
                  <p className="text-muted-foreground">
                    or click to browse files (select multiple files)
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-4">
                    <span>📄 PDF files only</span>
                    <span>📦 Max 50MB per file</span>
                    <span>🔢 Up to 20 files</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Files to Merge ({files.length})
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Drag files to reorder • Total size: {formatFileSize(totalSize)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={resetForm}>
                    <X className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    className="group flex items-center gap-4 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                        onClick={() => moveFile(file.id, 'up')}
                        disabled={index === 0}
                        title="Move up"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                        onClick={() => moveFile(file.id, 'down')}
                        disabled={index === files.length - 1}
                        title="Move down"
                      >
                        ↓
                      </Button>
                    </div>
                    
                    <GripVertical className="h-4 w-4 text-muted-foreground opacity-60 group-hover:opacity-100" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <p className="font-medium truncate" title={file.name}>
                          {file.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>PDF Document</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-60 hover:opacity-100"
                      title="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </Button>
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
                    <span className="text-sm font-medium">Add more files</span>
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

          {/* Merge Action */}
          {files.length >= 2 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Ready to Merge</h3>
                  <p className="text-muted-foreground text-sm">
                    {files.length} PDF files will be combined into one document
                  </p>
                </div>
                <Button 
                  onClick={handleMerge} 
                  disabled={isMerging}
                  size="lg"
                  className="min-w-[140px]"
                >
                  {isMerging ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Merging...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Merge PDFs
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isMerging && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div>
                  <p className="font-medium">Merging PDF files...</p>
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
            <h3 className="font-semibold mb-2">Easy Reordering</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop or use arrow buttons to change the order of pages
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">No Limit</h3>
            <p className="text-sm text-muted-foreground">
              Merge as many PDF files as you need without restrictions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Quality Preserved</h3>
            <p className="text-sm text-muted-foreground">
              Original quality and formatting is maintained in the merged PDF
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
