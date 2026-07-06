import { useNavigate } from "@tanstack/react-router";
import { Download } from "lucide-react";
import type { ReactNode } from "react";
import {
  useDocument,
  useLineItems,
  useActivity,
  useCreateJobCard,
  useConvertQuoteToInvoice,
  useCreateDeliveryNote,
  useUpdateStatus,
  type DocType,
} from "@/lib/queries";
import { generatePDF } from "@/lib/pdf";
import { money, fmtDate, fmtDateTime, DOC_LABELS } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";
import { Breadcrumbs } from "./Breadcrumbs";
import { DeleteDocButton } from "./DeleteDocButton";

interface Props {
  id: string;
  type: DocType;
  listRoute: string;
  listLabel: string;
  actions?: ReactNode;
}

export function DocumentDetail({ id, type, listRoute, listLabel, actions }: Props) {
  const { data: doc, isLoading } = useDocument(id);
  const { data: items = [] } = useLineItems(id);
  const { data: activity = [] } = useActivity(id);
  const nav = useNavigate();

  const convert = useConvertQuoteToInvoice();
  const createDN = useCreateDeliveryNote();
  const createJC = useCreateJobCard();
  const updateStatus = useUpdateStatus();

  if (isLoading) return <div className="p-8 text-sm text-muted-navy">Loading…</div>;
  if (!doc) return <div className="p-8 text-sm text-muted-navy">Not found.</div>;

  const label = DOC_LABELS[type];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <Breadcrumbs items={[{ label: listLabel, to: listRoute }, { label: doc.doc_number }]} />

      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">{doc.doc_number}</h1>
            <StatusBadge status={doc.status} />
          </div>
          <p className="text-sm text-muted-navy mt-1">{label} · {fmtDate(doc.doc_date)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => generatePDF(doc, items)}
            className="btn-uppercase inline-flex items-center gap-2 px-3 py-2 border border-border bg-white text-ink hover:bg-secondary"
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </button>

          {type === "quote" && (
            <>
              <button
                onClick={async () => {
                  const inv = await convert.mutateAsync(doc);
                  if (inv?.id) nav({ to: `/invoices/${inv.id}` });
                }}
                className="btn-uppercase px-3 py-2 bg-royal text-white hover:bg-royal-deep"
              >
                Convert to Invoice
              </button>
              <button
                onClick={async () => {
                  await createJC.mutateAsync(doc);
                  nav({ to: "/jobs" });
                }}
                className="btn-uppercase px-3 py-2 border border-border bg-white text-ink hover:bg-secondary"
              >
                Create Job Card
              </button>
            </>
          )}

          {type === "invoice" && (
            <>
              {doc.status !== "paid" && (
                <button
                  onClick={() => updateStatus.mutate({ id: doc.id, status: "paid", action: "marked_paid" })}
                  className="btn-uppercase px-3 py-2 bg-eco text-white hover:brightness-90"
                >
                  Mark Paid
                </button>
              )}
              <button
                onClick={async () => {
                  const dn = await createDN.mutateAsync(doc);
                  if (dn?.id) nav({ to: `/delivery/${dn.id}` });
                }}
                className="btn-uppercase px-3 py-2 border border-border bg-white text-ink hover:bg-secondary"
              >
                Create Delivery
              </button>
              <button
                onClick={async () => {
                  await createJC.mutateAsync(doc);
                  nav({ to: "/jobs" });
                }}
                className="btn-uppercase px-3 py-2 border border-border bg-white text-ink hover:bg-secondary"
              >
                Create Job Card
              </button>
            </>
          )}

          {type === "delivery_note" && doc.status !== "delivered" && (
            <button
              onClick={() =>
                updateStatus.mutate({ id: doc.id, status: "delivered", action: "marked_delivered" })
              }
              className="btn-uppercase px-3 py-2 bg-eco text-white hover:brightness-90"
            >
              Mark Delivered
            </button>
          )}

          {actions}

          <DeleteDocButton id={doc.id} redirectTo={listRoute} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-md p-4">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-navy">Customer</div>
          <div className="mt-1 font-medium text-ink">{doc.customer_name || "—"}</div>
          {doc.customer_email && <div className="text-xs text-muted-navy mt-1">{doc.customer_email}</div>}
          {doc.customer_phone && <div className="text-xs text-muted-navy">{doc.customer_phone}</div>}
          {doc.customer_address && <div className="text-xs text-muted-navy mt-1">{doc.customer_address}</div>}
        </div>
        <div className="bg-card border border-border rounded-md p-4">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-navy">Project</div>
          <div className="mt-1 text-sm text-ink whitespace-pre-line">{doc.project_description || "—"}</div>
        </div>
        <div className="bg-card border border-border rounded-md p-4">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-navy">Dates</div>
          <div className="mt-1 text-sm text-ink">Issued: {fmtDate(doc.doc_date)}</div>
          {doc.due_date && <div className="text-sm text-ink">Due: {fmtDate(doc.due_date)}</div>}
        </div>
      </div>

      {type !== "job_card" && (
        <div className="bg-card border border-border rounded-md mb-6 overflow-hidden">
          <table className="w-full hidden md:table">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.1em] text-muted-navy border-b border-border">
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right w-24">Qty</th>
                <th className="px-4 py-3 text-right w-32">Unit</th>
                <th className="px-4 py-3 text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id} className="border-b border-border/60">
                  <td className="px-4 py-3 text-sm">{i.description}</td>
                  <td className="px-4 py-3 text-sm text-right">{i.quantity}</td>
                  <td className="px-4 py-3 text-sm text-right">{money(i.unit_price)}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{money(i.total_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="md:hidden divide-y divide-border">
            {items.map((i) => (
              <div key={i.id} className="p-4">
                <div className="text-sm text-ink">{i.description}</div>
                <div className="mt-1 flex justify-between text-xs text-muted-navy">
                  <span>{i.quantity} × {money(i.unit_price)}</span>
                  <span className="font-medium text-ink">{money(i.total_price)}</span>
                </div>
              </div>
            ))}
          </div>
          {type !== "delivery_note" && (
            <div className="border-t border-border p-4 flex justify-end">
              <div className="w-full max-w-xs space-y-1 text-sm">
                <div className="flex justify-between text-muted-navy"><span>Subtotal</span><span>{money(doc.subtotal)}</span></div>
                <div className="flex justify-between text-muted-navy"><span>Tax ({doc.tax_rate}%)</span><span>{money(doc.tax_amount)}</span></div>
                <div className="flex justify-between border-t border-border pt-2 font-serif text-lg text-ink"><span>Total</span><span>{money(doc.total)}</span></div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-card border border-border rounded-md p-4">
        <div className="text-[10px] uppercase tracking-[0.14em] text-muted-navy mb-3">Activity</div>
        {activity.length === 0 ? (
          <div className="text-sm text-muted-navy">No activity yet.</div>
        ) : (
          <ol className="space-y-2">
            {activity.map((a) => (
              <li key={a.id} className="text-sm">
                <span className="text-ink font-medium">{a.description || a.action}</span>
                <span className="text-xs text-muted-navy ml-2">{fmtDateTime(a.performed_at)}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
