import React from "react"

type Variant = "primary" | "secondary" | "outline" | "destructive" | "ghost"

interface ButtonProps {
  variant?: Variant
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function Button({
  variant = "primary",
  children,
  onClick,
  disabled = false,
  fullWidth = true,
  size = "lg",
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"

  const sizes = {
    sm: "h-10 px-4 text-sm",
    md: "h-12 px-6 text-[15px]",
    lg: "h-14 px-6 text-[16px] tracking-wide",
  }

  const variants: Record<Variant, string> = {
    primary: disabled
      ? "bg-[#9DBFA0] text-white cursor-not-allowed"
      : "bg-brand text-white active:bg-brand-hover focus-visible:ring-brand",
    secondary: disabled
      ? "bg-white border border-[#D1CCBF] text-[#B0ADA6] cursor-not-allowed"
      : "bg-white border border-brand text-brand active:bg-brand-pale",
    outline: disabled
      ? "border border-[#D1CCBF] text-[#B0ADA6] cursor-not-allowed"
      : "border border-border text-charcoal active:bg-[#F0ECE4]",
    destructive: disabled
      ? "bg-[#F4AEAE] text-white cursor-not-allowed"
      : "bg-danger text-white active:bg-[#B91C1C] focus-visible:ring-danger",
    ghost: "bg-transparent text-brand underline-offset-2 active:opacity-60",
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={[
        base,
        sizes[size],
        variants[variant],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="font-display">{children}</span>
    </button>
  )
}
