import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" && "h-8 px-3 text-sm",
        size === "md" && "h-10 px-4 text-sm",
        variant === "primary" &&
          "bg-[var(--color-accent)] text-white hover:brightness-110 dark:text-[var(--color-canvas)]",
        variant === "ghost" && "hover:bg-[var(--color-panel-muted)] text-[var(--color-ink)]",
        variant === "outline" &&
          "border border-[var(--color-line)] bg-[var(--color-panel)] hover:bg-[var(--color-panel-muted)]",
        className,
      )}
      {...props}
    />
  );
}
