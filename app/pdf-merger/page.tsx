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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf')
    
    if (pdfFiles.length !== acceptedFiles.length) {
      toast.error('Only PDF files are allowed')
    }
    
    if (pdfFiles.length === 0) return

    const newFiles = pdfFiles.map(file => ({
      ...file,
      id: Math.random().toString(36).substring(7)
    }))
    
    setFiles(prev => [...prev, ...newFiles])
    setError(null)
    
    toast.success(`${newFiles.length} PDF file${newFiles.length > 1 ? 's' : ''} added successfully`)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB per file
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

      const response = await fetch('https://api.tundasportsclub.com/api/pdf-merger/merge', {
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
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              `}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-lg">Drop your PDF files here...</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg">Drag & drop your PDF files here</p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse files (select multiple files)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  Files to Merge ({files.length})
                </h3>
                <div className="text-sm text-muted-foreground">
                  Total size: {formatFileSize(totalSize)}
                </div>
              </div>
              
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                  >
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveFile(file.id, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveFile(file.id, 'down')}
                        disabled={index === files.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
                    
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(file.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <div
                  {...getRootProps()}
                  className="flex-1 border border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <input {...getInputProps()} />
                  <p className="text-sm">Add more files</p>
                </div>
                <Button variant="outline" onClick={resetForm}>
                  Clear All
                </Button>
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
          {isMerging && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Merging PDF files...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Merge Button */}
          {files.length > 0 && (
            <div className="flex justify-center">
              <Button
                onClick={handleMerge}
                disabled={files.length < 2 || isMerging}
                size="lg"
                className="min-w-[200px]"
              >
                {isMerging ? (
                  <>Merging...</>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Merge PDFs ({files.length})
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
