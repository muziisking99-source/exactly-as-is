import { Trash2, Plus } from "lucide-react";
import { money } from "@/lib/format";
import type { FormLineItem } from "@/lib/queries";
import { ProductPicker } from "./ProductPicker";

export const emptyLineItem = (): FormLineItem => ({
  description: "",
  quantity: 1,
  unit_price: 0,
  product_id: null,
});

interface Props {
  items: FormLineItem[];
  taxRate: number;
  onItemsChange: (items: FormLineItem[]) => void;
  onTaxRateChange: (rate: number) => void;
}

export function LineItemGrid({ items, taxRate, onItemsChange, onTaxRateChange }: Props) {
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  function updateItem(idx: number, patch: Partial<FormLineItem>) {
    const next = [...items];
    next[idx] = { ...next[idx], ...patch };
    onItemsChange(next);
  }

  function removeItem(idx: number) {
    const next = items.filter((_, i) => i !== idx);
    onItemsChange(next.length ? next : [emptyLineItem()]);
  }

  return (
    <section className="bg-card border border-border rounded-md p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[11px] uppercase tracking-[0.14em] text-muted-navy">Line Items</h2>
        <button
          type="button"
          onClick={() => onItemsChange([...items, emptyLineItem()])}
          className="btn-uppercase inline-flex items-center gap-1 px-2 py-1 text-royal border border-royal/30 hover:bg-blue-50"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>

      <div className="hidden md:grid grid-cols-[120px_1fr_80px_120px_120px_40px] gap-2 mb-2 text-[10px] uppercase tracking-[0.1em] text-muted-navy px-0">
        <span>Product</span>
        <span>Description</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Unit price</span>
        <span className="text-right">Total</span>
        <span />
      </div>

      <div className="space-y-2">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-[120px_1fr_80px_120px_120px_40px] gap-2 items-center bg-secondary/30 md:bg-transparent p-3 md:p-0 rounded"
          >
            <ProductPicker
              productId={it.product_id}
              onSelect={(product) => {
                if (!product) {
                  updateItem(idx, { product_id: null });
                  return;
                }
                updateItem(idx, {
                  product_id: product.id,
                  description: product.description || product.name,
                  unit_price: product.unit_price,
                });
              }}
            />
            <input
              placeholder="Description"
              value={it.description}
              onChange={(e) => updateItem(idx, { description: e.target.value })}
              className="px-3 py-2 border border-border rounded bg-white focus:border-royal outline-none"
            />
            <input
              type="number"
              min={0}
              step="0.5"
              value={it.quantity}
              onChange={(e) => updateItem(idx, { quantity: parseFloat(e.target.value) || 0 })}
              className="px-3 py-2 border border-border rounded bg-white focus:border-royal outline-none text-right"
            />
            <input
              type="number"
              min={0}
              step="0.01"
              value={it.unit_price}
              onChange={(e) => updateItem(idx, { unit_price: parseFloat(e.target.value) || 0 })}
              className="px-3 py-2 border border-border rounded bg-white focus:border-royal outline-none text-right"
            />
            <div className="text-right text-sm font-medium text-ink">
              {money(it.quantity * it.unit_price)}
            </div>
            <button
              type="button"
              onClick={() => removeItem(idx)}
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
            value={taxRate}
            onChange={(e) => onTaxRateChange(parseFloat(e.target.value) || 0)}
            className="mt-1 w-32 px-3 py-2 border border-border rounded bg-white focus:border-royal outline-none"
          />
        </div>
        <div className="w-full md:w-64 space-y-1 text-sm">
          <div className="flex justify-between text-muted-navy">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-navy">
            <span>Tax</span>
            <span>{money(tax)}</span>
          </div>
          <div className="flex justify-between font-serif text-lg text-ink border-t border-border pt-2">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
