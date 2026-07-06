import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { K as useUpdateStatus } from "./queries-B6SZHgYf.mjs";
import { t as Route } from "./delivery._id-yuQTprc5.mjs";
import { t as DocumentDetail } from "./DocumentDetail-WSBIlUHU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/delivery._id-BlbHcDw8.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { id } = Route.useParams();
	const updateStatus = useUpdateStatus();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentDetail, {
		id,
		type: "delivery_note",
		listRoute: "/delivery",
		listLabel: "Delivery Notes",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => updateStatus.mutate({
				id,
				status: "in_transit",
				action: "in_transit"
			}),
			className: "btn-uppercase px-3 py-2 border border-border bg-card text-ink hover:bg-secondary",
			children: "Mark In Transit"
		})
	});
}
//#endregion
export { Page as component };
