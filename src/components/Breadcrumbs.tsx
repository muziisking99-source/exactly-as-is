import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="flex items-center gap-1 text-xs text-muted-navy mb-3 min-w-0 overflow-hidden">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1 min-w-0 shrink">
          {i > 0 && <ChevronRight className="w-3 h-3 shrink-0" />}
          {it.to ? (
            <Link to={it.to} className="hover:text-ink truncate">
              {it.label}
            </Link>
          ) : (
            <span className="text-ink truncate">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
