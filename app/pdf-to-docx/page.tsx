'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, Download, FileText, Loader2, X, AlertCircle,
  CheckCircle, Clock, Cpu
} from 'lucide-react';
import { getApiUrl, smartPdfRequest, downloadBlob, formatFileSize } from '@/lib/api';

interface UploadedFile {
  file: File;
  id: string;
  name: string;
  size: number;
}

export default function PdfToDocxPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingInfo, setProcessingInfo] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Debug logging
  console.log('Component state - result:', result, 'error:', error, 'isConverting:', isConverting);

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size
    }));
    setFiles(newFiles.slice(0, 1)); // Only allow one file
    setError(null);
    setResult(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    maxSize: 100 * 1024 * 1024 // 100MB
  });

  const convertFile = async () => {
    if (files.length === 0) return;

    setIsConverting(true);
    setError(null);
    setProcessingInfo('Initializing conversion...');

    try {
      const file = files[0];
      const fileSize = file.size / (1024 * 1024); // Size in MB
      
      console.log('Starting conversion for file:', file.name, 'Size:', fileSize.toFixed(2) + 'MB');
      
      if (fileSize > 10) {
        setProcessingInfo('Large file detected - using Stirling-PDF for optimal conversion...');
      } else {
        setProcessingInfo('Processing with primary API...');
      }

      const formData = new FormData();
      formData.append('file', file.file);

      console.log('FormData created, making API request to:', getApiUrl('pdfToDocx'));
      
      const response = await smartPdfRequest(getApiUrl('pdfToDocx'), {
        method: 'POST',
        body: formData,
      }, file.file);

      console.log('API Response received:', response);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`Conversion failed: ${errorText}`);
      }

      setProcessingInfo('Converting to Word document...');
      const blob = await response.blob();
      console.log('Blob created successfully:', blob);
      console.log('Blob size:', blob.size);
      console.log('Blob type:', blob.type);
      
      if (blob.size === 0) {
        throw new Error('Received empty file from server');
      }
      
      const filename = file.name.replace('.pdf', '.docx');
      console.log('Setting result with filename:', filename);

      setResult({ blob, filename });
      setProcessingInfo('Conversion completed successfully!');
      setDebugInfo(`Conversion completed: ${filename}, ${blob.size} bytes`);
      console.log('Conversion completed successfully!');

    } catch (error) {
      console.error('PDF conversion error:', error);
      
      let errorMessage = 'Conversion failed';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      if (errorMessage.includes('timeout')) {
        errorMessage = 'Conversion timeout - please try again with a smaller file';
      } else if (errorMessage.includes('Network error')) {
        errorMessage = 'Network error - check your connection and try again';
      }
      
      setError(errorMessage);
    } finally {
      setIsConverting(false);
    }
  };

  const downloadResult = () => {
    if (result) {
      console.log('Downloading file:', result.filename);
      console.log('Blob size:', result.blob.size);
      downloadBlob(result.blob, result.filename);
      setResult(null);
    } else {
      console.error('No result to download');
    }
  };

  const removeFile = () => {
    setFiles([]);
    setError(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <FileText className="h-6 w-6" />
                PDF to Word Converter
              </h1>
              <p className="text-muted-foreground">
                Convert PDF files to editable Word documents with intelligent processing
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              Smart API + Stirling-PDF Fallback
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Cpu className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium">Smart Processing</h3>
              <p className="text-sm text-muted-foreground">
                Automatic fallback to Stirling-PDF for complex files
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-medium">Fast Conversion</h3>
              <p className="text-sm text-muted-foreground">
                Optimized for speed with large file support
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-medium">High Quality</h3>
              <p className="text-sm text-muted-foreground">
                Preserves formatting, tables, and images
              </p>
            </CardContent>
          </Card>
        </div>

        {/* File Upload */}
        {files.length === 0 ? (
          <Card>
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
                  <p className="text-xl text-primary mb-2">Drop your PDF here!</p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xl font-medium text-foreground">
                      Select PDF file to convert
                    </p>
                    <p className="text-muted-foreground">
                      Drag & drop or click to browse • Max 100MB
                    </p>
                    <Button>
                      Choose PDF File
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Uploaded File */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Selected File
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('file-input')?.click()}>
                    Change File
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="font-medium">{files[0].name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(files[0].size)}
                        {files[0].size > 10 * 1024 * 1024 && (
                          <Badge variant="secondary" className="ml-2">Large file - will use Stirling-PDF</Badge>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onDrop([file]);
                  }}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Convert Button */}
            <Card>
              <CardContent className="p-6 text-center">
                <Button 
                  onClick={convertFile}
                  disabled={isConverting}
                  size="lg"
                  className="w-full max-w-md"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Converting to Word...
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5 mr-2" />
                      Convert to Word Document
                    </>
                  )}
                </Button>
                {processingInfo && (
                  <p className="text-sm text-muted-foreground mt-2">{processingInfo}</p>
                )}
              </CardContent>
            </Card>
          </>
        )}

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

        {/* Success Result */}
        {result && (
          <Card className="border-green-500">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
                <div>
                  <h3 className="text-lg font-medium text-green-700">Conversion Successful!</h3>
                  <p className="text-muted-foreground">Your PDF has been converted to a Word document</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Debug: Blob size: {result.blob.size} bytes, Type: {result.blob.type}
                  </p>
                </div>
                <div className="flex justify-center gap-3">
                  <Button onClick={downloadResult} size="lg">
                    <Download className="h-5 w-5 mr-2" />
                    Download Word Document
                  </Button>
                  <Button onClick={() => setResult(null)} variant="outline">
                    Convert Another File
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  File: {result.filename}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug Info */}
        {debugInfo && (
          <Card className="border-blue-500">
            <CardContent className="p-4">
              <div className="text-sm font-mono text-blue-600">
                Debug: {debugInfo}
              </div>
            </CardContent>
          </Card>
        )}

        {/* How it Works */}
        <Card>
          <CardHeader>
            <CardTitle>How it Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Smart Processing</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Files under 10MB: Fast Python API</li>
                  <li>• Large/complex files: Stirling-PDF engine</li>
                  <li>• Automatic fallback if primary fails</li>
                  <li>• Optimal quality for all file types</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Supported Features</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Text extraction and formatting</li>
                  <li>• Tables and complex layouts</li>
                  <li>• Images and graphics</li>
                  <li>• Headers, footers, and pagination</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
