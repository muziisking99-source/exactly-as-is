import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { T as useCustomers, d as money, v as useCreateCustomer, z as useProducts } from "./queries-B6SZHgYf.mjs";
import { S as Check, o as Trash2, r as UserPlus, s as Search, u as Plus, y as ChevronsUpDown } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/@radix-ui/react-popover+[...].mjs";
import { t as _e } from "../_libs/cmdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LineItemGrid-uzsl3Ztj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomerFields({ value, onChange }) {
	const { data: customers = [] } = useCustomers();
	const createCustomer = useCreateCustomer();
	const [customerQuery, setCustomerQuery] = (0, import_react.useState)("");
	const matches = (0, import_react.useMemo)(() => customerQuery ? customers.filter((c) => c.name.toLowerCase().includes(customerQuery.toLowerCase())).slice(0, 5) : [], [customers, customerQuery]);
	const exactMatch = (0, import_react.useMemo)(() => customers.find((c) => c.name.toLowerCase() === value.customer_name.trim().toLowerCase()), [customers, value.customer_name]);
	const showSaveAsNew = value.customer_name.trim().length > 0 && !exactMatch && !createCustomer.isPending;
	async function saveAsNewCustomer() {
		const name = value.customer_name.trim();
		if (!name) return;
		onChange({ customer_id: (await createCustomer.mutateAsync({
			name,
			email: value.customer_email || null,
			phone: value.customer_phone || null,
			billing_address: value.customer_address || null
		})).id });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "glass-card p-4 md:p-6 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-[11px] uppercase tracking-[0.14em] text-muted-navy",
			children: "Customer"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid md:grid-cols-2 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-navy",
							children: "Name *"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: value.customer_name,
							onChange: (e) => {
								onChange({
									customer_name: e.target.value,
									customer_id: null
								});
								setCustomerQuery(e.target.value);
							},
							className: "mt-1 input-field"
						}),
						matches.length > 0 && value.customer_name.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "absolute z-10 top-full left-0 right-0 bg-popover border border-border rounded-lg mt-1 shadow-lg max-h-48 overflow-auto",
							children: matches.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								onClick: () => {
									onChange({
										customer_id: c.id,
										customer_name: c.name,
										customer_email: c.email ?? "",
										customer_phone: c.phone ?? "",
										customer_address: c.billing_address ?? ""
									});
									setCustomerQuery("");
								},
								className: "px-3 py-2 text-sm hover:bg-secondary cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-ink",
									children: c.name
								}), c.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-navy",
									children: c.email
								})]
							}, c.id))
						}),
						showSaveAsNew && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: saveAsNewCustomer,
							className: "mt-2 inline-flex items-center gap-1 text-xs text-royal hover:underline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "w-3 h-3" }), "Save as new customer"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs text-muted-navy",
					children: "Email"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: value.customer_email ?? "",
					onChange: (e) => onChange({ customer_email: e.target.value }),
					className: "mt-1 input-field"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs text-muted-navy",
					children: "Phone"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: value.customer_phone ?? "",
					onChange: (e) => onChange({ customer_phone: e.target.value }),
					className: "mt-1 input-field"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs text-muted-navy",
					children: "Address"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: value.customer_address ?? "",
					onChange: (e) => onChange({ customer_address: e.target.value }),
					className: "mt-1 input-field"
				})] })
			]
		})]
	});
}
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
var Command$1 = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}));
Command$1.displayName = _e.displayName;
var CommandInput = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
		ref,
		className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	})]
}));
CommandInput.displayName = _e.Input.displayName;
var CommandList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}));
CommandList.displayName = _e.List.displayName;
var CommandEmpty = import_react.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}));
CommandEmpty.displayName = _e.Empty.displayName;
var CommandGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}));
CommandGroup.displayName = _e.Group.displayName;
var CommandSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}));
CommandSeparator.displayName = _e.Separator.displayName;
var CommandItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
	ref,
	className: cn("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
	...props
}));
CommandItem.displayName = _e.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	});
};
CommandShortcut.displayName = "CommandShortcut";
function ProductPicker({ productId, onSelect }) {
	const { data: products = [] } = useProducts();
	const [open, setOpen] = (0, import_react.useState)(false);
	const selected = products.find((p) => p.id === productId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: cn("w-full flex items-center justify-between gap-1 px-2 py-2 text-xs border border-border rounded-lg bg-card hover:bg-secondary/50 outline-none focus:border-royal", !selected && "text-muted-navy"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: selected ? selected.name : "Product…"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsUpDown, { className: "w-3 h-3 shrink-0 opacity-50" })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
			className: "w-64 p-0",
			align: "start",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Command$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandInput, { placeholder: "Search products…" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandEmpty, { children: "No products found." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandGroup, { children: [productId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandItem, {
				value: "__clear__",
				onSelect: () => {
					onSelect(null);
					setOpen(false);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-navy",
					children: "Clear selection"
				})
			}), products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
				value: p.name,
				onSelect: () => {
					onSelect(p);
					setOpen(false);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: cn("w-3 h-3", productId === p.id ? "opacity-100" : "opacity-0") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate",
						children: p.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] text-muted-navy",
						children: money(p.unit_price)
					})]
				})]
			}, p.id))] })] })] })
		})]
	});
}
var emptyLineItem = () => ({
	description: "",
	quantity: 1,
	unit_price: 0,
	product_id: null
});
function LineItemGrid({ items, taxRate, onItemsChange, onTaxRateChange }) {
	const subtotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
	const tax = subtotal * (taxRate / 100);
	const total = subtotal + tax;
	function updateItem(idx, patch) {
		const next = [...items];
		next[idx] = {
			...next[idx],
			...patch
		};
		onItemsChange(next);
	}
	function removeItem(idx) {
		const next = items.filter((_, i) => i !== idx);
		onItemsChange(next.length ? next : [emptyLineItem()]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "glass-card p-4 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[11px] uppercase tracking-[0.14em] text-muted-navy",
					children: "Line Items"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onItemsChange([...items, emptyLineItem()]),
					className: "btn-uppercase inline-flex items-center gap-1 px-2 py-1 text-royal border border-royal/30 hover:bg-royal/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3 h-3" }), " Add"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden md:grid grid-cols-[120px_1fr_80px_120px_120px_40px] gap-2 mb-2 text-[10px] uppercase tracking-[0.1em] text-muted-navy px-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Product" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Description" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right",
						children: "Qty"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right",
						children: "Unit price"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right",
						children: "Total"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: items.map((it, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-[120px_1fr_80px_120px_120px_40px] gap-2 items-center bg-secondary/30 md:bg-transparent p-3 md:p-0 rounded",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductPicker, {
							productId: it.product_id,
							onSelect: (product) => {
								if (!product) {
									updateItem(idx, { product_id: null });
									return;
								}
								updateItem(idx, {
									product_id: product.id,
									description: product.description || product.name,
									unit_price: product.unit_price
								});
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							placeholder: "Description",
							value: it.description,
							onChange: (e) => updateItem(idx, { description: e.target.value }),
							className: "input-field"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 0,
							step: "0.5",
							value: it.quantity,
							onChange: (e) => updateItem(idx, { quantity: parseFloat(e.target.value) || 0 }),
							className: "input-field text-right"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 0,
							step: "0.01",
							value: it.unit_price,
							onChange: (e) => updateItem(idx, { unit_price: parseFloat(e.target.value) || 0 }),
							className: "input-field text-right"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-right text-sm font-medium text-ink",
							children: money(it.quantity * it.unit_price)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => removeItem(idx),
							className: "text-muted-navy hover:text-danger justify-self-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						})
					]
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs text-muted-navy",
					children: "Tax rate (%)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					min: 0,
					value: taxRate,
					onChange: (e) => onTaxRateChange(parseFloat(e.target.value) || 0),
					className: "mt-1 w-32 input-field"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full md:w-64 space-y-1 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-muted-navy",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(subtotal) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-muted-navy",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tax" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(tax) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between font-serif text-lg text-ink border-t border-border pt-2 font-mono",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(total) })]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { LineItemGrid as n, emptyLineItem as r, CustomerFields as t };
