import Link from "next/link";

export default function About() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:pt-10">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-10 shadow-sm sm:px-10">
        <p className="text-xs font-semibold tracking-wide text-[var(--muted-2)]">About</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[var(--foreground)]">
          codeK Virtual Internship Platform
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">
          We run structured, task-based internship tracks designed for students and early-career professionals.
          You apply, get approved, receive tasks, submit project links, and track everything in one place.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] p-5 dark:bg-[rgba(15,23,42,0.35)]">
            <p className="text-sm font-semibold text-[var(--foreground)]">Remote-first</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Join from anywhere and work on tasks at your own pace.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] p-5 dark:bg-[rgba(15,23,42,0.35)]">
            <p className="text-sm font-semibold text-[var(--foreground)]">Clear workflow</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Approval, tasks, submissions, and verification are built into the platform.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
            How it works
          </h2>
          <ol className="mt-5 space-y-3 text-sm text-[var(--muted)]">
            <li>
              <span className="font-semibold text-[var(--foreground)]">1.</span> Browse tracks and apply.
            </li>
            <li>
              <span className="font-semibold text-[var(--foreground)]">2.</span> Get approved and receive tasks.
            </li>
            <li>
              <span className="font-semibold text-[var(--foreground)]">3.</span> Submit links for each task (GitHub or project URL).
            </li>
            <li>
              <span className="font-semibold text-[var(--foreground)]">4.</span> Complete tasks and submit payment proof (if applicable).
            </li>
            <li>
              <span className="font-semibold text-[var(--foreground)]">5.</span> Our team verifies and issues documents.
            </li>
          </ol>
        </div>

        <div className="lg:col-span-5 rounded-3xl border border-[var(--border)] bg-[rgba(15,31,61,0.06)] p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
            Ready to start?
          </h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Browse internship tracks, submit a strong application, and track everything from your dashboard.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110 transition"
            >
              Browse tracks
            </Link>
            <Link
              href="/student"
              className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.8)] transition dark:bg-[rgba(15,23,42,0.35)] dark:hover:bg-[rgba(15,23,42,0.6)]"
            >
              Open dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
