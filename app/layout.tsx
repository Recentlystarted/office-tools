import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/sonner'
import { AdSenseHead } from '@/components/ads/AdSenseHead'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://office-tools.in'),
  title: 'Office Tools - Professional PDF & Document Tools',
  description: 'A comprehensive collection of 25+ professional online tools for PDF processing, document conversion, text manipulation, and office productivity.',
  keywords: 'PDF converter, PDF to Word, PDF merger, QR code generator, password generator, office tools, document conversion',
  authors: [{ name: 'Office Tools Team' }],
  creator: 'Office Tools',
  publisher: 'Office Tools',
  robots: 'index, follow',
  verification: {
    google: '5696950830848605', // AdSense publisher ID for verification
  },
  other: {
    'google-adsense-account': 'ca-pub-5696950830848605',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' }
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Office Tools - Professional PDF & Document Tools',
    description: 'Free online tools for PDF processing, document conversion, and office productivity.',
    url: 'https://office-tools.in',
    siteName: 'Office Tools',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Office Tools - Professional PDF & Document Tools',
    description: 'Free online tools for PDF processing, document conversion, and office productivity.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Prevent FOUC and layout shifts */
            html { visibility: hidden; opacity: 0; }
            html.hydrated { visibility: visible; opacity: 1; transition: opacity 0.3s ease; }
            
            /* Fix webkit text size adjust */
            html, body { -webkit-text-size-adjust: 100%; }
            
            /* Prevent layout shifts during hydration */
            * { box-sizing: border-box; }
            
            /* AdSense optimization */
            .adsbygoogle { display: block !important; }
          `
        }} />
      </head>
      <body className={inter.className}>
        <AdSenseHead />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
        <script dangerouslySetInnerHTML={{
          __html: `
            // Mark HTML as hydrated to prevent FOUC
            document.documentElement.classList.add('hydrated');
            
            // Fix AdSense layout issues
            (function() {
              var ads = document.querySelectorAll('.adsbygoogle');
              ads.forEach(function(ad) {
                if (!ad.getAttribute('data-ad-status')) {
                  ad.style.display = 'block';
                }
              });
            })();
          `
        }} />
      </body>
    </html>
  )
}
