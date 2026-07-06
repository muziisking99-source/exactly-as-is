import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as DocumentList } from "./DocumentList-DjAXO1UN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/delivery.index-Db52Hgxo.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentList, {
		type: "delivery_note",
		title: "Delivery Notes",
		detailRoute: (id) => `/delivery/${id}`,
		tabs: [
			{
				value: "ready",
				label: "Ready",
				match: (d) => d.status === "ready"
			},
			{
				value: "in_transit",
				label: "In Transit",
				match: (d) => d.status === "in_transit"
			},
			{
				value: "delivered",
				label: "Delivered",
				match: (d) => d.status === "delivered"
			},
			{
				value: "returned",
				label: "Returned",
				match: (d) => d.status === "returned"
			}
		]
	});
}
//#endregion
export { Page as component };
