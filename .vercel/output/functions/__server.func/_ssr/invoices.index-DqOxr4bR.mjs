import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { u as isOverdue } from "./queries-B6SZHgYf.mjs";
import { t as DocumentList } from "./DocumentList-DjAXO1UN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invoices.index-DqOxr4bR.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentList, {
		type: "invoice",
		title: "Invoices",
		newHref: "/invoices/new",
		detailRoute: (id) => `/invoices/${id}`,
		tabs: [
			{
				value: "unpaid",
				label: "Unpaid",
				match: (d) => d.status === "unpaid" || d.status === "partially_paid" || d.status === "sent" || isOverdue(d) && d.status !== "paid"
			},
			{
				value: "paid",
				label: "Paid",
				match: (d) => d.status === "paid"
			},
			{
				value: "cancelled",
				label: "Cancelled",
				match: (d) => d.status === "cancelled"
			}
		]
	});
}
//#endregion
export { Page as component };
