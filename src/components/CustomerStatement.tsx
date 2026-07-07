import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useCustomerStatementData, type StatementMode } from "@/lib/queries";
import { fmtDate, fmtDateSlash, money } from "@/lib/format";
import { generateStatementPDF } from "@/lib/pdf";

function monthStart(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

interface Props {
  customerId: string;
}

function AgingSummary({
  aging,
  totalDue,
}: {
  aging: { days120Plus: number; days90: number; days60: number; days30: number; current: number };
  totalDue: number;
}) {
  const cols = [
    { label: "120 Days+", value: aging.days120Plus },
    { label: "90 Days", value: aging.days90 },
    { label: "60 Days", value: aging.days60 },
    { label: "30 Days", value: aging.days30 },
    { label: "Current", value: aging.current },
  ];

  return (
    <div className="border-t border-border">
      <div className="grid grid-cols-3 sm:grid-cols-6 text-center text-[10px] uppercase tracking-[0.08em]">
        {cols.map((col) => (
          <div key={col.label} className="border-r border-border last:border-r-0">
            <div className="bg-surface-alt px-2 py-2 font-medium text-muted-navy">{col.label}</div>
            <div className="px-2 py-3 text-sm font-mono">{Math.abs(col.value) < 0.01 ? "—" : money(col.value)}</div>
          </div>
        ))}
        <div className="col-span-3 sm:col-span-1 bg-royal text-primary-foreground">
          <div className="px-2 py-2 font-medium opacity-80">Total Due</div>
          <div className="px-2 py-3 text-sm font-mono font-bold">{money(totalDue)}</div>
        </div>
      </div>
    </div>
  );
}

export function CustomerStatement({ customerId }: Props) {
  const [from, setFrom] = useState(monthStart);
  const [to, setTo] = useState(today);
  const [mode, setMode] = useState<StatementMode>("activity");

  const { data, isLoading } = useCustomerStatementData(customerId, from, to, mode);

  const customerName = data?.customer.name ?? "Customer";

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <Breadcrumbs
        items={[
          { label: "Customers", to: "/customers" },
          { label: customerName },
          { label: "Statement" },
        ]}
      />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title">Statement</h1>
          <p className="text-sm text-muted-navy mt-1">{customerName}</p>
        </div>
        {data && (
          <button
            type="button"
            onClick={() =>
              generateStatementPDF(data.customer, to, {
                accountSummary: data.accountSummary,
                ledgerRows: data.ledgerRows,
                aging: data.aging,
              })
            }
            className="btn-uppercase inline-flex items-center gap-2 px-4 py-2 bg-royal text-primary-foreground hover:bg-royal-deep"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        )}
      </div>

      <div className="glass-card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:items-end">
          <div className="w-full sm:w-auto">
            <label className="text-xs text-muted-navy">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 input-field w-full"
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="text-xs text-muted-navy">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 input-field w-full"
            />
          </div>
          <div className="w-full sm:w-auto sm:min-w-[200px]">
            <label className="text-xs text-muted-navy">Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as StatementMode)}
              className="mt-1 input-field w-full"
            >
              <option value="activity">Activity period</option>
              <option value="open">Open invoices</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="glass-card p-8 text-center text-sm text-muted-navy">Loading…</div>
      ) : !data ? (
        <div className="glass-card p-8 text-center text-sm text-muted-navy">Customer not found.</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0 border-b border-border">
            <div className="p-4 border-b md:border-b-0 md:border-r border-border">
              <div className="text-[10px] uppercase tracking-[0.1em] text-muted-navy mb-2">Bill To</div>
              <div className="text-sm font-medium">{data.customer.name}</div>
              {data.customer.billing_address && (
                <div className="text-sm text-muted-navy mt-1 whitespace-pre-line">{data.customer.billing_address}</div>
              )}
              {data.customer.vat_number && (
                <div className="text-xs text-muted-navy mt-2">Vat No: {data.customer.vat_number}</div>
              )}
            </div>
            <div className="p-4">
              <div className="text-[10px] uppercase tracking-[0.1em] text-muted-navy mb-2">Account Summary</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-navy">Previous Balance</span>
                  <span className="font-mono">{money(data.accountSummary.previousBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-navy">Credits</span>
                  <span className="font-mono">{money(data.accountSummary.credits)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-navy">Debits</span>
                  <span className="font-mono">{money(data.accountSummary.debits)}</span>
                </div>
                <div className="flex justify-between bg-royal text-primary-foreground -mx-4 px-4 py-2 mt-2 font-medium">
                  <span>Total Balance Due</span>
                  <span className="font-mono">{money(data.accountSummary.totalBalanceDue)}</span>
                </div>
              </div>
            </div>
          </div>

          {data.ledgerRows.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-navy">No transactions in this period.</div>
          ) : (
            <>
              <table className="hidden md:table w-full">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-[0.1em] text-primary-foreground bg-royal">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Invoice #</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3 text-right">Debits</th>
                    <th className="px-4 py-3 text-right">Credits</th>
                    <th className="px-4 py-3 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ledgerRows.map((row, i) => (
                    <tr key={`${row.date}-${row.invoiceNo}-${i}`} className="border-b border-border/60 even:bg-surface-alt/50">
                      <td className="px-4 py-3 text-sm">{fmtDateSlash(row.date)}</td>
                      <td className="px-4 py-3 text-sm">{row.invoiceNo || "—"}</td>
                      <td className="px-4 py-3 text-sm">{row.description}</td>
                      <td className="px-4 py-3 text-sm text-right font-mono">
                        {row.debit > 0 ? money(row.debit) : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-mono">
                        {row.credit > 0 ? money(row.credit) : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-mono font-medium">{money(row.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="md:hidden divide-y divide-border">
                {data.ledgerRows.map((row, i) => (
                  <div key={`${row.date}-${row.invoiceNo}-${i}`} className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm text-ink">{row.description}</div>
                        <div className="text-xs text-muted-navy mt-0.5">
                          {fmtDateSlash(row.date)}
                          {row.invoiceNo ? ` · #${row.invoiceNo}` : ""}
                        </div>
                      </div>
                      <div className="text-sm font-mono font-medium">{money(row.lineTotal)}</div>
                    </div>
                    {(row.debit > 0 || row.credit > 0) && (
                      <div className="mt-1 flex gap-4 text-xs text-muted-navy">
                        {row.debit > 0 && <span>Debit {money(row.debit)}</span>}
                        {row.credit > 0 && <span>Credit {money(row.credit)}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <AgingSummary aging={data.aging} totalDue={data.accountSummary.totalBalanceDue} />
        </div>
      )}
    </div>
  );
}
