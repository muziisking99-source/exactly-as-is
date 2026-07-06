import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  type CustomerRow,
} from "@/lib/queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const emptyForm = () => ({
  name: "",
  email: "",
  phone: "",
  billing_address: "",
  vat_number: "",
  contact_person: "",
  notes: "",
});

export function CustomersPage() {
  const { data: customers = [], isLoading } = useCustomers();
  const create = useCreateCustomer();
  const update = useUpdateCustomer();
  const remove = useDeleteCustomer();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerRow | null>(null);
  const [form, setForm] = useState(emptyForm());

  function openNew() {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  }

  function openEdit(c: CustomerRow) {
    setEditing(c);
    setForm({
      name: c.name,
      email: c.email ?? "",
      phone: c.phone ?? "",
      billing_address: c.billing_address ?? "",
      vat_number: c.vat_number ?? "",
      contact_person: c.contact_person ?? "",
      notes: c.notes ?? "",
    });
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim()) return;
    const payload = {
      name: form.name.trim(),
      email: form.email || null,
      phone: form.phone || null,
      billing_address: form.billing_address || null,
      vat_number: form.vat_number || null,
      contact_person: form.contact_person || null,
      notes: form.notes || null,
    };
    if (editing) {
      await update.mutateAsync({ id: editing.id, ...payload });
    } else {
      await create.mutateAsync(payload);
    }
    setOpen(false);
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="text-sm text-muted-navy mt-1">
            {customers.length} customer{customers.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="btn-uppercase inline-flex items-center gap-1 px-4 py-2 bg-royal text-primary-foreground hover:bg-royal-deep"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-navy">Loading…</div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-navy">No customers yet.</div>
        ) : (
          <>
            <table className="hidden md:table w-full">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.1em] text-muted-navy border-b border-border">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">VAT</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b border-border/60 hover:bg-secondary/40">
                    <td className="px-4 py-3 text-sm font-medium text-ink">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-navy">{c.contact_person || "—"}</td>
                    <td className="px-4 py-3 text-sm text-muted-navy">{c.email || "—"}</td>
                    <td className="px-4 py-3 text-sm text-muted-navy">{c.phone || "—"}</td>
                    <td className="px-4 py-3 text-sm text-muted-navy">{c.vat_number || "—"}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link
                        to="/customers/$id/statement"
                        params={{ id: c.id }}
                        className="text-muted-navy hover:text-royal inline-block"
                        title="Statement"
                      >
                        <FileText className="w-4 h-4 inline" />
                      </Link>
                      <button type="button" onClick={() => openEdit(c)} className="text-muted-navy hover:text-royal">
                        <Pencil className="w-4 h-4 inline" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove.mutate(c.id)}
                        className="text-muted-navy hover:text-danger"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="md:hidden divide-y divide-border">
              {customers.map((c) => (
                <div key={c.id} className="p-4">
                  <div className="font-medium text-ink">{c.name}</div>
                  {c.contact_person && (
                    <div className="text-sm text-muted-navy mt-0.5">{c.contact_person}</div>
                  )}
                  <div className="mt-2 space-y-0.5 text-xs text-muted-navy">
                    {c.email && <div>{c.email}</div>}
                    {c.phone && <div>{c.phone}</div>}
                    {c.vat_number && <div>VAT: {c.vat_number}</div>}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      to="/customers/$id/statement"
                      params={{ id: c.id }}
                      className="btn-uppercase px-3 py-1.5 border border-border text-muted-navy inline-flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> Statement
                    </Link>
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="btn-uppercase px-3 py-1.5 border border-border text-muted-navy inline-flex items-center gap-1"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove.mutate(c.id)}
                      className="btn-uppercase px-3 py-1.5 border border-border text-danger inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">{editing ? "Edit Customer" : "New Customer"}</DialogTitle>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-navy">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1 input-field"
                />
              </div>
              <div>
                <label className="text-xs text-muted-navy">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="mt-1 input-field"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-navy">Billing address</label>
              <input
                value={form.billing_address}
                onChange={(e) => setForm((f) => ({ ...f, billing_address: e.target.value }))}
                className="mt-1 input-field"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-navy">VAT number</label>
                <input
                  value={form.vat_number}
                  onChange={(e) => setForm((f) => ({ ...f, vat_number: e.target.value }))}
                  className="mt-1 input-field"
                />
              </div>
              <div>
                <label className="text-xs text-muted-navy">Contact person</label>
                <input
                  value={form.contact_person}
                  onChange={(e) => setForm((f) => ({ ...f, contact_person: e.target.value }))}
                  className="mt-1 input-field"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-navy">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={2}
                className="mt-1 input-field"
              />
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
