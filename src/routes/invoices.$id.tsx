import { createFileRoute } from "@tanstack/react-router";
import { DocumentDetail } from "@/components/DocumentDetail";

export const Route = createFileRoute("/invoices/$id")({ component: Page });

function Page() {
  const { id } = Route.useParams();
  return <DocumentDetail id={id} type="invoice" listRoute="/invoices" listLabel="Invoices" />;
}
