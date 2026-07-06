import { cn } from "@/lib/utils";
import { STATUS_LABELS } from "@/lib/format";

const CLASSES: Record<string, string> = {
  draft: "bg-secondary text-muted-navy border-border",
  sent: "bg-blue-50 text-royal border-royal/20",
  approved: "bg-emerald-50 text-eco border-eco/30",
  unpaid: "bg-amber-50 text-amber-warn border-amber-warn/30",
  paid: "bg-emerald-50 text-eco border-eco/30",
  overdue: "bg-red-50 text-danger border-danger/30",
  cancelled: "bg-secondary text-muted-navy border-border",
  ready: "bg-blue-50 text-royal border-royal/20",
  in_transit: "bg-amber-50 text-amber-warn border-amber-warn/30",
  delivered: "bg-emerald-50 text-eco border-eco/30",
  returned: "bg-red-50 text-danger border-danger/30",
  pending: "bg-secondary text-muted-navy border-border",
  in_progress: "bg-blue-50 text-royal border-royal/20",
  completed: "bg-emerald-50 text-eco border-eco/30",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] font-semibold border rounded-sm",
        CLASSES[status] ?? "bg-secondary text-muted-navy border-border",
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
