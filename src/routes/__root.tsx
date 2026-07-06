import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { toast } from "sonner";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";
import { VtDirectionSync } from "@/components/VtDirectionSync";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-offwhite px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl text-ink">404</h1>
        <p className="mt-2 text-sm text-muted-navy">Page not found.</p>
        <a href="/" className="mt-6 inline-flex btn-uppercase px-4 py-2 bg-royal text-primary-foreground">
          Go home
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "root" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-offwhite px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl text-ink">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-navy">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 btn-uppercase px-4 py-2 bg-royal text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Trend Capital Workflow" },
      { name: "description", content: "Trend Capital workflow — quotes, invoices, delivery notes, and job cards." },
      { property: "og:title", content: "Trend Capital Workflow" },
      { property: "og:description", content: "Trend Capital workflow — quotes, invoices, delivery notes, and job cards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Trend Capital Workflow" },
      { name: "twitter:description", content: "Trend Capital workflow — quotes, invoices, delivery notes, and job cards." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fcef1a0d-1a18-4868-9335-6398c509e5c6/id-preview-e04808d2--a0adb80d-98b3-427b-b2e0-f74b964c02a1.lovable.app-1783345934652.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fcef1a0d-1a18-4868-9335-6398c509e5c6/id-preview-e04808d2--a0adb80d-98b3-427b-b2e0-f74b964c02a1.lovable.app-1783345934652.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/trend-capital-logo.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function ShellGate() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/auth") return <Outlet />;
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function RootComponent() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false, staleTime: 30_000 } },
        queryCache: new QueryCache({
          onError: (e) => toast.error((e as Error).message ?? "Something went wrong"),
        }),
        mutationCache: new MutationCache({
          onError: (e) => toast.error((e as Error).message ?? "Action failed"),
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <VtDirectionSync />
        <ShellGate />
        <Toaster position="top-right" theme="light" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
