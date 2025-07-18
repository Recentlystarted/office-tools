/**
 * API Configuration - Production Ready with Stirling-PDF Fallback
 * Configured for office-tools.in deployment
 */

// Main API Configuration
export const API_CONFIG = {
  // Use direct API only - no fallback complexity
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 
           process.env.NEXT_PUBLIC_API_BASE_URL || 
           'http://localhost:5000',
  
  // Stirling-PDF direct access for testing
  stirlingBaseUrl: process.env.NEXT_PUBLIC_STIRLING_URL || 'http://localhost:8080',
  
  // Request configuration
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '600000'), // 10 minutes for complex PDFs
  maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '52428800'), // 50MB
  
  // API endpoints - updated to match actual VPS backend structure
  endpoints: {
    // PDF Tools - Corrected endpoints
    pdfToWord: '/api/pdf/convert',
    pdfToDocx: '/api/pdf/convert',
    docxToPdf: '/api/docx/convert-to-pdf',
    htmlToDocx: '/api/html-to-docx/convert',
    pdfMerger: '/api/pdf-merger/merge',
    pdfMergerInfo: '/api/pdf-merger/info',
    pdfCompressor: '/api/pdf-compressor/compress',
    pdfCompressorInfo: '/api/pdf-compressor/info',
    pdfRotate: '/api/pdf-rotate/rotate',
    pdfEditor: '/api/pdf-editor/edit',
    pdfUnlock: '/api/pdf/unlock',
    imageToPdf: '/api/image/to-pdf',
    imageConverter: '/api/image/convert',
    
    // Health and Info endpoints
    health: '/health',
    apiInfo: '/api',
    
    // Service info endpoints
    pdfInfo: '/api/pdf/info',
    imageInfo: '/api/image/info',
    textInfo: '/api/text/info',
    
    // Advanced Stirling-PDF operations (if available via gateway)
    stirlingConvert: '/api/stirling/convert',
    stirlingMerge: '/api/stirling/merge-pdfs',
    stirlingSplit: '/api/stirling/split-pages',
    stirlingRotate: '/api/stirling/rotate-pdf',
    stirlingCompress: '/api/stirling/compress-pdf',
    stirlingExtractImages: '/api/stirling/extract-images',
    stirlingExtractText: '/api/stirling/extract-text',
    stirlingWatermark: '/api/stirling/add-watermark',
    stirlingProtect: '/api/stirling/add-password',
    stirlingRemovePassword: '/api/stirling/remove-password',
    stirlingMetadata: '/api/stirling/change-metadata',
    stirlingBookmarks: '/api/stirling/get-info-on-pdf',
    stirlingPageNumbers: '/api/stirling/add-page-numbers',
    stirlingBlankPages: '/api/stirling/remove-blank-pages',
    stirlingOcr: '/api/stirling/ocr-pdf',
    stirlingRepair: '/api/stirling/repair',
    stirlingFlatten: '/api/stirling/flatten',
    stirlingScale: '/api/stirling/scale-pages',
    
    // Generators - corrected to match backend
    qrGenerator: '/api/generator/qr-generate',
    passwordGenerator: '/api/text/password',
    uuidGenerator: '/api/generator/uuid-generate',
    loremGenerator: '/api/generator/lorem-generate',
    hashGenerator: '/api/generator/hash-generate',
    
    // Text Tools - corrected paths
    textCaseConverter: '/api/text/text-case',
    wordCounter: '/api/text/word-count',
    base64Encoder: '/api/text/base64',
    urlEncoder: '/api/text/url-encode',
    
    // AI Text Analysis - updated paths
    textAnalyzer: '/api/text/analyze',
    grammarCheck: '/api/text/grammar-check',
    textRewrite: '/api/text/rewrite',
    
    // Tools - corrected to match backend
    jsonFormatter: '/api/tools/json-format',
    timestampConverter: '/api/tools/timestamp-convert',
    colorPicker: '/api/tools/color-convert',
    urlShortener: '/api/tools/url-shorten'
  }
}

/**
 * Get full API URL for any tool
 * Usage: getApiUrl('qrGenerator') → 'https://your-api-domain.com/api/generator/qr-generate'
 */
export const getApiUrl = (toolName: string): string => {
  const endpoint = API_CONFIG.endpoints[toolName as keyof typeof API_CONFIG.endpoints]
  if (!endpoint) {
    throw new Error(`Unknown tool: ${toolName}`)
  }
  return `${API_CONFIG.baseUrl}${endpoint}`
}

