import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as DocumentList } from "./DocumentList-DjAXO1UN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quotes.index-BD7xufQB.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentList, {
		type: "quote",
		title: "Quotations",
		newHref: "/quotes/new",
		detailRoute: (id) => `/quotes/${id}`,
		tabs: [
			{
				value: "draft",
				label: "Draft",
				match: (d) => d.status === "draft"
			},
			{
				value: "sent",
				label: "Sent",
				match: (d) => d.status === "sent"
			},
			{
				value: "approved",
				label: "Approved",
				match: (d) => d.status === "approved"
			}
		]
	});
}
//#endregion
export { Page as component };
