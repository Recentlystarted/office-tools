'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, Download, FileText, Shield, Scissors, Merge, 
  RotateCw, Archive, Droplets, Eye, Settings, Loader2,
  Type, ImageIcon, Lock, Unlock, FileImage, FileSpreadsheet,
  Presentation, Globe, ScanText, X, Plus, Minus, ZoomIn, ZoomOut,
  MousePointer, Square, Circle, Edit, Save
} from 'lucide-react';
import { getApiUrl, smartPdfRequest, downloadBlob, formatFileSize } from '@/lib/api';

// Add global PDF.js types
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface UploadedFile {
  file: File;
  id: string;
  name: string;
  size: number;
}

interface EditElement {
  id: string;
  type: 'text' | 'rectangle' | 'circle' | 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style: {
    color: string;
    fontSize?: number;
    strokeWidth?: number;
  };
}

// Simplified PDF Operations - Core tools only with Stirling-PDF fallback
const PDF_OPERATIONS = {
  convert: [
    { operation: 'pdf-to-word', description: 'Convert PDF to Word Document', endpoint: 'pdfToDocx', icon: 'FileText', multiFile: false },
    { operation: 'pdf-to-excel', description: 'Convert PDF to Excel Spreadsheet', endpoint: 'stirlingConvert', params: { outputFormat: 'xlsx' }, icon: 'FileSpreadsheet', multiFile: false },
  ],
  edit: [
    { operation: 'compress-pdf', description: 'Compress PDF File', endpoint: 'pdfCompressor', icon: 'Archive', multiFile: false },
    { operation: 'rotate-pdf', description: 'Rotate PDF Pages', endpoint: 'pdfRotate', icon: 'RotateCw', multiFile: false },
  ],
  organize: [
    { operation: 'merge-pdfs', description: 'Merge Multiple PDFs', endpoint: 'pdfMerger', icon: 'Merge', multiFile: true },
    { operation: 'split-pdf', description: 'Split PDF into Pages', endpoint: 'stirlingSplit', icon: 'Scissors', multiFile: false },
  ],
  security: [
    { operation: 'add-password', description: 'Add Password Protection', endpoint: 'stirlingProtect', icon: 'Lock', multiFile: false },
    { operation: 'remove-password', description: 'Remove Password Protection', endpoint: 'stirlingRemovePassword', icon: 'Unlock', multiFile: false },
  ],
  extract: [
    { operation: 'extract-text', description: 'Extract Text from PDF', endpoint: 'stirlingExtractText', icon: 'Type', multiFile: false },
    { operation: 'extract-images', description: 'Extract Images from PDF', endpoint: 'stirlingExtractImages', icon: 'FileImage', multiFile: false },
  ],
};

