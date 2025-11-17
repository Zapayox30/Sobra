import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  href?: string
  className?: string
  showText?: boolean
}

const sizeClasses = {
  sm: {
    badge: 'px-2 py-1 text-base rounded-lg',
    dollar: 'text-lg',
    text: 'text-base'
  },
  md: {
    badge: 'px-3 py-1.5 text-xl rounded-lg',
    dollar: 'text-2xl',
    text: 'text-xl'
  },
  lg: {
    badge: 'px-4 py-2 text-2xl rounded-xl',
    dollar: 'text-3xl',
    text: 'text-2xl'
  },
  xl: {
    badge: 'px-6 py-3 text-4xl rounded-2xl',
    dollar: 'text-5xl',
    text: 'text-7xl'
  }
}

export function Logo({ 
  size = 'md', 
  href = '/dashboard', 
  className,
  showText = true 
}: LogoProps) {
  const sizes = sizeClasses[size]
  
  const content = (
    <div className={cn("flex items-center gap-2 group", className)}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-brand rounded-lg opacity-20 blur-xl group-hover:opacity-30 transition-opacity" />
        <div className={cn(
          "relative bg-gradient-brand text-white font-bold tracking-tight shadow-lg group-hover:scale-105 transition-transform",
          sizes.badge
        )}>
          SO<span className={cn("text-purple-300", sizes.dollar)}>$</span>
        </div>
      </div>
      {showText && (
        <span className={cn("font-bold text-gradient", sizes.text)}>
          SOBRA
        </span>
      )}
    </div>
  )
  
  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    )
  }
  
  return content
}

