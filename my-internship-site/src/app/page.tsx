"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import InternshipCard from "../components/InternshipCard";
import { internships } from "../data/internships";

export default function Home() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return internships;
    return internships.filter((i) => {
      const hay = `${i.title} ${i.company} ${i.location} ${i.description}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:pt-10">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-10 shadow-sm sm:px-10">
        <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[rgba(31,74,168,0.25)] blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[rgba(15,31,61,0.20)] blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
              Virtual internships that feel like real work.
              <span className="mt-2 block bg-gradient-to-r from-[var(--brand)] via-[var(--brand-2)] to-[var(--brand)] bg-clip-text text-transparent">
                Built for portfolios, not checkboxes.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">
              Explore curated tracks, complete guided tasks, and keep your progress in one place.
              Verification is built-in for payments and submissions.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-2)]"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M16.1 16.1 21 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search tracks (e.g., Frontend, Data, DevOps)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-10 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-2)] outline-none focus:ring-4 focus:ring-[var(--ring)] dark:bg-[rgba(15,23,42,0.35)]"
                />
              </div>

              <div className="flex gap-2">
                <Link
                  href="/student"
                  className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.8)] transition dark:bg-[rgba(15,23,42,0.35)] dark:hover:bg-[rgba(15,23,42,0.6)]"
                >
                  Track status
                </Link>
                <Link
                  href="#tracks"
                  className="inline-flex items-center justify-center rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110 transition"
                >
                  Browse
                </Link>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--border)] bg-[rgba(31,74,168,0.10)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                {internships.length} tracks
              </span>
              <span className="rounded-full border border-[var(--border)] bg-[rgba(15,31,61,0.08)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                Remote-first
              </span>
              <span className="rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-3 py-1 text-xs font-semibold text-[var(--foreground)] dark:bg-[rgba(15,23,42,0.35)]">
                Task-based learning
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="grid gap-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] p-5 shadow-sm dark:bg-[rgba(15,23,42,0.35)]">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  What you get
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                  <li>Approval workflow + tasks assignment</li>
                  <li>Submission links tracked per application</li>
                  <li>Payment proof upload with verification</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] p-5 shadow-sm dark:bg-[rgba(15,23,42,0.35)]">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  Pro tip
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Use a consistent repo name for submissions (example: codeK_YourName_Track).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 flex items-end justify-between gap-4">
        <div>
          <h2 id="tracks" className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Browse internship tracks
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Showing {filtered.length} of {internships.length}
          </p>
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <p className="text-sm font-semibold text-[var(--foreground)]">No matches found.</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Try a shorter keyword like &quot;data&quot;, &quot;design&quot;, &quot;java&quot;, or &quot;cloud&quot;.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-5 rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:brightness-110 transition"
          >
            Clear search
          </button>
        </section>
      ) : (
        <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((internship) => (
            <InternshipCard key={internship.id} internship={internship} />
          ))}
        </section>
      )}
    </main>
  );
}
