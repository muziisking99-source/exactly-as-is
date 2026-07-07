import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import { money, dueDateFromDocDate, displayInvoiceNumber } from "./format";

export type DocType = "quote" | "invoice" | "delivery_note" | "job_card";

export interface CustomerRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  billing_address: string | null;
  vat_number: string | null;
  contact_person: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  unit_price: number;
  unit: string | null;
  sku: string | null;
  category: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentRow {
  id: string;
  doc_type: DocType;
  doc_number: string;
  parent_id: string | null;
  customer_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  project_description: string | null;
  status: string;
  notes: string | null;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  doc_date: string;
  due_date: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface LineItem {
  id: string;
  document_id: string;
  product_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  sort_order: number;
}

export interface FormLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  product_id?: string | null;
}

export function isValidLineItem(item: FormLineItem): boolean {
  return item.description.trim().length > 0;
}

export interface JobTask {
  id: string;
  job_card_id: string;
  task_description: string;
  assigned_to: string | null;
  status: string;
  completed_at: string | null;
  sort_order: number;
}

export interface Activity {
  id: string;
  document_id: string;
  action: string;
  description: string | null;
  performed_by: string | null;
  performed_at: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface PaymentRow {
  id: string;
  invoice_id: string;
  amount: number;
  payment_date: string;
  reference: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export type StatementMode = "open" | "activity";

export interface AgingBuckets {
  days120Plus: number;
  days90: number;
  days60: number;
  days30: number;
  current: number;
}

export interface StatementLedgerRow {
  date: string;
  invoiceNo: string;
  description: string;
  debit: number;
  credit: number;
  lineTotal: number;
}

export interface StatementAccountSummary {
  previousBalance: number;
  credits: number;
  debits: number;
  totalBalanceDue: number;
}

export function computeAging(
  rows: { invoice: DocumentRow; balance: number }[],
  asOfDate: string,
): AgingBuckets {
  const buckets: AgingBuckets = { days120Plus: 0, days90: 0, days60: 0, days30: 0, current: 0 };
  const asOf = new Date(`${asOfDate}T12:00:00`);
  for (const { invoice, balance } of rows) {
    if (balance <= 0.001) continue;
    const dueStr = invoice.due_date ?? dueDateFromDocDate(invoice.doc_date);
    const due = new Date(`${dueStr}T12:00:00`);
    const daysPastDue = Math.floor((asOf.getTime() - due.getTime()) / 86400000);
    if (daysPastDue <= 0) buckets.current += balance;
    else if (daysPastDue <= 30) buckets.days30 += balance;
    else if (daysPastDue <= 60) buckets.days60 += balance;
    else if (daysPastDue <= 90) buckets.days90 += balance;
    else buckets.days120Plus += balance;
  }
  return buckets;
}

function buildActivityLedgerRows(
  from: string,
  openingBalance: number,
  ledger: {
    kind: "invoice" | "payment";
    date: string;
    invoice: DocumentRow;
    amount: number;
    payment?: PaymentRow;
  }[],
): StatementLedgerRow[] {
  const rows: StatementLedgerRow[] = [];
  let running = openingBalance;

  if (Math.abs(openingBalance) > 0.005) {
    rows.push({
      date: from,
      invoiceNo: "",
      description: "Previous Balance (Forwarded)",
      debit: openingBalance > 0 ? openingBalance : 0,
      credit: openingBalance < 0 ? -openingBalance : 0,
      lineTotal: running,
    });
  }

  for (const entry of ledger) {
    if (entry.kind === "invoice") {
      running += entry.amount;
      rows.push({
        date: entry.date,
        invoiceNo: displayInvoiceNumber(entry.invoice.doc_number),
        description: "INVOICE",
        debit: entry.amount,
        credit: 0,
        lineTotal: running,
      });
    } else {
      running -= entry.amount;
      rows.push({
        date: entry.date,
        invoiceNo: displayInvoiceNumber(entry.invoice.doc_number),
        description: "Payment Thank You",
        debit: 0,
        credit: entry.amount,
        lineTotal: running,
      });
    }
  }

  return rows;
}

function buildOpenLedgerRows(
  rows: { invoice: DocumentRow; paid: number; balance: number }[],
): StatementLedgerRow[] {
  let running = 0;
  return rows.map((r) => {
    running += r.balance;
    return {
      date: r.invoice.doc_date,
      invoiceNo: displayInvoiceNumber(r.invoice.doc_number),
      description: "INVOICE",
      debit: Number(r.invoice.total),
      credit: r.paid,
      lineTotal: running,
    };
  });
}

export function invoiceAmountPaid(payments: Pick<PaymentRow, "amount">[]): number {
  return payments.reduce((s, p) => s + Number(p.amount), 0);
}

export function invoiceBalance(doc: Pick<DocumentRow, "total">, payments: Pick<PaymentRow, "amount">[]): number {
  return Math.max(0, Number(doc.total) - invoiceAmountPaid(payments));
}

export function deriveInvoiceStatus(total: number, amountPaid: number): string {
  if (amountPaid >= Number(total)) return "paid";
  if (amountPaid > 0) return "partially_paid";
  return "unpaid";
}

async function syncInvoiceStatus(invoiceId: string, invoiceTotal: number): Promise<string> {
  const { data: payments, error } = await supabase
    .from("payments")
    .select("amount")
    .eq("invoice_id", invoiceId);
  if (error) throw error;
  const paid = invoiceAmountPaid((payments ?? []) as PaymentRow[]);
  const status = deriveInvoiceStatus(invoiceTotal, paid);
  const { error: updErr } = await supabase.from("documents").update({ status }).eq("id", invoiceId);
  if (updErr) throw updErr;
  return status;
}

function customerMatchesInvoice(customer: CustomerRow, doc: DocumentRow): boolean {
  if (doc.customer_id && doc.customer_id === customer.id) return true;
  return doc.customer_name.toLowerCase() === customer.name.toLowerCase();
}

// -------- Documents --------
export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: async (): Promise<DocumentRow[]> => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as any;
    },
  });
}

