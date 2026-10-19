import { RENDER_MODES, type RenderMode } from "@genui-lab/experiment-core";
import { cn } from "@/lib/cn";

interface ModeSelectorProps {
  value: RenderMode;
  onChange: (mode: RenderMode) => void;
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
        Representation
      </legend>
      <div role="radiogroup" aria-label="Representation mode" className="space-y-1">
        {RENDER_MODES.map((mode) => {
          const selected = value === mode.id;
          const disabled = mode.status === "planned";
          return (
            <button
              key={mode.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-disabled={disabled}
              disabled={disabled}
              title={mode.description}
              onClick={() => onChange(mode.id)}
              className={cn(
                "flex w-full items-start gap-2 rounded-md border px-3 py-2 text-left transition-colors",
                selected
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                  : "border-transparent hover:bg-[var(--color-panel-muted)]",
                disabled && "cursor-not-allowed opacity-45 hover:bg-transparent",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "mt-1 h-2.5 w-2.5 shrink-0 rounded-full border",
                  selected
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                    : "border-[var(--color-ink-muted)]",
                )}
              />
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="text-sm font-medium">{mode.name}</span>
                  {disabled ? (
                    <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--color-ink-muted)]">
                      planned
                    </span>
                  ) : null}
                </span>
                <span className="mt-0.5 block text-xs text-[var(--color-ink-muted)]">
                  {mode.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
