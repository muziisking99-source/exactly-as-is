import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Search, FileText, Download } from "lucide-react";
import type { DocType, DocumentRow, LineItem } from "@/lib/queries";
import { useDocumentsByType, useIsAdmin, usePaymentsForInvoices, invoiceBalance } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { money, fmtDate, isOverdue } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";
import { TabBar } from "./TabBar";
import { EmptyState } from "./EmptyState";
import { DeleteDocButton } from "./DeleteDocButton";
import { TableSkeleton } from "./TableSkeleton";
import { rowEnterDelay, rowEnterTransition, rowExitTransition } from "@/components/motion";
import { generatePDF } from "@/lib/pdf";

function useDebouncedValue<T>(value: T, delay = 180): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

interface Props {
  type: DocType;
  title: string;
  detailRoute: (id: string) => string;
  tabs: { value: string; label: string; match: (d: DocumentRow) => boolean }[];
  newHref?: string;
}

export function DocumentList({ type, title, detailRoute, tabs, newHref }: Props) {
  const { data: docs, isLoading } = useDocumentsByType(type);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [tab, setTab] = useState("all");
  const isAdmin = useIsAdmin();
  const invoiceIds = type === "invoice" ? (docs ?? []).map((d) => d.id) : [];
  const { data: paymentMap = {} } = usePaymentsForInvoices(invoiceIds);

  const allTabs = useMemo(
    () => [{ value: "all", label: "All", match: () => true }, ...tabs],
    [tabs],
  );

  const withOverdue = useMemo(
    () =>
      (docs ?? []).map((d) =>
        isOverdue(d) && d.status !== "overdue" ? { ...d, status: "overdue" } : d,
      ),
    [docs],
  );

  const filtered = useMemo(() => {
    const currentTab = allTabs.find((t) => t.value === tab)!;
    return withOverdue.filter((d) => {
      if (!currentTab.match(d)) return false;
      if (!debouncedSearch) return true;
      const q = debouncedSearch.toLowerCase();
      return (
        d.doc_number.toLowerCase().includes(q) ||
        d.customer_name.toLowerCase().includes(q)
      );
    });
  }, [withOverdue, tab, debouncedSearch, allTabs]);

  const counts = allTabs.map((t) => ({
    ...t,
    count: withOverdue.filter(t.match).length,
  }));

  async function downloadPDF(doc: DocumentRow) {
    const { data } = await supabase
      .from("line_items")
      .select("*")
      .eq("document_id", doc.id)
      .order("sort_order");
    generatePDF(doc, (data ?? []) as LineItem[]);
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="text-sm text-muted-navy mt-1">
            {withOverdue.length} document{withOverdue.length === 1 ? "" : "s"}
          </p>
        </div>
        {newHref && (
          <Link
            to={newHref}
            className="btn-uppercase inline-flex items-center px-4 py-2 bg-royal text-primary-foreground hover:bg-royal-deep"
          >
            + New
          </Link>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-navy" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by number or customer…"
              className="w-full pl-9 pr-3 py-2 text-sm bg-secondary/50 rounded-lg border border-transparent focus:border-royal focus:bg-card outline-none transition-colors duration-150"
            />
          </div>
          <div className="mt-3">
            <TabBar tabs={counts} value={tab} onChange={setTab} />
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={8} className="py-2" />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-10 h-10" />}
            title="No documents"
            description="Nothing here yet."
          />
        ) : (
          <>
            <table className="hidden md:table w-full">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.1em] text-muted-navy border-b border-border">
                  <th className="px-4 py-3">Number</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  {type === "invoice" && <th className="px-4 py-3 text-right">Balance</th>}
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {filtered.map((d, i) => (
                    <motion.tr
                      key={d.id}
                      initial={{ opacity: 1, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 1, x: 14, transition: rowExitTransition }}
                      transition={{
                        delay: rowEnterDelay(i),
                        ...rowEnterTransition,
                      }}
                      className="border-b border-border/60 hover:bg-secondary/50 transition-colors duration-150"
                    >
                      <td className="px-4 py-3">
                        <Link to={detailRoute(d.id)} className="font-medium text-ink hover:text-royal">
                          {d.doc_number}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-ink">{d.customer_name || "—"}</td>
                      <td className="px-4 py-3 text-sm text-muted-navy">{fmtDate(d.doc_date)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={d.status} docId={d.id} />
                      </td>
                      <td className="px-4 py-3 text-right text-sm">
                        {type === "job_card" ? "—" : money(d.total)}
                      </td>
                      {type === "invoice" && (
                        <td className="px-4 py-3 text-right text-sm font-mono">
                          {money(invoiceBalance(d, paymentMap[d.id] ?? []))}
                        </td>
                      )}
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => downloadPDF(d)}
                          className="text-muted-navy hover:text-royal"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4 inline" />
                        </button>
                        {isAdmin && <DeleteDocButton id={d.id} label="Del" />}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            <div className="md:hidden divide-y divide-border">
              <AnimatePresence initial={false}>
                {filtered.map((d, i) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 1, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 1, x: 14, transition: rowExitTransition }}
                    transition={{
                      delay: rowEnterDelay(i),
                      ...rowEnterTransition,
                    }}
                    className="p-4"
                  >
                    <div className="flex items-start justify-between">
                      <Link to={detailRoute(d.id)} className="font-medium text-ink">
                        {d.doc_number}
                      </Link>
                      <StatusBadge status={d.status} docId={d.id} />
                    </div>
                    <div className="text-sm text-ink mt-1">{d.customer_name || "—"}</div>
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-navy">
                      <span>{fmtDate(d.doc_date)}</span>
                      {type !== "job_card" && (
                        <span className="text-ink font-medium">
                          {type === "invoice"
                            ? money(invoiceBalance(d, paymentMap[d.id] ?? []))
                            : money(d.total)}
                          {type === "invoice" && " bal."}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => downloadPDF(d)}
                        className="btn-uppercase px-3 py-1.5 border border-border text-muted-navy"
                      >
                        PDF
                      </button>
                      {isAdmin && <DeleteDocButton id={d.id} label="Del" />}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
