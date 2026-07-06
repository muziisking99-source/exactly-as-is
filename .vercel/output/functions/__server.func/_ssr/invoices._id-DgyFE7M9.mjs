import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as DocumentDetail } from "./DocumentDetail-WSBIlUHU.mjs";
import { t as Route } from "./invoices._id-DRVrXK6v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invoices._id-DgyFE7M9.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { id } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentDetail, {
		id,
		type: "invoice",
		listRoute: "/invoices",
		listLabel: "Invoices"
	});
}
//#endregion
export { Page as component };
