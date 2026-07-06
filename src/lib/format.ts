export const money = (n: number | string | null | undefined): string => {
  const v = typeof n === "string" ? parseFloat(n) : (n ?? 0);
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(isNaN(v as number) ? 0 : (v as number));
};

/** PDF table amounts: `520,00` (no currency symbol in cell) */
export const pdfMoney = (n: number | string | null | undefined): string => {
  const v = typeof n === "string" ? parseFloat(n) : (n ?? 0);
  const num = isNaN(v as number) ? 0 : (v as number);
  return num.toFixed(2).replace(".", ",");
};

/** PDF totals: `R 520,00` */
export const pdfTotal = (n: number | string | null | undefined): string =>
  `R ${pdfMoney(n)}`;

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
  partially_paid: "Partial",
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
  if (!["unpaid", "sent", "overdue", "partially_paid"].includes(doc.status)) return false;
  return new Date(doc.due_date) < new Date(new Date().toDateString());
};

/** Invoice due date: 30 days from invoice date */
export function dueDateFromDocDate(docDate: string): string {
  const d = new Date(docDate + "T12:00:00");
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

export const INVOICE_PAYMENT_TERMS = "30 days from invoice";

export const COMPANY = {
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
    branch: "450105",
  },
};
