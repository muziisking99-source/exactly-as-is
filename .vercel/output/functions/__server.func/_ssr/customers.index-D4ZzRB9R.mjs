import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as useDeleteCustomer, T as useCustomers, U as useUpdateCustomer, v as useCreateCustomer } from "./queries-B6SZHgYf.mjs";
import { d as Pencil, g as FileText, o as Trash2, u as Plus } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-CzUx__WV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers.index-D4ZzRB9R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyForm = () => ({
	name: "",
	email: "",
	phone: "",
	billing_address: "",
	vat_number: "",
	contact_person: "",
	notes: ""
});
function CustomersPage() {
	const { data: customers = [], isLoading } = useCustomers();
	const create = useCreateCustomer();
	const update = useUpdateCustomer();
	const remove = useDeleteCustomer();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(emptyForm());
	function openNew() {
		setEditing(null);
		setForm(emptyForm());
		setOpen(true);
	}
	function openEdit(c) {
		setEditing(c);
		setForm({
			name: c.name,
			email: c.email ?? "",
			phone: c.phone ?? "",
			billing_address: c.billing_address ?? "",
			vat_number: c.vat_number ?? "",
			contact_person: c.contact_person ?? "",
			notes: c.notes ?? ""
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
			notes: form.notes || null
		};
		if (editing) await update.mutateAsync({
			id: editing.id,
			...payload
		});
		else await create.mutateAsync(payload);
		setOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 md:p-8 max-w-7xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4 flex-wrap mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "page-title",
					children: "Customers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-navy mt-1",
					children: [
						customers.length,
						" customer",
						customers.length === 1 ? "" : "s"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: openNew,
					className: "btn-uppercase inline-flex items-center gap-1 px-4 py-2 bg-royal text-primary-foreground hover:bg-royal-deep",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " Add Customer"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "glass-card overflow-hidden",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-sm text-muted-navy",
					children: "Loading…"
				}) : customers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-sm text-muted-navy",
					children: "No customers yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-left text-[10px] uppercase tracking-[0.1em] text-muted-navy border-b border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Contact"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Phone"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "VAT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Actions"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: customers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60 hover:bg-secondary/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-sm font-medium text-ink",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-sm text-muted-navy",
								children: c.contact_person || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-sm text-muted-navy",
								children: c.email || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-sm text-muted-navy",
								children: c.phone || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-sm text-muted-navy",
								children: c.vat_number || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3 text-right space-x-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/customers/$id/statement",
										params: { id: c.id },
										className: "text-muted-navy hover:text-royal inline-block",
										title: "Statement",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 inline" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => openEdit(c),
										className: "text-muted-navy hover:text-royal",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-4 h-4 inline" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => remove.mutate(c.id),
										className: "text-muted-navy hover:text-danger",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 inline" })
									})
								]
							})
						]
					}, c.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-serif",
							children: editing ? "Edit Customer" : "New Customer"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs text-muted-navy",
									children: "Name *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: form.name,
									onChange: (e) => setForm((f) => ({
										...f,
										name: e.target.value
									})),
									className: "mt-1 input-field"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs text-muted-navy",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: form.email,
										onChange: (e) => setForm((f) => ({
											...f,
											email: e.target.value
										})),
										className: "mt-1 input-field"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs text-muted-navy",
										children: "Phone"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: form.phone,
										onChange: (e) => setForm((f) => ({
											...f,
											phone: e.target.value
										})),
										className: "mt-1 input-field"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs text-muted-navy",
									children: "Billing address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: form.billing_address,
									onChange: (e) => setForm((f) => ({
										...f,
										billing_address: e.target.value
									})),
									className: "mt-1 input-field"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs text-muted-navy",
										children: "VAT number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: form.vat_number,
										onChange: (e) => setForm((f) => ({
											...f,
											vat_number: e.target.value
										})),
										className: "mt-1 input-field"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs text-muted-navy",
										children: "Contact person"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: form.contact_person,
										onChange: (e) => setForm((f) => ({
											...f,
											contact_person: e.target.value
										})),
										className: "mt-1 input-field"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs text-muted-navy",
									children: "Notes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: form.notes,
									onChange: (e) => setForm((f) => ({
										...f,
										notes: e.target.value
									})),
									rows: 2,
									className: "mt-1 input-field"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setOpen(false),
							className: "btn-uppercase px-4 py-2 border border-border bg-card text-ink hover:bg-secondary",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: save,
							disabled: create.isPending || update.isPending,
							className: "btn-uppercase px-4 py-2 bg-royal text-primary-foreground hover:bg-royal-deep",
							children: "Save"
						})] })
					]
				})
			})
		]
	});
}
var SplitComponent = CustomersPage;
//#endregion
export { SplitComponent as component };
