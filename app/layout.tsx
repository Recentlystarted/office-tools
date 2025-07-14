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
      </body>
    </html>
  )
}