export function useDocumentsByType(type: DocType) {
  const q = useDocuments();
  return { ...q, data: q.data?.filter((d) => d.doc_type === type) ?? [] };
}

export function useDocument(id: string | undefined) {
  return useQuery({
    queryKey: ["document", id],
    enabled: !!id,
    queryFn: async (): Promise<DocumentRow | null> => {
      const { data, error } = await supabase.from("documents").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      return data as any;
    },
  });
}

export function useLineItems(docId: string | undefined) {
  return useQuery({
    queryKey: ["line_items", docId],
    enabled: !!docId,
    queryFn: async (): Promise<LineItem[]> => {
      const { data, error } = await supabase
        .from("line_items")
        .select("*")
        .eq("document_id", docId!)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as any;
    },
  });
}

export function useActivity(docId: string | undefined) {
  return useQuery({
    queryKey: ["activity", docId],
    enabled: !!docId,
    queryFn: async (): Promise<Activity[]> => {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .eq("document_id", docId!)
        .order("performed_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as any;
    },
  });
}

export function useJobTasks(jobId?: string) {
  return useQuery({
    queryKey: ["job_tasks", jobId ?? "all"],
    queryFn: async (): Promise<JobTask[]> => {
      let q = supabase.from("job_tasks").select("*").order("sort_order");
      if (jobId) q = q.eq("job_card_id", jobId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as any;
    },
  });
}

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId!).maybeSingle();
      if (error) throw error;
      return data as any;
    },
  });
}

export function useIsAdmin() {
  const { user } = useAuth();
  const { data } = useProfile(user?.id);
  return data?.role === "admin";
}

// -------- Payments --------
export function usePayments(invoiceId: string | undefined) {
  return useQuery({
    queryKey: ["payments", invoiceId],
    enabled: !!invoiceId,
    queryFn: async (): Promise<PaymentRow[]> => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("invoice_id", invoiceId!)
        .order("payment_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PaymentRow[];
    },
  });
}

export function usePaymentsForInvoices(invoiceIds: string[]) {
  const key = invoiceIds.slice().sort().join(",");
  return useQuery({
    queryKey: ["payments", "batch", key],
    enabled: invoiceIds.length > 0,
    queryFn: async (): Promise<Record<string, PaymentRow[]>> => {
      const { data, error } = await supabase.from("payments").select("*").in("invoice_id", invoiceIds);
      if (error) throw error;
      const map: Record<string, PaymentRow[]> = {};
      for (const p of (data ?? []) as PaymentRow[]) {
        (map[p.invoice_id] ??= []).push(p);
      }
      return map;
    },
  });
}

