import { createFileRoute } from "@tanstack/react-router";
import { InvoiceForm } from "@/components/InvoiceForm";

export const Route = createFileRoute("/invoices/new")({ component: InvoiceForm });
