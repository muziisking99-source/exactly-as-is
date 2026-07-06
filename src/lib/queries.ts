import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";

export type DocType = "quote" | "invoice" | "delivery_note" | "job_card";

export interface DocumentRow {
  id: string;
  doc_type: DocType;
  doc_number: string;
  parent_id: string | null;
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
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  sort_order: number;
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

export function useCustomers() {
  const { data } = useDocuments();
  const seen = new Map<string, { name: string; email: string | null; phone: string | null; address: string | null }>();
  (data ?? []).forEach((d) => {
    if (d.customer_name && !seen.has(d.customer_name)) {
      seen.set(d.customer_name, {
        name: d.customer_name,
        email: d.customer_email,
        phone: d.customer_phone,
        address: d.customer_address,
      });
    }
  });
  return Array.from(seen.values());
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
          due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
          created_by: user?.id,
        })
        .select()
        .single();
      if (error) throw error;
      const { data: items } = await supabase.from("line_items").select("*").eq("document_id", quote.id);
      if (items && items.length) {
        await supabase.from("line_items").insert(
          items.map((it: any) => ({
            document_id: (inv as any).id,
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
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  project_description?: string;
  notes?: string;
  tax_rate: number;
  status: "draft" | "sent";
  doc_date: string;
  items: { description: string; quantity: number; unit_price: number }[];
}

export function useCreateQuote() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: QuoteFormInput) => {
      const subtotal = input.items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
      const tax_amount = subtotal * (input.tax_rate / 100);
      const total = subtotal + tax_amount;
      const doc_number = await nextDocNumber("quote");
      const { data: doc, error } = await supabase
        .from("documents")
        .insert({
          doc_type: "quote",
          doc_number,
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
      if (input.items.length) {
        await supabase.from("line_items").insert(
          input.items.map((it, i) => ({
            document_id: (doc as any).id,
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
