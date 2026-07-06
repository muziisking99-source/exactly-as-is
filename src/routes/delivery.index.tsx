import { createFileRoute } from "@tanstack/react-router";
import { DocumentList } from "@/components/DocumentList";

export const Route = createFileRoute("/delivery/")({ component: Page });

function Page() {
  return (
    <DocumentList
      type="delivery_note"
      title="Delivery Notes"
      detailRoute={(id) => `/delivery/${id}`}
      tabs={[
        { value: "ready", label: "Ready", match: (d) => d.status === "ready" },
        { value: "in_transit", label: "In Transit", match: (d) => d.status === "in_transit" },
        { value: "delivered", label: "Delivered", match: (d) => d.status === "delivered" },
        { value: "returned", label: "Returned", match: (d) => d.status === "returned" },
      ]}
    />
  );
}
