import { generateToolMetadata } from '@/lib/seo'

export const metadata = generateToolMetadata('password-generator')

export default function PasswordGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
