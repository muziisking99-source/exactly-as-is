import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useAuth, t as AuthProvider } from "./auth-DsVZIAel.mjs";
import { _ as useNavigate, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { i as MutationCache, n as QueryCache, t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { B as useProfile, M as useDocuments } from "./queries-B6SZHgYf.mjs";
import { t as Route } from "./customers._id.statement-CJWb2xku.mjs";
import { c as Route$17, f as Package, g as FileText, h as LayoutDashboard, i as Truck, l as Receipt, m as LogOut, n as Users, p as Menu, t as X, v as ClipboardList } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Route$18 } from "./delivery._id-yuQTprc5.mjs";
import { n as getVtDirection, t as applyVtDirection } from "./view-transitions-BxeEtDWE.mjs";
import { t as useReducedMotion } from "./use-reduced-motion-DPT29gQb.mjs";
import { n as AnimatePresence } from "../_libs/framer-motion.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { t as Route$19 } from "./invoices._id-DRVrXK6v.mjs";
import { t as Route$20 } from "./quotes._id-pMm9uIjl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CHvdprxo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-Bb5E7lSH.css";
/** Pen-stroke underline for active nav — draws L→R, retracts on deactivate */
function NavInkStroke({ active, className }) {
	const reduced = useReducedMotion();
	const pathRef = (0, import_react.useRef)(null);
	const [length, setLength] = (0, import_react.useState)(0);
	const prevActive = (0, import_react.useRef)(active);
	(0, import_react.useEffect)(() => {
		if (pathRef.current) setLength(pathRef.current.getTotalLength());
	}, []);
	(0, import_react.useEffect)(() => {
		prevActive.current = active;
	}, [active]);
	if (reduced) return active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute bottom-1 left-3 right-3 h-px bg-royal ${className ?? ""}` }) : null;
	const offset = active ? 0 : length;
	const duration = active ? 150 : 120;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		className: `absolute bottom-1 left-3 right-3 h-[3px] overflow-visible pointer-events-none ${className ?? ""}`,
		preserveAspectRatio: "none",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			ref: pathRef,
			d: "M0 2 Q12 0 24 2 T48 2",
			fill: "none",
			stroke: "var(--royal)",
			strokeWidth: "2",
			strokeLinecap: "round",
			style: {
				strokeDasharray: length || 48,
				strokeDashoffset: offset,
				transition: `stroke-dashoffset ${duration}ms ease-out`
			}
		})
	});
}
var NAV = [
	{
		to: "/",
		label: "Dashboard",
		icon: LayoutDashboard,
		key: "dash"
	},
	{
		to: "/quotes",
		label: "Quotes",
		icon: FileText,
		key: "quote"
	},
	{
		to: "/invoices",
		label: "Invoices",
		icon: Receipt,
		key: "invoice"
	},
	{
		to: "/delivery",
		label: "Delivery",
		icon: Truck,
		key: "delivery_note"
	},
	{
		to: "/jobs",
		label: "Job Cards",
		icon: ClipboardList,
		key: "job_card"
	},
	{
		to: "/products",
		label: "Products",
		icon: Package,
		key: "products"
	},
	{
		to: "/customers",
		label: "Customers",
		icon: Users,
		key: "customers"
	},
	{
		to: "/tracker",
		label: "Order Tracker",
		icon: Route$17,
		key: "tracker"
	}
];
var drawerEase = [
	.22,
	1,
	.36,
	1
];
function AppShell({ children }) {
	const { user, signOut, loading } = useAuth();
	const { data: profile } = useProfile(user?.id);
	const { data: docs } = useDocuments();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!loading && !user && pathname !== "/auth") navigate({ to: "/auth" });
	}, [
		loading,
		user,
		pathname,
		navigate
	]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen grid place-items-center bg-offwhite",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-muted-navy text-sm",
			children: "Loading…"
		})
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen grid place-items-center bg-offwhite",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-muted-navy text-sm",
			children: "Redirecting…"
		})
	});
	const countOf = (key) => (docs ?? []).filter((d) => d.doc_type === key).length;
	const sidebar = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "w-[260px] bg-card border-r border-border flex flex-col h-full shadow-[4px_0_24px_-12px_rgba(27,42,74,0.06)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-5 py-5 border-b border-border bg-gradient-to-b from-white to-secondary/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/trend-capital-logo.png",
						alt: "Trend Capital",
						className: "w-11 h-11 rounded-full object-cover ring-1 ring-border shadow-sm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif text-lg leading-none text-ink font-semibold tracking-tight",
						children: "Trend Capital"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-[0.16em] text-muted-navy mt-1",
						children: "Workflow"
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 px-3 py-4 space-y-0.5",
				children: NAV.map((n) => {
					const Icon = n.icon;
					const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
					const count = n.key === "dash" || n.key === "tracker" || n.key === "products" || n.key === "customers" ? null : countOf(n.key);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: n.to,
						onClick: () => setOpen(false),
						className: cn("relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-150", active ? "text-royal font-medium" : "text-muted-navy hover:text-ink hover:bg-secondary"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavInkStroke, { active }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-4 h-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1",
								children: n.label
							}),
							count !== null && count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] px-1.5 py-0.5 rounded-md font-mono font-medium bg-secondary text-muted-navy",
								children: count
							})
						]
					}, n.to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 py-4 border-t border-border bg-secondary/20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-ink font-medium truncate",
						children: profile?.name || user.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-[0.12em] text-muted-navy font-mono",
						children: profile?.role ?? "staff"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => signOut(),
						className: "mt-3 flex items-center gap-2 text-xs text-muted-navy hover:text-royal transition-colors duration-150",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-3.5 h-3.5" }), " Sign out"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 text-[10px] uppercase tracking-[0.18em] text-muted-navy/50",
						children: "Built by Muzi"
					})
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-offwhite",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "md:hidden flex items-center justify-between px-4 h-14 bg-card/90 border-b border-border sticky top-0 z-30 backdrop-blur-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setOpen(true),
					className: "p-2 -ml-2 text-ink",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-5 h-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/trend-capital-logo.png",
						alt: "",
						className: "w-7 h-7 rounded-full shadow-sm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-serif text-base font-semibold text-ink",
						children: "Trend Capital"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-8" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden md:block h-screen sticky top-0",
					children: sidebar
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					className: "fixed inset-0 z-40 md:hidden",
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					exit: { opacity: 0 },
					transition: { duration: .15 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 bg-royal/20 backdrop-blur-sm",
						onClick: () => setOpen(false)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						className: "absolute inset-y-0 left-0 w-[260px]",
						initial: { x: -280 },
						animate: { x: 0 },
						exit: { x: -280 },
						transition: {
							duration: .2,
							ease: drawerEase
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setOpen(false),
							className: "absolute -right-10 top-3 text-royal p-2 bg-white rounded-full shadow-md",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						}), sidebar]
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 min-w-0 vt-root",
					children
				})
			]
		})]
	});
}
/** Sets html[data-vt] before internal navigations for direction-aware view transitions */
function VtDirectionSync() {
	(0, import_react.useEffect)(() => {
		const onClick = (e) => {
			const el = e.target.closest("a[href]");
			if (!el || !(el instanceof HTMLAnchorElement)) return;
			if (el.target === "_blank" || el.hasAttribute("download")) return;
			try {
				const url = new URL(el.href, window.location.origin);
				if (url.origin !== window.location.origin) return;
				applyVtDirection(getVtDirection(window.location.pathname, url.pathname));
			} catch {}
		};
		const onPopState = () => applyVtDirection("back");
		document.addEventListener("click", onClick, true);
		window.addEventListener("popstate", onPopState);
		return () => {
			document.removeEventListener("click", onClick, true);
			window.removeEventListener("popstate", onPopState);
		};
	}, []);
	return null;
}
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-offwhite px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-7xl text-ink",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-navy",
					children: "Page not found."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					className: "mt-6 inline-flex btn-uppercase px-4 py-2 bg-royal text-primary-foreground",
					children: "Go home"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "root" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-offwhite px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-2xl text-ink",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-navy",
					children: error.message
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						router.invalidate();
						reset();
					},
					className: "mt-6 btn-uppercase px-4 py-2 bg-royal text-primary-foreground",
					children: "Try again"
				})
			]
		})
	});
}
var Route$16 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Trend Capital Workflow" },
			{
				name: "description",
				content: "Trend Capital workflow — quotes, invoices, delivery notes, and job cards."
			},
			{
				property: "og:title",
				content: "Trend Capital Workflow"
			},
			{
				property: "og:description",
				content: "Quotes, invoices, delivery notes, and job cards for Trend Capital."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/trend-capital-logo.png",
				type: "image/png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: ""
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function ShellGate() {
	if (useRouterState({ select: (s) => s.location.pathname }) === "/auth") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
function RootComponent() {
	const [queryClient] = (0, import_react.useState)(() => new QueryClient({
		defaultOptions: { queries: {
			refetchOnWindowFocus: false,
			staleTime: 3e4
		} },
		queryCache: new QueryCache({ onError: (e) => toast.error(e.message ?? "Something went wrong") }),
		mutationCache: new MutationCache({ onError: (e) => toast.error(e.message ?? "Action failed") })
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VtDirectionSync, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShellGate, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-right",
				theme: "light",
				richColors: true
			})
		] })
	});
}
var $$splitComponentImporter$14 = () => import("./tracker-5f9D1eA8.mjs");
var Route$15 = createFileRoute("/tracker")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./quotes-B59KfiyO.mjs");
var Route$14 = createFileRoute("/quotes")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./products-BStXIeRT.mjs");
var Route$13 = createFileRoute("/products")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./jobs-D3eKPmN1.mjs");
var Route$12 = createFileRoute("/jobs")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./invoices-PD4q9kOS.mjs");
var Route$11 = createFileRoute("/invoices")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./delivery-D4DOXBYI.mjs");
var Route$10 = createFileRoute("/delivery")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./customers-D9s-8NG-.mjs");
var Route$9 = createFileRoute("/customers")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./auth-CbrpQCfT.mjs");
var Route$8 = createFileRoute("/auth")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./routes-CeGv-G7T.mjs");
var Route$7 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./quotes.index-BD7xufQB.mjs");
var Route$6 = createFileRoute("/quotes/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./invoices.index-DqOxr4bR.mjs");
var Route$5 = createFileRoute("/invoices/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./delivery.index-Db52Hgxo.mjs");
var Route$4 = createFileRoute("/delivery/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./customers.index-D4ZzRB9R.mjs");
var Route$3 = createFileRoute("/customers/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./quotes.new-Dfy6mRbN.mjs");
var Route$2 = createFileRoute("/quotes/new")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./invoices.new-BUaMh2Dq.mjs");
var Route$1 = createFileRoute("/invoices/new")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var TrackerRoute = Route$15.update({
	id: "/tracker",
	path: "/tracker",
	getParentRoute: () => Route$16
});
var QuotesRoute = Route$14.update({
	id: "/quotes",
	path: "/quotes",
	getParentRoute: () => Route$16
});
var ProductsRoute = Route$13.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => Route$16
});
var JobsRoute = Route$12.update({
	id: "/jobs",
	path: "/jobs",
	getParentRoute: () => Route$16
});
var InvoicesRoute = Route$11.update({
	id: "/invoices",
	path: "/invoices",
	getParentRoute: () => Route$16
});
var DeliveryRoute = Route$10.update({
	id: "/delivery",
	path: "/delivery",
	getParentRoute: () => Route$16
});
var CustomersRoute = Route$9.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => Route$16
});
var AuthRoute = Route$8.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$16
});
var IndexRoute = Route$7.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$16
});
var QuotesIndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => QuotesRoute
});
var InvoicesIndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => InvoicesRoute
});
var DeliveryIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => DeliveryRoute
});
var CustomersIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => CustomersRoute
});
var QuotesNewRoute = Route$2.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => QuotesRoute
});
var QuotesIdRoute = Route$20.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => QuotesRoute
});
var InvoicesNewRoute = Route$1.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => InvoicesRoute
});
var InvoicesIdRoute = Route$19.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => InvoicesRoute
});
var DeliveryIdRoute = Route$18.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => DeliveryRoute
});
var CustomersRouteChildren = {
	CustomersIndexRoute,
	CustomersIdStatementRoute: Route.update({
		id: "/$id/statement",
		path: "/$id/statement",
		getParentRoute: () => CustomersRoute
	})
};
var CustomersRouteWithChildren = CustomersRoute._addFileChildren(CustomersRouteChildren);
var DeliveryRouteChildren = {
	DeliveryIdRoute,
	DeliveryIndexRoute
};
var DeliveryRouteWithChildren = DeliveryRoute._addFileChildren(DeliveryRouteChildren);
var InvoicesRouteChildren = {
	InvoicesIdRoute,
	InvoicesNewRoute,
	InvoicesIndexRoute
};
var InvoicesRouteWithChildren = InvoicesRoute._addFileChildren(InvoicesRouteChildren);
var QuotesRouteChildren = {
	QuotesIdRoute,
	QuotesNewRoute,
	QuotesIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthRoute,
	CustomersRoute: CustomersRouteWithChildren,
	DeliveryRoute: DeliveryRouteWithChildren,
	InvoicesRoute: InvoicesRouteWithChildren,
	JobsRoute,
	ProductsRoute,
	QuotesRoute: QuotesRoute._addFileChildren(QuotesRouteChildren),
	TrackerRoute
};
var routeTree = Route$16._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		defaultViewTransition: true
	});
};
//#endregion
export { getRouter };
