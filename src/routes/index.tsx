import { createFileRoute, Link } from "@tanstack/react-router";
import { useDocuments, useIsAdmin } from "@/lib/queries";
import { money, fmtDate, isOverdue } from "@/lib/format";
import { FileText, Receipt, Truck, ClipboardList, TrendingUp } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: docs = [], isLoading } = useDocuments();
  const isAdmin = useIsAdmin();

  const quotes = docs.filter((d) => d.doc_type === "quote");
  const invoices = docs.filter((d) => d.doc_type === "invoice");
  const deliveries = docs.filter((d) => d.doc_type === "delivery_note");
  const jobs = docs.filter((d) => d.doc_type === "job_card");

  const pendingQuotes = quotes.filter((d) => d.status === "draft" || d.status === "sent").length;
  const unpaid = invoices.filter((d) => d.status !== "paid" && d.status !== "cancelled");
  const overdue = unpaid.filter(isOverdue).length;
  const inMotion = deliveries.filter((d) => d.status === "ready" || d.status === "in_transit").length;
  const activeJobs = jobs.filter((d) => d.status !== "completed").length;
  const outstandingAmount = unpaid.reduce((s, d) => s + Number(d.total), 0);

  const recent = docs.slice(0, 8);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-sm text-muted-navy mt-1">Alpine-Eco operations at a glance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card
          icon={<FileText className="w-5 h-5" />}
          label="Pending Quotes"
          value={isLoading ? "…" : pendingQuotes}
          to="/quotes"
          tint="royal"
        />
        <Card
          icon={<Receipt className="w-5 h-5" />}
          label="Unpaid Invoices"
          value={isLoading ? "…" : unpaid.length}
          sub={overdue > 0 ? `${overdue} overdue` : undefined}
          to="/invoices"
          tint={overdue > 0 ? "danger" : "amber"}
        />
        <Card
          icon={<Truck className="w-5 h-5" />}
          label="Deliveries in Motion"
          value={isLoading ? "…" : inMotion}
          to="/delivery"
          tint="royal"
        />
        <Card
          icon={<ClipboardList className="w-5 h-5" />}
          label="Active Jobs"
          value={isLoading ? "…" : activeJobs}
          to="/jobs"
          tint="eco"
        />
      </div>

      {isAdmin && (
        <div className="bg-royal text-white rounded-md p-5 md:p-6 flex items-center gap-4">
          <TrendingUp className="w-8 h-8" />
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-[0.14em] text-white/70">Outstanding invoice total</div>
            <div className="font-serif text-3xl mt-1">{money(outstandingAmount)}</div>
          </div>
          <Link to="/invoices" className="btn-uppercase px-3 py-2 border border-white/40 hover:bg-white/10">
            Review
          </Link>
        </div>
      )}

      <div className="bg-card border border-border rounded-md">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-[11px] uppercase tracking-[0.14em] text-muted-navy">Recent activity</h2>
          <Link to="/tracker" className="text-xs text-royal hover:underline">Tracker →</Link>
        </div>
        {recent.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-navy">
            {isLoading ? "Loading…" : "No documents yet. Create your first quote."}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((d) => (
              <li key={d.id} className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-secondary grid place-items-center text-muted-navy">
                  {iconFor(d.doc_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink truncate">
                    {d.doc_number} · {d.customer_name || "—"}
                  </div>
                  <div className="text-xs text-muted-navy">{fmtDate(d.created_at)}</div>
                </div>
                <StatusBadge status={d.status} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-navy/70 text-center">Built by Muzi</div>
    </div>
  );
}

function iconFor(t: string) {
  if (t === "quote") return <FileText className="w-4 h-4" />;
  if (t === "invoice") return <Receipt className="w-4 h-4" />;
  if (t === "delivery_note") return <Truck className="w-4 h-4" />;
  return <ClipboardList className="w-4 h-4" />;
}

function Card({
  icon,
  label,
  value,
  sub,
  to,
  tint,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: string;
  to: string;
  tint: "royal" | "eco" | "amber" | "danger";
}) {
  const bar =
    tint === "royal" ? "bg-royal" : tint === "eco" ? "bg-eco" : tint === "amber" ? "bg-amber-warn" : "bg-danger";
  return (
    <Link
      to={to}
      className="bg-card border border-border rounded-md p-4 hover:shadow-sm transition-shadow relative overflow-hidden"
    >
      <div className={`absolute top-0 left-0 h-1 w-full ${bar}`} />
      <div className="flex items-center gap-2 text-muted-navy">
        {icon}
        <span className="text-[11px] uppercase tracking-[0.1em]">{label}</span>
      </div>
      <div className="mt-2 font-serif text-3xl text-ink">{value}</div>
      {sub && <div className="text-xs text-danger mt-1">{sub}</div>}
    </Link>
  );
}
