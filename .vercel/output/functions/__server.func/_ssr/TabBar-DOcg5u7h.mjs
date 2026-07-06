import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TabBar-DOcg5u7h.js
var import_jsx_runtime = require_jsx_runtime();
function TabBar({ tabs, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-1 border-b border-border overflow-x-auto -mx-1 px-1",
		children: tabs.map((t) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onChange(t.value),
				className: cn("px-3 py-2 text-[11px] uppercase tracking-[0.1em] font-semibold border-b-2 -mb-px whitespace-nowrap transition-all duration-300", t.value === value ? "border-royal text-royal" : "border-transparent text-muted-navy hover:text-ink hover:border-border"),
				style: { transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" },
				children: [t.label, typeof t.count === "number" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-1.5 text-muted-navy/70 normal-case",
					children: [
						"(",
						t.count,
						")"
					]
				})]
			}, t.value);
		})
	});
}
//#endregion
export { TabBar as t };
