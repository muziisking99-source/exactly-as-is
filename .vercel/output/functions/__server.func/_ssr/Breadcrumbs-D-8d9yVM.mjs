import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as ChevronRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Breadcrumbs-D-8d9yVM.js
var import_jsx_runtime = require_jsx_runtime();
function Breadcrumbs({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex items-center gap-1 text-xs text-muted-navy mb-3",
		children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center gap-1",
			children: [i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3 h-3" }), it.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: it.to,
				className: "hover:text-ink",
				children: it.label
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-ink",
				children: it.label
			})]
		}, i))
	});
}
//#endregion
export { Breadcrumbs as t };
