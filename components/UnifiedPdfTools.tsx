'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, Download, FileText, Shield, Scissors, Merge, 
  RotateCw, Archive, Lock, Unlock, Loader2, X, AlertCircle,
  CheckCircle, FileSpreadsheet, FileImage
} from 'lucide-react';
import { getApiUrl, smartPdfRequest, downloadBlob, formatFileSize } from '@/lib/api';

interface UploadedFile {
  file: File;
  id: string;
  name: string;
  size: number;
}

interface PdfOperation {
  operation: string;
  description: string;
  endpoint: string;
  icon: string;
  multiFile: boolean;
  category: string;
  params?: Record<string, any>;
}

const PDF_TOOLS: PdfOperation[] = [
  // Convert
  { operation: 'pdf-to-word', description: 'Convert PDF to Word Document', endpoint: 'pdfToDocx', icon: 'FileText', multiFile: false, category: 'convert' },
  { operation: 'pdf-to-excel', description: 'Convert PDF to Excel', endpoint: 'stirlingConvert', icon: 'FileSpreadsheet', multiFile: false, category: 'convert', params: { outputFormat: 'xlsx' } },
  
  // Edit
  { operation: 'compress-pdf', description: 'Compress PDF File', endpoint: 'pdfCompressor', icon: 'Archive', multiFile: false, category: 'edit' },
  { operation: 'rotate-pdf', description: 'Rotate PDF Pages', endpoint: 'pdfRotate', icon: 'RotateCw', multiFile: false, category: 'edit' },
  
  // Organize
  { operation: 'merge-pdfs', description: 'Merge Multiple PDFs', endpoint: 'pdfMerger', icon: 'Merge', multiFile: true, category: 'organize' },
  { operation: 'split-pdf', description: 'Split PDF into Pages', endpoint: 'stirlingSplit', icon: 'Scissors', multiFile: false, category: 'organize' },
  
  // Security
  { operation: 'add-password', description: 'Add Password Protection', endpoint: 'stirlingProtect', icon: 'Lock', multiFile: false, category: 'security' },
  { operation: 'remove-password', description: 'Remove Password Protection', endpoint: 'stirlingRemovePassword', icon: 'Unlock', multiFile: false, category: 'security' },
];

const getIcon = (iconName: string) => {
  const icons = {
    FileText, FileSpreadsheet, FileImage, Archive, RotateCw, Merge, Scissors, Lock, Unlock, Shield
  };
  const IconComponent = icons[iconName as keyof typeof icons] || FileText;
  return <IconComponent className="h-4 w-4" />;
};

