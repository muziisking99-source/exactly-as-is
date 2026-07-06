import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TableSkeleton-DidsG2Fj.js
var import_jsx_runtime = require_jsx_runtime();
/** Blueprint grid pulse — production-drawing feel, not shimmer */
function TableSkeleton({ rows = 6, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden", className),
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 blueprint-grid pointer-events-none",
			style: {
				backgroundImage: `
            linear-gradient(var(--royal) 1px, transparent 1px),
            linear-gradient(90deg, var(--royal) 1px, transparent 1px)
          `,
				backgroundSize: "24px 24px",
				opacity: .1,
				animation: "blueprint-breathe 1.8s ease-in-out infinite"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative space-y-0 divide-y divide-border",
			children: Array.from({ length: rows }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "h-12 px-4 flex items-center gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-24 rounded bg-secondary/80" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 flex-1 max-w-[140px] rounded bg-secondary/60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-16 rounded bg-secondary/50 ml-auto" })
				]
			}, i))
		})]
	});
}
//#endregion
export { TableSkeleton as t };
