import { generateToolMetadata } from '@/lib/seo'

export const metadata = generateToolMetadata('word-counter')

export default function WordCounterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
