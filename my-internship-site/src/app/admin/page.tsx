"use client";

import { useMemo, useState } from "react";
import { Application } from "@/types/application";
import { internships } from "@/data/internships";

type StatusFilter = "all" | "pending" | "approved" | "completed" | "rejected";

function badge(status: string) {
  switch (status) {
    case "approved":
      return "border-[rgba(59,130,246,0.35)] bg-[rgba(59,130,246,0.12)] text-[rgba(30,64,175,1)]";
    case "completed":
      return "border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.12)] text-[rgba(20,83,45,1)]";
    case "rejected":
      return "border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.12)] text-[rgba(153,27,27,1)]";
    default:
      return "border-[rgba(234,179,8,0.35)] bg-[rgba(234,179,8,0.16)] text-[rgba(113,63,18,1)]";
  }
}

export default function ManagementPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const ACCESS_CODE = "access123"; // Simple access code - in production, use proper authentication

  const getInternshipTitle = (id: string) => {
    return internships.find((i) => i.id === id)?.title || "Unknown Track";
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/applications");
      if (!response.ok) throw new Error("Failed to fetch applications");
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === ACCESS_CODE) {
      setIsPasswordCorrect(true);
      setPassword("");
      setPasswordError("");
      fetchApplications();
    } else {
      setPasswordError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  const handleStatusUpdate = async (
    appId: string,
    newStatus: "approved" | "rejected" | "completed"
  ) => {
    try {
      const response = await fetch(`/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        let message = "Failed to update status";
        try {
          const data = await response.json();
          if (data?.error) message = data.error;
        } catch {}
        throw new Error(message);
      }

      if (newStatus === "approved") {
        const taskResponse = await fetch("/api/tasks/assign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ applicationId: appId }),
        });

        if (!taskResponse.ok) {
          console.warn("Failed to assign tasks, but status was updated");
        }
      }

      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      );

      if (newStatus === "approved") {
        alert("Application approved and tasks assigned.");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const handlePaymentVerification = async (appId: string, status: "verified" | "rejected") => {
    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, status }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to verify payment");
      }

      const data = await response.json();
      setApplications((prev) => prev.map((app) => (app.id === appId ? data.application : app)));

      alert(`Payment ${status}.`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Payment verification failed");
    }
  };

  const handleExportToFile = async () => {
    try {
      const response = await fetch("/api/export");
      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `applications_${new Date().toISOString().split("T")[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to download file");
    }
  };

  const counts = useMemo(() => {
    const pending = applications.filter((a) => (a.status || "pending") === "pending").length;
    const approved = applications.filter((a) => a.status === "approved").length;
    const completed = applications.filter((a) => a.status === "completed").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;
    return { pending, approved, completed, rejected, total: applications.length };
  }, [applications]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications
      .filter((a) => {
        if (statusFilter === "all") return true;
        return (a.status || "pending") === statusFilter;
      })
      .filter((a) => {
        if (!q) return true;
        const hay = `${a.fullName} ${a.email} ${a.phone} ${a.id}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => (b.appliedAt || "").localeCompare(a.appliedAt || ""));
  }, [applications, query, statusFilter]);

  if (!isPasswordCorrect) {
    return (
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:pt-10">
        <div className="mx-auto max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold tracking-wide text-[var(--muted-2)]">Management</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            Sign in
          </h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Enter the access code to manage applications, tasks, and payments.
          </p>

          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                Access code
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access code"
                className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-2)] outline-none focus:ring-4 focus:ring-[var(--ring)] dark:bg-[rgba(15,23,42,0.35)]"
              />
            </div>

            {passwordError && (
              <div className="rounded-2xl border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.10)] p-3 text-sm text-[var(--foreground)]">
                {passwordError}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-[var(--brand)] py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110 transition"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-[var(--foreground)]">Loading applications...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.10)] p-8 text-sm text-[var(--foreground)]">
          Error: {error}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:pt-10">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[var(--muted-2)]">Management</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            Management dashboard
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Review applications, task submissions, and payment screenshots.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportToFile}
            className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.85)] transition dark:bg-[rgba(15,23,42,0.35)] dark:hover:bg-[rgba(15,23,42,0.6)]"
          >
            Export TXT
          </button>
          <button
            onClick={() => {
              setIsPasswordCorrect(false);
              setApplications([]);
              setLoading(true);
              setError("");
              setStatusFilter("all");
              setQuery("");
            }}
            className="rounded-2xl bg-[rgba(239,68,68,0.14)] px-4 py-3 text-sm font-semibold text-[rgba(153,27,27,1)] hover:bg-[rgba(239,68,68,0.20)] transition"
          >
            Logout
          </button>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <p className="text-xs font-semibold text-[var(--muted-2)]">Total</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">{counts.total}</p>
        </div>
        <div className="rounded-2xl border border-[rgba(234,179,8,0.35)] bg-[rgba(234,179,8,0.12)] p-4">
          <p className="text-xs font-semibold text-[rgba(113,63,18,1)]">Pending</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">{counts.pending}</p>
        </div>
        <div className="rounded-2xl border border-[rgba(59,130,246,0.35)] bg-[rgba(59,130,246,0.10)] p-4">
          <p className="text-xs font-semibold text-[rgba(30,64,175,1)]">Approved</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">{counts.approved}</p>
        </div>
        <div className="rounded-2xl border border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.10)] p-4">
          <p className="text-xs font-semibold text-[rgba(20,83,45,1)]">Completed</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">{counts.completed}</p>
        </div>
        <div className="rounded-2xl border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.10)] p-4">
          <p className="text-xs font-semibold text-[rgba(153,27,27,1)]">Rejected</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">{counts.rejected}</p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["all", "pending", "approved", "completed", "rejected"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  statusFilter === s
                    ? "border-[var(--border)] bg-[rgba(31,74,168,0.12)] text-[var(--foreground)]"
                    : "border-[var(--border)] bg-[rgba(255,255,255,0.35)] text-[var(--muted)] hover:bg-[rgba(255,255,255,0.6)] dark:bg-[rgba(15,23,42,0.25)]"
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone, id..."
              className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-2)] outline-none focus:ring-4 focus:ring-[var(--ring)] dark:bg-[rgba(15,23,42,0.35)] sm:w-80"
            />
          </div>
        </div>

        <p className="mt-4 text-sm text-[var(--muted)]">
          Showing {filtered.length} of {applications.length}
        </p>
      </section>

      <section className="mt-8 space-y-6">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-[var(--foreground)]">No applications found.</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Try changing the filter or search query.</p>
          </div>
        ) : (
          filtered.map((app) => (
            <article
              key={app.id}
              className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
                    {app.fullName}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Track: {getInternshipTitle(app.internshipId)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-2)]">
                    Applied on {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "N/A"} | ID: {app.id}
                  </p>
                </div>

                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badge(app.status || "pending")}`}>
                  {(app.status || "pending").toUpperCase()}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.45)] p-4 dark:bg-[rgba(15,23,42,0.30)]">
                  <p className="text-xs font-semibold text-[var(--muted-2)]">Email</p>
                  <a className="mt-1 block text-sm font-semibold text-[var(--brand-2)] hover:underline break-all" href={`mailto:${app.email}`}>
                    {app.email}
                  </a>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.45)] p-4 dark:bg-[rgba(15,23,42,0.30)]">
                  <p className="text-xs font-semibold text-[var(--muted-2)]">Phone</p>
                  <a className="mt-1 block text-sm font-semibold text-[var(--brand-2)] hover:underline break-all" href={`tel:${app.phone}`}>
                    {app.phone}
                  </a>
                </div>
              </div>

              <details className="mt-5 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.45)] p-4 dark:bg-[rgba(15,23,42,0.30)]">
                <summary className="cursor-pointer text-sm font-semibold text-[var(--foreground)]">
                  Cover letter
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)] whitespace-pre-wrap">{app.coverLetter}</p>
              </details>

              {app.repoUrl && (
                <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.45)] p-4 dark:bg-[rgba(15,23,42,0.30)]">
                  <p className="text-xs font-semibold text-[var(--muted-2)]">Submitted repo</p>
                  <a
                    href={app.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm font-semibold text-[var(--brand-2)] hover:underline break-all"
                  >
                    {app.repoUrl}
                  </a>
                </div>
              )}

              {app.tasks && app.tasks.length > 0 && (
                <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.45)] p-4 dark:bg-[rgba(15,23,42,0.30)]">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    Tasks ({app.tasks.filter((t) => t.status !== "pending").length}/{app.tasks.length})
                  </p>
                  <div className="mt-3 space-y-2 text-sm">
                    {app.tasks.map((task) => (
                      <div key={task.id} className="flex items-start justify-between gap-3">
                        <div className="min-w-0 text-[var(--muted)]">
                          <p className="text-sm font-semibold text-[var(--foreground)]">{task.title}</p>
                          {task.submittedUrl && (
                            <a
                              href={task.submittedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 block text-xs font-semibold text-[var(--brand-2)] hover:underline break-all"
                            >
                              {task.submittedUrl}
                            </a>
                          )}
                        </div>
                        <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${badge(task.status)}`}>
                          {task.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {app.paymentProofUrl && (
                <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[rgba(59,130,246,0.06)] p-4">
                  <p className="text-sm font-semibold text-[var(--foreground)]">Payment proof</p>
                  <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <img
                      src={app.paymentProofUrl}
                      alt="Payment proof screenshot"
                      className="w-full max-w-xs rounded-2xl border border-[var(--border)] bg-white"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[var(--muted-2)]">
                        Status: {(app.paymentStatus || "pending").toUpperCase()}
                      </p>
                      {app.paymentStatus === "pending" && (
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                          <button
                            onClick={() => handlePaymentVerification(app.id, "verified")}
                            className="rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110 transition"
                          >
                            Verify payment
                          </button>
                          <button
                            onClick={() => handlePaymentVerification(app.id, "rejected")}
                            className="rounded-2xl bg-[rgba(239,68,68,0.14)] px-4 py-3 text-sm font-semibold text-[rgba(153,27,27,1)] hover:bg-[rgba(239,68,68,0.20)] transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                {(app.status || "pending") === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(app.id, "approved")}
                      className="rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110 transition"
                    >
                      Approve and assign tasks
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app.id, "rejected")}
                      className="rounded-2xl bg-[rgba(239,68,68,0.14)] px-4 py-3 text-sm font-semibold text-[rgba(153,27,27,1)] hover:bg-[rgba(239,68,68,0.20)] transition"
                    >
                      Reject
                    </button>
                  </>
                )}

                {app.status === "approved" && (
                  <>
                    <a
                      href={`mailto:${app.email}?subject=${encodeURIComponent(
                        `Internship Approved - ${getInternshipTitle(app.internshipId)}`
                      )}&body=${encodeURIComponent(
                        `Dear ${app.fullName},\n\nWe are pleased to inform you that your application for ${getInternshipTitle(
                          app.internshipId
                        )} has been approved.\n\nYour tasks are available in the student dashboard.\n\nBest regards,\ncodeK Virtual Internship Platform`
                      )}`}
                      className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.85)] transition dark:bg-[rgba(15,23,42,0.35)] dark:hover:bg-[rgba(15,23,42,0.6)]"
                    >
                      Send approval email
                    </a>
                    <button
                      disabled={(app.tasks?.filter((t) => t.status !== "pending" && t.submittedUrl).length || 0) < 2}
                      title={
                        (app.tasks?.filter((t) => t.status !== "pending" && t.submittedUrl).length || 0) < 2
                          ? "At least 2 task submissions are required before marking completed."
                          : "Mark as completed"
                      }
                      onClick={() => handleStatusUpdate(app.id, "completed")}
                      className="rounded-2xl bg-[rgba(34,197,94,0.14)] px-4 py-3 text-sm font-semibold text-[rgba(20,83,45,1)] hover:bg-[rgba(34,197,94,0.20)] disabled:cursor-not-allowed disabled:opacity-60 transition"
                    >
                      Mark completed
                    </button>
                  </>
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
