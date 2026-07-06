import { createFileRoute } from "@tanstack/react-router";
import { DocumentDetail } from "@/components/DocumentDetail";
import { useUpdateStatus } from "@/lib/queries";

export const Route = createFileRoute("/delivery/$id")({ component: Page });

function Page() {
  const { id } = Route.useParams();
  const updateStatus = useUpdateStatus();
  return (
    <DocumentDetail
      id={id}
      type="delivery_note"
      listRoute="/delivery"
      listLabel="Delivery Notes"
      actions={
        <button
          onClick={() => updateStatus.mutate({ id, status: "in_transit", action: "in_transit" })}
          className="btn-uppercase px-3 py-2 border border-border bg-card text-ink hover:bg-secondary"
        >
          Mark In Transit
        </button>
      }
    />
  );
}
