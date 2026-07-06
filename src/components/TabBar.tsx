import { cn } from "@/lib/utils";

export interface Tab { value: string; label: string; count?: number }

export function TabBar({
  tabs,
  value,
  onChange,
}: {
  tabs: Tab[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-1 border-b border-border overflow-x-auto -mx-1 px-1">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={cn(
              "px-3 py-2 text-[11px] uppercase tracking-[0.1em] font-semibold border-b-2 -mb-px whitespace-nowrap transition-all duration-300",
              active
                ? "border-royal text-royal"
                : "border-transparent text-muted-navy hover:text-ink hover:border-border",
            )}
            style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className="ml-1.5 text-muted-navy/70 normal-case">({t.count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
