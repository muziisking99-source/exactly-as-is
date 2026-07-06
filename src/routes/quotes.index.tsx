import { createFileRoute } from "@tanstack/react-router";
import { DocumentList } from "@/components/DocumentList";

export const Route = createFileRoute("/quotes/")({ component: Page });

function Page() {
  return (
    <DocumentList
      type="quote"
      title="Quotations"
      newHref="/quotes/new"
      detailRoute={(id) => `/quotes/${id}`}
      tabs={[
        { value: "draft", label: "Draft", match: (d) => d.status === "draft" },
        { value: "sent", label: "Sent", match: (d) => d.status === "sent" },
        { value: "approved", label: "Approved", match: (d) => d.status === "approved" },
      ]}
    />
  );
}
