'use client'

import { useEffect } from 'react'
import { ADSENSE_CONFIG } from '@/lib/adsense'

/**
 * AdSense Head Component for Auto Ads
 * Uses direct script injection to avoid Next.js Script component issues
 */
export function AdSenseHead() {
  // Only render in production
  if (!ADSENSE_CONFIG.enabled) {
    return null
  }

  useEffect(() => {
    // Check if script is already loaded
    if (document.querySelector(`script[src*="${ADSENSE_CONFIG.publisherId}"]`)) {
      return
    }

    // Create and inject AdSense script
    const script = document.createElement('script')
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.publisherId}`
    script.async = true
    script.crossOrigin = 'anonymous'
    
    script.onload = () => {
      console.log('AdSense Auto Ads script loaded successfully')
    }
    
    script.onerror = () => {
      console.error('Failed to load AdSense script')
    }

    // Add to head
    document.head.appendChild(script)

    // Cleanup function
    return () => {
      const existingScript = document.querySelector(`script[src*="${ADSENSE_CONFIG.publisherId}"]`)
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return null
}
