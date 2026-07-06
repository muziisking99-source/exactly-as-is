import { useMemo, useState } from "react";
import { useCreateCustomer, useCustomers } from "@/lib/queries";
import { UserPlus } from "lucide-react";

export interface CustomerFormFields {
  customer_id?: string | null;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
}

interface Props {
  value: CustomerFormFields;
  onChange: (patch: Partial<CustomerFormFields>) => void;
}

export function CustomerFields({ value, onChange }: Props) {
  const { data: customers = [] } = useCustomers();
  const createCustomer = useCreateCustomer();
  const [customerQuery, setCustomerQuery] = useState("");

  const matches = useMemo(
    () =>
      customerQuery
        ? customers
            .filter((c) => c.name.toLowerCase().includes(customerQuery.toLowerCase()))
            .slice(0, 5)
        : [],
    [customers, customerQuery],
  );

  const exactMatch = useMemo(
    () => customers.find((c) => c.name.toLowerCase() === value.customer_name.trim().toLowerCase()),
    [customers, value.customer_name],
  );

  const showSaveAsNew =
    value.customer_name.trim().length > 0 &&
    !exactMatch &&
    !createCustomer.isPending;

  async function saveAsNewCustomer() {
    const name = value.customer_name.trim();
    if (!name) return;
    const customer = await createCustomer.mutateAsync({
      name,
      email: value.customer_email || null,
      phone: value.customer_phone || null,
      billing_address: value.customer_address || null,
    });
    onChange({ customer_id: customer.id });
  }

  return (
    <section className="glass-card p-4 md:p-6 space-y-4">
      <h2 className="text-[11px] uppercase tracking-[0.14em] text-muted-navy">Customer</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="text-xs text-muted-navy">Name *</label>
          <input
            value={value.customer_name}
            onChange={(e) => {
              onChange({ customer_name: e.target.value, customer_id: null });
              setCustomerQuery(e.target.value);
            }}
            className="mt-1 input-field"
          />
          {matches.length > 0 && value.customer_name.length > 0 && (
            <ul className="absolute z-10 top-full left-0 right-0 bg-popover border border-border rounded-lg mt-1 shadow-lg max-h-48 overflow-auto">
              {matches.map((c) => (
                <li
                  key={c.id}
                  onClick={() => {
                    onChange({
                      customer_id: c.id,
                      customer_name: c.name,
                      customer_email: c.email ?? "",
                      customer_phone: c.phone ?? "",
                      customer_address: c.billing_address ?? "",
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
          {showSaveAsNew && (
            <button
              type="button"
              onClick={saveAsNewCustomer}
              className="mt-2 inline-flex items-center gap-1 text-xs text-royal hover:underline"
            >
              <UserPlus className="w-3 h-3" />
              Save as new customer
            </button>
          )}
        </div>
        <div>
          <label className="text-xs text-muted-navy">Email</label>
          <input
            value={value.customer_email ?? ""}
            onChange={(e) => onChange({ customer_email: e.target.value })}
            className="mt-1 input-field"
          />
        </div>
        <div>
          <label className="text-xs text-muted-navy">Phone</label>
          <input
            value={value.customer_phone ?? ""}
            onChange={(e) => onChange({ customer_phone: e.target.value })}
            className="mt-1 input-field"
          />
        </div>
        <div>
          <label className="text-xs text-muted-navy">Address</label>
          <input
            value={value.customer_address ?? ""}
            onChange={(e) => onChange({ customer_address: e.target.value })}
            className="mt-1 input-field"
          />
        </div>
      </div>
    </section>
  );
}
