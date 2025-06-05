import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps, cva } from "class-variance-authority"
import * as React from "react"

import LoadingSpinner from "../global/LoadingSpinner"

const baseButtonClassnames = "transition-all"
const buttonAppearanceClassnames =
  "relative select-none items-center justify-center transition-all shrink-0 text-base font-medium rounded-full inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background gap-1"

const buttonVariants = cva(baseButtonClassnames, {
  variants: {
    variant: {
      default: cn(
        buttonAppearanceClassnames,
        "border border-primary bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary active:ring-4 active:ring-offset-2 active:ring-primary/40 active:bg-primary/80 active:scale-[0.98]",
      ),
      destructive: cn(
        buttonAppearanceClassnames,
        "border border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive active:ring-4 active:ring-offset-2 active:ring-destructive/40 active:bg-destructive/80 active:scale-[0.98]",
      ),
      warning: cn(
        buttonAppearanceClassnames,
        "border border-warning bg-orange-400 dark:bg-orange-800 text-white dark:text-warning-foreground hover:bg-warning-dark/90 focus-visible:ring-warning active:ring-4 active:ring-offset-2 active:ring-warning/40 active:bg-warning-dark/80 active:scale-[0.98]",
      ),
      outline: cn(
        buttonAppearanceClassnames,
        "border border-input dark:border-white/10 bg-transparent hover:bg-background-inverse/5 hover:text-accent-foreground focus-visible:ring-accent active:ring-4 active:ring-offset-2 active:ring-accent/40 active:bg-accent/10 active:scale-[0.98]",
      ),
      "outline-warning": cn(
        buttonAppearanceClassnames,
        "border border-warning-dark bg-transparent text-warning-dark dark:text-warning hover:bg-warning-dark dark:hover:text-white hover:text-white focus-visible:ring-warning active:ring-4 active:ring-offset-2 active:ring-warning/40 active:bg-warning-dark/80 active:text-white active:scale-[0.98]",
      ),
      info: cn(
        buttonAppearanceClassnames,
        "border border-info bg-info text-info-foreground dark:bg-info-dark dark:text-white hover:bg-info-dark dark:hover:text-white focus-visible:ring-info active:ring-4 active:ring-offset-2 active:ring-info/40 active:bg-info-dark/80 active:scale-[0.98]",
      ),
      "outline-info": cn(
        buttonAppearanceClassnames,
        "border border-info-dark bg-transparent text-info-dark dark:text-info hover:bg-info-dark dark:hover:text-white focus-visible:ring-info active:ring-4 active:ring-offset-2 active:ring-info/40 active:bg-info-dark/80 active:text-white active:scale-[0.98]",
      ),
      secondary: cn(
        buttonAppearanceClassnames,
        "border-2 border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary active:ring-4 active:ring-offset-2 active:ring-secondary/40 active:bg-secondary/70 active:scale-[0.98]",
      ),
      ghost: cn(
        buttonAppearanceClassnames,
        "border border-transparent hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent active:ring-4 active:ring-offset-2 active:ring-accent/40 active:bg-accent/80 active:scale-[0.98]",
      ),
      link: cn(
        "underline-offset-4 hover:underline text-[inherit] active:text-primary/80 active:underline disabled:opacity-50 disabled:pointer-events-none",
      ),
      premium: cn(
        buttonAppearanceClassnames,
        "font-bold bg-clip-padding border-[2px] before:-m-[2px] rounded-md before:rounded-md border-transparent bg-white dark:bg-secondary text-primary hover:before:bg-gradient-to-r hover:before:from-pink-500 hover:before:to-purple-500 before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 hover:bg-white/90 dark:hover:bg-secondary/90 relative before:content before:absolute before:z-[-1] before:inset-0 before:bg-primary before:transition-opacity before:duration-500 before:delay-100 hover:before:opacity-100 active:ring-4 active:ring-offset-2 active:ring-pink-500/40 active:scale-[0.98] active:before:opacity-90",
      ),
      none: cn(
        "inline-flex text-[inherit] p-0 h-auto w-auto text-left items-center active:ring-4 active:ring-offset-2 active:ring-accent/40 active:opacity-80",
      ),
    },
    size: {
      none: "p-0 h-auto w-auto ",
      default: "py-2 px-4",
      icon: "p-2",
      "icon-sm": "p-1",
      xs: "py-0.5 px-2 text-xs",
      sm: "py-1 px-3",
      lg: "py-4 px-8",
    },
  },
  compoundVariants: [
    {
      variant: ["none", "link"],
      size: ["default", "sm", "lg", "icon", "icon-sm"],
      class: "p-0 h-auto w-auto",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  loadingProps?: React.ComponentProps<typeof LoadingSpinner>
  asChild?: boolean
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      className,
      children,
      fullWidth,
      loading: isLoading,
      loadingProps = {},
      size,
      type = "button",
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const buttonSize = ["none", "link"].includes(variant as string)
      ? "none"
      : (size ?? "default")

    const buttonClassnames = cn(
      buttonVariants({ variant, size: buttonSize }),
      fullWidth && "w-full",
      isLoading && 'relative [&_svg:not([aria-label="Loading"])]:hidden',
      className,
    )

    if (asChild) {
      return (
        <Slot className={buttonClassnames} {...props}>
          {children}
        </Slot>
      )
    }

    return (
      <button
        className={buttonClassnames}
        data-loading={isLoading}
        ref={ref}
        type={type}
        disabled={props.disabled || isLoading}
        {...props}
      >
        <>
          {isLoading ? (
            <LoadingSpinner
              {...loadingProps}
              aria-label="Loading"
              className={cn("relative", loadingProps.className)}
            />
          ) : null}
          {children}
        </>
      </button>
    )
  },
)

Button.displayName = "Button"

export { Button, buttonVariants }
