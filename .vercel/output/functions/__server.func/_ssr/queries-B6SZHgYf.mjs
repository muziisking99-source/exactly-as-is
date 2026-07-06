import { t as supabase } from "./client-labONTLt.mjs";
import { n as useAuth } from "./auth-DsVZIAel.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queries-B6SZHgYf.js
var money = (n) => {
	const v = typeof n === "string" ? parseFloat(n) : n ?? 0;
	return new Intl.NumberFormat("en-ZA", {
		style: "currency",
		currency: "ZAR",
		minimumFractionDigits: 2
	}).format(isNaN(v) ? 0 : v);
};
/** PDF table amounts: `520,00` (no currency symbol in cell) */
var pdfMoney = (n) => {
	const v = typeof n === "string" ? parseFloat(n) : n ?? 0;
	return (isNaN(v) ? 0 : v).toFixed(2).replace(".", ",");
};
/** PDF totals: `R 520,00` */
var pdfTotal = (n) => `R ${pdfMoney(n)}`;
var fmtDate = (d) => {
	if (!d) return "—";
	const date = typeof d === "string" ? new Date(d) : d;
	if (isNaN(date.getTime())) return "—";
	return new Intl.DateTimeFormat("en-ZA", {
		year: "numeric",
		month: "short",
		day: "2-digit"
	}).format(date);
};
var fmtDateTime = (d) => {
	if (!d) return "—";
	const date = typeof d === "string" ? new Date(d) : d;
	if (isNaN(date.getTime())) return "—";
	return new Intl.DateTimeFormat("en-ZA", {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(date);
};
var DOC_LABELS = {
	quote: "Quote",
	invoice: "Invoice",
	delivery_note: "Delivery Note",
	job_card: "Job Card"
};
var STATUS_LABELS = {
	draft: "Draft",
	sent: "Sent",
	approved: "Approved",
	unpaid: "Unpaid",
	paid: "Paid",
	partially_paid: "Partial",
	overdue: "Overdue",
	cancelled: "Cancelled",
	ready: "Ready",
	in_transit: "In Transit",
	delivered: "Delivered",
	returned: "Returned",
	pending: "Pending",
	in_progress: "In Progress",
	completed: "Completed"
};
var isOverdue = (doc) => {
	if (doc.doc_type !== "invoice") return false;
	if (!doc.due_date) return false;
	if (![
		"unpaid",
		"sent",
		"overdue",
		"partially_paid"
	].includes(doc.status)) return false;
	return new Date(doc.due_date) < new Date((/* @__PURE__ */ new Date()).toDateString());
};
/** Invoice due date: 30 days from invoice date */
function dueDateFromDocDate(docDate) {
	const d = /* @__PURE__ */ new Date(docDate + "T12:00:00");
	d.setDate(d.getDate() + 30);
	return d.toISOString().slice(0, 10);
}
var INVOICE_PAYMENT_TERMS = "30 days from invoice";
var COMPANY = {
	name: "Trend Capital",
	legalName: "TREND CAPITAL CORPORATION PTY(LTD)",
	tagline: "Capital & Commerce",
	address: "22 Steven Rd, Stafford, Johannesburg",
	phone: "011 493 0113",
	email: "info@trendcapital.co.za",
	contact: "Waseem",
	vatNumber: "4480153149",
	bank: {
		name: "Capitec Business",
		accountName: "TREND CAPITAL CORPORATION PTY(LTD)",
		accountNumber: "1052274374",
		branch: "450105"
	}
};
function invoiceAmountPaid(payments) {
	return payments.reduce((s, p) => s + Number(p.amount), 0);
}
function invoiceBalance(doc, payments) {
	return Math.max(0, Number(doc.total) - invoiceAmountPaid(payments));
}
function deriveInvoiceStatus(total, amountPaid) {
	if (amountPaid >= Number(total)) return "paid";
	if (amountPaid > 0) return "partially_paid";
	return "unpaid";
}
async function syncInvoiceStatus(invoiceId, invoiceTotal) {
	const { data: payments, error } = await supabase.from("payments").select("amount").eq("invoice_id", invoiceId);
	if (error) throw error;
	const status = deriveInvoiceStatus(invoiceTotal, invoiceAmountPaid(payments ?? []));
	const { error: updErr } = await supabase.from("documents").update({ status }).eq("id", invoiceId);
	if (updErr) throw updErr;
	return status;
}
function customerMatchesInvoice(customer, doc) {
	if (doc.customer_id && doc.customer_id === customer.id) return true;
	return doc.customer_name.toLowerCase() === customer.name.toLowerCase();
}
function useDocuments() {
	return useQuery({
		queryKey: ["documents"],
		queryFn: async () => {
			const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
}
function useDocumentsByType(type) {
	const q = useDocuments();
	return {
		...q,
		data: q.data?.filter((d) => d.doc_type === type) ?? []
	};
}
function useDocument(id) {
	return useQuery({
		queryKey: ["document", id],
		enabled: !!id,
		queryFn: async () => {
			const { data, error } = await supabase.from("documents").select("*").eq("id", id).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
}
function useLineItems(docId) {
	return useQuery({
		queryKey: ["line_items", docId],
		enabled: !!docId,
		queryFn: async () => {
			const { data, error } = await supabase.from("line_items").select("*").eq("document_id", docId).order("sort_order");
			if (error) throw error;
			return data ?? [];
		}
	});
}
function useActivity(docId) {
	return useQuery({
		queryKey: ["activity", docId],
		enabled: !!docId,
		queryFn: async () => {
			const { data, error } = await supabase.from("activity_log").select("*").eq("document_id", docId).order("performed_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
}
function useJobTasks(jobId) {
	return useQuery({
		queryKey: ["job_tasks", jobId ?? "all"],
		queryFn: async () => {
			let q = supabase.from("job_tasks").select("*").order("sort_order");
			if (jobId) q = q.eq("job_card_id", jobId);
			const { data, error } = await q;
			if (error) throw error;
			return data ?? [];
		}
	});
}
function useProfile(userId) {
	return useQuery({
		queryKey: ["profile", userId],
		enabled: !!userId,
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
}
function useIsAdmin() {
	const { user } = useAuth();
	const { data } = useProfile(user?.id);
	return data?.role === "admin";
}
function usePayments(invoiceId) {
	return useQuery({
		queryKey: ["payments", invoiceId],
		enabled: !!invoiceId,
		queryFn: async () => {
			const { data, error } = await supabase.from("payments").select("*").eq("invoice_id", invoiceId).order("payment_date", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
}
function usePaymentsForInvoices(invoiceIds) {
	return useQuery({
		queryKey: [
			"payments",
			"batch",
			invoiceIds.slice().sort().join(",")
		],
		enabled: invoiceIds.length > 0,
		queryFn: async () => {
			const { data, error } = await supabase.from("payments").select("*").in("invoice_id", invoiceIds);
			if (error) throw error;
			const map = {};
			for (const p of data ?? []) (map[p.invoice_id] ??= []).push(p);
			return map;
		}
	});
}
function useRecordPayment() {
	const qc = useQueryClient();
	const { user } = useAuth();
	return useMutation({
		mutationFn: async (input) => {
			const { data: existing } = await supabase.from("payments").select("amount").eq("invoice_id", input.invoice_id);
			const paid = invoiceAmountPaid(existing ?? []);
			const balance = Math.max(0, Number(input.invoice_total) - paid);
			if (input.amount > balance + .001) throw new Error(`Amount exceeds balance due (${money(balance)})`);
			const { data: payment, error } = await supabase.from("payments").insert({
				invoice_id: input.invoice_id,
				amount: input.amount,
				payment_date: input.payment_date,
				reference: input.reference || null,
				notes: input.notes || null,
				created_by: user?.id
			}).select().single();
			if (error) throw error;
			const status = await syncInvoiceStatus(input.invoice_id, input.invoice_total);
			if (user) await supabase.from("activity_log").insert({
				document_id: input.invoice_id,
				action: "payment_recorded",
				description: `${money(input.amount)} received on ${input.payment_date}${status === "paid" ? " — paid in full" : ""}`,
				performed_by: user.id
			});
			return payment;
		},
		onSuccess: (_d, v) => {
			qc.invalidateQueries({ queryKey: ["payments"] });
			qc.invalidateQueries({ queryKey: ["documents"] });
			qc.invalidateQueries({ queryKey: ["document", v.invoice_id] });
			qc.invalidateQueries({ queryKey: ["activity", v.invoice_id] });
			toast.success("Payment recorded");
		},
		onError: (e) => toast.error(e.message ?? "Failed to record payment")
	});
}
function useUpdatePayment() {
	const qc = useQueryClient();
	const { user } = useAuth();
	return useMutation({
		mutationFn: async (input) => {
			const { data: existing } = await supabase.from("payments").select("id, amount").eq("invoice_id", input.invoice_id);
			const otherPaid = invoiceAmountPaid((existing ?? []).filter((p) => p.id !== input.id));
			const maxAllowed = Number(input.invoice_total) - otherPaid;
			if (input.amount > maxAllowed + .001) throw new Error(`Amount exceeds balance due (${money(maxAllowed)})`);
			const { error } = await supabase.from("payments").update({
				amount: input.amount,
				payment_date: input.payment_date,
				reference: input.reference ?? null,
				notes: input.notes ?? null
			}).eq("id", input.id);
			if (error) throw error;
			await syncInvoiceStatus(input.invoice_id, input.invoice_total);
			if (user) await supabase.from("activity_log").insert({
				document_id: input.invoice_id,
				action: "payment_updated",
				description: `Payment updated — ${money(input.amount)} on ${input.payment_date}`,
				performed_by: user.id
			});
		},
		onSuccess: (_d, v) => {
			qc.invalidateQueries({ queryKey: ["payments"] });
			qc.invalidateQueries({ queryKey: ["documents"] });
			qc.invalidateQueries({ queryKey: ["document", v.invoice_id] });
			qc.invalidateQueries({ queryKey: ["activity", v.invoice_id] });
			toast.success("Payment updated");
		},
		onError: (e) => toast.error(e.message ?? "Failed to update payment")
	});
}
function useDeletePayment() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (input) => {
			const { error } = await supabase.from("payments").delete().eq("id", input.id);
			if (error) throw error;
			await syncInvoiceStatus(input.invoice_id, input.invoice_total);
		},
		onSuccess: (_d, v) => {
			qc.invalidateQueries({ queryKey: ["payments"] });
			qc.invalidateQueries({ queryKey: ["documents"] });
			qc.invalidateQueries({ queryKey: ["document", v.invoice_id] });
			qc.invalidateQueries({ queryKey: ["activity", v.invoice_id] });
			toast.success("Payment deleted");
		},
		onError: (e) => toast.error(e.message ?? "Failed to delete payment")
	});
}
function useCustomerStatementData(customerId, from, to, mode) {
	return useQuery({
		queryKey: [
			"statement",
			customerId,
			from,
			to,
			mode
		],
		enabled: !!customerId && !!from && !!to,
		queryFn: async () => {
			const { data: customer, error: cErr } = await supabase.from("customers").select("*").eq("id", customerId).single();
			if (cErr) throw cErr;
			const { data: allDocs, error: dErr } = await supabase.from("documents").select("*").eq("doc_type", "invoice");
			if (dErr) throw dErr;
			const invoices = (allDocs ?? []).filter((d) => customerMatchesInvoice(customer, d));
			const invoiceIds = invoices.map((i) => i.id);
			let payments = [];
			if (invoiceIds.length) {
				const { data, error } = await supabase.from("payments").select("*").in("invoice_id", invoiceIds);
				if (error) throw error;
				payments = data ?? [];
			}
			const paymentsByInvoice = {};
			for (const p of payments) (paymentsByInvoice[p.invoice_id] ??= []).push(p);
			const withBalance = invoices.map((inv) => {
				const invPayments = paymentsByInvoice[inv.id] ?? [];
				return {
					invoice: inv,
					payments: invPayments,
					paid: invoiceAmountPaid(invPayments),
					balance: invoiceBalance(inv, invPayments)
				};
			});
			if (mode === "open") {
				const open = withBalance.filter((row) => row.balance > .001 && row.invoice.doc_date >= from && row.invoice.doc_date <= to && !["paid", "cancelled"].includes(row.invoice.status));
				return {
					customer,
					mode,
					from,
					to,
					rows: open,
					totalOutstanding: open.reduce((s, r) => s + r.balance, 0)
				};
			}
			const inRangeInvoices = withBalance.filter((r) => r.invoice.doc_date >= from && r.invoice.doc_date <= to);
			const inRangePayments = payments.filter((p) => p.payment_date >= from && p.payment_date <= to);
			const beforeInvoices = withBalance.filter((r) => r.invoice.doc_date < from);
			const beforePayments = payments.filter((p) => p.payment_date < from);
			const openingBalance = beforeInvoices.reduce((s, r) => s + Number(r.invoice.total), 0) - invoiceAmountPaid(beforePayments);
			return {
				customer,
				mode,
				from,
				to,
				ledger: [...inRangeInvoices.map((r) => ({
					kind: "invoice",
					date: r.invoice.doc_date,
					invoice: r.invoice,
					amount: Number(r.invoice.total)
				})), ...inRangePayments.map((p) => {
					const inv = invoices.find((i) => i.id === p.invoice_id);
					return {
						kind: "payment",
						date: p.payment_date,
						payment: p,
						invoice: inv,
						amount: Number(p.amount)
					};
				})].sort((a, b) => a.date.localeCompare(b.date) || (a.kind === "payment" ? 1 : -1)),
				openingBalance,
				closingBalance: openingBalance + (inRangeInvoices.reduce((s, r) => s + Number(r.invoice.total), 0) - invoiceAmountPaid(inRangePayments))
			};
		}
	});
}
function useCustomers() {
	return useQuery({
		queryKey: ["customers"],
		queryFn: async () => {
			const { data, error } = await supabase.from("customers").select("*").order("name");
			if (error) throw error;
			return data ?? [];
		}
	});
}
function useCreateCustomer() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (input) => {
			const { data, error } = await supabase.from("customers").insert(input).select().single();
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["customers"] });
			toast.success("Customer saved");
		},
		onError: (e) => toast.error(e.message ?? "Failed to save customer")
	});
}
function useUpdateCustomer() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...patch }) => {
			const { error } = await supabase.from("customers").update(patch).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["customers"] });
			toast.success("Customer updated");
		},
		onError: (e) => toast.error(e.message ?? "Failed to update customer")
	});
}
function useDeleteCustomer() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("customers").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["customers"] });
			toast.success("Customer deleted");
		},
		onError: (e) => toast.error(e.message ?? "Failed to delete customer")
	});
}
function useProducts() {
	return useQuery({
		queryKey: ["products", "active"],
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("*").eq("active", true).order("name");
			if (error) throw error;
			return data ?? [];
		}
	});
}
function useAllProducts() {
	return useQuery({
		queryKey: ["products"],
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("*").order("name");
			if (error) throw error;
			return data ?? [];
		}
	});
}
function useCreateProduct() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (input) => {
			const { data, error } = await supabase.from("products").insert(input).select().single();
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["products"] });
			toast.success("Product created");
		},
		onError: (e) => toast.error(e.message ?? "Failed to create product")
	});
}
function useUpdateProduct() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...patch }) => {
			const { error } = await supabase.from("products").update(patch).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["products"] });
			toast.success("Product updated");
		},
		onError: (e) => toast.error(e.message ?? "Failed to update product")
	});
}
function useDeleteProduct() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("products").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["products"] });
			toast.success("Product deleted");
		},
		onError: (e) => toast.error(e.message ?? "Failed to delete product")
	});
}
function useUpdateStatus() {
	const qc = useQueryClient();
	const { user } = useAuth();
	return useMutation({
		mutationFn: async ({ id, status, action }) => {
			const { error } = await supabase.from("documents").update({ status }).eq("id", id);
			if (error) throw error;
			if (action && user) await supabase.from("activity_log").insert({
				document_id: id,
				action,
				description: `Status changed to ${status}`,
				performed_by: user.id
			});
		},
		onSuccess: (_d, v) => {
			qc.invalidateQueries({ queryKey: ["documents"] });
			qc.invalidateQueries({ queryKey: ["document", v.id] });
			qc.invalidateQueries({ queryKey: ["activity", v.id] });
			toast.success("Status updated");
		},
		onError: (e) => toast.error(e.message ?? "Failed to update")
	});
}
function useDeleteDocument() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("documents").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["documents"] });
			toast.success("Deleted");
		},
		onError: (e) => toast.error(e.message ?? "Delete failed")
	});
}
function useToggleTask() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, status }) => {
			const patch = { status };
			if (status === "completed") patch.completed_at = (/* @__PURE__ */ new Date()).toISOString();
			else patch.completed_at = null;
			const { error } = await supabase.from("job_tasks").update(patch).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["job_tasks"] })
	});
}
function useAddTask() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ job_card_id, task_description }) => {
			const { error } = await supabase.from("job_tasks").insert({
				job_card_id,
				task_description
			});
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["job_tasks"] })
	});
}
function useDeleteTask() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("job_tasks").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["job_tasks"] })
	});
}
async function nextDocNumber(type) {
	const { data, error } = await supabase.rpc("generate_doc_number", { p_doc_type: type });
	if (error) throw error;
	return data;
}
function useConvertQuoteToInvoice() {
	const qc = useQueryClient();
	const { user } = useAuth();
	return useMutation({
		mutationFn: async (quote) => {
			const doc_number = await nextDocNumber("invoice");
			const { data: inv, error } = await supabase.from("documents").insert({
				doc_type: "invoice",
				doc_number,
				parent_id: quote.id,
				customer_id: quote.customer_id,
				customer_name: quote.customer_name,
				customer_email: quote.customer_email,
				customer_phone: quote.customer_phone,
				customer_address: quote.customer_address,
				project_description: quote.project_description,
				status: "unpaid",
				subtotal: quote.subtotal,
				tax_rate: quote.tax_rate,
				tax_amount: quote.tax_amount,
				total: quote.total,
				doc_date: quote.doc_date,
				due_date: dueDateFromDocDate(quote.doc_date),
				created_by: user?.id
			}).select().single();
			if (error) throw error;
			const { data: items } = await supabase.from("line_items").select("*").eq("document_id", quote.id);
			if (items && items.length) await supabase.from("line_items").insert(items.map((it) => ({
				document_id: inv.id,
				product_id: it.product_id,
				description: it.description,
				quantity: it.quantity,
				unit_price: it.unit_price,
				total_price: it.total_price,
				sort_order: it.sort_order
			})));
			if (user) await supabase.from("activity_log").insert({
				document_id: quote.id,
				action: "converted_to_invoice",
				description: `Converted to invoice ${doc_number}`,
				performed_by: user.id
			});
			return inv;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["documents"] });
			toast.success("Invoice created");
		},
		onError: (e) => toast.error(e.message ?? "Convert failed")
	});
}
function useCreateDeliveryNote() {
	const qc = useQueryClient();
	const { user } = useAuth();
	return useMutation({
		mutationFn: async (invoice) => {
			const doc_number = await nextDocNumber("delivery_note");
			const { data: dn, error } = await supabase.from("documents").insert({
				doc_type: "delivery_note",
				doc_number,
				parent_id: invoice.id,
				customer_name: invoice.customer_name,
				customer_email: invoice.customer_email,
				customer_phone: invoice.customer_phone,
				customer_address: invoice.customer_address,
				project_description: invoice.project_description,
				status: "ready",
				subtotal: invoice.subtotal,
				tax_rate: 0,
				tax_amount: 0,
				total: invoice.total,
				created_by: user?.id
			}).select().single();
			if (error) throw error;
			const { data: items } = await supabase.from("line_items").select("*").eq("document_id", invoice.id);
			if (items && items.length) await supabase.from("line_items").insert(items.map((it) => ({
				document_id: dn.id,
				product_id: it.product_id,
				description: it.description,
				quantity: it.quantity,
				unit_price: it.unit_price,
				total_price: it.total_price,
				sort_order: it.sort_order
			})));
			if (user) await supabase.from("activity_log").insert({
				document_id: invoice.id,
				action: "delivery_created",
				description: `Delivery note ${doc_number} created`,
				performed_by: user.id
			});
			return dn;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["documents"] });
			toast.success("Delivery note created");
		},
		onError: (e) => toast.error(e.message ?? "Failed")
	});
}
function useCreateJobCard() {
	const qc = useQueryClient();
	const { user } = useAuth();
	return useMutation({
		mutationFn: async (src) => {
			const doc_number = await nextDocNumber("job_card");
			const parentQuoteId = src.doc_type === "quote" ? src.id : src.parent_id;
			const { data: jc, error } = await supabase.from("documents").insert({
				doc_type: "job_card",
				doc_number,
				parent_id: parentQuoteId,
				customer_name: src.customer_name,
				customer_email: src.customer_email,
				customer_phone: src.customer_phone,
				customer_address: src.customer_address,
				project_description: src.project_description,
				status: "pending",
				created_by: user?.id
			}).select().single();
			if (error) throw error;
			if (user) await supabase.from("activity_log").insert({
				document_id: src.id,
				action: "job_created",
				description: `Job card ${doc_number} created`,
				performed_by: user.id
			});
			return jc;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["documents"] });
			toast.success("Job card created");
		},
		onError: (e) => toast.error(e.message ?? "Failed")
	});
}
function useCreateQuote() {
	const qc = useQueryClient();
	const { user } = useAuth();
	return useMutation({
		mutationFn: async (input) => {
			const subtotal = input.items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
			const tax_amount = subtotal * (input.tax_rate / 100);
			const total = subtotal + tax_amount;
			const doc_number = await nextDocNumber("quote");
			const { data: doc, error } = await supabase.from("documents").insert({
				doc_type: "quote",
				doc_number,
				customer_id: input.customer_id || null,
				customer_name: input.customer_name,
				customer_email: input.customer_email || null,
				customer_phone: input.customer_phone || null,
				customer_address: input.customer_address || null,
				project_description: input.project_description || null,
				notes: input.notes || null,
				status: input.status,
				doc_date: input.doc_date,
				subtotal,
				tax_rate: input.tax_rate,
				tax_amount,
				total,
				created_by: user?.id
			}).select().single();
			if (error) throw error;
			if (input.items.length) await supabase.from("line_items").insert(input.items.map((it, i) => ({
				document_id: doc.id,
				product_id: it.product_id || null,
				description: it.description,
				quantity: it.quantity,
				unit_price: it.unit_price,
				total_price: it.quantity * it.unit_price,
				sort_order: i
			})));
			return doc;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["documents"] });
			toast.success("Quote created");
		},
		onError: (e) => toast.error(e.message ?? "Failed")
	});
}
function useCreateInvoice() {
	const qc = useQueryClient();
	const { user } = useAuth();
	return useMutation({
		mutationFn: async (input) => {
			const subtotal = input.items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
			const tax_amount = subtotal * (input.tax_rate / 100);
			const total = subtotal + tax_amount;
			const doc_number = await nextDocNumber("invoice");
			const { data: doc, error } = await supabase.from("documents").insert({
				doc_type: "invoice",
				doc_number,
				parent_id: null,
				customer_id: input.customer_id || null,
				customer_name: input.customer_name,
				customer_email: input.customer_email || null,
				customer_phone: input.customer_phone || null,
				customer_address: input.customer_address || null,
				project_description: input.project_description || null,
				notes: input.notes || null,
				status: "unpaid",
				doc_date: input.doc_date,
				due_date: input.due_date,
				subtotal,
				tax_rate: input.tax_rate,
				tax_amount,
				total,
				created_by: user?.id
			}).select().single();
			if (error) throw error;
			if (input.items.length) await supabase.from("line_items").insert(input.items.map((it, i) => ({
				document_id: doc.id,
				product_id: it.product_id || null,
				description: it.description,
				quantity: it.quantity,
				unit_price: it.unit_price,
				total_price: it.quantity * it.unit_price,
				sort_order: i
			})));
			if (user) await supabase.from("activity_log").insert({
				document_id: doc.id,
				action: "created",
				description: `Invoice ${doc_number} created`,
				performed_by: user.id
			});
			return doc;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["documents"] });
			toast.success("Invoice created");
		},
		onError: (e) => toast.error(e.message ?? "Failed")
	});
}
//#endregion
export { useDeleteTask as A, useProfile as B, useCreateQuote as C, useDeleteDocument as D, useDeleteCustomer as E, useJobTasks as F, useUpdateProduct as G, useToggleTask as H, useLineItems as I, useUpdateStatus as K, usePayments as L, useDocuments as M, useDocumentsByType as N, useDeletePayment as O, useIsAdmin as P, usePaymentsForInvoices as R, useCreateProduct as S, useCustomers as T, useUpdateCustomer as U, useRecordPayment as V, useUpdatePayment as W, useConvertQuoteToInvoice as _, dueDateFromDocDate as a, useCreateInvoice as b, invoiceAmountPaid as c, money as d, pdfMoney as f, useAllProducts as g, useAddTask as h, STATUS_LABELS as i, useDocument as j, useDeleteProduct as k, invoiceBalance as l, useActivity as m, DOC_LABELS as n, fmtDate as o, pdfTotal as p, INVOICE_PAYMENT_TERMS as r, fmtDateTime as s, COMPANY as t, isOverdue as u, useCreateCustomer as v, useCustomerStatementData as w, useCreateJobCard as x, useCreateDeliveryNote as y, useProducts as z };
