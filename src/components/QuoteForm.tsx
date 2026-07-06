import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCreateQuote, type QuoteFormInput } from "@/lib/queries";
import { CustomerFields } from "@/components/CustomerFields";
import { LineItemGrid, emptyLineItem } from "@/components/LineItemGrid";

export function QuoteForm() {
  const nav = useNavigate();
  const create = useCreateQuote();
  const [form, setForm] = useState<QuoteFormInput>({
    customer_id: null,
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    project_description: "",
    notes: "",
    tax_rate: 15,
    status: "draft",
    doc_date: new Date().toISOString().slice(0, 10),
    items: [emptyLineItem()],
  });

  const update = (patch: Partial<QuoteFormInput>) => setForm((f) => ({ ...f, ...patch }));

  async function submit(status: "draft" | "sent") {
    if (!form.customer_name.trim()) return;
    const doc = await create.mutateAsync({ ...form, status });
    if (doc?.id) nav({ to: `/quotes/${doc.id}` });
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="page-title">New Quote</h1>
        <p className="text-sm text-muted-navy mt-1">Fill in the details and add line items.</p>
      </div>

      <CustomerFields
        value={form}
        onChange={(patch) => update(patch)}
      />

      <section className="glass-card p-4 md:p-6 space-y-4">
        <h2 className="text-[11px] uppercase tracking-[0.14em] text-muted-navy">Dates</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-navy">Quote date</label>
            <input
              type="date"
              value={form.doc_date}
              onChange={(e) => update({ doc_date: e.target.value })}
              className="mt-1 input-field"
            />
          </div>
        </div>
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
          onClick={() => submit("draft")}
          disabled={create.isPending}
          className="btn-uppercase px-4 py-2 border border-border bg-card text-ink hover:bg-secondary"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={() => submit("sent")}
          disabled={create.isPending}
          className="btn-uppercase px-4 py-2 bg-royal text-primary-foreground hover:bg-royal-deep"
        >
          Save & Send
        </button>
      </div>
    </div>
  );
}
