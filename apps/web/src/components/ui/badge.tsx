import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "normal" | "warning" | "critical" | "info";
}

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  normal: "bg-[var(--color-ok-soft)] text-[var(--color-ok)]",
  warning: "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  critical: "bg-[var(--color-critical-soft)] text-[var(--color-critical)]",
  info: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
};

export function Badge({ className, tone = "info", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
