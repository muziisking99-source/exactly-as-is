import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as STATUS_LABELS } from "./queries-B6SZHgYf.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as useReducedMotion } from "./use-reduced-motion-DPT29gQb.mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StatusBadge-B4J8COXt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Statuses that get the stamp-impact treatment */
var STAMP_STATUSES = /* @__PURE__ */ new Set([
	"sent",
	"approved",
	"paid",
	"delivered",
	"completed"
]);
function isStampStatus(status) {
	return STAMP_STATUSES.has(status);
}
function stampColor(status) {
	if (status === "sent" || status === "approved") return "royal";
	if (status === "paid" || status === "delivered" || status === "completed") return "eco";
	return null;
}
/** Stable per-instance rotation so repeated stamps don't look robotic */
function stampRotation(seed) {
	let h = 0;
	for (let i = 0; i < seed.length; i++) h = h * 31 + seed.charCodeAt(i) | 0;
	return (h % 2 === 0 ? 1 : -1) * (2 + Math.abs(h) % 3);
}
/** Irregular hand-stamped ring edge */
function StampRing({ color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 48 48",
		className: "absolute inset-0 w-full h-full pointer-events-none",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M24 3 C35 2 44 11 45 22 C46 33 37 44 24 45 C11 44 2 33 3 22 C4 11 13 4 24 3 Z",
			fill: "none",
			stroke: color === "royal" ? "var(--royal)" : "var(--eco)",
			strokeWidth: "2.5",
			strokeLinejoin: "round",
			opacity: "0.55"
		})
	});
}
function StampImpact({ children, status, stampGen, seed, className }) {
	const reduced = useReducedMotion();
	const color = stampColor(status);
	if (!color || stampGen === 0 || reduced) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex", className),
		children
	});
	const rot = stampRotation(`${seed}-${stampGen}`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("relative inline-flex", className),
		children: [stampGen > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
			className: "absolute -inset-1.5 pointer-events-none",
			initial: {
				scale: 1.4,
				rotate: rot
			},
			animate: {
				scale: 1,
				rotate: rot * .35
			},
			transition: {
				type: "spring",
				stiffness: 520,
				damping: 26,
				mass: .6
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StampRing, { color })
		}, stampGen), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "relative z-[1]",
			children
		})]
	});
}
var stampedTransitions = /* @__PURE__ */ new Set();
/**
* Fires once when `status` transitions into a stamp-worthy value.
* Never fires on initial mount or page refresh.
*/
function useStampOnStatus(docId, status) {
	const [gen, setGen] = (0, import_react.useState)(0);
	const prev = (0, import_react.useRef)(null);
	const mounted = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!mounted.current) {
			mounted.current = true;
			prev.current = status;
			return;
		}
		if (!docId || !isStampStatus(status)) {
			prev.current = status;
			return;
		}
		const key = `${docId}:${status}`;
		if (prev.current !== status && !stampedTransitions.has(key)) {
			stampedTransitions.add(key);
			setGen((g) => g + 1);
		}
		prev.current = status;
	}, [docId, status]);
	return gen;
}
var CLASSES = {
	draft: "bg-secondary text-muted-navy border-border",
	sent: "bg-royal/10 text-royal border-royal/20",
	approved: "bg-eco/10 text-eco border-eco/25",
	unpaid: "bg-amber-warn/10 text-amber-warn border-amber-warn/25",
	partially_paid: "bg-amber-warn/10 text-amber-warn border-amber-warn/30",
	paid: "bg-eco/10 text-eco border-eco/25",
	overdue: "bg-danger/10 text-danger border-danger/25",
	cancelled: "bg-secondary text-muted-navy border-border",
	ready: "bg-royal/10 text-royal border-royal/20",
	in_transit: "bg-amber-warn/10 text-amber-warn border-amber-warn/25",
	delivered: "bg-eco/10 text-eco border-eco/25",
	returned: "bg-danger/10 text-danger border-danger/25",
	pending: "bg-secondary text-muted-navy border-border",
	in_progress: "bg-royal/10 text-royal border-royal/20",
	completed: "bg-eco/10 text-eco border-eco/25"
};
function StatusBadge({ status, docId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StampImpact, {
		status,
		stampGen: useStampOnStatus(docId, status),
		seed: docId ?? status,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] font-semibold border rounded-md font-mono", CLASSES[status] ?? "bg-secondary text-muted-navy border-border"),
			children: STATUS_LABELS[status] ?? status
		})
	});
}
//#endregion
export { StatusBadge as t };
