/**
 * Google AdSense Configuration
 * Optimized for Auto Ads - much simpler setup!
 */

// AdSense configuration for Auto Ads
export const ADSENSE_CONFIG = {
  // Your AdSense Publisher ID (ca-pub-xxxxxxxxxxxxxxxx)
  // This is safe to be public as it's used in the client-side code
  publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-0000000000000000',
  
  // Enable/disable ads based on environment
  enabled: process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID,
  
  // Auto Ads don't need manual slot configuration!
  // Google will automatically place ads on your pages
  autoAdsEnabled: true,
}

/**
 * Load Google AdSense script for Auto Ads
 */
export const loadAdSenseScript = () => {
  if (typeof window === 'undefined' || !ADSENSE_CONFIG.enabled) {
    return
  }

  // Check if script is already loaded
  if (document.querySelector(`script[src*="adsbygoogle.js"]`)) {
    return
  }

  const script = document.createElement('script')
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.publisherId}`
  script.async = true
  script.crossOrigin = 'anonymous'
  
  // Add error handling
  script.onerror = () => {
    console.warn('AdSense script failed to load')
  }
  
  // Enable Auto Ads globally
  script.onload = () => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: ADSENSE_CONFIG.publisherId,
        enable_page_level_ads: true
      })
      console.log('AdSense Auto Ads initialized successfully')
    } catch (error) {
      console.warn('AdSense Auto Ads initialization failed:', error)
    }
  }
  
  document.head.appendChild(script)
}

/**
 * Initialize Auto Ads (simplified for auto ads)
 */
export const initAutoAds = () => {
  if (typeof window === 'undefined' || !ADSENSE_CONFIG.enabled) {
    return
  }

  try {
    // @ts-ignore
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch (error) {
    console.warn('AdSense Auto Ads push failed:', error)
  }
}
