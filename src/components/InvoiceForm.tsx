import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCreateInvoice, type InvoiceFormInput } from "@/lib/queries";
import { dueDateFromDocDate, INVOICE_PAYMENT_TERMS } from "@/lib/format";
import { CustomerFields } from "@/components/CustomerFields";
import { LineItemGrid, emptyLineItem } from "@/components/LineItemGrid";

const defaultDueDate = () => dueDateFromDocDate(new Date().toISOString().slice(0, 10));

export function InvoiceForm() {
  const nav = useNavigate();
  const create = useCreateInvoice();
  const [form, setForm] = useState<InvoiceFormInput>({
    customer_id: null,
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    project_description: "",
    notes: "",
    tax_rate: 15,
    doc_date: new Date().toISOString().slice(0, 10),
    due_date: defaultDueDate(),
    items: [emptyLineItem()],
  });

  const update = (patch: Partial<InvoiceFormInput>) => setForm((f) => ({ ...f, ...patch }));

  async function submit() {
    if (!form.customer_name.trim()) return;
    const doc = await create.mutateAsync(form);
    if (doc?.id) nav({ to: `/invoices/${doc.id}` });
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="page-title">New Invoice</h1>
        <p className="text-sm text-muted-navy mt-1">Create an invoice directly — no quote required.</p>
      </div>

      <CustomerFields value={form} onChange={(patch) => update(patch)} />

      <section className="glass-card p-4 md:p-6 space-y-4">
        <h2 className="text-[11px] uppercase tracking-[0.14em] text-muted-navy">Dates</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-navy">Invoice date</label>
            <input
              type="date"
              value={form.doc_date}
              onChange={(e) => {
                const doc_date = e.target.value;
                update({ doc_date, due_date: dueDateFromDocDate(doc_date) });
              }}
              className="mt-1 input-field"
            />
          </div>
          <div>
            <label className="text-xs text-muted-navy">Due date</label>
            <input
              type="date"
              value={form.due_date}
              onChange={(e) => update({ due_date: e.target.value })}
              className="mt-1 input-field"
            />
          </div>
        </div>
        <p className="text-xs text-muted-navy">Payment terms: {INVOICE_PAYMENT_TERMS}</p>
      </section>

      <section className="glass-card p-4 md:p-6 space-y-4">
        <h2 className="text-[11px] uppercase tracking-[0.14em] text-muted-navy">Project</h2>
        <textarea
          value={form.project_description}
          onChange={(e) => update({ project_description: e.target.value })}
          rows={3}
          className="w-full input-field"
          placeholder="Describe the job / order…"
        />
      </section>

      <LineItemGrid
        items={form.items}
        taxRate={form.tax_rate}
        onItemsChange={(items) => update({ items })}
        onTaxRateChange={(tax_rate) => update({ tax_rate })}
      />

      <div className="flex flex-wrap gap-2 justify-end">
        <button
          type="button"
          onClick={submit}
          disabled={create.isPending}
          className="btn-uppercase px-4 py-2 bg-royal text-primary-foreground hover:bg-royal-deep"
        >
          Create Invoice
        </button>
      </div>
    </div>
  );
}
