import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { COMPANY, money, fmtDate, DOC_LABELS } from "./format";
import type { DocumentRow, LineItem, JobTask } from "./queries";

const ROYAL: [number, number, number] = [27, 63, 190];
const ECO: [number, number, number] = [30, 158, 94];
const INK: [number, number, number] = [13, 26, 46];

export function generatePDF(doc: DocumentRow, items: LineItem[] = [], tasks: JobTask[] = []) {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const W = pdf.internal.pageSize.getWidth();

  // Header band
  pdf.setFillColor(...ROYAL);
  pdf.rect(0, 0, W, 90, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.text(COMPANY.name, 40, 42);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(COMPANY.tagline, 40, 60);
  pdf.setFontSize(9);
  pdf.text(COMPANY.address, 40, 75);
  pdf.text(`${COMPANY.phone}  ·  ${COMPANY.email}`, 40, 87);

  // Doc title
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  const label = DOC_LABELS[doc.doc_type] || "Document";
  pdf.text(label.toUpperCase(), W - 40, 42, { align: "right" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text(doc.doc_number, W - 40, 60, { align: "right" });
  pdf.setFontSize(9);
  pdf.text(fmtDate(doc.doc_date), W - 40, 75, { align: "right" });

  // Bill-to
  pdf.setTextColor(...INK);
  let y = 120;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("BILL TO", 40, y);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  y += 14;
  pdf.text(doc.customer_name || "—", 40, y);
  if (doc.customer_email) { y += 12; pdf.setFontSize(9); pdf.text(doc.customer_email, 40, y); }
  if (doc.customer_phone) { y += 12; pdf.text(doc.customer_phone, 40, y); }
  if (doc.customer_address) { y += 12; pdf.text(doc.customer_address, 40, y); }

  // Meta right
  let ry = 120;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("STATUS", W - 40, ry, { align: "right" });
  pdf.setFont("helvetica", "normal");
  ry += 14;
  pdf.text(doc.status.toUpperCase(), W - 40, ry, { align: "right" });
  if (doc.due_date) {
    ry += 18;
    pdf.setFont("helvetica", "bold");
    pdf.text("DUE DATE", W - 40, ry, { align: "right" });
    pdf.setFont("helvetica", "normal");
    ry += 14;
    pdf.text(fmtDate(doc.due_date), W - 40, ry, { align: "right" });
  }

  const startY = Math.max(y, ry) + 30;

  // Paid stamp for invoices
  if (doc.doc_type === "invoice" && doc.status === "paid") {
    pdf.saveGraphicsState();
    pdf.setTextColor(...ECO);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(48);
    pdf.text("PAID", W - 140, startY + 30, { angle: -18 });
    pdf.restoreGraphicsState();
  }

  if (doc.doc_type === "job_card") {
    if (doc.project_description) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text("PROJECT", 40, startY);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      const lines = pdf.splitTextToSize(doc.project_description, W - 80);
      pdf.text(lines, 40, startY + 14);
    }
    autoTable(pdf, {
      startY: startY + 60,
      head: [["Task", "Assigned to", "Status"]],
      body: tasks.map((t) => [t.task_description, t.assigned_to ?? "—", t.status]),
      headStyles: { fillColor: ROYAL, textColor: 255 },
      styles: { font: "helvetica", fontSize: 10 },
    });
  } else {
    autoTable(pdf, {
      startY: startY + (doc.doc_type === "invoice" && doc.status === "paid" ? 40 : 0),
      head: [["Description", "Qty", "Unit Price", "Total"]],
      body: items.map((i) => [
        i.description,
        String(i.quantity),
        money(i.unit_price),
        money(i.total_price),
      ]),
      headStyles: { fillColor: ROYAL, textColor: 255 },
      styles: { font: "helvetica", fontSize: 10 },
      columnStyles: {
        1: { halign: "right", cellWidth: 50 },
        2: { halign: "right", cellWidth: 90 },
        3: { halign: "right", cellWidth: 90 },
      },
    });

    if (doc.doc_type !== "delivery_note") {
      const finalY = (pdf as any).lastAutoTable.finalY + 20;
      const boxX = W - 240;
      pdf.setFontSize(10);
      pdf.setTextColor(...INK);
      pdf.text("Subtotal", boxX, finalY);
      pdf.text(money(doc.subtotal), W - 40, finalY, { align: "right" });
      pdf.text(`Tax (${doc.tax_rate}%)`, boxX, finalY + 16);
      pdf.text(money(doc.tax_amount), W - 40, finalY + 16, { align: "right" });
      pdf.setDrawColor(...ROYAL);
      pdf.line(boxX, finalY + 24, W - 40, finalY + 24);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("TOTAL", boxX, finalY + 40);
      pdf.text(money(doc.total), W - 40, finalY + 40, { align: "right" });
    }

    if (doc.doc_type === "delivery_note") {
      const finalY = (pdf as any).lastAutoTable.finalY + 60;
      pdf.setFontSize(10);
      pdf.setDrawColor(180);
      pdf.line(40, finalY + 30, 260, finalY + 30);
      pdf.text("Delivered by", 40, finalY + 44);
      pdf.text("Name / Date", 40, finalY + 56);
      pdf.line(W - 260, finalY + 30, W - 40, finalY + 30);
      pdf.text("Received by", W - 260, finalY + 44);
      pdf.text("Name / Date", W - 260, finalY + 56);
    }
  }

  if (doc.notes) {
    const y2 = (pdf as any).lastAutoTable?.finalY ?? 300;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text("NOTES", 40, y2 + 100);
    pdf.setFont("helvetica", "normal");
    pdf.text(pdf.splitTextToSize(doc.notes, W - 80), 40, y2 + 114);
  }

  pdf.save(`${doc.doc_number}.pdf`);
}
