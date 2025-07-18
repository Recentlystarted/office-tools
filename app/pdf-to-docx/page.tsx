'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, Download, FileText, Loader2, X, AlertCircle,
  CheckCircle, Clock, Cpu
} from 'lucide-react';
import { getApiUrl, smartPdfRequest, stirlingPdfRequest, downloadBlob, formatFileSize } from '@/lib/api';
import ApiStatus from '@/components/api-status';

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
  const [useStirlingPdf, setUseStirlingPdf] = useState(false);

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
    setProcessingInfo(`Converting using ${useStirlingPdf ? 'Stirling-PDF' : 'Primary API'}...`);

    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file.file);

      let response: Response;
      
      if (useStirlingPdf) {
        response = await stirlingPdfRequest(getApiUrl('pdfToDocx'), formData);
      } else {
        response = await smartPdfRequest(getApiUrl('pdfToDocx'), {
          method: 'POST',
          body: formData,
        }, file.file);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Conversion failed: ${errorText}`);
      }

      setProcessingInfo('Converting to Word document...');
      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error('Received empty file from server');
      }
      
      const filename = file.name.replace('.pdf', '.docx');

      setResult({ blob, filename });
      setProcessingInfo('Conversion completed successfully!');

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
      downloadBlob(result.blob, result.filename);
      setResult(null);
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
        {/* API Status */}
        <ApiStatus />

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

            {/* API Selection */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">Conversion Engine</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose between Primary API and Stirling-PDF for conversion
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={!useStirlingPdf ? "default" : "outline"} className="text-xs">
                      Primary API
                    </Badge>
                    <Toggle
                      pressed={useStirlingPdf}
                      onPressedChange={setUseStirlingPdf}
                      variant="outline"
                      size="sm"
                      className="data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600 hover:bg-blue-50"
                    >
                      {useStirlingPdf ? '🔄' : '⚡'}
                    </Toggle>
                    <Badge variant={useStirlingPdf ? "default" : "outline"} className="text-xs">
                      Stirling-PDF
                    </Badge>
                  </div>
                </div>
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
                      <span className="text-xs ml-2 opacity-70">
                        ({useStirlingPdf ? 'Stirling-PDF' : 'Primary API'})
                      </span>
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
