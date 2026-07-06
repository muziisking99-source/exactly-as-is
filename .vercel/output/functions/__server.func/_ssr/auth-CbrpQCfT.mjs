import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useAuth } from "./auth-DsVZIAel.mjs";
import { _ as useNavigate, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CbrpQCfT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const { signIn, signUp, user } = useAuth();
	const nav = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [mode, setMode] = (0, import_react.useState)("in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (user && pathname === "/auth") nav({ to: "/" });
	}, [
		user,
		pathname,
		nav
	]);
	async function submit(e) {
		e.preventDefault();
		setLoading(true);
		const r = mode === "in" ? await signIn(email, password) : await signUp(email, password, name);
		setLoading(false);
		if (r.error) toast.error(r.error.message);
		else if (mode === "up") {
			toast.success("Account created. You can sign in now.");
			setMode("in");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-[100dvh] grid md:grid-cols-2 bg-offwhite",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden md:flex flex-col justify-between p-10 bg-royal text-primary-foreground relative overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 opacity-40",
					style: { background: "radial-gradient(ellipse 60% 50% at 20% 10%, rgba(255,255,255,0.12), transparent), radial-gradient(ellipse 50% 40% at 90% 90%, rgba(0,0,0,0.15), transparent)" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/trend-capital-logo.png",
						alt: "Trend Capital",
						className: "w-16 h-16 rounded-full ring-2 ring-white/20 shadow-lg bg-white"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif text-2xl leading-tight font-semibold",
						children: "Trend Capital"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-[0.16em] mt-1 text-white/70",
						children: "Capital & Commerce"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif text-4xl leading-[1.05] font-semibold tracking-tight",
						children: "Workflow Platform"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-md text-white/80 text-sm leading-relaxed",
						children: "Manage quotes, invoices, deliveries and job cards for Trend Capital operations."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative text-[10px] uppercase tracking-[0.18em] text-white/50",
					children: "Built by Muzi"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "w-full max-w-sm space-y-5 glass-card p-8 hover-lift",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:hidden flex items-center gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/trend-capital-logo.png",
								alt: "",
								className: "w-10 h-10 rounded-full shadow-sm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-serif text-2xl text-ink font-semibold",
								children: "Trend Capital"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-2xl text-ink font-semibold",
							children: mode === "in" ? "Sign in" : "Create account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-navy mt-1",
							children: mode === "in" ? "Access the workflow." : "Staff registration."
						})
					] }),
					mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-navy",
						children: "Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						value: name,
						onChange: (e) => setName(e.target.value),
						className: "mt-1 input-field"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-navy",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						className: "mt-1 input-field"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-navy",
						children: "Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "password",
						minLength: 6,
						value: password,
						onChange: (e) => setPassword(e.target.value),
						className: "mt-1 input-field"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: loading,
						className: "btn-uppercase w-full py-2.5 bg-royal text-primary-foreground hover:bg-royal-deep disabled:opacity-60",
						children: loading ? "Please wait…" : mode === "in" ? "Sign in" : "Sign up"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center text-xs text-muted-navy",
						children: [
							mode === "in" ? "No account?" : "Have an account?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMode(mode === "in" ? "up" : "in"),
								className: "text-royal font-medium hover:underline",
								children: mode === "in" ? "Create one" : "Sign in"
							})
						]
					})
				]
			})
		})]
	});
}
//#endregion
export { AuthPage as component };
