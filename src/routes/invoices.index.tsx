import { createFileRoute } from "@tanstack/react-router";
import { DocumentList } from "@/components/DocumentList";
import { isOverdue } from "@/lib/format";

export const Route = createFileRoute("/invoices/")({ component: Page });

function Page() {
  return (
    <DocumentList
      type="invoice"
      title="Invoices"
      newHref="/invoices/new"
      detailRoute={(id) => `/invoices/${id}`}
      tabs={[
        {
          value: "unpaid",
          label: "Unpaid",
          match: (d) =>
            d.status === "unpaid" ||
            d.status === "partially_paid" ||
            d.status === "sent" ||
            (isOverdue(d) && d.status !== "paid"),
        },
        { value: "paid", label: "Paid", match: (d) => d.status === "paid" },
        { value: "cancelled", label: "Cancelled", match: (d) => d.status === "cancelled" },
      ]}
    />
  );
}
