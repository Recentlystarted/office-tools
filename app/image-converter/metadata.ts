import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Image Converter Online - Convert JPG, PNG, WebP, GIF, BMP, TIFF, SVG, ICO',
  description: 'Convert images between different formats online for free. Support for JPG, PNG, WebP, GIF, BMP, TIFF, SVG, and ICO. Batch conversion, high quality, fast processing.',
  keywords: [
    'image converter',
    'convert images online',
    'JPG to PNG converter',
    'PNG to JPG converter', 
    'WebP converter',
    'SVG converter',
    'ICO converter',
    'TIFF converter',
    'free image conversion',
    'batch image converter',
    'image format converter',
    'online image tools'
  ],
  authors: [{ name: 'Office Tools' }],
  creator: 'Office Tools',
  publisher: 'Office Tools',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://office-tools.in'),
  alternates: {
    canonical: '/image-converter'
  },
  openGraph: {
    title: 'Free Image Converter Online - Convert JPG, PNG, WebP, GIF, BMP, TIFF, SVG, ICO',
    description: 'Convert images between different formats online for free. Support for JPG, PNG, WebP, GIF, BMP, TIFF, SVG, and ICO. Batch conversion, high quality, fast processing.',
    url: '/image-converter',
    siteName: 'Office Tools',
    images: [
      {
        url: '/og-image-converter.jpg',
        width: 1200,
        height: 630,
        alt: 'Image Converter Tool'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Image Converter Online - Convert JPG, PNG, WebP, GIF, BMP, TIFF, SVG, ICO',
    description: 'Convert images between different formats online for free. Support for JPG, PNG, WebP, GIF, BMP, TIFF, SVG, and ICO.',
    images: ['/og-image-converter.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default metadata
