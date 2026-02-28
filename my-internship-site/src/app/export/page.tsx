"use client";

import { useState } from "react";

export default function ExportPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    setLoading(true);
    setError("");

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
      setError(err instanceof Error ? err.message : "Failed to download file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:pt-10">
      <div className="grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-5">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold tracking-wide text-[var(--muted-2)]">Management</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              Export applications
            </h1>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Download a text file containing application details, status, cover letters, and summary stats.
            </p>

            {error && (
              <div className="mt-6 rounded-2xl border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.10)] p-4 text-sm text-[var(--foreground)]">
                {error}
              </div>
            )}

            <button
              onClick={handleDownload}
              disabled={loading}
              className="mt-6 w-full rounded-2xl bg-[var(--brand)] py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-60 disabled:hover:brightness-100 transition"
            >
              {loading ? "Downloading..." : "Download export"}
            </button>
          </div>
        </section>

        <section className="lg:col-span-7">
          <div className="rounded-3xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] p-6 shadow-sm dark:bg-[rgba(15,23,42,0.35)] sm:p-8">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">What is included</h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              <li>Applicant details (name, email, phone)</li>
              <li>Internship program information</li>
              <li>Application status (pending, approved, rejected, completed)</li>
              <li>Cover letters</li>
              <li>Task submission links (if any)</li>
              <li>Summary counts</li>
            </ul>
            <p className="mt-6 text-xs text-[var(--muted-2)]">
              This export is intended for internal review and email follow-ups.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

