import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as useDeleteTask, F as useJobTasks, H as useToggleTask, K as useUpdateStatus, N as useDocumentsByType, h as useAddTask, o as fmtDate } from "./queries-B6SZHgYf.mjs";
import { _ as Download, b as ChevronRight, o as Trash2, u as Plus, x as ChevronDown } from "../_libs/lucide-react.mjs";
import { t as generatePDF } from "./pdf-Csiy_zzv.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as useReducedMotion } from "./use-reduced-motion-DPT29gQb.mjs";
import { t as StatusBadge } from "./StatusBadge-B4J8COXt.mjs";
import { t as DeleteDocButton } from "./DeleteDocButton-B_krKXeD.mjs";
import { t as TabBar } from "./TabBar-DOcg5u7h.mjs";
import { t as TableSkeleton } from "./TableSkeleton-DidsG2Fj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jobs-D3eKPmN1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InkCheck({ checked, onChange, className }) {
	const reduced = useReducedMotion();
	const pathRef = (0, import_react.useRef)(null);
	const [pathLen, setPathLen] = (0, import_react.useState)(14);
	const [pulse, setPulse] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (pathRef.current) setPathLen(pathRef.current.getTotalLength());
	}, []);
	(0, import_react.useEffect)(() => {
		if (checked && !reduced) {
			setPulse(true);
			const t = setTimeout(() => setPulse(false), 80);
			return () => clearTimeout(t);
		}
	}, [checked, reduced]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		role: "checkbox",
		"aria-checked": checked,
		onClick: () => onChange(!checked),
		className: cn("relative w-4 h-4 shrink-0 rounded border border-border bg-card flex items-center justify-center", "transition-colors duration-150 hover:border-royal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal/30", checked && "border-eco/50 bg-eco/5", pulse && "scale-110", className),
		style: { transition: "border-color 150ms, background-color 150ms, transform 80ms ease-out" },
		children: checked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 14 14",
			className: "w-3 h-3",
			"aria-hidden": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				ref: pathRef,
				d: "M2.5 7 L5.5 10 L11.5 3.5",
				fill: "none",
				stroke: "var(--eco)",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				style: reduced ? void 0 : {
					strokeDasharray: pathLen,
					strokeDashoffset: pathLen,
					animation: "ink-check-draw 150ms ease-out forwards"
				}
			})
		})
	});
}
function JobsPage() {
	const { data: jobs = [], isLoading } = useDocumentsByType("job_card");
	const { data: tasks = [] } = useJobTasks();
	const [tab, setTab] = (0, import_react.useState)("all");
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	const counted = [
		{
			value: "all",
			label: "All"
		},
		{
			value: "pending",
			label: "Pending"
		},
		{
			value: "in_progress",
			label: "In Progress"
		},
		{
			value: "completed",
			label: "Completed"
		}
	].map((t) => ({
		...t,
		count: t.value === "all" ? jobs.length : jobs.filter((j) => j.status === t.value).length
	}));
	const filtered = jobs.filter((j) => tab === "all" ? true : j.status === tab);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 md:p-8 max-w-7xl mx-auto space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "page-title",
			children: "Job Cards"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-navy mt-1",
			children: "Track factory tasks per job."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-card overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4 border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBar, {
					tabs: counted,
					value: tab,
					onChange: setTab
				})
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableSkeleton, {
				rows: 6,
				className: "py-2"
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-8 text-center text-sm text-muted-navy",
				children: "No job cards yet. Create one from a quote or invoice."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border",
				children: filtered.map((job) => {
					const jobTasks = tasks.filter((t) => t.job_card_id === job.id);
					const done = jobTasks.filter((t) => t.status === "completed").length;
					const isOpen = expanded === job.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobRow, {
						job,
						doneCount: done,
						totalCount: jobTasks.length,
						open: isOpen,
						onToggle: () => setExpanded(isOpen ? null : job.id)
					}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskPanel, {
						jobId: job.id,
						tasks: jobTasks
					})] }, job.id);
				})
			})]
		})]
	});
}
function JobRow({ job, doneCount, totalCount, open, onToggle }) {
	const updateStatus = useUpdateStatus();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 flex items-center gap-3 flex-wrap",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onToggle,
				className: "text-muted-navy hover:text-ink",
				children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium text-ink",
					children: job.doc_number
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-navy",
					children: [
						job.customer_name || "—",
						" · ",
						fmtDate(job.doc_date),
						" · ",
						doneCount,
						"/",
						totalCount,
						" tasks"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
				status: job.status,
				docId: job.id
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: job.status,
				onChange: (e) => updateStatus.mutate({
					id: job.id,
					status: e.target.value,
					action: `status_${e.target.value}`
				}),
				className: "text-xs px-2 py-1 border border-border rounded-lg bg-card text-ink",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "pending",
						children: "Pending"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "in_progress",
						children: "In Progress"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "completed",
						children: "Completed"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => generatePDF(job, [], []),
				className: "btn-uppercase px-3 py-1.5 border border-border bg-card text-ink hover:bg-secondary inline-flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3 h-3" }), " PDF"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteDocButton, {
				id: job.id,
				label: "Del"
			})
		]
	});
}
function TaskPanel({ jobId, tasks }) {
	const add = useAddTask();
	const toggle = useToggleTask();
	const del = useDeleteTask();
	const [text, setText] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-secondary/30 px-8 py-4 space-y-2 border-t border-border",
		children: [
			tasks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-navy",
				children: "No tasks yet."
			}),
			tasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 bg-card rounded-lg p-2 border border-border/60",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InkCheck, {
						checked: t.status === "completed",
						onChange: (checked) => toggle.mutate({
							id: t.id,
							status: checked ? "completed" : "pending"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `flex-1 text-sm ${t.status === "completed" ? "line-through text-muted-navy" : "text-ink"}`,
						children: t.task_description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => del.mutate(t.id),
						className: "text-muted-navy hover:text-danger",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
					})
				]
			}, t.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					if (!text.trim()) return;
					add.mutate({
						job_card_id: jobId,
						task_description: text.trim()
					});
					setText("");
				},
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: "Add task…",
					className: "flex-1 input-field text-sm py-1.5"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn-uppercase px-3 py-1.5 bg-royal text-primary-foreground inline-flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3 h-3" }), " Add"]
				})]
			})
		]
	});
}
//#endregion
export { JobsPage as component };
