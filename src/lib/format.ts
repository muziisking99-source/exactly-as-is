export const money = (n: number | string | null | undefined): string => {
  const v = typeof n === "string" ? parseFloat(n) : (n ?? 0);
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(isNaN(v as number) ? 0 : (v as number));
};

/** PDF table amounts: `17 046,25` (no currency symbol, space thousands) */
export const pdfMoney = (n: number | string | null | undefined): string => {
  const v = typeof n === "string" ? parseFloat(n) : (n ?? 0);
  const num = isNaN(v as number) ? 0 : (v as number);
  const [whole, frac] = Math.abs(num).toFixed(2).split(".");
  const spaced = whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${num < 0 ? "-" : ""}${spaced},${frac}`;
};

/** PDF totals: `R 17 046,25` */
export const pdfTotal = (n: number | string | null | undefined): string => {
  const v = typeof n === "string" ? parseFloat(n) : (n ?? 0);
  const num = isNaN(v as number) ? 0 : (v as number);
  if (Math.abs(num) < 0.005) return "R -";
  if (num < 0) return `R (${pdfMoney(-num)})`;
  return `R ${pdfMoney(num)}`;
};

/** Statement column amount — zero shows as `R -` */
export const pdfColumnAmount = (n: number): string => {
  if (Math.abs(n) < 0.005) return "R -";
  if (n < 0) return `R (${pdfMoney(-n)})`;
  return `R ${pdfMoney(n)}`;
};

export const fmtDateSlash = (d: string | Date | null | undefined): string => {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d.length === 10 ? `${d}T12:00:00` : d) : d;
  if (isNaN(date.getTime())) return "—";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
};

/** Short customer code from name, e.g. "Cable Feeder Systems" → "CFS" */
export function customerCode(name: string): string {
  const words = name
    .replace(/\(.*?\)/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !/^(pty|ltd|inc|co)$/i.test(w));
  if (words.length >= 3) return words.slice(0, 3).map((w) => w[0]).join("").toUpperCase();
  return name.replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase() || "—";
}

/** Display invoice number without prefix, e.g. "INV-1707" → "1707" */
export function displayInvoiceNumber(docNumber: string): string {
  const match = docNumber.match(/(\d+)$/);
  return match ? match[1] : docNumber;
}

const STATEMENT_COUNTER_KEY = "trendcap.statementCounter";
const STATEMENT_START = 1005;

/** Sequential statement number, persisted in localStorage. First call returns 1005. */
export function statementNumber(_customerId?: string): string {
  if (typeof window === "undefined") return String(STATEMENT_START);
  const raw = window.localStorage.getItem(STATEMENT_COUNTER_KEY);
  const next = raw ? parseInt(raw, 10) : STATEMENT_START;
  const value = Number.isFinite(next) && next >= STATEMENT_START ? next : STATEMENT_START;
  window.localStorage.setItem(STATEMENT_COUNTER_KEY, String(value + 1));
  return String(value);
}

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