export default function UnifiedPdfTools() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeOperation, setActiveOperation] = useState<string>('');
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Settings for operations
  const [password, setPassword] = useState('');
  const [rotationAngle, setRotationAngle] = useState(90);
  const [compressionLevel, setCompressionLevel] = useState(50);

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setError(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
    maxSize: 100 * 1024 * 1024 // 100MB
  });

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const processFile = async (operation: PdfOperation) => {
    if (files.length === 0) {
      setError('Please upload at least one PDF file');
      return;
    }

    if (operation.multiFile && files.length < 2) {
      setError('This operation requires at least 2 PDF files');
      return;
    }

    // Validate required settings
    if (operation.operation.includes('password') && !password.trim()) {
      setError('Please enter a password');
      return;
    }

    setIsProcessing(true);
    setActiveOperation(operation.operation);
    setError(null);

    try {
      const formData = new FormData();
      
      // Add files
      if (operation.multiFile) {
        files.forEach((file, index) => {
          formData.append(`file${index + 1}`, file.file);
        });
      } else {
        formData.append('file', files[0].file);
      }

      // Add operation-specific parameters
      if (operation.params) {
        Object.entries(operation.params).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
      }

      // Add settings based on operation
      switch (operation.operation) {
        case 'add-password':
        case 'remove-password':
          formData.append('password', password);
          break;
        case 'compress-pdf':
          formData.append('compressionLevel', compressionLevel.toString());
          break;
        case 'rotate-pdf':
          formData.append('angle', rotationAngle.toString());
          break;
      }

      console.log(`Processing ${operation.description} with ${operation.endpoint}...`);
      
      const response = await smartPdfRequest(getApiUrl(operation.endpoint), {
        method: 'POST',
        body: formData,
      }, files[0].file);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Processing failed: ${errorText}`);
      }

      const blob = await response.blob();
      let filename = `processed_${files[0].name}`;
      
      // Set appropriate filename based on operation
      if (operation.params?.outputFormat) {
        const ext = operation.params.outputFormat;
        filename = filename.replace('.pdf', `.${ext}`);
      }

      setResult({ blob, filename });

    } catch (error) {
      console.error('PDF processing error:', error);
      
      let errorMessage = 'Processing failed';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Show user-friendly error messages
      if (errorMessage.includes('timeout')) {
        errorMessage = 'Processing timeout - trying Stirling-PDF fallback...';
      } else if (errorMessage.includes('Network error')) {
        errorMessage = 'Network error - check your connection and try again';
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
      setActiveOperation('');
    }
  };

  const downloadResult = () => {
    if (result) {
      downloadBlob(result.blob, result.filename);
      setResult(null);
    }
  };

  const getOperationsByCategory = (category: string) => {
    return PDF_TOOLS.filter(op => op.category === category);
  };

  const renderOperationCard = (operation: PdfOperation) => (
    <Card key={operation.operation} className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getIcon(operation.icon)}
              <h4 className="font-medium text-sm">{operation.description}</h4>
            </div>
            {operation.multiFile && (
              <Badge variant="secondary" className="text-xs">Multi-file</Badge>
            )}
          </div>
          <Button 
            onClick={() => processFile(operation)}
            disabled={isProcessing || files.length === 0 || (operation.multiFile && files.length < 2)}
            size="sm"
            className="w-full"
          >
            {isProcessing && activeOperation === operation.operation ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Process'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">PDF Tools</h1>
              <p className="text-muted-foreground">Professional PDF processing with intelligent fallback</p>
            </div>
            {files.length > 0 && (
              <Badge variant="outline" className="text-sm">
                {files.length} file{files.length !== 1 ? 's' : ''} selected
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* File Upload Section */}
        {files.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                `}
              >
                <input {...getInputProps()} />
                <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                {isDragActive ? (
                  <p className="text-xl text-primary mb-2">Drop your PDF files here!</p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xl font-medium text-foreground">
                      Upload PDF files to get started
                    </p>
                    <p className="text-muted-foreground">
                      Drag & drop or click to browse • Max 100MB per file
                    </p>
                    <Button>
                      Choose Files
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Uploaded Files */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Uploaded Files
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add More
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files || []);
                    onDrop(newFiles);
                  }}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Card className="border-destructive">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-medium">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Operation Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Operation Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Password (for security operations)</label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Rotation Angle</label>
                    <select
                      value={rotationAngle}
                      onChange={(e) => setRotationAngle(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value={90}>90°</option>
                      <option value={180}>180°</option>
                      <option value={270}>270°</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Compression Level: {compressionLevel}%</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={compressionLevel}
                      onChange={(e) => setCompressionLevel(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PDF Operations */}
            <div className="space-y-6">
              {/* Convert */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Convert
                  </CardTitle>
                  <CardDescription>Transform PDFs to different formats</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getOperationsByCategory('convert').map(renderOperationCard)}
                  </div>
                </CardContent>
              </Card>

              {/* Edit */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Archive className="h-5 w-5" />
                    Edit
                  </CardTitle>
                  <CardDescription>Modify and optimize PDF files</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getOperationsByCategory('edit').map(renderOperationCard)}
                  </div>
                </CardContent>
              </Card>

              {/* Organize */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scissors className="h-5 w-5" />
                    Organize
                  </CardTitle>
                  <CardDescription>Merge, split, and organize PDF pages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getOperationsByCategory('organize').map(renderOperationCard)}
                  </div>
                </CardContent>
              </Card>

              {/* Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security
                  </CardTitle>
                  <CardDescription>Protect and unlock PDF files</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getOperationsByCategory('security').map(renderOperationCard)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Processing Status */}
        {isProcessing && (
          <Card className="border-primary">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div>
                  <p className="font-medium">Processing your PDF...</p>
                  <p className="text-sm text-muted-foreground">
                    Using smart API with Stirling-PDF fallback for best results
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Result */}
        {result && (
          <Card className="border-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Processing Complete!</p>
                    <p className="text-sm text-muted-foreground">{result.filename}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={downloadResult}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button onClick={() => setResult(null)} variant="outline">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
