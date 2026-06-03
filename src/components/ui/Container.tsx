import { cn } from '@/lib/utils'
import type { BaseComponentProps } from '@/types'

interface ContainerProps extends BaseComponentProps {
  narrow?: boolean
  wide?: boolean
  as?: React.ElementType
}

export function Container({
  children,
  className,
  narrow,
  wide,
  as: As = 'div',
}: ContainerProps) {
  return (
    <As
      className={cn(
        'mx-auto px-5 sm:px-6 lg:px-8',
        narrow ? 'max-w-3xl' : wide ? 'max-w-7xl' : 'max-w-6xl',
        className,
      )}
    >
      {children}
    </As>
  )
}
