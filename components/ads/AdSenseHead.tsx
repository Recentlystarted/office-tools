'use client'

import Script from 'next/script'
import { ADSENSE_CONFIG } from '@/lib/adsense'

/**
 * AdSense Head Component for Auto Ads
 * Auto Ads handles everything automatically once script is loaded
 */
export function AdSenseHead() {
  // Only render script in production
  if (!ADSENSE_CONFIG.enabled) {
    return null
  }

  return (
    <Script
      id="adsense-auto-ads"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        console.log('AdSense Auto Ads script loaded successfully')
      }}
      onError={(e) => {
        console.error('Failed to load AdSense script:', e)
      }}
    />
  )
}
