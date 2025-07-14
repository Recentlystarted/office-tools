/**
 * API Configuration - Secure for GitHub Pages Static Export
 * Uses build-time environment variables for API endpoints
 */

// API configuration optimized for static export
export const API_CONFIG = {
  // Use build-time environment variable that gets replaced during build
  // This will be https://api.tundasportsclub.com in production
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.tundasportsclub.com',
  
  // API endpoints - direct to your real API since we can't use proxy routes in static export
  endpoints: {
    // PDF Tools  
    pdfToWord: '/api/pdf/convert',
    pdfMerger: '/api/pdf-merger/merge', 
    pdfCompressor: '/api/pdf-compressor/compress',
    pdfUnlock: '/api/pdf-unlock/unlock',
    imageToPdf: '/api/image-to-pdf/convert',
    
    // Generators
    qrGenerator: '/api/generator/qr-generate',
    passwordGenerator: '/api/text/password',
    uuidGenerator: '/api/generator/uuid',
    loremGenerator: '/api/text/lorem-ipsum',
    hashGenerator: '/api/text/hash',
    
    // Text Tools
    textCaseConverter: '/api/text/case-convert',
    wordCounter: '/api/text/word-count',
    
    // Converters
    jsonFormatter: '/api/text/json-format',
    base64Encoder: '/api/text/base64',
    urlEncoder: '/api/text/url-encode',
  },
  
  // Request configuration
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '600000'),
  maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '52428800'),
}

/**
 * Build API URL for frontend calls
 */
export const getApiUrl = (toolName: string): string => {
  const endpoint = API_CONFIG.endpoints[toolName as keyof typeof API_CONFIG.endpoints]
  if (!endpoint) {
    throw new Error(`Unknown tool: ${toolName}`)
  }
  return `${API_CONFIG.baseUrl}${endpoint}`
}

/**
 * Common API request headers
 */
export const getApiHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
})

/**
 * API error handling
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
 * Make API request with proper error handling
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
