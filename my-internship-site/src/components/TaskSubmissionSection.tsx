"use client";

import { useMemo, useState } from "react";
import { Application, Task } from "@/types/application";

interface TaskSubmissionSectionProps {
  application: Application;
  onTaskSubmitted: () => void;
}

function statusStyles(status: Task["status"]) {
  switch (status) {
    case "completed":
      return "bg-[rgba(34,197,94,0.14)] text-[rgba(20,83,45,1)] border-[rgba(34,197,94,0.35)]";
    case "submitted":
      return "bg-[rgba(59,130,246,0.14)] text-[rgba(30,64,175,1)] border-[rgba(59,130,246,0.35)]";
    default:
      return "bg-[rgba(234,179,8,0.16)] text-[rgba(113,63,18,1)] border-[rgba(234,179,8,0.35)]";
  }
}

export function TaskSubmissionSection({ application, onTaskSubmitted }: TaskSubmissionSectionProps) {
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const tasks = application.tasks || [];
  const completedTasks = useMemo(
    () => tasks.filter((t) => t.status === "completed" || t.status === "submitted").length,
    [tasks]
  );
  const totalTasks = tasks.length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  if (!application.tasks || application.tasks.length === 0) {
    return null;
  }

  const handleTaskSubmit = async (task: Task) => {
    const url = submissionUrl[task.id]?.trim();

    if (!url) {
      setError("Please enter a URL for the task submission.");
      return;
    }

    setSubmittingTaskId(task.id);
    setError(null);

    try {
      const response = await fetch("/api/tasks/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: application.id,
          taskId: task.id,
          submittedUrl: url,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit task");
      }

      setSubmissionUrl((prev) => {
        const updated = { ...prev };
        delete updated[task.id];
        return updated;
      });

      onTaskSubmitted();
      alert("Task submitted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit task");
    } finally {
      setSubmittingTaskId(null);
    }
  };

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">Internship tasks</p>
          <p className="mt-1 text-xs text-[var(--muted-2)]">
            Progress: {completedTasks}/{totalTasks} ({progress}%)
          </p>
        </div>

        <div className="w-full sm:w-56">
          <div className="h-2 w-full overflow-hidden rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.35)] dark:bg-[rgba(15,23,42,0.25)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] p-4 shadow-sm transition hover:bg-[rgba(255,255,255,0.75)] dark:bg-[rgba(15,23,42,0.35)] dark:hover:bg-[rgba(15,23,42,0.55)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)]">{task.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{task.description}</p>
              </div>
              <span
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles(
                  task.status
                )}`}
              >
                {task.status.toUpperCase()}
              </span>
            </div>

            {task.status === "pending" && (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input
                  type="url"
                  placeholder="Paste your GitHub repo URL or project link..."
                  value={submissionUrl[task.id] || ""}
                  onChange={(e) =>
                    setSubmissionUrl((prev) => ({
                      ...prev,
                      [task.id]: e.target.value,
                    }))
                  }
                  className="flex-1 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.6)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-2)] outline-none focus:ring-4 focus:ring-[var(--ring)] dark:bg-[rgba(15,23,42,0.35)]"
                  disabled={submittingTaskId === task.id}
                />
                <button
                  type="button"
                  onClick={() => handleTaskSubmit(task)}
                  disabled={submittingTaskId === task.id}
                  className="rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-60 disabled:hover:brightness-100 transition"
                >
                  {submittingTaskId === task.id ? "Submitting..." : "Submit"}
                </button>
              </div>
            )}

            {task.submittedUrl && (
              <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[rgba(15,31,61,0.04)] p-3 text-sm dark:bg-[rgba(255,255,255,0.05)]">
                <a
                  href={task.submittedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--brand-2)] hover:underline break-all"
                >
                  {task.submittedUrl}
                </a>
                <p className="mt-1 text-xs text-[var(--muted-2)]">
                  Submitted on: {task.submittedAt ? new Date(task.submittedAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.10)] p-3 text-sm text-[var(--foreground)]">
          {error}
        </div>
      )}

      <p className="mt-4 text-xs text-[var(--muted-2)]">
        Tip: Submit a repo link with a clear README and step-by-step setup instructions.
      </p>
    </section>
  );
}

