import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'font-body font-semibold tracking-wide rounded-lg',
    'min-h-[52px]',
    'transition-all duration-[250ms] ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-brand-navy text-white',
          'hover:bg-[#0d3590] hover:shadow-btn-primary',
        ],
        secondary: [
          'bg-white text-brand-navy border border-brand-navy',
          'hover:bg-brand-navy hover:text-white',
        ],
        ghost: [
          'text-brand-cyan bg-transparent',
          'hover:underline',
        ],
      },
      size: {
        sm: 'text-[13px] py-2 px-4',
        md: 'text-[15px] py-3 px-6',
        lg: 'text-base py-4 px-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

export function Button({
  variant,
  size,
  asChild = false,
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={!asChild && (isLoading || disabled)}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          {children}
        </>
      ) : (
        children
      )}
    </Comp>
  )
}
