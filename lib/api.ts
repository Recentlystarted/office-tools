// API Base URL from environment or default
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'https://api.tundasportsclub.com'
export const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '600000') // 10 minutes
export const MAX_FILE_SIZE = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '52428800') // 50MB

// API Response type
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  code?: string
  details?: string
}

// File upload options
export interface UploadOptions {
  endpoint: string
  file: File
  additionalData?: Record<string, any>
  onProgress?: (progress: number) => void
  timeout?: number
}

// Generic API helper class
export class ApiClient {
  private baseUrl: string
  private timeout: number

  constructor(baseUrl = API_BASE_URL, timeout = API_TIMEOUT) {
    this.baseUrl = baseUrl
    this.timeout = timeout
  }

  // Upload file to API
  async uploadFile(options: UploadOptions): Promise<Blob | ApiResponse> {
    const { endpoint, file, additionalData = {}, onProgress, timeout = this.timeout } = options
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`)
    }

    const formData = new FormData()
    formData.append('file', file)
    
    // Add any additional form data
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value)
    })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
          'Accept': 'application/octet-stream, application/json',
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        // Try to parse error response as JSON
        let errorData: ApiResponse
        try {
          errorData = await response.json()
        } catch {
          errorData = {
            success: false,
            error: `HTTP ${response.status}: ${response.statusText}`,
            code: 'HTTP_ERROR'
          }
        }
        throw new Error(errorData.error || 'API request failed')
      }

      // Check content type
      const contentType = response.headers.get('content-type')
      
      if (contentType?.includes('application/json')) {
        // JSON response (error or status)
        return await response.json()
      } else {
        // Binary response (file)
        return await response.blob()
      }

    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again with a smaller file.')
        }
        throw error
      }
      throw new Error('Unknown error occurred')
    }
  }

  // Post JSON data
  async postJson<T = any>(endpoint: string, data: any): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
          code: 'HTTP_ERROR'
        }))
        throw new Error(errorData.error || 'API request failed')
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out')
        }
        throw error
      }
      throw new Error('Unknown error occurred')
    }
  }

  // Get request
  async get<T = any>(endpoint: string): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
          code: 'HTTP_ERROR'
        }))
        throw new Error(errorData.error || 'API request failed')
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out')
        }
        throw error
      }
      throw new Error('Unknown error occurred')
    }
  }
}

// Default API client instance
export const apiClient = new ApiClient()

// Utility function to download blob as file
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Utility function to get file extension
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

// Utility function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
