import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


export const colors = {
  primary: "#ED467E",
  black: "#1a172b",
  white: "#ffffff",
  grey: "#D9D9D9"
}


const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        customGrey: "bg-[#D9D9D9] text-[#25458E] hover:bg-[ED467E] hover:!text-white",
      },
      size: {
        default: "<h-9></h-9> px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-3xl gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-3xl px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
       color: {
        default: "bg-[#ED467E] text-white hover:bg-[#D9D9D9] hover:!text-[#25458E]",
        primary: "bg-[#ED467E] text-white hover:bg-[#D9D9D9] hover:!text-[#25458E]",
        grey: "bg-[#D9D9D9] text-[#25458E] hover:bg-[#ED467E] hover:!text-white",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      color: "default"
    },
  }
)

function Button({
  className,
  variant,
  size,
  color,
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
      className={cn(buttonVariants({ variant, size, className, color }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
