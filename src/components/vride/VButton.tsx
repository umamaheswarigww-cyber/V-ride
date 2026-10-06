"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "brand" | "accent" | "ghost" | "ghostDark";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "vride-btn-primary",
  brand: "vride-btn-brand",
  accent: "vride-btn-accent",
  ghost: "vride-btn-ghost",
  ghostDark: "vride-btn-ghost-dark",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-base",
};

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const VButton = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(VARIANTS[variant], SIZES[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);
VButton.displayName = "VButton";