export function useRecordPayment() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: {
      invoice_id: string;
      invoice_total: number;
      amount: number;
      payment_date: string;
      reference?: string;
      notes?: string;
    }) => {
      const { data: existing } = await supabase
        .from("payments")
        .select("amount")
        .eq("invoice_id", input.invoice_id);
      const paid = invoiceAmountPaid((existing ?? []) as PaymentRow[]);
      const balance = Math.max(0, Number(input.invoice_total) - paid);
      if (input.amount > balance + 0.001) throw new Error(`Amount exceeds balance due (${money(balance)})`);

      const { data: payment, error } = await supabase
        .from("payments")
        .insert({
          invoice_id: input.invoice_id,
          amount: input.amount,
          payment_date: input.payment_date,
          reference: input.reference || null,
          notes: input.notes || null,
          created_by: user?.id,
        })
        .select()
        .single();
      if (error) throw error;

      const status = await syncInvoiceStatus(input.invoice_id, input.invoice_total);
      if (user) {
        await supabase.from("activity_log").insert({
          document_id: input.invoice_id,
          action: "payment_recorded",
          description: `${money(input.amount)} received on ${input.payment_date}${status === "paid" ? " — paid in full" : ""}`,
          performed_by: user.id,
        });
      }
      return payment as PaymentRow;
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["documents"] });
      qc.invalidateQueries({ queryKey: ["document", v.invoice_id] });
      qc.invalidateQueries({ queryKey: ["activity", v.invoice_id] });
      toast.success("Payment recorded");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to record payment"),
  });
}

export function useUpdatePayment() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: {
      id: string;
      invoice_id: string;
      invoice_total: number;
      amount: number;
      payment_date: string;
      reference?: string | null;
      notes?: string | null;
    }) => {
      const { data: existing } = await supabase
        .from("payments")
        .select("id, amount")
        .eq("invoice_id", input.invoice_id);
      const others = ((existing ?? []) as PaymentRow[]).filter((p) => p.id !== input.id);
      const otherPaid = invoiceAmountPaid(others);
      const maxAllowed = Number(input.invoice_total) - otherPaid;
      if (input.amount > maxAllowed + 0.001) throw new Error(`Amount exceeds balance due (${money(maxAllowed)})`);

      const { error } = await supabase
        .from("payments")
        .update({
          amount: input.amount,
          payment_date: input.payment_date,
          reference: input.reference ?? null,
          notes: input.notes ?? null,
        })
        .eq("id", input.id);
      if (error) throw error;

      await syncInvoiceStatus(input.invoice_id, input.invoice_total);
      if (user) {
        await supabase.from("activity_log").insert({
          document_id: input.invoice_id,
          action: "payment_updated",
          description: `Payment updated — ${money(input.amount)} on ${input.payment_date}`,
          performed_by: user.id,
        });
      }
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["documents"] });
      qc.invalidateQueries({ queryKey: ["document", v.invoice_id] });
      qc.invalidateQueries({ queryKey: ["activity", v.invoice_id] });
      toast.success("Payment updated");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to update payment"),
  });
}

export function useDeletePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; invoice_id: string; invoice_total: number }) => {
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
    onError: (e: any) => toast.error(e.message ?? "Failed to delete payment"),
  });
}

export function useCustomer(customerId: string | undefined) {
  return useQuery({
    queryKey: ["customer", customerId],
    enabled: !!customerId,
    queryFn: async (): Promise<CustomerRow | null> => {
      const { data, error } = await supabase.from("customers").select("*").eq("id", customerId!).maybeSingle();
      if (error) throw error;
      return data as CustomerRow | null;
    },
  });
}

