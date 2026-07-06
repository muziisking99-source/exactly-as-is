import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useDeleteDocument, useIsAdmin } from "@/lib/queries";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteDocButton({
  id,
  redirectTo,
  label = "Delete",
}: {
  id: string;
  redirectTo?: string;
  label?: string;
}) {
  const isAdmin = useIsAdmin();
  const del = useDeleteDocument();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  if (!isAdmin) return null;
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] uppercase tracking-[0.08em] font-semibold text-danger border border-danger/30 rounded hover:bg-red-50">
          <Trash2 className="w-3.5 h-3.5" /> {label}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete document?</AlertDialogTitle>
          <AlertDialogDescription>
            This cannot be undone. Related line items, tasks, and activity will be removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-danger text-white hover:bg-danger/90"
            onClick={async () => {
              await del.mutateAsync(id);
              setOpen(false);
              if (redirectTo) nav({ to: redirectTo });
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
