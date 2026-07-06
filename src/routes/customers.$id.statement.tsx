import { createFileRoute } from "@tanstack/react-router";
import { CustomerStatement } from "@/components/CustomerStatement";

export const Route = createFileRoute("/customers/$id/statement")({
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  return <CustomerStatement customerId={id} />;
}
