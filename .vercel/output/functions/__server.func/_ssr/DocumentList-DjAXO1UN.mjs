import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-labONTLt.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as useDocumentsByType, P as useIsAdmin, R as usePaymentsForInvoices, d as money, l as invoiceBalance, o as fmtDate, u as isOverdue } from "./queries-B6SZHgYf.mjs";
import { _ as Download, g as FileText, s as Search } from "../_libs/lucide-react.mjs";
import { t as generatePDF } from "./pdf-Csiy_zzv.mjs";
import { n as AnimatePresence } from "../_libs/framer-motion.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { t as StatusBadge } from "./StatusBadge-B4J8COXt.mjs";
import { t as DeleteDocButton } from "./DeleteDocButton-B_krKXeD.mjs";
import { t as TabBar } from "./TabBar-DOcg5u7h.mjs";
import { t as TableSkeleton } from "./TableSkeleton-DidsG2Fj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DocumentList-DjAXO1UN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EmptyState({ title, description, icon, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center py-16 px-6",
		children: [
			icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-4 text-muted-navy/60",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-serif text-xl text-ink",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-navy max-w-md mx-auto",
				children: description
			}),
			action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: action
			})
		]
	});
}
/** Row entrance: quick horizontal settle, capped stagger */
var rowEnterDelay = (index) => Math.min(index, 7) * .018;
var rowEnterTransition = {
	duration: .04,
	ease: [
		.22,
		1,
		.36,
		1
	]
};
var rowExitTransition = {
	duration: .1,
	ease: "easeIn"
};
function useDebouncedValue(value, delay = 180) {
	const [debounced, setDebounced] = (0, import_react.useState)(value);
	(0, import_react.useEffect)(() => {
		const t = window.setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(t);
	}, [value, delay]);
	return debounced;
}
function DocumentList({ type, title, detailRoute, tabs, newHref }) {
	const { data: docs, isLoading } = useDocumentsByType(type);
	const [search, setSearch] = (0, import_react.useState)("");
	const debouncedSearch = useDebouncedValue(search);
	const [tab, setTab] = (0, import_react.useState)("all");
	const isAdmin = useIsAdmin();
	const { data: paymentMap = {} } = usePaymentsForInvoices(type === "invoice" ? (docs ?? []).map((d) => d.id) : []);
	const allTabs = (0, import_react.useMemo)(() => [{
		value: "all",
		label: "All",
		match: () => true
	}, ...tabs], [tabs]);
	const withOverdue = (0, import_react.useMemo)(() => (docs ?? []).map((d) => isOverdue(d) && d.status !== "overdue" ? {
		...d,
		status: "overdue"
	} : d), [docs]);
	const filtered = (0, import_react.useMemo)(() => {
		const currentTab = allTabs.find((t) => t.value === tab);
		return withOverdue.filter((d) => {
			if (!currentTab.match(d)) return false;
			if (!debouncedSearch) return true;
			const q = debouncedSearch.toLowerCase();
			return d.doc_number.toLowerCase().includes(q) || d.customer_name.toLowerCase().includes(q);
		});
	}, [
		withOverdue,
		tab,
		debouncedSearch,
		allTabs
	]);
	const counts = allTabs.map((t) => ({
		...t,
		count: withOverdue.filter(t.match).length
	}));
	async function downloadPDF(doc) {
		const { data } = await supabase.from("line_items").select("*").eq("document_id", doc.id).order("sort_order");
		generatePDF(doc, data ?? []);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 md:p-8 max-w-7xl mx-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-4 flex-wrap mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "page-title",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-navy mt-1",
				children: [
					withOverdue.length,
					" document",
					withOverdue.length === 1 ? "" : "s"
				]
			})] }), newHref && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: newHref,
				className: "btn-uppercase inline-flex items-center px-4 py-2 bg-royal text-primary-foreground hover:bg-royal-deep",
				children: "+ New"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-card overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 border-b border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 w-4 h-4 text-muted-navy" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Search by number or customer…",
						className: "w-full pl-9 pr-3 py-2 text-sm bg-secondary/50 rounded-lg border border-transparent focus:border-royal focus:bg-card outline-none transition-colors duration-150"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBar, {
						tabs: counts,
						value: tab,
						onChange: setTab
					})
				})]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableSkeleton, {
				rows: 8,
				className: "py-2"
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-10 h-10" }),
				title: "No documents",
				description: "Nothing here yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "hidden md:table w-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "text-left text-[10px] uppercase tracking-[0.1em] text-muted-navy border-b border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Number"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Customer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Date"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-right",
							children: "Total"
						}),
						type === "invoice" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-right",
							children: "Balance"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-right",
							children: "Actions"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					initial: false,
					children: filtered.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.tr, {
						initial: {
							opacity: 1,
							x: -10
						},
						animate: {
							opacity: 1,
							x: 0
						},
						exit: {
							opacity: 1,
							x: 14
						},
						transition: {
							delay: rowEnterDelay(i),
							...rowEnterTransition
						},
						exit: {
							opacity: 1,
							x: 14,
							transition: rowExitTransition
						},
						className: "border-b border-border/60 hover:bg-secondary/50 transition-colors duration-150",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: detailRoute(d.id),
									className: "font-medium text-ink hover:text-royal",
									children: d.doc_number
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-sm text-ink",
								children: d.customer_name || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-sm text-muted-navy",
								children: fmtDate(d.doc_date)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
									status: d.status,
									docId: d.id
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-right text-sm",
								children: type === "job_card" ? "—" : money(d.total)
							}),
							type === "invoice" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-right text-sm font-mono",
								children: money(invoiceBalance(d, paymentMap[d.id] ?? []))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3 text-right space-x-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => downloadPDF(d),
									className: "text-muted-navy hover:text-royal",
									title: "Download PDF",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4 inline" })
								}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteDocButton, {
									id: d.id,
									label: "Del"
								})]
							})
						]
					}, d.id))
				}) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:hidden divide-y divide-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					initial: false,
					children: filtered.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 1,
							x: -10
						},
						animate: {
							opacity: 1,
							x: 0
						},
						exit: {
							opacity: 1,
							x: 14
						},
						transition: {
							delay: rowEnterDelay(i),
							...rowEnterTransition
						},
						exit: {
							opacity: 1,
							x: 14,
							transition: rowExitTransition
						},
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: detailRoute(d.id),
									className: "font-medium text-ink",
									children: d.doc_number
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
									status: d.status,
									docId: d.id
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-ink mt-1",
								children: d.customer_name || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mt-2 text-xs text-muted-navy",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtDate(d.doc_date) }), type !== "job_card" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-ink font-medium",
									children: [type === "invoice" ? money(invoiceBalance(d, paymentMap[d.id] ?? [])) : money(d.total), type === "invoice" && " bal."]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => downloadPDF(d),
									className: "btn-uppercase px-3 py-1.5 border border-border text-muted-navy",
									children: "PDF"
								})
							})
						]
					}, d.id))
				})
			})] })]
		})]
	});
}
//#endregion
export { DocumentList as t };