/**
 * Common API headers
 */
export const getApiHeaders = (includeAuth: boolean = false): Record<string, string> => {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  }
  
  if (includeAuth) {
    // Add any auth headers if needed in the future
  }
  
  return headers
}

/**
 * API Error class
 */
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * API Response type
 */
export interface ApiResponse {
  success: boolean
  data?: any
  error?: string
  message?: string
}

/**
 * Enhanced API request with error handling and timeout
 */
export const apiRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...getApiHeaders(),
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408)
      }
      throw new ApiError(`Network error: ${error.message}`)
    }
    throw new ApiError('Unknown network error')
  }
}

/**
 * Simple direct API request without fallback complexity
 */
export const smartPdfRequest = async (
  endpoint: string,
  options: RequestInit,
  file?: File
): Promise<Response> => {
  const response = await apiRequest(endpoint, {
    ...options,
    signal: options.signal || AbortSignal.timeout(API_CONFIG.timeout),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response;
};

/**
 * Stirling-PDF direct request - with CORS handling
 */
export const stirlingPdfRequest = async (
  endpoint: string,
  formData: FormData,
  options: { signal?: AbortSignal } = {}
): Promise<Response> => {
  // Use direct Sterling PDF URL from environment
  const stirlingUrl = `${API_CONFIG.stirlingBaseUrl}/api/v1/convert/pdf/docx`;
  
  console.log(`Using Stirling-PDF direct: ${stirlingUrl}`);
  
  try {
    // Make direct request to Sterling PDF
    const response = await fetch(stirlingUrl, {
      method: 'POST',
      body: formData,
      mode: 'cors', // Enable CORS
      signal: options.signal || AbortSignal.timeout(API_CONFIG.timeout),
    });

    if (!response.ok) {
      throw new Error(`Stirling-PDF request failed: ${response.status} ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('Stirling-PDF request error:', error);
    throw error;
  }
};

/**
 * Test API connectivity
 */
export const testApiConnectivity = async (): Promise<{
  primary: boolean
  stirling: boolean
  primaryTime?: number
  stirlingTime?: number
}> => {
  const result = {
    primary: false,
    stirling: false,
    primaryTime: undefined as number | undefined,
    stirlingTime: undefined as number | undefined,
  }

  // Test primary API
  try {
    const start = Date.now()
    const response = await fetch(`${API_CONFIG.baseUrl}/health`)
    result.primaryTime = Date.now() - start
    result.primary = response.ok
  } catch (error) {
    console.error('Primary API test failed:', error)
  }

  // Test Stirling-PDF API
  try {
    const start = Date.now()
    const response = await fetch(`${API_CONFIG.stirlingBaseUrl}/`)
    result.stirlingTime = Date.now() - start
    result.stirling = response.ok
  } catch (error) {
    console.error('Stirling-PDF test failed:', error)
  }

  return result
}

/**
 * Intelligent API URL resolver with fallback detection
 */
export const getSmartApiUrl = async (toolName: string): Promise<string> => {
  const endpoint = API_CONFIG.endpoints[toolName as keyof typeof API_CONFIG.endpoints]
  if (!endpoint) {
    throw new Error(`Unknown tool: ${toolName}`)
  }

  // Test if the main API is responsive
  try {
    const connectivity = await testApiConnectivity()
    return `${API_CONFIG.baseUrl}${endpoint}`
  } catch (error) {
    // Fallback to base URL if main API is down
    console.warn('Main API appears to be down, using fallback')
    return `${API_CONFIG.baseUrl}${endpoint}`
  }
}

// Legacy exports for backward compatibility
export const API_BASE_URL = API_CONFIG.baseUrl
export const API_TIMEOUT = API_CONFIG.timeout

/**
 * Download blob file
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Simple API client for legacy compatibility
 */
export const apiClient = {
  async uploadFile(options: { 
    endpoint: string, 
    file: File, 
    onProgress?: (progress: number) => void 
  }): Promise<ApiResponse> {
    const formData = new FormData()
    formData.append('file', options.file)
    
    try {
      const response = await fetch(options.endpoint, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        }
      }
      
      const blob = await response.blob()
      return {
        success: true,
        data: { blob, filename: options.file.name }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}
