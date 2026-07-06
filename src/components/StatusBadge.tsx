import { cn } from "@/lib/utils";
import { STATUS_LABELS } from "@/lib/format";
import { StampImpact } from "./StampImpact";
import { useStampOnStatus } from "@/hooks/use-stamp-on-status";

const CLASSES: Record<string, string> = {
  draft: "bg-secondary text-muted-navy border-border",
  sent: "bg-royal/10 text-royal border-royal/20",
  approved: "bg-eco/10 text-eco border-eco/25",
  unpaid: "bg-amber-warn/10 text-amber-warn border-amber-warn/25",
  partially_paid: "bg-amber-warn/10 text-amber-warn border-amber-warn/30",
  paid: "bg-eco/10 text-eco border-eco/25",
  overdue: "bg-danger/10 text-danger border-danger/25",
  cancelled: "bg-secondary text-muted-navy border-border",
  ready: "bg-royal/10 text-royal border-royal/20",
  in_transit: "bg-amber-warn/10 text-amber-warn border-amber-warn/25",
  delivered: "bg-eco/10 text-eco border-eco/25",
  returned: "bg-danger/10 text-danger border-danger/25",
  pending: "bg-secondary text-muted-navy border-border",
  in_progress: "bg-royal/10 text-royal border-royal/20",
  completed: "bg-eco/10 text-eco border-eco/25",
};

interface Props {
  status: string;
  /** Pass document id so stamp fires once on status transition */
  docId?: string;
}

export function StatusBadge({ status, docId }: Props) {
  const stampGen = useStampOnStatus(docId, status);
  const seed = docId ?? status;

  return (
    <StampImpact status={status} stampGen={stampGen} seed={seed}>
      <span
        className={cn(
          "inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] font-semibold border rounded-md font-mono",
          CLASSES[status] ?? "bg-secondary text-muted-navy border-border",
        )}
      >
        {STATUS_LABELS[status] ?? status}
      </span>
    </StampImpact>
  );
}
