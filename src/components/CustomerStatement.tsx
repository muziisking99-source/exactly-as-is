import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useCustomerStatementData, type StatementMode } from "@/lib/queries";
import { fmtDate, money } from "@/lib/format";
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

export function CustomerStatement({ customerId }: Props) {
  const [from, setFrom] = useState(monthStart);
  const [to, setTo] = useState(today);
  const [mode, setMode] = useState<StatementMode>("open");

  const { data, isLoading } = useCustomerStatementData(customerId, from, to, mode);

  const customerName = data?.customer.name ?? "Customer";

  const pdfPayload = useMemo(() => {
    if (!data) return null;
    if (data.mode === "open" && "rows" in data) {
      return { mode: "open" as const, rows: data.rows, totalOutstanding: data.totalOutstanding };
    }
    if (data.mode === "activity" && "ledger" in data) {
      return {
        mode: "activity" as const,
        ledger: data.ledger,
        openingBalance: data.openingBalance,
        closingBalance: data.closingBalance,
      };
    }
    return null;
  }, [data]);

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
          <h1 className="page-title">Customer Statement</h1>
          <p className="text-sm text-muted-navy mt-1">{customerName}</p>
        </div>
        {data && pdfPayload && (
          <button
            type="button"
            onClick={() => generateStatementPDF(data.customer, mode, from, to, pdfPayload)}
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
              <option value="open">Open invoices (by invoice date)</option>
              <option value="activity">Activity period</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="glass-card p-8 text-center text-sm text-muted-navy">Loading…</div>
      ) : !data ? (
        <div className="glass-card p-8 text-center text-sm text-muted-navy">Customer not found.</div>
      ) : mode === "open" && "rows" in data ? (
        <div className="glass-card overflow-hidden">
          {data.rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-navy">
              No open invoices in this date range.
            </div>
          ) : (
            <>
              <table className="hidden md:table w-full">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-[0.1em] text-muted-navy border-b border-border">
                    <th className="px-4 py-3">Invoice</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Due</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-right">Paid</th>
                    <th className="px-4 py-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row) => (
                    <tr key={row.invoice.id} className="border-b border-border/60">
                      <td className="px-4 py-3">
                        <Link
                          to="/invoices/$id"
                          params={{ id: row.invoice.id }}
                          className="text-sm font-medium text-ink hover:text-royal"
                        >
                          {row.invoice.doc_number}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm">{fmtDate(row.invoice.doc_date)}</td>
                      <td className="px-4 py-3 text-sm">{fmtDate(row.invoice.due_date)}</td>
                      <td className="px-4 py-3 text-sm text-right font-mono">{money(row.invoice.total)}</td>
                      <td className="px-4 py-3 text-sm text-right font-mono text-eco">{money(row.paid)}</td>
                      <td className="px-4 py-3 text-sm text-right font-mono font-medium">{money(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="md:hidden divide-y divide-border">
                {data.rows.map((row) => (
                  <div key={row.invoice.id} className="p-4">
                    <Link
                      to="/invoices/$id"
                      params={{ id: row.invoice.id }}
                      className="font-medium text-ink hover:text-royal"
                    >
                      {row.invoice.doc_number}
                    </Link>
                    <div className="mt-1 text-xs text-muted-navy">
                      {fmtDate(row.invoice.doc_date)} · Due {fmtDate(row.invoice.due_date)}
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-muted-navy">Balance</span>
                      <span className="font-mono font-medium">{money(row.balance)}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-muted-navy">
                      <span>Total {money(row.invoice.total)}</span>
                      <span className="text-eco">Paid {money(row.paid)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-border flex justify-between text-sm font-medium">
                <span className="text-muted-navy uppercase tracking-[0.1em] text-[10px]">
                  Total outstanding
                </span>
                <span className="font-mono text-lg">{money(data.totalOutstanding)}</span>
              </div>
            </>
          )}
        </div>
      ) : "ledger" in data ? (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border text-sm">
            <span className="text-muted-navy">Opening balance: </span>
            <span className="font-mono font-medium">{money(data.openingBalance)}</span>
          </div>
          {data.ledger.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-navy">No activity in this period.</div>
          ) : (
            <>
              <table className="hidden md:table w-full">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-[0.1em] text-muted-navy border-b border-border">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Reference</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ledger.map((row, i) => (
                    <tr key={`${row.kind}-${row.date}-${i}`} className="border-b border-border/60">
                      <td className="px-4 py-3 text-sm">{fmtDate(row.date)}</td>
                      <td className="px-4 py-3 text-sm capitalize">{row.kind}</td>
                      <td className="px-4 py-3 text-sm">
                        {row.kind === "invoice" ? (
                          <Link
                            to="/invoices/$id"
                            params={{ id: row.invoice.id }}
                            className="hover:text-royal"
                          >
                            {row.invoice.doc_number}
                          </Link>
                        ) : (
                          row.payment?.reference || row.invoice.doc_number
                        )}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm text-right font-mono ${
                          row.kind === "payment" ? "text-eco" : "text-ink"
                        }`}
                      >
                        {row.kind === "payment" ? `−${money(row.amount)}` : money(row.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="md:hidden divide-y divide-border">
                {data.ledger.map((row, i) => (
                  <div key={`${row.kind}-${row.date}-${i}`} className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm capitalize text-ink">{row.kind}</div>
                        <div className="text-xs text-muted-navy mt-0.5">{fmtDate(row.date)}</div>
                      </div>
                      <div
                        className={`text-sm font-mono font-medium ${
                          row.kind === "payment" ? "text-eco" : "text-ink"
                        }`}
                      >
                        {row.kind === "payment" ? `−${money(row.amount)}` : money(row.amount)}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-muted-navy">
                      {row.kind === "invoice" ? (
                        <Link
                          to="/invoices/$id"
                          params={{ id: row.invoice.id }}
                          className="hover:text-royal"
                        >
                          {row.invoice.doc_number}
                        </Link>
                      ) : (
                        row.payment?.reference || row.invoice.doc_number
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="p-4 border-t border-border flex justify-between text-sm font-medium">
            <span className="text-muted-navy uppercase tracking-[0.1em] text-[10px]">
              Closing balance
            </span>
            <span className="font-mono text-lg">{money(data.closingBalance)}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
