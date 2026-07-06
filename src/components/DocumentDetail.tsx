import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Download, Pencil, Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import {
  useDocument,
  useLineItems,
  useActivity,
  useCreateJobCard,
  useConvertQuoteToInvoice,
  useCreateDeliveryNote,
  usePayments,
  useRecordPayment,
  useUpdatePayment,
  useDeletePayment,
  useIsAdmin,
  useUpdateStatus,
  invoiceAmountPaid,
  invoiceBalance,
  type DocType,
  type PaymentRow,
} from "@/lib/queries";
import { generatePDF } from "@/lib/pdf";
import { money, fmtDate, fmtDateTime, DOC_LABELS, INVOICE_PAYMENT_TERMS } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";
import { Breadcrumbs } from "./Breadcrumbs";
import { DeleteDocButton } from "./DeleteDocButton";
import { PaymentFormDialog } from "./PaymentForm";
import { applyVtDirection, getVtDirection } from "@/lib/view-transitions";

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
  const { data: payments = [] } = usePayments(type === "invoice" ? id : undefined);
  const nav = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = useIsAdmin();

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentRow | null>(null);

  const recordPayment = useRecordPayment();
  const updatePayment = useUpdatePayment();
  const deletePayment = useDeletePayment();

  const go = (to: string) => {
    applyVtDirection(getVtDirection(pathname, to));
    nav({ to });
  };

  const convert = useConvertQuoteToInvoice();
  const createDN = useCreateDeliveryNote();
  const createJC = useCreateJobCard();
  const updateStatus = useUpdateStatus();

  if (isLoading) return <div className="p-8 text-sm text-muted-navy">Loading…</div>;
  if (!doc) return <div className="p-8 text-sm text-muted-navy">Not found.</div>;

  const label = DOC_LABELS[type];
  const amountPaid = type === "invoice" ? invoiceAmountPaid(payments) : 0;
  const balance = type === "invoice" ? invoiceBalance(doc, payments) : 0;

  function openRecordPayment() {
    setEditingPayment(null);
    setPaymentOpen(true);
  }

  function openEditPayment(p: PaymentRow) {
    setEditingPayment(p);
    setPaymentOpen(true);
  }

  async function handlePaymentSubmit(values: {
    amount: number;
    payment_date: string;
    reference: string;
    notes: string;
  }) {
    if (editingPayment) {
      await updatePayment.mutateAsync({
        id: editingPayment.id,
        invoice_id: doc!.id,
        invoice_total: Number(doc!.total),
        amount: values.amount,
        payment_date: values.payment_date,
        reference: values.reference || null,
        notes: values.notes || null,
      });
    } else {
      await recordPayment.mutateAsync({
        invoice_id: doc!.id,
        invoice_total: Number(doc!.total),
        amount: values.amount,
        payment_date: values.payment_date,
        reference: values.reference,
        notes: values.notes,
      });
    }
    setPaymentOpen(false);
    setEditingPayment(null);
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <Breadcrumbs items={[{ label: listLabel, to: listRoute }, { label: doc.doc_number }]} />

      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">{doc.doc_number}</h1>
            <StatusBadge status={doc.status} docId={doc.id} />
          </div>
          <p className="text-sm text-muted-navy mt-1">{label} · {fmtDate(doc.doc_date)}</p>
          {type === "invoice" && doc.customer_id && (
            <Link
              to="/customers/$id/statement"
              params={{ id: doc.customer_id }}
              className="text-xs text-royal hover:underline mt-1 inline-block"
            >
              Customer statement →
            </Link>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => generatePDF(doc, items)}
            className="btn-uppercase inline-flex items-center gap-2 px-3 py-2 border border-border bg-card text-ink hover:bg-secondary"
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </button>

          {type === "quote" && (
            <>
              <button
                onClick={async () => {
                  const inv = await convert.mutateAsync(doc);
                  if (inv?.id) go(`/invoices/${inv.id}`);
                }}
                className="btn-uppercase px-3 py-2 bg-royal text-primary-foreground hover:bg-royal-deep"
              >
                Convert to Invoice
              </button>
              <button
                onClick={async () => {
                  await createJC.mutateAsync(doc);
                  go("/jobs");
                }}
                className="btn-uppercase px-3 py-2 border border-border bg-card text-ink hover:bg-secondary"
              >
                Create Job Card
              </button>
            </>
          )}

          {type === "invoice" && (
            <>
              {balance > 0.001 && (
                <>
                  <button
                    onClick={openRecordPayment}
                    className="btn-uppercase inline-flex items-center gap-1 px-3 py-2 bg-eco text-white hover:brightness-90"
                  >
                    <Plus className="w-3.5 h-3.5" /> Record Payment
                  </button>
                  <button
                    onClick={() =>
                      recordPayment.mutate({
                        invoice_id: doc.id,
                        invoice_total: Number(doc.total),
                        amount: balance,
                        payment_date: new Date().toISOString().slice(0, 10),
                      })
                    }
                    className="btn-uppercase px-3 py-2 border border-eco/40 text-eco hover:bg-eco/5"
                  >
                    Mark fully paid
                  </button>
                </>
              )}
              <button
                onClick={async () => {
                  const dn = await createDN.mutateAsync(doc);
                  if (dn?.id) go(`/delivery/${dn.id}`);
                }}
                className="btn-uppercase px-3 py-2 border border-border bg-card text-ink hover:bg-secondary"
              >
                Create Delivery
              </button>
              <button
                onClick={async () => {
                  await createJC.mutateAsync(doc);
                  go("/jobs");
                }}
                className="btn-uppercase px-3 py-2 border border-border bg-card text-ink hover:bg-secondary"
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
        <div className="glass-card p-4">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-navy">Customer</div>
          <div className="mt-1 font-medium text-ink">{doc.customer_name || "—"}</div>
          {doc.customer_email && <div className="text-xs text-muted-navy mt-1">{doc.customer_email}</div>}
          {doc.customer_phone && <div className="text-xs text-muted-navy">{doc.customer_phone}</div>}
          {doc.customer_address && <div className="text-xs text-muted-navy mt-1">{doc.customer_address}</div>}
        </div>
        <div className="glass-card p-4">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-navy">Project</div>
          <div className="mt-1 text-sm text-ink whitespace-pre-line">{doc.project_description || "—"}</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-navy">Dates</div>
          <div className="mt-1 text-sm text-ink">Issued: {fmtDate(doc.doc_date)}</div>
          {doc.due_date && <div className="text-sm text-ink">Due: {fmtDate(doc.due_date)}</div>}
          {type === "invoice" && (
            <div className="text-xs text-muted-navy mt-2">Payment terms: {INVOICE_PAYMENT_TERMS}</div>
          )}
        </div>
      </div>

      {type === "invoice" && (
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-muted-navy">Total </span>
              <span className="font-mono font-medium text-ink">{money(doc.total)}</span>
            </div>
            <div>
              <span className="text-muted-navy">Paid </span>
              <span className="font-mono font-medium text-eco">{money(amountPaid)}</span>
            </div>
            <div>
              <span className="text-muted-navy">Balance due </span>
              <span className="font-mono font-semibold text-ink">{money(balance)}</span>
            </div>
          </div>
        </div>
      )}

      {type === "invoice" && (
        <div className="glass-card mb-6 overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.14em] text-muted-navy">Payments</div>
            {balance > 0.001 && (
              <button
                type="button"
                onClick={openRecordPayment}
                className="text-xs text-royal hover:underline"
              >
                + Add payment
              </button>
            )}
          </div>
          {payments.length === 0 ? (
            <div className="p-4 text-sm text-muted-navy">No payments recorded yet.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.1em] text-muted-navy border-b border-border">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Notes</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-border/60">
                    <td className="px-4 py-3 text-sm">{fmtDate(p.payment_date)}</td>
                    <td className="px-4 py-3 text-sm text-right font-mono">{money(p.amount)}</td>
                    <td className="px-4 py-3 text-sm text-muted-navy">{p.reference || "—"}</td>
                    <td className="px-4 py-3 text-sm text-muted-navy">{p.notes || "—"}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditPayment(p)}
                        className="text-muted-navy hover:text-royal"
                        title="Edit payment"
                      >
                        <Pencil className="w-4 h-4 inline" />
                      </button>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() =>
                            deletePayment.mutate({
                              id: p.id,
                              invoice_id: doc.id,
                              invoice_total: Number(doc.total),
                            })
                          }
                          className="text-muted-navy hover:text-danger"
                          title="Delete payment"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {type !== "job_card" && (
        <div className="glass-card mb-6 overflow-hidden">
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
                <div className="flex justify-between border-t border-border pt-2 font-serif text-lg text-ink font-mono"><span>Total</span><span>{money(doc.total)}</span></div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="glass-card p-4">
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

      {type === "invoice" && (
        <PaymentFormDialog
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          balance={balance}
          editing={editingPayment}
          loading={recordPayment.isPending || updatePayment.isPending}
          onSubmit={handlePaymentSubmit}
        />
      )}
    </div>
  );
}
