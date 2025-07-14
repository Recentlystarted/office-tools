'use client'

import { useEffect } from 'react'
import { ADSENSE_CONFIG, initAutoAds } from '@/lib/adsense'

/**
 * Simple Auto Ads Component for Google AdSense
 * No manual ad slots needed - Google handles placement automatically
 */
export function AutoAdsDisplay({ className = '' }: { className?: string }) {
  useEffect(() => {
    // Initialize Auto Ads when component mounts
    if (ADSENSE_CONFIG.enabled) {
      initAutoAds()
    }
  }, [])

  // Don't render anything in development
  if (!ADSENSE_CONFIG.enabled) {
    return (
      <div 
        className={`bg-muted/30 border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center p-4 ${className}`}
        style={{ minHeight: '100px' }}
      >
        <span className="text-muted-foreground text-sm">
          Auto Ads Space (Development Mode)
        </span>
      </div>
    )
  }

  // For Auto Ads, we just need to return null or a minimal container
  // Google will automatically inject ads where appropriate
  return <div className={`auto-ads-container ${className}`} />
}

/**
 * Legacy components for backward compatibility
 * These are simplified since Auto Ads handle placement automatically
 */

export function HeaderBannerAd({ className = '' }: { className?: string }) {
  return <AutoAdsDisplay className={`header-banner-placeholder ${className}`} />
}

export function SidebarAd({ className = '' }: { className?: string }) {
  return <AutoAdsDisplay className={`sidebar-placeholder ${className}`} />
}

export function InContentAd({ className = '' }: { className?: string }) {
  return <AutoAdsDisplay className={`content-placeholder ${className}`} />
}

export function FooterAd({ className = '' }: { className?: string }) {
  return <AutoAdsDisplay className={`footer-placeholder ${className}`} />
}

// Keep the AdUnit component for any manual ad units you might add later
export function AdUnit({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  className = '',
  style = {},
}: {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  responsive?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  // For Auto Ads setup, manual ad units are not needed
  // This is kept for potential future manual ad units
  return <AutoAdsDisplay className={className} />
}
