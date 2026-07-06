import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as useCreateQuote } from "./queries-B6SZHgYf.mjs";
import { n as LineItemGrid, r as emptyLineItem, t as CustomerFields } from "./LineItemGrid-uzsl3Ztj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quotes.new-Dfy6mRbN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuoteForm() {
	const nav = useNavigate();
	const create = useCreateQuote();
	const [form, setForm] = (0, import_react.useState)({
		customer_id: null,
		customer_name: "",
		customer_email: "",
		customer_phone: "",
		customer_address: "",
		project_description: "",
		notes: "",
		tax_rate: 15,
		status: "draft",
		doc_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		items: [emptyLineItem()]
	});
	const update = (patch) => setForm((f) => ({
		...f,
		...patch
	}));
	async function submit(status) {
		if (!form.customer_name.trim()) return;
		const doc = await create.mutateAsync({
			...form,
			status
		});
		if (doc?.id) nav({ to: `/quotes/${doc.id}` });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 md:p-8 max-w-5xl mx-auto space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "page-title",
				children: "New Quote"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-navy mt-1",
				children: "Fill in the details and add line items."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerFields, {
				value: form,
				onChange: (patch) => update(patch)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "glass-card p-4 md:p-6 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[11px] uppercase tracking-[0.14em] text-muted-navy",
					children: "Dates"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid md:grid-cols-2 gap-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-navy",
						children: "Quote date"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: form.doc_date,
						onChange: (e) => update({ doc_date: e.target.value }),
						className: "mt-1 input-field"
					})] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "glass-card p-4 md:p-6 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[11px] uppercase tracking-[0.14em] text-muted-navy",
					children: "Project"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.project_description,
					onChange: (e) => update({ project_description: e.target.value }),
					rows: 3,
					className: "w-full input-field",
					placeholder: "Describe the job / order…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineItemGrid, {
				items: form.items,
				taxRate: form.tax_rate,
				onItemsChange: (items) => update({ items }),
				onTaxRateChange: (tax_rate) => update({ tax_rate })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 justify-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => submit("draft"),
					disabled: create.isPending,
					className: "btn-uppercase px-4 py-2 border border-border bg-card text-ink hover:bg-secondary",
					children: "Save as Draft"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => submit("sent"),
					disabled: create.isPending,
					className: "btn-uppercase px-4 py-2 bg-royal text-primary-foreground hover:bg-royal-deep",
					children: "Save & Send"
				})]
			})
		]
	});
}
var SplitComponent = QuoteForm;
//#endregion
export { SplitComponent as component };