export function useCustomerStatementData(
  customerId: string | undefined,
  from: string,
  to: string,
  mode: StatementMode,
) {
  return useQuery({
    queryKey: ["statement", customerId, from, to, mode],
    enabled: !!customerId && !!from && !!to,
    queryFn: async () => {
      const { data: customer, error: cErr } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId!)
        .single();
      if (cErr) throw cErr;

      const { data: allDocs, error: dErr } = await supabase
        .from("documents")
        .select("*")
        .eq("doc_type", "invoice");
      if (dErr) throw dErr;

      const invoices = ((allDocs ?? []) as DocumentRow[]).filter((d) =>
        customerMatchesInvoice(customer as CustomerRow, d),
      );
      const invoiceIds = invoices.map((i) => i.id);
      let payments: PaymentRow[] = [];
      if (invoiceIds.length) {
        const { data, error } = await supabase.from("payments").select("*").in("invoice_id", invoiceIds);
        if (error) throw error;
        payments = (data ?? []) as PaymentRow[];
      }

      const paymentsByInvoice: Record<string, PaymentRow[]> = {};
      for (const p of payments) {
        (paymentsByInvoice[p.invoice_id] ??= []).push(p);
      }

      const withBalance = invoices.map((inv) => {
        const invPayments = paymentsByInvoice[inv.id] ?? [];
        const paid = invoiceAmountPaid(invPayments);
        const balance = invoiceBalance(inv, invPayments);
        return { invoice: inv, payments: invPayments, paid, balance };
      });

      if (mode === "open") {
        const open = withBalance.filter(
          (row) =>
            row.balance > 0.001 &&
            row.invoice.doc_date >= from &&
            row.invoice.doc_date <= to &&
            !["paid", "cancelled"].includes(row.invoice.status),
        );
        const totalOutstanding = open.reduce((s, r) => s + r.balance, 0);
        const allOpen = withBalance.filter(
          (row) => row.balance > 0.001 && !["paid", "cancelled"].includes(row.invoice.status),
        );
        return {
          customer: customer as CustomerRow,
          mode,
          from,
          to,
          rows: open,
          totalOutstanding,
          accountSummary: {
            previousBalance: 0,
            credits: open.reduce((s, r) => s + r.paid, 0),
            debits: open.reduce((s, r) => s + Number(r.invoice.total), 0),
            totalBalanceDue: totalOutstanding,
          },
          ledgerRows: buildOpenLedgerRows(open),
          aging: computeAging(allOpen, to),
        };
      }

      // Activity period
      const inRangeInvoices = withBalance.filter(
        (r) => r.invoice.doc_date >= from && r.invoice.doc_date <= to,
      );
      const inRangePayments = payments.filter((p) => p.payment_date >= from && p.payment_date <= to);

      const beforeInvoices = withBalance.filter((r) => r.invoice.doc_date < from);
      const beforePayments = payments.filter((p) => p.payment_date < from);
      const openingBalance =
        beforeInvoices.reduce((s, r) => s + Number(r.invoice.total), 0) -
        invoiceAmountPaid(beforePayments);

      type LedgerRow =
        | { kind: "invoice"; date: string; invoice: DocumentRow; amount: number }
        | { kind: "payment"; date: string; payment: PaymentRow; invoice: DocumentRow; amount: number };

      const ledger: LedgerRow[] = [
        ...inRangeInvoices.map((r) => ({
          kind: "invoice" as const,
          date: r.invoice.doc_date,
          invoice: r.invoice,
          amount: Number(r.invoice.total),
        })),
        ...inRangePayments.map((p) => {
          const inv = invoices.find((i) => i.id === p.invoice_id)!;
          return {
            kind: "payment" as const,
            date: p.payment_date,
            payment: p,
            invoice: inv,
            amount: Number(p.amount),
          };
        }),
      ].sort((a, b) => a.date.localeCompare(b.date) || (a.kind === "payment" ? 1 : -1));

      const periodNet =
        inRangeInvoices.reduce((s, r) => s + Number(r.invoice.total), 0) -
        invoiceAmountPaid(inRangePayments);
      const closingBalance = openingBalance + periodNet;
      const allOpen = withBalance.filter(
        (row) => row.balance > 0.001 && !["paid", "cancelled"].includes(row.invoice.status),
      );

      return {
        customer: customer as CustomerRow,
        mode,
        from,
        to,
        ledger,
        openingBalance,
        closingBalance,
        accountSummary: {
          previousBalance: openingBalance,
          credits: invoiceAmountPaid(inRangePayments),
          debits: inRangeInvoices.reduce((s, r) => s + Number(r.invoice.total), 0),
          totalBalanceDue: closingBalance,
        },
        ledgerRows: buildActivityLedgerRows(from, openingBalance, ledger),
        aging: computeAging(allOpen, to),
      };
    },
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async (): Promise<CustomerRow[]> => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("name");
      if (error) throw error;
      return (data ?? []) as any;
    },
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      name: string;
      email?: string | null;
      phone?: string | null;
      billing_address?: string | null;
      vat_number?: string | null;
      contact_person?: string | null;
      notes?: string | null;
    }) => {
      const { data, error } = await supabase.from("customers").insert(input).select().single();
      if (error) throw error;
      return data as any;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer saved");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to save customer"),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<CustomerRow> & { id: string }) => {
      const { error } = await supabase.from("customers").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer updated");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to update customer"),
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("customers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer deleted");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to delete customer"),
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ["products", "active"],
    queryFn: async (): Promise<ProductRow[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("name");
      if (error) throw error;
      return (data ?? []) as any;
    },
  });
}

