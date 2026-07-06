import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as useLineItems, K as useUpdateStatus, L as usePayments, O as useDeletePayment, P as useIsAdmin, V as useRecordPayment, W as useUpdatePayment, _ as useConvertQuoteToInvoice, c as invoiceAmountPaid, d as money, j as useDocument, l as invoiceBalance, m as useActivity, n as DOC_LABELS, o as fmtDate, s as fmtDateTime, x as useCreateJobCard, y as useCreateDeliveryNote } from "./queries-B6SZHgYf.mjs";
import { _ as Download, d as Pencil, o as Trash2, u as Plus } from "../_libs/lucide-react.mjs";
import { t as Breadcrumbs } from "./Breadcrumbs-D-8d9yVM.mjs";
import { t as generatePDF } from "./pdf-Csiy_zzv.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-CzUx__WV.mjs";
import { n as getVtDirection, t as applyVtDirection } from "./view-transitions-BxeEtDWE.mjs";
import { t as StatusBadge } from "./StatusBadge-B4J8COXt.mjs";
import { t as DeleteDocButton } from "./DeleteDocButton-B_krKXeD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DocumentDetail-WSBIlUHU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
function PaymentFormDialog({ open, onOpenChange, balance, editing, loading, onSubmit }) {
	const maxAmount = editing ? balance + Number(editing.amount) : balance;
	const [amount, setAmount] = (0, import_react.useState)("");
	const [paymentDate, setPaymentDate] = (0, import_react.useState)(today());
	const [reference, setReference] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		if (editing) {
			setAmount(String(editing.amount));
			setPaymentDate(editing.payment_date);
			setReference(editing.reference ?? "");
			setNotes(editing.notes ?? "");
		} else {
			setAmount(balance > 0 ? String(balance.toFixed(2)) : "");
			setPaymentDate(today());
			setReference("");
			setNotes("");
		}
	}, [
		open,
		editing,
		balance
	]);
	function handleSubmit(e) {
		e.preventDefault();
		const parsed = parseFloat(amount);
		if (!parsed || parsed <= 0) return;
		if (parsed > maxAmount + .001) return;
		onSubmit({
			amount: parsed,
			payment_date: paymentDate,
			reference: reference.trim(),
			notes: notes.trim()
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "font-serif",
				children: editing ? "Edit Payment" : "Record Payment"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-navy",
						children: ["Balance due: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-medium text-ink",
							children: money(balance)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-navy",
						children: "Amount *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						step: "0.01",
						min: "0.01",
						max: maxAmount,
						required: true,
						value: amount,
						onChange: (e) => setAmount(e.target.value),
						className: "mt-1 input-field font-mono"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-navy",
						children: "Payment date *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						required: true,
						value: paymentDate,
						onChange: (e) => setPaymentDate(e.target.value),
						className: "mt-1 input-field"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-navy",
						children: "Reference"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: reference,
						onChange: (e) => setReference(e.target.value),
						placeholder: "EFT ref, cheque #…",
						className: "mt-1 input-field"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-navy",
						children: "Notes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						rows: 2,
						className: "mt-1 input-field"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onOpenChange(false),
						className: "btn-uppercase px-4 py-2 border border-border bg-card text-ink hover:bg-secondary",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: loading,
						className: "btn-uppercase px-4 py-2 bg-eco text-white hover:brightness-90 disabled:opacity-60",
						children: loading ? "Saving…" : editing ? "Update" : "Record"
					})] })
				]
			})]
		})
	});
}
function DocumentDetail({ id, type, listRoute, listLabel, actions }) {
	const { data: doc, isLoading } = useDocument(id);
	const { data: items = [] } = useLineItems(id);
	const { data: activity = [] } = useActivity(id);
	const { data: payments = [] } = usePayments(type === "invoice" ? id : void 0);
	const nav = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isAdmin = useIsAdmin();
	const [paymentOpen, setPaymentOpen] = (0, import_react.useState)(false);
	const [editingPayment, setEditingPayment] = (0, import_react.useState)(null);
	const recordPayment = useRecordPayment();
	const updatePayment = useUpdatePayment();
	const deletePayment = useDeletePayment();
	const go = (to) => {
		applyVtDirection(getVtDirection(pathname, to));
		nav({ to });
	};
	const convert = useConvertQuoteToInvoice();
	const createDN = useCreateDeliveryNote();
	const createJC = useCreateJobCard();
	const updateStatus = useUpdateStatus();
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-sm text-muted-navy",
		children: "Loading…"
	});
	if (!doc) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-sm text-muted-navy",
		children: "Not found."
	});
	const label = DOC_LABELS[type];
	const amountPaid = type === "invoice" ? invoiceAmountPaid(payments) : 0;
	const balance = type === "invoice" ? invoiceBalance(doc, payments) : 0;
	function openRecordPayment() {
		setEditingPayment(null);
		setPaymentOpen(true);
	}
	function openEditPayment(p) {
		setEditingPayment(p);
		setPaymentOpen(true);
	}
	async function handlePaymentSubmit(values) {
		if (editingPayment) await updatePayment.mutateAsync({
			id: editingPayment.id,
			invoice_id: doc.id,
			invoice_total: Number(doc.total),
			amount: values.amount,
			payment_date: values.payment_date,
			reference: values.reference || null,
			notes: values.notes || null
		});
		else await recordPayment.mutateAsync({
			invoice_id: doc.id,
			invoice_total: Number(doc.total),
			amount: values.amount,
			payment_date: values.payment_date,
			reference: values.reference,
			notes: values.notes
		});
		setPaymentOpen(false);
		setEditingPayment(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 md:p-8 max-w-6xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { items: [{
				label: listLabel,
				to: listRoute
			}, { label: doc.doc_number }] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4 flex-wrap mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "page-title",
							children: doc.doc_number
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
							status: doc.status,
							docId: doc.id
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-navy mt-1",
						children: [
							label,
							" · ",
							fmtDate(doc.doc_date)
						]
					}),
					type === "invoice" && doc.customer_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/customers/$id/statement",
						params: { id: doc.customer_id },
						className: "text-xs text-royal hover:underline mt-1 inline-block",
						children: "Customer statement →"
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => generatePDF(doc, items),
							className: "btn-uppercase inline-flex items-center gap-2 px-3 py-2 border border-border bg-card text-ink hover:bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), " PDF"]
						}),
						type === "quote" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: async () => {
								const inv = await convert.mutateAsync(doc);
								if (inv?.id) go(`/invoices/${inv.id}`);
							},
							className: "btn-uppercase px-3 py-2 bg-royal text-primary-foreground hover:bg-royal-deep",
							children: "Convert to Invoice"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: async () => {
								await createJC.mutateAsync(doc);
								go("/jobs");
							},
							className: "btn-uppercase px-3 py-2 border border-border bg-card text-ink hover:bg-secondary",
							children: "Create Job Card"
						})] }),
						type === "invoice" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							balance > .001 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: openRecordPayment,
								className: "btn-uppercase inline-flex items-center gap-1 px-3 py-2 bg-eco text-white hover:brightness-90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), " Record Payment"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => recordPayment.mutate({
									invoice_id: doc.id,
									invoice_total: Number(doc.total),
									amount: balance,
									payment_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
								}),
								className: "btn-uppercase px-3 py-2 border border-eco/40 text-eco hover:bg-eco/5",
								children: "Mark fully paid"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: async () => {
									const dn = await createDN.mutateAsync(doc);
									if (dn?.id) go(`/delivery/${dn.id}`);
								},
								className: "btn-uppercase px-3 py-2 border border-border bg-card text-ink hover:bg-secondary",
								children: "Create Delivery"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: async () => {
									await createJC.mutateAsync(doc);
									go("/jobs");
								},
								className: "btn-uppercase px-3 py-2 border border-border bg-card text-ink hover:bg-secondary",
								children: "Create Job Card"
							})
						] }),
						type === "delivery_note" && doc.status !== "delivered" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => updateStatus.mutate({
								id: doc.id,
								status: "delivered",
								action: "marked_delivered"
							}),
							className: "btn-uppercase px-3 py-2 bg-eco text-white hover:brightness-90",
							children: "Mark Delivered"
						}),
						actions,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteDocButton, {
							id: doc.id,
							redirectTo: listRoute
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-3 gap-4 mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-[0.14em] text-muted-navy",
								children: "Customer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-medium text-ink",
								children: doc.customer_name || "—"
							}),
							doc.customer_email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-navy mt-1",
								children: doc.customer_email
							}),
							doc.customer_phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-navy",
								children: doc.customer_phone
							}),
							doc.customer_address && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-navy mt-1",
								children: doc.customer_address
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-[0.14em] text-muted-navy",
							children: "Project"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-sm text-ink whitespace-pre-line",
							children: doc.project_description || "—"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-[0.14em] text-muted-navy",
								children: "Dates"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-sm text-ink",
								children: ["Issued: ", fmtDate(doc.doc_date)]
							}),
							doc.due_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm text-ink",
								children: ["Due: ", fmtDate(doc.due_date)]
							}),
							type === "invoice" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-navy mt-2",
								children: ["Payment terms: ", "30 days from invoice"]
							})
						]
					})
				]
			}),
			type === "invoice" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "glass-card p-4 mb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-6 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-navy",
							children: "Total "
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-medium text-ink",
							children: money(doc.total)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-navy",
							children: "Paid "
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-medium text-eco",
							children: money(amountPaid)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-navy",
							children: "Balance due "
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-semibold text-ink",
							children: money(balance)
						})] })
					]
				})
			}),
			type === "invoice" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card mb-6 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-b border-border flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-[0.14em] text-muted-navy",
						children: "Payments"
					}), balance > .001 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: openRecordPayment,
						className: "text-xs text-royal hover:underline",
						children: "+ Add payment"
					})]
				}), payments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4 text-sm text-muted-navy",
					children: "No payments recorded yet."
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
								className: "px-4 py-3 text-right",
								children: "Amount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Reference"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Notes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Actions"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-sm",
								children: fmtDate(p.payment_date)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-sm text-right font-mono",
								children: money(p.amount)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-sm text-muted-navy",
								children: p.reference || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-sm text-muted-navy",
								children: p.notes || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3 text-right space-x-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => openEditPayment(p),
									className: "text-muted-navy hover:text-royal",
									title: "Edit payment",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-4 h-4 inline" })
								}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => deletePayment.mutate({
										id: p.id,
										invoice_id: doc.id,
										invoice_total: Number(doc.total)
									}),
									className: "text-muted-navy hover:text-danger",
									title: "Delete payment",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 inline" })
								})]
							})
						]
					}, p.id)) })]
				})]
			}),
			type !== "job_card" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card mb-6 overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full hidden md:table",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-left text-[10px] uppercase tracking-[0.1em] text-muted-navy border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Description"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right w-24",
									children: "Qty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right w-32",
									children: "Unit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right w-32",
									children: "Total"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-sm",
									children: i.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-sm text-right",
									children: i.quantity
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-sm text-right",
									children: money(i.unit_price)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-sm text-right font-medium",
									children: money(i.total_price)
								})
							]
						}, i.id)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:hidden divide-y divide-border",
						children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-ink",
								children: i.description
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex justify-between text-xs text-muted-navy",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									i.quantity,
									" × ",
									money(i.unit_price)
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-ink",
									children: money(i.total_price)
								})]
							})]
						}, i.id))
					}),
					type !== "delivery_note" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-border p-4 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full max-w-xs space-y-1 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-muted-navy",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(doc.subtotal) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-muted-navy",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Tax (",
										doc.tax_rate,
										"%)"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(doc.tax_amount) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between border-t border-border pt-2 font-serif text-lg text-ink font-mono",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(doc.total) })]
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-[0.14em] text-muted-navy mb-3",
					children: "Activity"
				}), activity.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-navy",
					children: "No activity yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "space-y-2",
					children: activity.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-ink font-medium",
							children: a.description || a.action
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-navy ml-2",
							children: fmtDateTime(a.performed_at)
						})]
					}, a.id))
				})]
			}),
			type === "invoice" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentFormDialog, {
				open: paymentOpen,
				onOpenChange: setPaymentOpen,
				balance,
				editing: editingPayment,
				loading: recordPayment.isPending || updatePayment.isPending,
				onSubmit: handlePaymentSubmit
			})
		]
	});
}
//#endregion
export { DocumentDetail as t };