export default function PdfEditor() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeOperation, setActiveOperation] = useState<string>('');
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);

  // Tool settings
  const [watermarkText, setWatermarkText] = useState('');
  const [password, setPassword] = useState('');
  const [rotationAngle, setRotationAngle] = useState(90);
  const [compressionLevel, setCompressionLevel] = useState(50);
  const [pagesToRemove, setPagesToRemove] = useState('');
  const [pageRange, setPageRange] = useState('');

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size
    }));
    setFiles(prev => [...prev, ...newFiles]);
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

  const processFile = async (operation: any) => {
    if (files.length === 0) {
      alert('Please upload at least one PDF file');
      return;
    }

    if (operation.multiFile && files.length < 2) {
      alert('This operation requires at least 2 PDF files');
      return;
    }

    setIsProcessing(true);
    setActiveOperation(operation.operation);

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
          if (!password.trim()) {
            alert('Please enter a password');
            return;
          }
          formData.append('password', password);
          break;
        
        case 'remove-password':
          if (!password.trim()) {
            alert('Please enter the current password');
            return;
          }
          formData.append('password', password);
          break;

        case 'add-watermark':
          if (!watermarkText.trim()) {
            alert('Please enter watermark text');
            return;
          }
          formData.append('watermarkText', watermarkText);
          break;

        case 'compress-pdf':
          formData.append('compressionLevel', compressionLevel.toString());
          break;

        case 'rotate-pdf':
          formData.append('angle', rotationAngle.toString());
          break;

        case 'split-pdf':
          if (pageRange) {
            formData.append('pageNumbers', pageRange);
          }
          break;
      }

      const response = await smartPdfRequest(getApiUrl(operation.endpoint), {
        method: 'POST',
        body: formData,
      }, files[0].file);

      if (!response.ok) {
        throw new Error(`Processing failed: ${response.statusText}`);
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
        errorMessage = 'Processing timeout - please try again with a smaller file';
      } else if (errorMessage.includes('Network error')) {
        errorMessage = 'Network error - please check your connection and try again';
      } else if (errorMessage.includes('API request failed')) {
        errorMessage = 'Server error - please try again later';
      }
      
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
      setActiveOperation('');
    }
  };

  // State for interactive editing
  const [tool, setTool] = useState<'select' | 'text' | 'rectangle' | 'circle'>('select');
  const [textContent, setTextContent] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(16);
  const [elements, setElements] = useState<EditElement[]>([]);

  const clearElements = () => {
    setElements([]);
    // Re-render the current PDF page if available
    if (files.length > 0) {
      // Find the PDF viewer component and trigger re-render
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const event = new CustomEvent('clearElements');
        canvas.dispatchEvent(event);
      }
    }
  };

  // Interactive Toolbar Component
  const InteractiveToolbar = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
          <Button
            size="sm"
            variant={tool === 'select' ? 'default' : 'outline'}
            onClick={() => setTool('select')}
            className="flex items-center gap-2 justify-start"
          >
            <MousePointer className="h-4 w-4" />
            <span className="hidden sm:inline">Select</span>
          </Button>
          <Button
            size="sm"
            variant={tool === 'text' ? 'default' : 'outline'}
            onClick={() => setTool('text')}
            className="flex items-center gap-2 justify-start"
          >
            <Type className="h-4 w-4" />
            <span className="hidden sm:inline">Add Text</span>
          </Button>
          <Button
            size="sm"
            variant={tool === 'rectangle' ? 'default' : 'outline'}
            onClick={() => setTool('rectangle')}
            className="flex items-center gap-2 justify-start"
          >
            <Square className="h-4 w-4" />
            <span className="hidden sm:inline">Rectangle</span>
          </Button>
          <Button
            size="sm"
            variant={tool === 'circle' ? 'default' : 'outline'}
            onClick={() => setTool('circle')}
            className="flex items-center gap-2 justify-start"
          >
            <Circle className="h-4 w-4" />
            <span className="hidden sm:inline">Circle</span>
          </Button>
        </div>

        {tool === 'text' && (
          <div className="space-y-3 pt-4 border-t">
            <div>
              <label className="text-sm font-medium mb-2 block">Text Content</label>
              <Textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Enter text to add"
                className="min-h-[80px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Font Size</label>
              <Input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                min="8"
                max="72"
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-10 rounded border border-input"
              />
            </div>
          </div>
        )}

        {(tool === 'rectangle' || tool === 'circle') && (
          <div className="space-y-3 pt-4 border-t">
            <div>
              <label className="text-sm font-medium mb-2 block">Stroke Color</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-10 rounded border border-input"
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <Button
            size="sm"
            onClick={clearElements}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>
    );
  };

  // Processing Tools Component
  const ProcessingTools = ({ category }: { category: keyof typeof PDF_OPERATIONS }) => {
    const operations = PDF_OPERATIONS[category];
    
    return (
      <div className="space-y-3">
        {operations.map((op) => (
          <Card key={op.operation} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getOperationIcon(op.operation)}
                  <h4 className="font-medium text-sm">{op.description}</h4>
                </div>
                {op.multiFile && (
                  <Badge variant="secondary" className="text-xs">Multi-file</Badge>
                )}
                <Button 
                  onClick={() => processFile(op)}
                  disabled={isProcessing || files.length === 0}
                  size="sm"
                  className="w-full"
                >
                  {isProcessing && activeOperation === op.operation ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Execute'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Settings for current category */}
        {category === 'security' && (
          <Card className="mt-4">
            <CardContent className="p-3 space-y-3">
              <h4 className="font-medium text-sm">Security Settings</h4>
              <div>
                <label className="text-xs font-medium mb-1 block">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Watermark Text</label>
                <Input
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="Enter watermark"
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        {category === 'edit' && (
          <Card className="mt-4">
            <CardContent className="p-3 space-y-3">
              <h4 className="font-medium text-sm">Edit Settings</h4>
              <div>
                <label className="text-xs font-medium mb-1 block">Rotation Angle</label>
                <select
                  value={rotationAngle}
                  onChange={(e) => setRotationAngle(parseInt(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-input rounded bg-background text-foreground"
                >
                  <option value={90}>90°</option>
                  <option value={180}>180°</option>
                  <option value={270}>270°</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Compression Level</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={compressionLevel}
                  onChange={(e) => setCompressionLevel(parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{compressionLevel}%</span>
              </div>
            </CardContent>
          </Card>
        )}
        
        {category === 'organize' && (
          <Card className="mt-4">
            <CardContent className="p-3 space-y-3">
              <h4 className="font-medium text-sm">Page Settings</h4>
              <div>
                <label className="text-xs font-medium mb-1 block">Page Range</label>
                <Input
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder="e.g., 1-5, 2,4,6"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Main PDF Viewer Component
  const InteractivePdfViewer = ({ files }: { files: UploadedFile[] }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pdfDoc, setPdfDoc] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [scale, setScale] = useState(1.5);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      const loadPdfJs = async () => {
        if (typeof window !== 'undefined' && !window.pdfjsLib) {
          try {
            // Use the local PDF.js worker file
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.async = true;
            script.onload = () => {
              if (window.pdfjsLib) {
                // Use the local worker file to avoid CSP issues
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
              }
            };
            script.onerror = () => {
              console.error('Failed to load PDF.js from CDN');
            };
            document.head.appendChild(script);
          } catch (error) {
            console.error('Error loading PDF.js:', error);
          }
        }
      };
      loadPdfJs();
    }, []);

    useEffect(() => {
      if (files.length > 0) {
        loadPdf(files[0].file);
      }
    }, [files]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const handleClearElements = () => {
          rerenderPage();
        };
        canvas.addEventListener('clearElements', handleClearElements);
        return () => canvas.removeEventListener('clearElements', handleClearElements);
      }
    }, []);

    const loadPdf = async (file: File) => {
      setIsLoading(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        
        // Wait for PDF.js to load
        let attempts = 0;
        while (!window.pdfjsLib && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.pdfjsLib) {
          throw new Error('PDF.js failed to load');
        }

        const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
        renderPage(pdf, 1);
      } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Failed to load PDF');
      } finally {
        setIsLoading(false);
      }
    };

    const renderPage = async (pdf: any, pageNum: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      const context = canvas.getContext('2d');
      if (!context) return;

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Render PDF page
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      // Render edit elements
      renderElements(context);
    };

    const renderElements = (context: CanvasRenderingContext2D) => {
      elements.forEach(element => {
        context.save();
        context.strokeStyle = element.style.color;
        context.fillStyle = element.style.color;
        context.lineWidth = element.style.strokeWidth || 2;

        switch (element.type) {
          case 'text':
            context.font = `${element.style.fontSize || 16}px Arial`;
            context.fillText(element.content || '', element.x, element.y);
            break;
          case 'rectangle':
            context.strokeRect(element.x, element.y, element.width, element.height);
            break;
          case 'circle':
            context.beginPath();
            context.arc(element.x + element.width/2, element.y + element.height/2, Math.min(element.width, element.height)/2, 0, 2 * Math.PI);
            context.stroke();
            break;
        }
        context.restore();
      });
    };

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (tool === 'text' && textContent.trim()) {
        const newElement: EditElement = {
          id: Date.now().toString(),
          type: 'text',
          x,
          y,
          width: 0,
          height: 0,
          content: textContent,
          style: { color: textColor, fontSize }
        };
        setElements(prev => [...prev, newElement]);
        setTextContent('');
        rerenderPage();
      }
    };

    const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (tool === 'select' || tool === 'text') return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const startX = event.clientX - rect.left;
      const startY = event.clientY - rect.top;

      const handleMouseMove = (e: MouseEvent) => {
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;
        
        // Clear and redraw with current shape
        rerenderPage();
        const context = canvas.getContext('2d');
        if (context) {
          context.strokeStyle = textColor;
          context.lineWidth = 2;
          
          if (tool === 'rectangle') {
            context.strokeRect(startX, startY, endX - startX, endY - startY);
          } else if (tool === 'circle') {
            const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) / 2;
            context.beginPath();
            context.arc(startX + (endX - startX)/2, startY + (endY - startY)/2, radius, 0, 2 * Math.PI);
            context.stroke();
          }
        }
      };

      const handleMouseUp = (e: MouseEvent) => {
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;
        
        const newElement: EditElement = {
          id: Date.now().toString(),
          type: tool as 'rectangle' | 'circle',
          x: Math.min(startX, endX),
          y: Math.min(startY, endY),
          width: Math.abs(endX - startX),
          height: Math.abs(endY - startY),
          style: { color: textColor, strokeWidth: 2 }
        };
        
        setElements(prev => [...prev, newElement]);
        
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        rerenderPage();
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const rerenderPage = () => {
      if (pdfDoc) {
        renderPage(pdfDoc, currentPage);
      }
    };

    const nextPage = () => {
      if (currentPage < numPages) {
        setCurrentPage(prev => prev + 1);
        renderPage(pdfDoc, currentPage + 1);
      }
    };

    const prevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        renderPage(pdfDoc, currentPage - 1);
      }
    };

    const zoomIn = () => {
      setScale(prev => Math.min(prev + 0.25, 3));
      if (pdfDoc) renderPage(pdfDoc, currentPage);
    };

    const zoomOut = () => {
      setScale(prev => Math.max(prev - 0.25, 0.5));
      if (pdfDoc) renderPage(pdfDoc, currentPage);
    };

    const savePdf = async () => {
      // For now, just download the current canvas as image
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, `edited_page_${currentPage}.png`);
        }
      });
    };

    if (files.length === 0) {
      return (
        <Card>
          <CardContent className="p-12 text-center">
            <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">Upload a PDF file to start editing</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Interactive PDF Editor
          </CardTitle>
          <CardDescription>
            Click on the PDF to add text, draw shapes, and annotate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-foreground">Tool:</label>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={tool === 'select' ? 'default' : 'outline'}
                    onClick={() => setTool('select')}
                  >
                    <MousePointer className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={tool === 'text' ? 'default' : 'outline'}
                    onClick={() => setTool('text')}
                  >
                    <Type className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={tool === 'rectangle' ? 'default' : 'outline'}
                    onClick={() => setTool('rectangle')}
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={tool === 'circle' ? 'default' : 'outline'}
                    onClick={() => setTool('circle')}
                  >
                    <Circle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {tool === 'text' && (
                <>
                  <div>
                    <label className="text-sm font-medium text-foreground">Text:</label>
                    <Input
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Enter text to add"
                      className="w-40"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Size:</label>
                    <Input
                      type="number"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      min="8"
                      max="72"
                      className="w-20"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-sm font-medium text-foreground">Color:</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded border border-input"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" onClick={clearElements} variant="outline">
                  Clear All
                </Button>
                <Button size="sm" onClick={savePdf} variant="default">
                  <Save className="h-4 w-4 mr-2" />
                  Save Page
                </Button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <div className="flex items-center justify-between p-3 bg-muted/30 border-b">
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={prevPage} disabled={currentPage <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-foreground">
                    Page {currentPage} of {numPages}
                  </span>
                  <Button size="sm" onClick={nextPage} disabled={currentPage >= numPages}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={zoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-foreground">{Math.round(scale * 100)}%</span>
                  <Button size="sm" onClick={zoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 bg-muted/20 text-center overflow-auto max-h-[600px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-foreground">Loading PDF...</span>
                  </div>
                ) : (
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    onMouseDown={handleCanvasMouseDown}
                    className="border border-border cursor-crosshair shadow-sm"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                )}
              </div>
            </div>

            {/* Elements List */}
            {elements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Added Elements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {elements.map((element) => (
                      <div key={element.id} className="flex items-center justify-between p-2 bg-muted/50 rounded border">
                        <span className="text-sm text-foreground">
                          {element.type === 'text' ? `Text: "${element.content}"` : `Shape: ${element.type}`}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setElements(prev => prev.filter(el => el.id !== element.id));
                            rerenderPage();
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const downloadResult = () => {
    if (result) {
      downloadBlob(result.blob, result.filename);
      setResult(null);
    }
  };

  const CategorySection = ({ category, title, icon }: { 
    category: keyof typeof PDF_OPERATIONS, 
    title: string, 
    icon: React.ReactNode 
  }) => {
    const operations = PDF_OPERATIONS[category];
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {operations.map((op) => (
            <Card key={op.operation} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{category}</Badge>
                    {getOperationIcon(op.operation)}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{op.description}</h4>
                    {op.multiFile && (
                      <Badge variant="secondary" className="mt-1 text-xs">Multi-file</Badge>
                    )}
                  </div>
                  <Button 
                    onClick={() => processFile(op)}
                    disabled={isProcessing || files.length === 0}
                    size="sm"
                    className="w-full"
                  >
                    {isProcessing && activeOperation === op.operation ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Execute'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const getOperationIcon = (operation: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'pdf-to-word': <FileText className="h-4 w-4" />,
      'pdf-to-excel': <FileSpreadsheet className="h-4 w-4" />,
      'pdf-to-powerpoint': <Presentation className="h-4 w-4" />,
      'pdf-to-html': <Globe className="h-4 w-4" />,
      'pdf-to-images': <ImageIcon className="h-4 w-4" />,
      'merge-pdfs': <Merge className="h-4 w-4" />,
      'split-pdf': <Scissors className="h-4 w-4" />,
      'rotate-pdf': <RotateCw className="h-4 w-4" />,
      'compress-pdf': <Archive className="h-4 w-4" />,
      'add-watermark': <Droplets className="h-4 w-4" />,
      'add-password': <Lock className="h-4 w-4" />,
      'remove-password': <Unlock className="h-4 w-4" />,
      'extract-text': <Type className="h-4 w-4" />,
      'extract-images': <FileImage className="h-4 w-4" />,
    };
    return iconMap[operation] || <Settings className="h-4 w-4" />;
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-card border-b shadow-sm">
        <div className="flex items-center gap-4 mb-2 sm:mb-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            PDF Editor
          </h1>
          {files.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {files[0].name}
            </Badge>
          )}
        </div>
        
        {/* File Upload Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('file-input')?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload PDF</span>
          </Button>
          <input
            id="file-input"
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onDrop([file]);
              }
            }}
            className="hidden"
          />
        </div>
      </div>

      {files.length === 0 ? (
        /* Upload Area - Full Screen */
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-full max-w-2xl">
            <CardContent className="p-12">
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                `}
              >
                <input {...getInputProps()} />
                <Upload className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
                {isDragActive ? (
                  <p className="text-xl text-primary mb-2">Drop your PDF here!</p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xl font-medium text-foreground">
                      Upload a PDF to get started
                    </p>
                    <p className="text-muted-foreground">
                      Drag & drop or click to browse • Max 100MB
                    </p>
                    <Button className="mt-4">
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Main Editor Layout */
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Tools Panel */}
          <div className="w-16 sm:w-80 bg-card border-r border-border flex flex-col overflow-y-auto">
            <Tabs defaultValue="interactive" orientation="vertical" className="h-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-muted">
                <TabsTrigger value="interactive" className="text-xs sm:text-sm p-2 data-[state=active]:bg-background">
                  <Edit className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Edit</span>
                </TabsTrigger>
                <TabsTrigger value="convert" className="text-xs sm:text-sm p-2 data-[state=active]:bg-background">
                  <FileText className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Convert</span>
                </TabsTrigger>
                <TabsTrigger value="tools" className="text-xs sm:text-sm p-2 data-[state=active]:bg-background">
                  <Settings className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Tools</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="text-xs sm:text-sm p-2 data-[state=active]:bg-background">
                  <Shield className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="extract" className="text-xs sm:text-sm p-2 data-[state=active]:bg-background">
                  <Eye className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Extract</span>
                </TabsTrigger>
                <TabsTrigger value="organize" className="text-xs sm:text-sm p-2 data-[state=active]:bg-background">
                  <Scissors className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Organize</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 p-2 sm:p-4">
                <TabsContent value="interactive" className="mt-0">
                  <InteractiveToolbar />
                </TabsContent>
                <TabsContent value="convert" className="mt-0">
                  <ProcessingTools category="convert" />
                </TabsContent>
                <TabsContent value="tools" className="mt-0">
                  <ProcessingTools category="edit" />
                </TabsContent>
                <TabsContent value="security" className="mt-0">
                  <ProcessingTools category="security" />
                </TabsContent>
                <TabsContent value="extract" className="mt-0">
                  <ProcessingTools category="extract" />
                </TabsContent>
                <TabsContent value="organize" className="mt-0">
                  <ProcessingTools category="organize" />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Main PDF Viewer */}
          <div className="flex-1 flex flex-col bg-muted/30">
            <InteractivePdfViewer files={files} />
          </div>
        </div>
      )}
      
      {/* Result Download Notification */}
      {result && (
        <div className="fixed top-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg z-50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-foreground">File Ready</h3>
              <p className="text-sm text-muted-foreground">{result.filename}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={downloadResult} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => setResult(null)} size="sm" variant="outline">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}