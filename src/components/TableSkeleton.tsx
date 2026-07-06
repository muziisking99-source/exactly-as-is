import { cn } from "@/lib/utils";

interface Props {
  rows?: number;
  className?: string;
}

/** Blueprint grid pulse — production-drawing feel, not shimmer */
export function TableSkeleton({ rows = 6, className }: Props) {
  return (
    <div className={cn("relative overflow-hidden", className)} aria-hidden>
      <div
        className="absolute inset-0 blueprint-grid pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(var(--royal) 1px, transparent 1px),
            linear-gradient(90deg, var(--royal) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
          opacity: 0.1,
          animation: "blueprint-breathe 1.8s ease-in-out infinite",
        }}
      />
      <div className="relative space-y-0 divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-12 px-4 flex items-center gap-4">
            <div className="h-3 w-24 rounded bg-secondary/80" />
            <div className="h-3 flex-1 max-w-[140px] rounded bg-secondary/60" />
            <div className="h-3 w-16 rounded bg-secondary/50 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
