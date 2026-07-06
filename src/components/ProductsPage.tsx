import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  useAllProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  type ProductRow,
} from "@/lib/queries";
import { money } from "@/lib/format";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const emptyForm = () => ({
  name: "",
  description: "",
  unit_price: 0,
  unit: "",
  sku: "",
  category: "",
  active: true,
});

export function ProductsPage() {
  const { data: products = [], isLoading } = useAllProducts();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const remove = useDeleteProduct();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [form, setForm] = useState(emptyForm());

  function openNew() {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  }

  function openEdit(p: ProductRow) {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description ?? "",
      unit_price: p.unit_price,
      unit: p.unit ?? "",
      sku: p.sku ?? "",
      category: p.category ?? "",
      active: p.active,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim()) return;
    const payload = {
      name: form.name.trim(),
      description: form.description || null,
      unit_price: form.unit_price,
      unit: form.unit || null,
      sku: form.sku || null,
      category: form.category || null,
      active: form.active,
    };
    if (editing) {
      await update.mutateAsync({ id: editing.id, ...payload });
    } else {
      await create.mutateAsync(payload);
    }
    setOpen(false);
  }

  async function toggleActive(p: ProductRow) {
    await update.mutateAsync({ id: p.id, active: !p.active });
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="text-sm text-muted-navy mt-1">{products.length} product{products.length === 1 ? "" : "s"}</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="btn-uppercase inline-flex items-center gap-1 px-4 py-2 bg-royal text-primary-foreground hover:bg-royal-deep"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-navy">Loading…</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-navy">No products yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.1em] text-muted-navy border-b border-border">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Unit price</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3 text-center">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border/60 hover:bg-secondary/40">
                  <td className="px-4 py-3 text-sm font-medium text-ink">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-navy">{p.category || "—"}</td>
                  <td className="px-4 py-3 text-sm text-right">{money(p.unit_price)}</td>
                  <td className="px-4 py-3 text-sm text-muted-navy">{p.unit || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <Switch checked={p.active} onCheckedChange={() => toggleActive(p)} />
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button type="button" onClick={() => openEdit(p)} className="text-muted-navy hover:text-royal">
                      <Pencil className="w-4 h-4 inline" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove.mutate(p.id)}
                      className="text-muted-navy hover:text-danger"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">{editing ? "Edit Product" : "New Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-navy">Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 input-field"
              />
            </div>
            <div>
              <label className="text-xs text-muted-navy">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="mt-1 input-field"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-navy">Unit price</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.unit_price}
                  onChange={(e) => setForm((f) => ({ ...f, unit_price: parseFloat(e.target.value) || 0 }))}
                  className="mt-1 input-field"
                />
              </div>
              <div>
                <label className="text-xs text-muted-navy">Unit</label>
                <input
                  value={form.unit}
                  onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                  placeholder="e.g. each, box"
                  className="mt-1 input-field"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-navy">SKU</label>
                <input
                  value={form.sku}
                  onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                  className="mt-1 input-field"
                />
              </div>
              <div>
                <label className="text-xs text-muted-navy">Category</label>
                <input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="mt-1 input-field"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.active} onCheckedChange={(active) => setForm((f) => ({ ...f, active }))} />
              <span className="text-sm text-ink">Active</span>
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-uppercase px-4 py-2 border border-border bg-card text-ink hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={create.isPending || update.isPending}
              className="btn-uppercase px-4 py-2 bg-royal text-primary-foreground hover:bg-royal-deep"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