export function useAllProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<ProductRow[]> => {
      const { data, error } = await supabase.from("products").select("*").order("name");
      if (error) throw error;
      return (data ?? []) as any;
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      name: string;
      description?: string | null;
      unit_price: number;
      unit?: string | null;
      sku?: string | null;
      category?: string | null;
      active?: boolean;
    }) => {
      const { data, error } = await supabase.from("products").insert(input).select().single();
      if (error) throw error;
      return data as any;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to create product"),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<ProductRow> & { id: string }) => {
      const { error } = await supabase.from("products").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to update product"),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to delete product"),
  });
}

// -------- Mutations --------
export function useUpdateStatus() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ id, status, action }: { id: string; status: string; action?: string }) => {
      const { error } = await supabase.from("documents").update({ status }).eq("id", id);
      if (error) throw error;
      if (action && user) {
        await supabase.from("activity_log").insert({
          document_id: id,
          action,
          description: `Status changed to ${status}`,
          performed_by: user.id,
        });
      }
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      qc.invalidateQueries({ queryKey: ["document", v.id] });
      qc.invalidateQueries({ queryKey: ["activity", v.id] });
      toast.success("Status updated");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to update"),
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("documents").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Deleted");
    },
    onError: (e: any) => toast.error(e.message ?? "Delete failed"),
  });
}

export function useToggleTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const patch: any = { status };
      if (status === "completed") patch.completed_at = new Date().toISOString();
      else patch.completed_at = null;
      const { error } = await supabase.from("job_tasks").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["job_tasks"] }),
  });
}

export function useAddTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ job_card_id, task_description }: { job_card_id: string; task_description: string }) => {
      const { error } = await supabase.from("job_tasks").insert({ job_card_id, task_description });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["job_tasks"] }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("job_tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["job_tasks"] }),
  });
}

// -------- Conversions --------
async function nextDocNumber(type: DocType): Promise<string> {
  const { data, error } = await supabase.rpc("generate_doc_number", { p_doc_type: type });
  if (error) throw error;
  return data as string;
}

export function useConvertQuoteToInvoice() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (quote: DocumentRow) => {
      const doc_number = await nextDocNumber("invoice");
      const { data: inv, error } = await supabase
        .from("documents")
        .insert({
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
          created_by: user?.id,
        })
        .select()
        .single();
      if (error) throw error;
      const { data: items } = await supabase.from("line_items").select("*").eq("document_id", quote.id);
      const validItems = (items ?? []).filter((it: any) => it.description?.trim());
      if (validItems.length) {
        await supabase.from("line_items").insert(
          validItems.map((it: any) => ({
            document_id: (inv as any).id,
            product_id: it.product_id,
            description: it.description,
            quantity: it.quantity,
            unit_price: it.unit_price,
            total_price: it.total_price,
            sort_order: it.sort_order,
          })),
        );
      }
      if (user) {
        await supabase.from("activity_log").insert({
          document_id: quote.id,
          action: "converted_to_invoice",
          description: `Converted to invoice ${doc_number}`,
          performed_by: user.id,
        });
      }
      return inv as any;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Invoice created");
    },
    onError: (e: any) => toast.error(e.message ?? "Convert failed"),
  });
}

