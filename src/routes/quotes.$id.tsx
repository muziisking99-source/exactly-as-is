import { createFileRoute } from "@tanstack/react-router";
import { DocumentDetail } from "@/components/DocumentDetail";

export const Route = createFileRoute("/quotes/$id")({ component: Page });

function Page() {
  const { id } = Route.useParams();
  return <DocumentDetail id={id} type="quote" listRoute="/quotes" listLabel="Quotations" />;
}
