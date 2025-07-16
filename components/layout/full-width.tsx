import { ReactNode } from 'react'

interface FullWidthLayoutProps {
  children: ReactNode
  className?: string
}

/**
 * Full-width layout component that removes container limitations
 * for modern, full-screen designs
 */
export function FullWidthLayout({ children, className = '' }: FullWidthLayoutProps) {
  return (
    <div className={`w-full min-h-screen ${className}`}>
      {children}
    </div>
  )
}

/**
 * Centered content container with max-width for better readability
 */
interface CenteredContentProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl'
  className?: string
}

export function CenteredContent({ 
  children, 
  maxWidth = '6xl',
  className = '' 
}: CenteredContentProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl'
  }

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  )
}

/**
 * Section wrapper for full-width sections with centered content
 */
interface SectionProps {
  children: ReactNode
  background?: 'default' | 'muted' | 'primary' | 'secondary'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl'
  className?: string
}

export function Section({ 
  children, 
  background = 'default',
  padding = 'lg',
  maxWidth = '6xl',
  className = '' 
}: SectionProps) {
  const backgroundClasses = {
    default: 'bg-background',
    muted: 'bg-muted/30',
    primary: 'bg-primary/5',
    secondary: 'bg-secondary/5'
  }

  const paddingClasses = {
    none: '',
    sm: 'py-4',
    md: 'py-8', 
    lg: 'py-12',
    xl: 'py-20'
  }

  return (
    <section className={`w-full ${backgroundClasses[background]} ${paddingClasses[padding]} ${className}`}>
      <CenteredContent maxWidth={maxWidth}>
        {children}
      </CenteredContent>
    </section>
  )
}
