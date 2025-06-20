
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 hover:scale-[1.02] shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98]",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-[1.02] shadow-lg hover:shadow-red-500/25 active:scale-[0.98]",
        outline:
          "border-2 border-slate-600 bg-transparent text-slate-300 hover:bg-slate-800/80 hover:text-white hover:border-cyan-500/70 hover:scale-[1.02] backdrop-blur-sm active:scale-[0.98]",
        secondary:
          "bg-slate-800 text-slate-100 hover:bg-slate-700 hover:scale-[1.02] shadow-md active:scale-[0.98]",
        ghost: "text-slate-300 hover:bg-slate-800/60 hover:text-white hover:scale-[1.02] active:scale-[0.98]",
        link: "text-cyan-400 underline-offset-4 hover:underline hover:text-cyan-300 hover:scale-[1.02] active:scale-[0.98]",
        premium: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 hover:scale-[1.02] shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]",
        success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:scale-[1.02] shadow-lg hover:shadow-green-500/25 active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-shimmer opacity-0 hover:opacity-100 transition-opacity duration-500" />
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
