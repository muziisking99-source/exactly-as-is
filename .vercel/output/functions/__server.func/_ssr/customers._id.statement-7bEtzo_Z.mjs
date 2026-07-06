import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as money, o as fmtDate, w as useCustomerStatementData } from "./queries-B6SZHgYf.mjs";
import { t as Route } from "./customers._id.statement-CJWb2xku.mjs";
import { _ as Download } from "../_libs/lucide-react.mjs";
import { t as Breadcrumbs } from "./Breadcrumbs-D-8d9yVM.mjs";
import { n as generateStatementPDF } from "./pdf-Csiy_zzv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers._id.statement-7bEtzo_Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function monthStart() {
	const d = /* @__PURE__ */ new Date();
	return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}
function today() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function CustomerStatement({ customerId }) {
	const [from, setFrom] = (0, import_react.useState)(monthStart);
	const [to, setTo] = (0, import_react.useState)(today);
	const [mode, setMode] = (0, import_react.useState)("open");
	const { data, isLoading } = useCustomerStatementData(customerId, from, to, mode);
	const customerName = data?.customer.name ?? "Customer";
	const pdfPayload = (0, import_react.useMemo)(() => {
		if (!data) return null;
		if (data.mode === "open" && "rows" in data) return {
			mode: "open",
			rows: data.rows,
			totalOutstanding: data.totalOutstanding
		};
		if (data.mode === "activity" && "ledger" in data) return {
			mode: "activity",
			ledger: data.ledger,
			openingBalance: data.openingBalance,
			closingBalance: data.closingBalance
		};
		return null;
	}, [data]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 md:p-8 max-w-6xl mx-auto space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { items: [
				{
					label: "Customers",
					to: "/customers"
				},
				{ label: customerName },
				{ label: "Statement" }
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "page-title",
					children: "Customer Statement"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-navy mt-1",
					children: customerName
				})] }), data && pdfPayload && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => generateStatementPDF(data.customer, mode, from, to, pdfPayload),
					className: "btn-uppercase inline-flex items-center gap-2 px-4 py-2 bg-royal text-primary-foreground hover:bg-royal-deep",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), " Download PDF"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "glass-card p-4 space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-4 items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-navy",
							children: "From"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: from,
							onChange: (e) => setFrom(e.target.value),
							className: "mt-1 input-field"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-navy",
							children: "To"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: to,
							onChange: (e) => setTo(e.target.value),
							className: "mt-1 input-field"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-navy",
							children: "Mode"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: mode,
							onChange: (e) => setMode(e.target.value),
							className: "mt-1 input-field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "open",
								children: "Open invoices (by invoice date)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "activity",
								children: "Activity period"
							})]
						})] })
					]
				})
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "glass-card p-8 text-center text-sm text-muted-navy",
				children: "Loading…"
			}) : !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "glass-card p-8 text-center text-sm text-muted-navy",
				children: "Customer not found."
			}) : mode === "open" && "rows" in data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "glass-card overflow-hidden",
				children: data.rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-sm text-muted-navy",
					children: "No open invoices in this date range."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-left text-[10px] uppercase tracking-[0.1em] text-muted-navy border-b border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Invoice"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Due"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Total"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Paid"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Balance"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: `/invoices/${row.invoice.id}`,
									className: "text-sm font-medium text-ink hover:text-royal",
									children: row.invoice.doc_number
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-sm",
								children: fmtDate(row.invoice.doc_date)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-sm",
								children: fmtDate(row.invoice.due_date)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-sm text-right font-mono",
								children: money(row.invoice.total)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-sm text-right font-mono text-eco",
								children: money(row.paid)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-sm text-right font-mono font-medium",
								children: money(row.balance)
							})
						]
					}, row.invoice.id)) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-t border-border flex justify-between text-sm font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-navy uppercase tracking-[0.1em] text-[10px]",
						children: "Total outstanding"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-lg",
						children: money(data.totalOutstanding)
					})]
				})] })
			}) : "ledger" in data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 border-b border-border text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-navy",
							children: "Opening balance: "
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-medium",
							children: money(data.openingBalance)
						})]
					}),
					data.ledger.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-8 text-center text-sm text-muted-navy",
						children: "No activity in this period."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-left text-[10px] uppercase tracking-[0.1em] text-muted-navy border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Reference"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right",
									children: "Amount"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.ledger.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-sm",
									children: fmtDate(row.date)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-sm capitalize",
									children: row.kind
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-sm",
									children: row.kind === "invoice" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: `/invoices/${row.invoice.id}`,
										className: "hover:text-royal",
										children: row.invoice.doc_number
									}) : row.payment?.reference || row.invoice.doc_number
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: `px-4 py-3 text-sm text-right font-mono ${row.kind === "payment" ? "text-eco" : "text-ink"}`,
									children: row.kind === "payment" ? `−${money(row.amount)}` : money(row.amount)
								})
							]
						}, `${row.kind}-${row.date}-${i}`)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 border-t border-border flex justify-between text-sm font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-navy uppercase tracking-[0.1em] text-[10px]",
							children: "Closing balance"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-lg",
							children: money(data.closingBalance)
						})]
					})
				]
			}) : null
		]
	});
}
function Page() {
	const { id } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerStatement, { customerId: id });
}
//#endregion
export { Page as component };
