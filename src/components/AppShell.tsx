import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "@/lib/auth";
import { useDocuments, useProfile } from "@/lib/queries";
import { NavInkStroke } from "@/components/NavInkStroke";
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
  Package,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, key: "dash" },
  { to: "/quotes", label: "Quotes", icon: FileText, key: "quote" },
  { to: "/invoices", label: "Invoices", icon: Receipt, key: "invoice" },
  { to: "/delivery", label: "Delivery", icon: Truck, key: "delivery_note" },
  { to: "/jobs", label: "Job Cards", icon: ClipboardList, key: "job_card" },
  { to: "/products", label: "Products", icon: Package, key: "products" },
  { to: "/customers", label: "Customers", icon: Users, key: "customers" },
  { to: "/tracker", label: "Order Tracker", icon: RouteIcon, key: "tracker" },
] as const;

const drawerEase = [0.22, 1, 0.36, 1] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut, loading } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: docs } = useDocuments();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && pathname !== "/auth") {
      navigate({ to: "/auth" });
    }
  }, [loading, user, pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-offwhite">
        <div className="text-muted-navy text-sm">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-offwhite">
        <div className="text-muted-navy text-sm">Redirecting…</div>
      </div>
    );
  }

  const countOf = (key: string) => (docs ?? []).filter((d) => d.doc_type === key).length;

  const sidebar = (
    <aside className="w-[260px] bg-card border-r border-border flex flex-col h-full shadow-[4px_0_24px_-12px_rgba(27,42,74,0.06)]">
      <div className="px-5 py-5 border-b border-border bg-gradient-to-b from-white to-secondary/30">
        <div className="flex items-center gap-3">
          <img
            src="/trend-capital-logo.png"
            alt="Trend Capital"
            className="w-11 h-11 rounded-full object-cover ring-1 ring-border shadow-sm"
          />
          <div>
            <div className="font-serif text-lg leading-none text-ink font-semibold tracking-tight">
              Trend Capital
            </div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-muted-navy mt-1">Workflow</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
          const count =
            n.key === "dash" || n.key === "tracker" || n.key === "products" || n.key === "customers"
              ? null
              : countOf(n.key);
          return (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-150",
                active
                  ? "text-royal font-medium"
                  : "text-muted-navy hover:text-ink hover:bg-secondary",
              )}
            >
              <NavInkStroke active={active} />
              <Icon className="w-4 h-4" />
              <span className="flex-1">{n.label}</span>
              {count !== null && count > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono font-medium bg-secondary text-muted-navy">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-border bg-secondary/20">
        <div className="text-sm text-ink font-medium truncate">{profile?.name || user.email}</div>
        <div className="text-[10px] uppercase tracking-[0.12em] text-muted-navy font-mono">
          {profile?.role ?? "staff"}
        </div>
        <button
          onClick={() => signOut()}
          className="mt-3 flex items-center gap-2 text-xs text-muted-navy hover:text-royal transition-colors duration-150"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign out
        </button>
        <div className="mt-4 text-[10px] uppercase tracking-[0.18em] text-muted-navy/50">
          Built by Muzi
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-offwhite">
      <div className="md:hidden flex items-center justify-between px-4 h-14 bg-card/90 border-b border-border sticky top-0 z-30 backdrop-blur-md">
        <button onClick={() => setOpen(true)} className="p-2 -ml-2 text-ink">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <img src="/trend-capital-logo.png" alt="" className="w-7 h-7 rounded-full shadow-sm" />
          <span className="font-serif text-base font-semibold text-ink">Trend Capital</span>
        </div>
        <div className="w-8" />
      </div>

      <div className="flex">
        <div className="hidden md:block h-screen sticky top-0">{sidebar}</div>

        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div
                className="absolute inset-0 bg-royal/20 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              />
              <motion.div
                className="absolute inset-y-0 left-0 w-[260px]"
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.2, ease: drawerEase }}
              >
                <button
                  onClick={() => setOpen(false)}
                  className="absolute -right-10 top-3 text-royal p-2 bg-white rounded-full shadow-md"
                >
                  <X className="w-5 h-5" />
                </button>
                {sidebar}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 min-w-0 vt-root">{children}</main>
      </div>
    </div>
  );
}
