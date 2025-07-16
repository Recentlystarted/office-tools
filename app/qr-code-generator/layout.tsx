import { generateToolMetadata } from '@/lib/seo'

export const metadata = generateToolMetadata('qr-code-generator')

export default function QRCodeGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
