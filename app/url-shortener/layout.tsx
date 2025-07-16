import { generateToolMetadata } from '@/lib/seo'

export const metadata = generateToolMetadata('url-shortener')

export default function URLShortenerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
