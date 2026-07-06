import { o as __toESM } from "../_runtime.mjs";
import { a as dueDateFromDocDate, f as pdfMoney, n as DOC_LABELS, o as fmtDate, p as pdfTotal, r as INVOICE_PAYMENT_TERMS, t as COMPANY } from "./queries-B6SZHgYf.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
import { t as autoTable } from "../_libs/jspdf-autotable.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pdf-Csiy_zzv.js
var import_jspdf_node_min = /* @__PURE__ */ __toESM(require_jspdf_node_min());
var NAVY = [
	27,
	42,
	74
];
var INK = [
	30,
	30,
	30
];
var MUTED = [
	100,
	100,
	100
];
var ROW_ALT = [
	245,
	247,
	250
];
var PAID_GREEN = [
	30,
	158,
	94
];
var TABLE_ROWS = 15;
var logoDataUrl = null;
async function loadLogo() {
	if (logoDataUrl) return logoDataUrl;
	try {
		const res = await fetch("/trend-capital-logo.png");
		if (!res.ok) return null;
		const blob = await res.blob();
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				logoDataUrl = reader.result;
				resolve(logoDataUrl);
			};
			reader.onerror = () => resolve(null);
			reader.readAsDataURL(blob);
		});
	} catch {
		return null;
	}
}
function drawNavyBar(pdf, x, y, w, h, label) {
	pdf.setFillColor(...NAVY);
	pdf.rect(x, y, w, h, "F");
	pdf.setTextColor(255, 255, 255);
	pdf.setFont("helvetica", "bold");
	pdf.setFontSize(9);
	pdf.text(label, x + 6, y + h / 2 + 3);
}
function drawMetaBox(pdf, x, y, w, rows) {
	const rowH = 14;
	const labelW = 72;
	pdf.setDrawColor(180);
	pdf.setLineWidth(.5);
	rows.forEach(([label, value], i) => {
		const ry = y + i * rowH;
		pdf.rect(x, ry, w, rowH);
		pdf.line(x + labelW, ry, x + labelW, ry + rowH);
		pdf.setFont("helvetica", "normal");
		pdf.setFontSize(8);
		pdf.setTextColor(...MUTED);
		pdf.text(label, x + 4, ry + 9);
		pdf.setTextColor(...INK);
		pdf.setFont("helvetica", "bold");
		pdf.text(value, x + labelW + 4, ry + 9);
	});
}
async function generatePDF(doc, items = [], tasks = []) {
	const pdf = new import_jspdf_node_min.default({
		unit: "pt",
		format: "a4"
	});
	const W = pdf.internal.pageSize.getWidth();
	const M = 36;
	const logo = await loadLogo();
	if (logo) pdf.addImage(logo, "PNG", M, 28, 72, 72);
	else {
		pdf.setFont("helvetica", "bold");
		pdf.setFontSize(14);
		pdf.setTextColor(...INK);
		pdf.text(COMPANY.name.toUpperCase(), M, 50);
	}
	const label = DOC_LABELS[doc.doc_type] || "Document";
	pdf.setTextColor(...NAVY);
	pdf.setFont("helvetica", "bold");
	pdf.setFontSize(28);
	pdf.text(label, W - M, 48, { align: "right" });
	const metaW = 160;
	const metaX = W - M - metaW;
	const metaRows = [
		["Date", fmtDate(doc.doc_date)],
		[label === "Invoice" ? "Invoice #" : "Doc #", doc.doc_number],
		["Customer ID", doc.customer_name?.slice(0, 12) || "—"]
	];
	if (doc.doc_type === "invoice") {
		metaRows.push(["Payment Terms", INVOICE_PAYMENT_TERMS]);
		metaRows.push(["Due Date", fmtDate(doc.due_date ?? dueDateFromDocDate(doc.doc_date))]);
	}
	drawMetaBox(pdf, metaX, 58, metaW, metaRows);
	let y = 108 + (doc.doc_type === "invoice" ? 28 : 0);
	const halfW = (W - M * 2 - 8) / 2;
	drawNavyBar(pdf, M, y, halfW, 16, "Bill To:");
	drawNavyBar(pdf, M + halfW + 8, y, halfW, 16, "VAT No:");
	y += 16;
	const boxH = 52;
	pdf.setDrawColor(180);
	pdf.setLineWidth(.5);
	pdf.rect(M, y, halfW, boxH);
	pdf.rect(M + halfW + 8, y, halfW, boxH);
	pdf.setFont("helvetica", "normal");
	pdf.setFontSize(9);
	pdf.setTextColor(...INK);
	let by = y + 12;
	pdf.text(doc.customer_name || "—", 42, by);
	by += 11;
	if (doc.customer_address) {
		const lines = pdf.splitTextToSize(doc.customer_address, halfW - 12);
		pdf.text(lines, 42, by);
	}
	if (doc.customer_email) {
		pdf.setFontSize(8);
		pdf.setTextColor(...MUTED);
		pdf.text(doc.customer_email, 42, y + boxH - 8);
	}
	pdf.setFont("helvetica", "normal");
	pdf.setFontSize(9);
	pdf.setTextColor(...INK);
	pdf.text(COMPANY.vatNumber, M + halfW + 14, y + 20);
	y += 62;
	const spW = 120;
	drawNavyBar(pdf, M, y, spW, 14, "Salesperson");
	pdf.rect(M, y + 14, spW, 22);
	pdf.setFont("helvetica", "normal");
	pdf.setFontSize(9);
	pdf.setTextColor(...INK);
	pdf.text(COMPANY.contact, 42, y + 28);
	y += 44;
	if (doc.doc_type === "invoice" && doc.status === "paid") {
		pdf.saveGraphicsState();
		pdf.setTextColor(...PAID_GREEN);
		pdf.setFont("helvetica", "bold");
		pdf.setFontSize(42);
		pdf.text("PAID", W / 2, y + 60, {
			align: "center",
			angle: -12
		});
		pdf.restoreGraphicsState();
	}
	if (doc.doc_type === "job_card") {
		if (doc.project_description) {
			pdf.setFont("helvetica", "bold");
			pdf.setFontSize(9);
			pdf.setTextColor(...NAVY);
			pdf.text("PROJECT", M, y);
			pdf.setFont("helvetica", "normal");
			pdf.setFontSize(9);
			pdf.setTextColor(...INK);
			pdf.text(pdf.splitTextToSize(doc.project_description, W - M * 2), M, y + 12);
			y += 40;
		}
		autoTable(pdf, {
			startY: y,
			head: [[
				"Task",
				"Assigned to",
				"Status"
			]],
			body: tasks.map((t) => [
				t.task_description,
				t.assigned_to ?? "—",
				t.status
			]),
			headStyles: {
				fillColor: NAVY,
				textColor: 255,
				fontStyle: "bold",
				fontSize: 9
			},
			styles: {
				font: "helvetica",
				fontSize: 9,
				textColor: INK
			},
			alternateRowStyles: { fillColor: ROW_ALT },
			margin: {
				left: M,
				right: M
			}
		});
	} else {
		const paddedRows = [];
		for (let i = 0; i < TABLE_ROWS; i++) {
			const it = items[i];
			if (it) paddedRows.push([
				i + 1,
				it.description,
				String(it.quantity),
				pdfMoney(it.unit_price),
				pdfMoney(it.total_price)
			]);
			else paddedRows.push([
				i + 1,
				"-",
				"-",
				"-",
				"-"
			]);
		}
		autoTable(pdf, {
			startY: y,
			head: [[
				"Item #",
				"Description",
				"Qty",
				"Unit Price",
				"Line Total"
			]],
			body: paddedRows,
			headStyles: {
				fillColor: NAVY,
				textColor: 255,
				fontStyle: "bold",
				fontSize: 9,
				halign: "center"
			},
			styles: {
				font: "helvetica",
				fontSize: 9,
				textColor: INK,
				cellPadding: 4
			},
			alternateRowStyles: { fillColor: ROW_ALT },
			columnStyles: {
				0: {
					halign: "center",
					cellWidth: 36
				},
				1: { halign: "left" },
				2: {
					halign: "center",
					cellWidth: 40
				},
				3: {
					halign: "right",
					cellWidth: 72
				},
				4: {
					halign: "right",
					cellWidth: 72
				}
			},
			margin: {
				left: M,
				right: M
			}
		});
	}
	let footerY = (pdf.lastAutoTable?.finalY ?? y + 200) + 24;
	if (doc.doc_type === "delivery_note") {
		pdf.setFontSize(9);
		pdf.setDrawColor(180);
		pdf.line(M, footerY + 30, 216, footerY + 30);
		pdf.text("Delivered by", M, footerY + 44);
		pdf.text("Name / Date", M, footerY + 56);
		pdf.line(W - M - 180, footerY + 30, W - M, footerY + 30);
		pdf.text("Received by", W - M - 180, footerY + 44);
		pdf.text("Name / Date", W - M - 180, footerY + 56);
		footerY += 80;
	} else if (doc.doc_type !== "job_card") {
		const notesW = 260;
		const notesH = 72;
		drawNavyBar(pdf, M, footerY, notesW, 14, "Special Notes");
		pdf.setDrawColor(180);
		pdf.rect(M, footerY + 14, notesW, notesH);
		pdf.setFont("helvetica", "normal");
		pdf.setFontSize(8);
		pdf.setTextColor(...INK);
		const bankLines = [
			`Bank: ${COMPANY.bank.name}`,
			`Account Name: ${COMPANY.bank.accountName}`,
			`Account Number: ${COMPANY.bank.accountNumber}`,
			`Branch: ${COMPANY.bank.branch}`
		];
		if (doc.notes) bankLines.push("", doc.notes);
		pdf.text(bankLines, 42, footerY + 26);
		const totalsX = W - M - 140;
		pdf.setFontSize(9);
		pdf.setTextColor(...INK);
		pdf.text("Subtotal", totalsX, footerY + 20);
		pdf.text(pdfTotal(doc.subtotal), W - M, footerY + 20, { align: "right" });
		pdf.setFont("helvetica", "bold");
		pdf.setFontSize(11);
		pdf.text("Total", totalsX, footerY + 40);
		pdf.text(pdfTotal(doc.total), W - M, footerY + 40, { align: "right" });
		footerY += 102;
	}
	pdf.setDrawColor(180);
	pdf.line(M, footerY, W - M, footerY);
	footerY += 20;
	pdf.setFont("helvetica", "bold");
	pdf.setFontSize(10);
	pdf.setTextColor(...INK);
	pdf.text("Thank you for your business!", W / 2, footerY, { align: "center" });
	footerY += 16;
	pdf.setFont("helvetica", "normal");
	pdf.setFontSize(8);
	pdf.setTextColor(...MUTED);
	pdf.text(`Should you have any enquiries concerning this ${label.toLowerCase()}, please contact ${COMPANY.contact} on ${COMPANY.phone}`, W / 2, footerY, { align: "center" });
	footerY += 20;
	pdf.line(116, footerY, W - M - 80, footerY);
	footerY += 12;
	pdf.text(COMPANY.address, W / 2, footerY, { align: "center" });
	pdf.save(`${doc.doc_number}.pdf`);
}
async function generateStatementPDF(customer, mode, from, to, data) {
	const pdf = new import_jspdf_node_min.default({
		unit: "pt",
		format: "a4"
	});
	const W = pdf.internal.pageSize.getWidth();
	const M = 36;
	const logo = await loadLogo();
	if (logo) pdf.addImage(logo, "PNG", M, 28, 56, 56);
	pdf.setTextColor(...NAVY);
	pdf.setFont("helvetica", "bold");
	pdf.setFontSize(22);
	pdf.text("Customer Statement", W - M, 48, { align: "right" });
	pdf.setFontSize(9);
	pdf.setTextColor(...MUTED);
	pdf.text(`Period: ${fmtDate(from)} — ${fmtDate(to)}`, W - M, 64, { align: "right" });
	pdf.text(mode === "open" ? "Open invoices" : "Activity statement", W - M, 76, { align: "right" });
	let y = 100;
	drawNavyBar(pdf, M, y, W - M * 2, 16, "Customer");
	y += 16;
	pdf.setDrawColor(180);
	pdf.rect(M, y, W - M * 2, 48);
	pdf.setFont("helvetica", "normal");
	pdf.setFontSize(9);
	pdf.setTextColor(...INK);
	pdf.text(customer.name, 42, y + 14);
	if (customer.billing_address) pdf.text(customer.billing_address, 42, y + 26);
	if (customer.vat_number) pdf.text(`VAT: ${customer.vat_number}`, 42, y + 38);
	y += 60;
	if (data.mode === "open") {
		autoTable(pdf, {
			startY: y,
			head: [[
				"Invoice #",
				"Date",
				"Due",
				"Total",
				"Paid",
				"Balance"
			]],
			body: data.rows.map((r) => [
				r.invoice.doc_number,
				fmtDate(r.invoice.doc_date),
				fmtDate(r.invoice.due_date),
				pdfTotal(r.invoice.total),
				pdfTotal(r.paid),
				pdfTotal(r.balance)
			]),
			headStyles: {
				fillColor: NAVY,
				textColor: 255,
				fontStyle: "bold",
				fontSize: 8
			},
			styles: {
				font: "helvetica",
				fontSize: 8,
				textColor: INK
			},
			margin: {
				left: M,
				right: M
			}
		});
		const endY = pdf.lastAutoTable?.finalY ?? y + 40;
		pdf.setFont("helvetica", "bold");
		pdf.setFontSize(10);
		pdf.text("Total outstanding:", M, endY + 24);
		pdf.text(pdfTotal(data.totalOutstanding), W - M, endY + 24, { align: "right" });
	} else {
		pdf.setFontSize(9);
		pdf.text(`Opening balance: ${pdfTotal(data.openingBalance)}`, M, y);
		y += 16;
		autoTable(pdf, {
			startY: y,
			head: [[
				"Date",
				"Type",
				"Reference",
				"Amount"
			]],
			body: data.ledger.map((row) => [
				fmtDate(row.date),
				row.kind === "invoice" ? "Invoice" : "Payment",
				row.kind === "invoice" ? row.invoice.doc_number : row.payment?.reference || row.invoice.doc_number,
				row.kind === "invoice" ? pdfTotal(row.amount) : `-${pdfMoney(row.amount)}`
			]),
			headStyles: {
				fillColor: NAVY,
				textColor: 255,
				fontStyle: "bold",
				fontSize: 8
			},
			styles: {
				font: "helvetica",
				fontSize: 8,
				textColor: INK
			},
			margin: {
				left: M,
				right: M
			}
		});
		const endY = pdf.lastAutoTable?.finalY ?? y + 40;
		pdf.setFont("helvetica", "bold");
		pdf.setFontSize(10);
		pdf.text("Closing balance:", M, endY + 24);
		pdf.text(pdfTotal(data.closingBalance), W - M, endY + 24, { align: "right" });
	}
	pdf.save(`statement-${customer.name.replace(/\s+/g, "-").toLowerCase()}-${from}.pdf`);
}
//#endregion
export { generateStatementPDF as n, generatePDF as t };
