import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCreateQuote, useCustomers, type QuoteFormInput } from "@/lib/queries";
import { money } from "@/lib/format";
import { Trash2, Plus } from "lucide-react";

const emptyItem = () => ({ description: "", quantity: 1, unit_price: 0 });

export function QuoteForm() {
  const nav = useNavigate();
  const create = useCreateQuote();
  const customers = useCustomers();
  const [customerQuery, setCustomerQuery] = useState("");
  const [form, setForm] = useState<QuoteFormInput>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    project_description: "",
    notes: "",
    tax_rate: 15,
    status: "draft",
    doc_date: new Date().toISOString().slice(0, 10),
    items: [emptyItem()],
  });

  const matches = useMemo(
    () =>
      customerQuery
        ? customers.filter((c) => c.name.toLowerCase().includes(customerQuery.toLowerCase())).slice(0, 5)
        : [],
    [customers, customerQuery],
  );

  const subtotal = form.items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
  const tax = subtotal * (form.tax_rate / 100);
  const total = subtotal + tax;

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

      <section className="bg-card border border-border rounded-md p-4 md:p-6 space-y-4">
        <h2 className="text-[11px] uppercase tracking-[0.14em] text-muted-navy">Customer</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="text-xs text-muted-navy">Name *</label>
            <input
              value={form.customer_name}
              onChange={(e) => {
                update({ customer_name: e.target.value });
                setCustomerQuery(e.target.value);
              }}
              className="mt-1 w-full px-3 py-2 border border-border rounded bg-white focus:border-royal outline-none"
            />
            {matches.length > 0 && form.customer_name.length > 0 && (
              <ul className="absolute z-10 top-full left-0 right-0 bg-white border border-border rounded-md mt-1 shadow-sm max-h-48 overflow-auto">
                {matches.map((c) => (
                  <li
                    key={c.name}
                    onClick={() => {
                      update({
                        customer_name: c.name,
                        customer_email: c.email ?? "",
                        customer_phone: c.phone ?? "",
                        customer_address: c.address ?? "",
                      });
                      setCustomerQuery("");
                    }}
                    className="px-3 py-2 text-sm hover:bg-secondary cursor-pointer"
                  >
                    <div className="text-ink">{c.name}</div>
                    {c.email && <div className="text-xs text-muted-navy">{c.email}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="text-xs text-muted-navy">Email</label>
            <input
              value={form.customer_email}
              onChange={(e) => update({ customer_email: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-border rounded bg-white focus:border-royal outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-muted-navy">Phone</label>
            <input
              value={form.customer_phone}
              onChange={(e) => update({ customer_phone: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-border rounded bg-white focus:border-royal outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-muted-navy">Address</label>
            <input
              value={form.customer_address}
              onChange={(e) => update({ customer_address: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-border rounded bg-white focus:border-royal outline-none"
            />
          </div>
        </div>
      </section>

      <section className="bg-card border border-border rounded-md p-4 md:p-6 space-y-4">
        <h2 className="text-[11px] uppercase tracking-[0.14em] text-muted-navy">Project</h2>
        <textarea
          value={form.project_description}
          onChange={(e) => update({ project_description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded bg-white focus:border-royal outline-none"
          placeholder="Describe the job / order…"
        />
      </section>

      <section className="bg-card border border-border rounded-md p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[11px] uppercase tracking-[0.14em] text-muted-navy">Line Items</h2>
          <button
            onClick={() => update({ items: [...form.items, emptyItem()] })}
            className="btn-uppercase inline-flex items-center gap-1 px-2 py-1 text-royal border border-royal/30 hover:bg-blue-50"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {form.items.map((it, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-[1fr_80px_120px_120px_40px] gap-2 items-center bg-secondary/30 md:bg-transparent p-3 md:p-0 rounded"
            >
              <input
                placeholder="Description"
                value={it.description}
                onChange={(e) => {
                  const items = [...form.items];
                  items[idx] = { ...it, description: e.target.value };
                  update({ items });
                }}
                className="px-3 py-2 border border-border rounded bg-white focus:border-royal outline-none"
              />
              <input
                type="number"
                min={0}
                step="0.5"
                value={it.quantity}
                onChange={(e) => {
                  const items = [...form.items];
                  items[idx] = { ...it, quantity: parseFloat(e.target.value) || 0 };
                  update({ items });
                }}
                className="px-3 py-2 border border-border rounded bg-white focus:border-royal outline-none text-right"
              />
              <input
                type="number"
                min={0}
                step="0.01"
                value={it.unit_price}
                onChange={(e) => {
                  const items = [...form.items];
                  items[idx] = { ...it, unit_price: parseFloat(e.target.value) || 0 };
                  update({ items });
                }}
                className="px-3 py-2 border border-border rounded bg-white focus:border-royal outline-none text-right"
              />
              <div className="text-right text-sm font-medium text-ink">
                {money(it.quantity * it.unit_price)}
              </div>
              <button
                onClick={() => {
                  const items = form.items.filter((_, i) => i !== idx);
                  update({ items: items.length ? items : [emptyItem()] });
                }}
                className="text-muted-navy hover:text-danger justify-self-end"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <label className="text-xs text-muted-navy">Tax rate (%)</label>
            <input
              type="number"
              min={0}
              value={form.tax_rate}
              onChange={(e) => update({ tax_rate: parseFloat(e.target.value) || 0 })}
              className="mt-1 w-32 px-3 py-2 border border-border rounded bg-white focus:border-royal outline-none"
            />
          </div>
          <div className="w-full md:w-64 space-y-1 text-sm">
            <div className="flex justify-between text-muted-navy"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="flex justify-between text-muted-navy"><span>Tax</span><span>{money(tax)}</span></div>
            <div className="flex justify-between font-serif text-lg text-ink border-t border-border pt-2"><span>Total</span><span>{money(total)}</span></div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2 justify-end">
        <button
          onClick={() => submit("draft")}
          disabled={create.isPending}
          className="btn-uppercase px-4 py-2 border border-border bg-white text-ink hover:bg-secondary"
        >
          Save as Draft
        </button>
        <button
          onClick={() => submit("sent")}
          disabled={create.isPending}
          className="btn-uppercase px-4 py-2 bg-royal text-white hover:bg-royal-deep"
        >
          Save & Send
        </button>
      </div>
    </div>
  );
}
