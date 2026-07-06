import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  useDocumentsByType,
  useJobTasks,
  useAddTask,
  useToggleTask,
  useDeleteTask,
  useUpdateStatus,
} from "@/lib/queries";
import { generatePDF } from "@/lib/pdf";
import { StatusBadge } from "@/components/StatusBadge";
import { TabBar } from "@/components/TabBar";
import { DeleteDocButton } from "@/components/DeleteDocButton";
import { InkCheck } from "@/components/InkCheck";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Plus, Trash2, Download, ChevronDown, ChevronRight } from "lucide-react";
import { fmtDate } from "@/lib/format";

export const Route = createFileRoute("/jobs")({ component: JobsPage });

function JobsPage() {
  const { data: jobs = [], isLoading } = useDocumentsByType("job_card");
  const { data: tasks = [] } = useJobTasks();
  const [tab, setTab] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const tabs = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];
  const counted = tabs.map((t) => ({
    ...t,
    count: t.value === "all" ? jobs.length : jobs.filter((j) => j.status === t.value).length,
  }));

  const filtered = jobs.filter((j) => (tab === "all" ? true : j.status === tab));

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-4">
      <div>
        <h1 className="page-title">Job Cards</h1>
        <p className="text-sm text-muted-navy mt-1">Track factory tasks per job.</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <TabBar tabs={counted} value={tab} onChange={setTab} />
        </div>
        {isLoading ? (
          <TableSkeleton rows={6} className="py-2" />
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-navy">No job cards yet. Create one from a quote or invoice.</div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((job) => {
              const jobTasks = tasks.filter((t) => t.job_card_id === job.id);
              const done = jobTasks.filter((t) => t.status === "completed").length;
              const isOpen = expanded === job.id;
              return (
                <li key={job.id}>
                  <JobRow
                    job={job}
                    doneCount={done}
                    totalCount={jobTasks.length}
                    open={isOpen}
                    onToggle={() => setExpanded(isOpen ? null : job.id)}
                  />
                  {isOpen && <TaskPanel jobId={job.id} tasks={jobTasks} />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function JobRow({
  job,
  doneCount,
  totalCount,
  open,
  onToggle,
}: {
  job: any;
  doneCount: number;
  totalCount: number;
  open: boolean;
  onToggle: () => void;
}) {
  const updateStatus = useUpdateStatus();
  return (
    <div className="p-4 flex items-center gap-3 flex-wrap">
      <button onClick={onToggle} className="text-muted-navy hover:text-ink">
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-ink">{job.doc_number}</div>
        <div className="text-xs text-muted-navy">
          {job.customer_name || "—"} · {fmtDate(job.doc_date)} · {doneCount}/{totalCount} tasks
        </div>
      </div>
      <StatusBadge status={job.status} docId={job.id} />
      <select
        value={job.status}
        onChange={(e) => updateStatus.mutate({ id: job.id, status: e.target.value, action: `status_${e.target.value}` })}
        className="text-xs px-2 py-1 border border-border rounded-lg bg-card text-ink"
      >
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <button
        onClick={() => generatePDF(job, [], [])}
        className="btn-uppercase px-3 py-1.5 border border-border bg-card text-ink hover:bg-secondary inline-flex items-center gap-1"
      >
        <Download className="w-3 h-3" /> PDF
      </button>
      <DeleteDocButton id={job.id} label="Del" />
    </div>
  );
}

function TaskPanel({ jobId, tasks }: { jobId: string; tasks: any[] }) {
  const add = useAddTask();
  const toggle = useToggleTask();
  const del = useDeleteTask();
  const [text, setText] = useState("");

  return (
    <div className="bg-secondary/30 px-8 py-4 space-y-2 border-t border-border">
      {tasks.length === 0 && <div className="text-xs text-muted-navy">No tasks yet.</div>}
      {tasks.map((t) => (
        <div key={t.id} className="flex items-center gap-3 bg-card rounded-lg p-2 border border-border/60">
          <InkCheck
            checked={t.status === "completed"}
            onChange={(checked) =>
              toggle.mutate({ id: t.id, status: checked ? "completed" : "pending" })
            }
          />
          <span
            className={`flex-1 text-sm ${t.status === "completed" ? "line-through text-muted-navy" : "text-ink"}`}
          >
            {t.task_description}
          </span>
          <button onClick={() => del.mutate(t.id)} className="text-muted-navy hover:text-danger">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          add.mutate({ job_card_id: jobId, task_description: text.trim() });
          setText("");
        }}
        className="flex gap-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add task…"
          className="flex-1 input-field text-sm py-1.5"
        />
        <button className="btn-uppercase px-3 py-1.5 bg-royal text-primary-foreground inline-flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add
        </button>
      </form>
    </div>
  );
}
