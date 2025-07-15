/**
 * API Configuration - Single Source of Truth
 * Clean, simple, and secure for GitHub Pages deployment
 */

// Main API Configuration
export const API_CONFIG = {
  // API base URL from environment variable - automatically injected during build
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  

  // Request configuration
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '600000'), // 10 minutes
  maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '52428800'), // 50MB
  
  // API endpoints 
  endpoints: {
    // PDF Tools
    pdfToWord: '/api/pdf/convert',
    pdfToDocx: '/api/pdf/convert',
    docxToPdf: '/api/docx/convert-to-pdf',
    pdfMerger: '/api/pdf-merger/merge',
    pdfMergerInfo: '/api/pdf-merger/info',
    pdfCompressor: '/api/pdf-compressor/compress',
    pdfRotate: '/api/pdf-rotate/rotate',
    pdfEditor: '/api/pdf-editor/edit',
    pdfUnlock: '/api/pdf/unlock',
    imageToPdf: '/api/image/to-pdf',
    imageConverter: '/api/image/convert',
    
    // Generators
    qrGenerator: '/api/generator/qr-generate',
    passwordGenerator: '/api/text/password',
    uuidGenerator: '/api/generator/uuid',
    loremGenerator: '/api/text/lorem-ipsum',
    hashGenerator: '/api/text/hash',
    
    // Text Tools
    textCaseConverter: '/api/text/case-convert',
    wordCounter: '/api/text/word-count',
    
    // AI Text Analysis
    textAnalyzer: '/api/text/analyze',
    grammarCheck: '/api/text/grammar-check',
    textRewrite: '/api/text/rewrite',
    
    // Converters
    jsonFormatter: '/api/text/json-format',
    base64Encoder: '/api/text/base64',
    urlEncoder: '/api/text/url-encode',
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
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Enhanced fetch with timeout and error handling
 * Usage: apiRequest(getApiUrl('qrGenerator'), { method: 'POST', body: formData })
 */
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
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

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status
      )
    }

    return response
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408, 'TIMEOUT')
    }
    
    throw error
  }
}

// Legacy exports for backward compatibility
export const API_BASE_URL = API_CONFIG.baseUrl
export const API_TIMEOUT = API_CONFIG.timeout
export const MAX_FILE_SIZE = API_CONFIG.maxFileSize

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  code?: string
  details?: string
}

export interface UploadOptions {
  maxSize?: number
  allowedTypes?: string[]
  multiple?: boolean
}

/**
 * Download blob as file
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
        data: blob,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}
