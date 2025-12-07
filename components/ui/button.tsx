import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "touch-optimized inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-destructive/30 aria-invalid:border-destructive active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow active:shadow-inner",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/40 shadow-sm hover:shadow active:shadow-inner",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted hover:text-foreground shadow-sm active:bg-muted/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm active:bg-secondary/70",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/80",
        link: "text-accent underline-offset-4 hover:underline hover:text-accent",
      },
      size: {
        default: "min-h-[44px] h-10 px-5 py-2.5 has-[>svg]:px-4",
        sm: "min-h-[40px] h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3",
        lg: "min-h-[48px] h-12 rounded-lg px-8 has-[>svg]:px-6 text-base",
        icon: "size-10 min-w-[44px] min-h-[44px]",
        "icon-sm": "size-9 min-w-[40px] min-h-[40px]",
        "icon-lg": "size-12 min-w-[48px] min-h-[48px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
