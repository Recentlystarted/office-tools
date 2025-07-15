'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { 
  Palette, 
  Upload, 
  Copy, 
  Check, 
  Pipette, 
  ImageIcon,
  RefreshCw,
  Download,
  Eye
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

// Helper function to convert RGB to HEX
const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

// Helper function to convert HEX to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// Helper function to convert RGB to HSL
const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

interface ColorInfo {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  x: number
  y: number
}

const presetColors = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#000000', '#FFFFFF', '#808080', '#800000', '#008000', '#000080',
  '#808000', '#800080', '#008080', '#C0C0C0', '#FFA500', '#800080'
]

export default function ColorPickerPage() {
  const [selectedColor, setSelectedColor] = useState<ColorInfo>({
    hex: '#ff0000',
    rgb: { r: 255, g: 0, b: 0 },
    hsl: { h: 0, s: 100, l: 50 },
    x: 0,
    y: 0
  })
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [customColor, setCustomColor] = useState('#ff0000')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [pickedColors, setPickedColors] = useState<ColorInfo[]>([])
  const [isPickingMode, setIsPickingMode] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Handle image upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setImageFile(file)
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      setIsPickingMode(false)
      toast.success('Image uploaded! Click on the image to pick colors.')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024, // 20MB
  })

  // Update color info when custom color changes
  useEffect(() => {
    const rgb = hexToRgb(customColor)
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      setSelectedColor({
        hex: customColor,
        rgb,
        hsl,
        x: 0,
        y: 0
      })
    }
  }, [customColor])

  // Handle image click for color picking
  const handleImageClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !imageRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Scale coordinates to canvas size
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const canvasX = x * scaleX
    const canvasY = y * scaleY

    // Get pixel data
    const imageData = ctx.getImageData(canvasX, canvasY, 1, 1)
    const [r, g, b] = imageData.data

    const hex = rgbToHex(r, g, b)
    const hsl = rgbToHsl(r, g, b)

    const colorInfo: ColorInfo = {
      hex,
      rgb: { r, g, b },
      hsl,
      x: Math.round(canvasX),
      y: Math.round(canvasY)
    }

    setSelectedColor(colorInfo)
    setCustomColor(hex)

    // Add to picked colors if not already present
    if (!pickedColors.some(color => color.hex === hex)) {
      setPickedColors(prev => [colorInfo, ...prev.slice(0, 9)]) // Keep last 10 colors
    }

    toast.success(`Color picked: ${hex}`)
  }

  // Load image to canvas
  useEffect(() => {
    if (imageUrl && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const img = imageRef.current

      img.onload = () => {
        // Set canvas size to maintain aspect ratio
        const maxWidth = 800
        const maxHeight = 600
        let { width, height } = img

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)
      }
    }
  }, [imageUrl])

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
      toast.success(`${field} copied to clipboard!`)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const removeImage = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl)
    }
    setImageFile(null)
    setImageUrl(null)
    setPickedColors([])
    setIsPickingMode(false)
  }

  const exportPalette = () => {
    if (pickedColors.length === 0) {
      toast.error('No colors picked yet!')
      return
    }

    const paletteData = {
      colors: pickedColors.map(color => ({
        hex: color.hex,
        rgb: color.rgb,
        hsl: color.hsl
      })),
      exportedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(paletteData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'color-palette.json'
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    toast.success('Color palette exported!')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Color Picker</h1>
        <p className="text-lg text-muted-foreground">
          Pick colors from images or choose from presets. Get HEX, RGB, and HSL values instantly.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Color Display & Info */}
        <div className="space-y-6">
          {/* Current Color Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Selected Color
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Color Preview */}
              <div 
                className="w-full h-32 rounded-lg border-2 border-gray-200 shadow-inner"
                style={{ backgroundColor: selectedColor.hex }}
              />

              {/* Color Values */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">HEX</Label>
                    <p className="font-mono text-lg">{selectedColor.hex.toUpperCase()}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(selectedColor.hex.toUpperCase(), 'HEX')}
                  >
                    {copiedField === 'HEX' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">RGB</Label>
                    <p className="font-mono text-lg">
                      {selectedColor.rgb.r}, {selectedColor.rgb.g}, {selectedColor.rgb.b}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(
                      `rgb(${selectedColor.rgb.r}, ${selectedColor.rgb.g}, ${selectedColor.rgb.b})`,
                      'RGB'
                    )}
                  >
                    {copiedField === 'RGB' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">HSL</Label>
                    <p className="font-mono text-lg">
                      {selectedColor.hsl.h}°, {selectedColor.hsl.s}%, {selectedColor.hsl.l}%
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(
                      `hsl(${selectedColor.hsl.h}, ${selectedColor.hsl.s}%, ${selectedColor.hsl.l}%)`,
                      'HSL'
                    )}
                  >
                    {copiedField === 'HSL' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Manual Color Input */}
              <div className="space-y-2">
                <Label htmlFor="customColor">Manual Color Input</Label>
                <div className="flex gap-2">
                  <input
                    id="customColor"
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    placeholder="#ff0000"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preset Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Preset Colors</CardTitle>
              <CardDescription>Click on any color to select it</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2">
                {presetColors.map((color, index) => (
                  <button
                    key={index}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => setCustomColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Image Upload & Picker */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Image Color Picker
              </CardTitle>
              <CardDescription>
                Upload an image and click on it to pick colors
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!imageUrl ? (
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
                      <p className="text-lg text-primary">Drop your image here...</p>
                      <p className="text-sm text-muted-foreground">Release to upload</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xl font-medium">Drop an image here</p>
                      <p className="text-muted-foreground">
                        or click to browse files
                      </p>
                      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-4">
                        <span>🖼️ Image files</span>
                        <span>📦 Max 20MB</span>
                        <span>🎨 Click to pick</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Image Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{imageFile?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(imageFile?.size || 0)} • Click to pick colors
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={removeImage}
                    >
                      Remove
                    </Button>
                  </div>

                  {/* Canvas for color picking */}
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      onClick={handleImageClick}
                      className="max-w-full max-h-96 border rounded-lg cursor-crosshair"
                      style={{ cursor: 'crosshair' }}
                    />
                    <img
                      ref={imageRef}
                      src={imageUrl}
                      alt="Color picker source"
                      className="hidden"
                    />
                    
                    {/* Picking indicator */}
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      <Pipette className="inline h-3 w-3 mr-1" />
                      Click to pick color
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Picked Colors & Tools */}
        <div className="space-y-6">
          {/* Picked Colors History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Picked Colors ({pickedColors.length})</span>
                {pickedColors.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportPalette}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                Colors picked from uploaded image
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pickedColors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Pipette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No colors picked yet</p>
                  <p className="text-sm">Upload an image and click on it to pick colors</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {pickedColors.map((color, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div
                        className="w-8 h-8 rounded border-2 border-gray-200 flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm font-medium">{color.hex.toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">
                          RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(color.hex.toUpperCase(), `picked-${index}`)}
                      >
                        {copiedField === `picked-${index}` ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Color Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Color Tools</CardTitle>
              <CardDescription>Useful color manipulation tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const colors = pickedColors.length > 0 ? pickedColors : [selectedColor]
                  const paletteUrl = `https://coolors.co/${colors.map(c => c.hex.slice(1)).join('-')}`
                  window.open(paletteUrl, '_blank')
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Palette on Coolors
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setPickedColors([])}
                disabled={pickedColors.length === 0}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-12 grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Image Color Picking</h3>
            <p className="text-sm text-muted-foreground">
              Upload any image and click to extract exact color values
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Multiple Formats</h3>
            <p className="text-sm text-muted-foreground">
              Get color values in HEX, RGB, and HSL formats instantly
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Color History</h3>
            <p className="text-sm text-muted-foreground">
              Keep track of picked colors and export as palette
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Quick Copy</h3>
            <p className="text-sm text-muted-foreground">
              One-click copy to clipboard for easy use in design tools
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