export function useCreateDeliveryNote() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (invoice: DocumentRow) => {
      const doc_number = await nextDocNumber("delivery_note");
      const { data: dn, error } = await supabase
        .from("documents")
        .insert({
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
          created_by: user?.id,
        })
        .select()
        .single();
      if (error) throw error;
      const { data: items } = await supabase.from("line_items").select("*").eq("document_id", invoice.id);
      if (items && items.length) {
        await supabase.from("line_items").insert(
          items.map((it: any) => ({
            document_id: (dn as any).id,
            product_id: it.product_id,
            description: it.description,
            quantity: it.quantity,
            unit_price: it.unit_price,
            total_price: it.total_price,
            sort_order: it.sort_order,
          })),
        );
      }
      if (user) {
        await supabase.from("activity_log").insert({
          document_id: invoice.id,
          action: "delivery_created",
          description: `Delivery note ${doc_number} created`,
          performed_by: user.id,
        });
      }
      return dn as any;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Delivery note created");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });
}

export function useCreateJobCard() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (src: DocumentRow) => {
      const doc_number = await nextDocNumber("job_card");
      const parentQuoteId = src.doc_type === "quote" ? src.id : src.parent_id;
      const { data: jc, error } = await supabase
        .from("documents")
        .insert({
          doc_type: "job_card",
          doc_number,
          parent_id: parentQuoteId,
          customer_name: src.customer_name,
          customer_email: src.customer_email,
          customer_phone: src.customer_phone,
          customer_address: src.customer_address,
          project_description: src.project_description,
          status: "pending",
          created_by: user?.id,
        })
        .select()
        .single();
      if (error) throw error;
      if (user) {
        await supabase.from("activity_log").insert({
          document_id: src.id,
          action: "job_created",
          description: `Job card ${doc_number} created`,
          performed_by: user.id,
        });
      }
      return jc as any;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Job card created");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });
}

export interface QuoteFormInput {
  customer_id?: string | null;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  project_description?: string;
  notes?: string;
  tax_rate: number;
  status: "draft" | "sent";
  doc_date: string;
  items: FormLineItem[];
}

export interface InvoiceFormInput {
  customer_id?: string | null;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  project_description?: string;
  notes?: string;
  tax_rate: number;
  doc_date: string;
  due_date: string;
  items: FormLineItem[];
}

export function useCreateQuote() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: QuoteFormInput) => {
      const validItems = input.items.filter(isValidLineItem);
      const subtotal = validItems.reduce((s, i) => s + i.quantity * i.unit_price, 0);
      const tax_amount = subtotal * (input.tax_rate / 100);
      const total = subtotal + tax_amount;
      const doc_number = await nextDocNumber("quote");
      const { data: doc, error } = await supabase
        .from("documents")
        .insert({
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
          created_by: user?.id,
        })
        .select()
        .single();
      if (error) throw error;
      if (validItems.length) {
        await supabase.from("line_items").insert(
          validItems.map((it, i) => ({
            document_id: (doc as any).id,
            product_id: it.product_id || null,
            description: it.description,
            quantity: it.quantity,
            unit_price: it.unit_price,
            total_price: it.quantity * it.unit_price,
            sort_order: i,
          })),
        );
      }
      return doc as any;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Quote created");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: InvoiceFormInput) => {
      const validItems = input.items.filter(isValidLineItem);
      const subtotal = validItems.reduce((s, i) => s + i.quantity * i.unit_price, 0);
      const tax_amount = subtotal * (input.tax_rate / 100);
      const total = subtotal + tax_amount;
      const doc_number = await nextDocNumber("invoice");
      const { data: doc, error } = await supabase
        .from("documents")
        .insert({
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
          created_by: user?.id,
        })
        .select()
        .single();
      if (error) throw error;
      if (validItems.length) {
        await supabase.from("line_items").insert(
          validItems.map((it, i) => ({
            document_id: (doc as any).id,
            product_id: it.product_id || null,
            description: it.description,
            quantity: it.quantity,
            unit_price: it.unit_price,
            total_price: it.quantity * it.unit_price,
            sort_order: i,
          })),
        );
      }
      if (user) {
        await supabase.from("activity_log").insert({
          document_id: (doc as any).id,
          action: "created",
          description: `Invoice ${doc_number} created`,
          performed_by: user.id,
        });
      }
      return doc as any;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Invoice created");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });
}
