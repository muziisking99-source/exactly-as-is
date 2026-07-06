import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as DocumentDetail } from "./DocumentDetail-WSBIlUHU.mjs";
import { t as Route } from "./quotes._id-pMm9uIjl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quotes._id-Ctjt6ARQ.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { id } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentDetail, {
		id,
		type: "quote",
		listRoute: "/quotes",
		listLabel: "Quotations"
	});
}
//#endregion
export { Page as component };
