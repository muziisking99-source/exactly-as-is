import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as useDocuments, P as useIsAdmin, R as usePaymentsForInvoices, d as money, l as invoiceBalance, o as fmtDate, u as isOverdue } from "./queries-B6SZHgYf.mjs";
import { a as TrendingUp, g as FileText, i as Truck, l as Receipt, v as ClipboardList } from "../_libs/lucide-react.mjs";
import { t as useReducedMotion } from "./use-reduced-motion-DPT29gQb.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { t as StatusBadge } from "./StatusBadge-B4J8COXt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CeGv-G7T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Mechanical tally counter — discrete steps, quick settle on final value.
* Total duration capped at 600ms.
*/
function useMechanicalCount(target, enabled = true) {
	const reduced = useReducedMotion();
	const [display, setDisplay] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!enabled) return;
		const goal = Math.max(0, Math.round(target));
		if (reduced) {
			setDisplay(goal);
			return;
		}
		if (goal === 0) {
			setDisplay(0);
			return;
		}
		const tail = Math.min(4, goal);
		const bulkTarget = goal - tail;
		const bulkSteps = bulkTarget > 0 ? Math.min(14, Math.max(4, Math.ceil(bulkTarget / 8))) : 0;
		const totalSteps = bulkSteps + tail;
		const totalMs = Math.min(580, Math.max(240, totalSteps * 26));
		const stepMs = Math.floor(totalMs / totalSteps);
		let step = 0;
		let timer;
		const tick = () => {
			step++;
			if (step <= bulkSteps && bulkTarget > 0) setDisplay(Math.round(bulkTarget * step / bulkSteps));
			else if (step <= bulkSteps + tail) {
				const tailStep = step - bulkSteps;
				setDisplay(Math.min(bulkTarget + tailStep, goal));
			} else {
				setDisplay(goal);
				return;
			}
			timer = window.setTimeout(tick, stepMs);
		};
		setDisplay(0);
		timer = window.setTimeout(tick, stepMs);
		return () => clearTimeout(timer);
	}, [
		target,
		enabled,
		reduced
	]);
	return display;
}
function Dashboard() {
	const { data: docs = [], isLoading } = useDocuments();
	const isAdmin = useIsAdmin();
	const quotes = docs.filter((d) => d.doc_type === "quote");
	const invoices = docs.filter((d) => d.doc_type === "invoice");
	const deliveries = docs.filter((d) => d.doc_type === "delivery_note");
	const jobs = docs.filter((d) => d.doc_type === "job_card");
	const pendingQuotes = quotes.filter((d) => d.status === "draft" || d.status === "sent").length;
	const unpaid = invoices.filter((d) => d.status !== "paid" && d.status !== "cancelled");
	const { data: paymentMap = {} } = usePaymentsForInvoices(unpaid.map((d) => d.id));
	const overdue = unpaid.filter(isOverdue).length;
	const inMotion = deliveries.filter((d) => d.status === "ready" || d.status === "in_transit").length;
	const activeJobs = jobs.filter((d) => d.status !== "completed").length;
	const outstandingAmount = unpaid.reduce((s, d) => s + invoiceBalance(d, paymentMap[d.id] ?? []), 0);
	const recent = docs.slice(0, 8);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 md:p-8 max-w-7xl mx-auto space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "page-title",
				children: "Dashboard"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-navy mt-1",
				children: "Trend Capital operations at a glance."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-5 h-5" }),
						label: "Pending Quotes",
						value: pendingQuotes,
						loading: isLoading,
						to: "/quotes",
						tint: "royal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "w-5 h-5" }),
						label: "Unpaid Invoices",
						value: unpaid.length,
						sub: overdue > 0 ? `${overdue} overdue` : void 0,
						loading: isLoading,
						to: "/invoices",
						tint: overdue > 0 ? "danger" : "amber"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "w-5 h-5" }),
						label: "Deliveries in Motion",
						value: inMotion,
						loading: isLoading,
						to: "/delivery",
						tint: "royal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "w-5 h-5" }),
						label: "Active Jobs",
						value: activeJobs,
						loading: isLoading,
						to: "/jobs",
						tint: "eco"
					})
				]
			}),
			isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-5 md:p-6 flex items-center gap-4 bg-royal text-primary-foreground border-royal hover-lift",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-8 h-8 opacity-90" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] uppercase tracking-[0.14em] text-white/70",
							children: "Outstanding invoice total"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-3xl mt-1 font-semibold",
							children: money(outstandingAmount)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/invoices",
						className: "btn-uppercase px-3 py-2 border border-white/30 hover:bg-white/10 text-white",
						children: "Review"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-b border-border flex justify-between items-center bg-secondary/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[11px] uppercase tracking-[0.14em] text-muted-navy",
						children: "Recent activity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/tracker",
						className: "text-xs text-royal hover:underline",
						children: "Tracker →"
					})]
				}), recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-sm text-muted-navy",
					children: isLoading ? "Loading…" : "No documents yet. Create your first quote."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: recent.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "p-4 flex items-center gap-3 hover:bg-secondary/40 transition-colors duration-150",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-lg bg-secondary grid place-items-center text-royal",
								children: iconFor(d.doc_type)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm font-medium text-ink truncate",
									children: [
										d.doc_number,
										" · ",
										d.customer_name || "—"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-navy font-mono",
									children: fmtDate(d.created_at)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
								status: d.status,
								docId: d.id
							})
						]
					}, d.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] uppercase tracking-[0.2em] text-muted-navy/60 text-center",
				children: "Built by Muzi"
			})
		]
	});
}
function iconFor(t) {
	if (t === "quote") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4" });
	if (t === "invoice") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "w-4 h-4" });
	if (t === "delivery_note") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "w-4 h-4" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "w-4 h-4" });
}
function MechanicalNumber({ value, loading }) {
	const reduced = useReducedMotion();
	const display = useMechanicalCount(value, !loading);
	const [landed, setLanded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (loading || reduced) return;
		if (display === value) {
			setLanded(true);
			const t = window.setTimeout(() => setLanded(false), 80);
			return () => clearTimeout(t);
		}
	}, [
		display,
		value,
		loading,
		reduced
	]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "…" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
		className: "inline-block tabular-nums",
		animate: landed ? { scale: [
			1,
			1.05,
			1
		] } : { scale: 1 },
		transition: {
			duration: .08,
			ease: "easeOut"
		},
		children: display
	});
}
function Card({ icon, label, value, sub, to, tint, loading }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "glass-card p-4 hover-lift block relative overflow-hidden group",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute top-0 left-0 h-0.5 w-full ${tint === "royal" ? "bg-royal" : tint === "eco" ? "bg-eco" : tint === "amber" ? "bg-amber-warn" : "bg-danger"}` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-muted-navy",
				children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] uppercase tracking-[0.1em]",
					children: label
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 font-mono text-3xl text-ink font-semibold tracking-tight",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MechanicalNumber, {
					value,
					loading
				})
			}),
			sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-danger mt-1",
				children: sub
			})
		]
	});
}
//#endregion
export { Dashboard as component };
