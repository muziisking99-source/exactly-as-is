import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as useDocuments, d as money, n as DOC_LABELS, o as fmtDate } from "./queries-B6SZHgYf.mjs";
import { g as FileText, i as Truck, l as Receipt, v as ClipboardList } from "../_libs/lucide-react.mjs";
import { t as StatusBadge } from "./StatusBadge-B4J8COXt.mjs";
import { t as TableSkeleton } from "./TableSkeleton-DidsG2Fj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tracker-5f9D1eA8.js
var import_jsx_runtime = require_jsx_runtime();
function TrackerPage() {
	const { data: docs = [], isLoading } = useDocuments();
	const quotes = docs.filter((d) => d.doc_type === "quote");
	const relatedToQuote = (quoteId) => docs.filter((d) => d.parent_id === quoteId || d.doc_type === "delivery_note" && parentInvoiceOf(d.parent_id, quoteId));
	function parentInvoiceOf(parentId, quoteId) {
		if (!parentId) return false;
		return docs.find((x) => x.id === parentId)?.parent_id === quoteId;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 md:p-8 max-w-6xl mx-auto space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "page-title",
			children: "Order Tracker"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-navy mt-1",
			children: "Quote-centric timeline of every order."
		})] }), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableSkeleton, {
			rows: 5,
			className: "glass-card py-2"
		}) : quotes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "glass-card p-8 text-center text-sm text-muted-navy",
			children: "No quotes yet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: quotes.map((q) => {
				const related = relatedToQuote(q.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-card p-4 md:p-6 hover-lift",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: `/quotes/${q.id}`,
							className: "font-serif text-xl text-ink hover:text-royal",
							children: q.doc_number
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted-navy",
							children: [
								q.customer_name || "—",
								" · ",
								fmtDate(q.doc_date)
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
								status: q.status,
								docId: q.id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-ink font-medium",
								children: money(q.total)
							})]
						})]
					}), related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 border-l-2 border-royal/30 pl-4 space-y-2",
						children: related.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-6 h-6 rounded-full bg-secondary grid place-items-center text-muted-navy",
									children: iconFor(r.doc_type)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: detailRouteFor(r.doc_type, r.id),
									className: "text-sm text-ink hover:text-royal",
									children: [
										DOC_LABELS[r.doc_type],
										" · ",
										r.doc_number
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
									status: r.status,
									docId: r.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-navy ml-auto",
									children: fmtDate(r.created_at)
								})
							]
						}, r.id))
					})]
				}, q.id);
			})
		})]
	});
}
function iconFor(t) {
	if (t === "quote") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3 h-3" });
	if (t === "invoice") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "w-3 h-3" });
	if (t === "delivery_note") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "w-3 h-3" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "w-3 h-3" });
}
function detailRouteFor(t, id) {
	if (t === "invoice") return `/invoices/${id}`;
	if (t === "delivery_note") return `/delivery/${id}`;
	if (t === "job_card") return `/jobs`;
	return `/quotes/${id}`;
}
//#endregion
export { TrackerPage as component };
