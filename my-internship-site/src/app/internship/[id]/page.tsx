import Link from "next/link";
import { internships } from "../../../data/internships";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return internships.map((i) => ({ id: i.id }));
}

export default async function InternshipDetail({ params }: Params) {
  const { id } = await params;
  const internship = internships.find((i) => i.id === id);

  if (!internship) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <p className="text-sm font-semibold text-[var(--foreground)]">Internship not found.</p>
          <Link href="/" className="mt-3 inline-flex text-sm font-semibold text-[var(--brand-2)] hover:underline">
            Back to tracks
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:pt-10">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-10 shadow-sm sm:px-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[rgba(31,74,168,0.18)] blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="text-xs font-semibold tracking-wide text-[var(--muted-2)]">
              {internship.company} <span className="mx-2">|</span> {internship.location}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
              {internship.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              {internship.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {internship.duration && (
                <span className="rounded-full border border-[var(--border)] bg-[rgba(31,74,168,0.10)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                  Duration: {internship.duration}
                </span>
              )}
              {internship.stipend && (
                <span className="rounded-full border border-[var(--border)] bg-[rgba(15,31,61,0.08)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                  Stipend: {internship.stipend}
                </span>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/apply?id=${internship.id}`}
                className="inline-flex items-center justify-center rounded-2xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110 transition"
              >
                Apply now
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.8)] transition dark:bg-[rgba(15,23,42,0.35)] dark:hover:bg-[rgba(15,23,42,0.6)]"
              >
                Back to tracks
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] p-6 shadow-sm dark:bg-[rgba(15,23,42,0.35)]">
              <p className="text-sm font-semibold text-[var(--foreground)]">What happens next</p>
              <ol className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                <li>
                  <span className="font-semibold text-[var(--foreground)]">1.</span> Apply with your details and a short cover letter.
                </li>
                <li>
                  <span className="font-semibold text-[var(--foreground)]">2.</span> Our team reviews and approves your application.
                </li>
                <li>
                  <span className="font-semibold text-[var(--foreground)]">3.</span> You receive tasks and submit links for review.
                </li>
              </ol>
              <Link
                href="/student"
                className="mt-5 inline-flex items-center text-sm font-semibold text-[var(--brand-2)] hover:underline"
              >
                Track your application
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

