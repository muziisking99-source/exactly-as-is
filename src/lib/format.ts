export const money = (n: number | string | null | undefined): string => {
  const v = typeof n === "string" ? parseFloat(n) : (n ?? 0);
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(isNaN(v as number) ? 0 : (v as number));
};

export const fmtDate = (d: string | Date | null | undefined): string => {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
};

export const fmtDateTime = (d: string | Date | null | undefined): string => {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const DOC_LABELS: Record<string, string> = {
  quote: "Quote",
  invoice: "Invoice",
  delivery_note: "Delivery Note",
  job_card: "Job Card",
};

export const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  approved: "Approved",
  unpaid: "Unpaid",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
  ready: "Ready",
  in_transit: "In Transit",
  delivered: "Delivered",
  returned: "Returned",
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

export const isOverdue = (doc: { status: string; due_date: string | null; doc_type: string }): boolean => {
  if (doc.doc_type !== "invoice") return false;
  if (!doc.due_date) return false;
  if (!["unpaid", "sent", "overdue"].includes(doc.status)) return false;
  return new Date(doc.due_date) < new Date(new Date().toDateString());
};

export const COMPANY = {
  name: "Alpine-Eco",
  tagline: "Notebooks and diaries",
  address: "22 Stevens Rd Stafford, Johannesburg",
  phone: "011 493 0113",
  email: "info@alpine-eco.co.za",
};
