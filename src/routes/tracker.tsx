import { createFileRoute, Link } from "@tanstack/react-router";
import { useDocuments } from "@/lib/queries";
import { StatusBadge } from "@/components/StatusBadge";
import { fmtDate, money, DOC_LABELS } from "@/lib/format";
import { FileText, Receipt, Truck, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/tracker")({ component: TrackerPage });

function TrackerPage() {
  const { data: docs = [], isLoading } = useDocuments();

  const quotes = docs.filter((d) => d.doc_type === "quote");

  // Group children by parent quote
  const relatedToQuote = (quoteId: string) =>
    docs.filter((d) => d.parent_id === quoteId || (d.doc_type === "delivery_note" && parentInvoiceOf(d.parent_id, quoteId)));

  function parentInvoiceOf(parentId: string | null, quoteId: string) {
    if (!parentId) return false;
    const p = docs.find((x) => x.id === parentId);
    return p?.parent_id === quoteId;
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="page-title">Order Tracker</h1>
        <p className="text-sm text-muted-navy mt-1">Quote-centric timeline of every order.</p>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-muted-navy">Loading…</div>
      ) : quotes.length === 0 ? (
        <div className="bg-card border border-border rounded-md p-8 text-center text-sm text-muted-navy">
          No quotes yet.
        </div>
      ) : (
        <ol className="space-y-4">
          {quotes.map((q) => {
            const related = relatedToQuote(q.id);
            return (
              <li key={q.id} className="bg-card border border-border rounded-md p-4 md:p-6">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <Link to={`/quotes/${q.id}`} className="font-serif text-xl text-ink hover:text-royal">
                      {q.doc_number}
                    </Link>
                    <div className="text-sm text-muted-navy">{q.customer_name || "—"} · {fmtDate(q.doc_date)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={q.status} />
                    <span className="text-sm text-ink font-medium">{money(q.total)}</span>
                  </div>
                </div>

                {related.length > 0 && (
                  <ul className="mt-4 border-l-2 border-royal/30 pl-4 space-y-2">
                    {related.map((r) => (
                      <li key={r.id} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-secondary grid place-items-center text-muted-navy">
                          {iconFor(r.doc_type)}
                        </div>
                        <Link
                          to={detailRouteFor(r.doc_type, r.id)}
                          className="text-sm text-ink hover:text-royal"
                        >
                          {DOC_LABELS[r.doc_type]} · {r.doc_number}
                        </Link>
                        <StatusBadge status={r.status} />
                        <span className="text-xs text-muted-navy ml-auto">{fmtDate(r.created_at)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function iconFor(t: string) {
  if (t === "quote") return <FileText className="w-3 h-3" />;
  if (t === "invoice") return <Receipt className="w-3 h-3" />;
  if (t === "delivery_note") return <Truck className="w-3 h-3" />;
  return <ClipboardList className="w-3 h-3" />;
}

function detailRouteFor(t: string, id: string) {
  if (t === "invoice") return `/invoices/${id}`;
  if (t === "delivery_note") return `/delivery/${id}`;
  if (t === "job_card") return `/jobs`;
  return `/quotes/${id}`;
}
