import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useDocuments, useProfile } from "@/lib/queries";
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Truck,
  ClipboardList,
  Route as RouteIcon,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, key: "dash" },
  { to: "/quotes", label: "Quotes", icon: FileText, key: "quote" },
  { to: "/invoices", label: "Invoices", icon: Receipt, key: "invoice" },
  { to: "/delivery", label: "Delivery", icon: Truck, key: "delivery_note" },
  { to: "/jobs", label: "Job Cards", icon: ClipboardList, key: "job_card" },
  { to: "/tracker", label: "Order Tracker", icon: RouteIcon, key: "tracker" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut, loading } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: docs } = useDocuments();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-offwhite">
        <div className="text-muted-navy text-sm">Loading…</div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined" && pathname !== "/auth") {
      navigate({ to: "/auth" });
    }
    return <>{children}</>;
  }

  const countOf = (key: string) => (docs ?? []).filter((d) => d.doc_type === key).length;

  const sidebar = (
    <aside className="w-[260px] bg-white border-r border-border flex flex-col h-full">
      <div className="px-6 py-5 border-b border-border">
        <div className="font-serif text-2xl leading-none text-ink">Alpine-Eco</div>
        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-navy mt-1">Workflow</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
          const count = n.key === "dash" || n.key === "tracker" ? null : countOf(n.key);
          return (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-royal text-white"
                  : "text-ink hover:bg-secondary",
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1">{n.label}</span>
              {count !== null && count > 0 && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-medium",
                    active ? "bg-white/20 text-white" : "bg-secondary text-muted-navy",
                  )}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-border">
        <div className="text-sm text-ink font-medium truncate">{profile?.name || user.email}</div>
        <div className="text-[11px] uppercase tracking-[0.1em] text-muted-navy">{profile?.role ?? "staff"}</div>
        <button
          onClick={() => signOut()}
          className="mt-3 flex items-center gap-2 text-xs text-muted-navy hover:text-ink"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign out
        </button>
        <div className="mt-4 text-[10px] uppercase tracking-[0.18em] text-muted-navy/70">
          Built by Muzi
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-border sticky top-0 z-30">
        <button onClick={() => setOpen(true)} className="p-2 -ml-2">
          <Menu className="w-5 h-5" />
        </button>
        <div className="font-serif text-lg">Alpine-Eco</div>
        <div className="w-8" />
      </div>

      <div className="flex">
        <div className="hidden md:block h-screen sticky top-0">{sidebar}</div>

        {open && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-[260px]">
              <button
                onClick={() => setOpen(false)}
                className="absolute -right-10 top-3 text-white p-2"
              >
                <X className="w-5 h-5" />
              </button>
              {sidebar}
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
