import { generateToolMetadata } from '@/lib/seo'

export const metadata = generateToolMetadata('pdf-merger')

export default function PDFMergerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
