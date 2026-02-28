import Link from "next/link";
import { Internship } from "../types/internship";

interface Props {
  internship: Internship;
}

export default function InternshipCard({ internship }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.65)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)] dark:bg-[rgba(15,23,42,0.45)]">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[var(--brand)] via-[var(--brand-2)] to-[var(--brand-light)] opacity-80" />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)] sm:text-xl">
            {internship.title}
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {internship.company} <span className="mx-2 text-[var(--muted-2)]">|</span>{" "}
            {internship.location}
          </p>
        </div>

        <div className="shrink-0">
          <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[rgba(31,74,168,0.10)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
            {internship.duration}
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-[var(--muted)] line-clamp-3">
        {internship.description}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-[var(--muted-2)]">{internship.stipend}</span>

        <div className="flex items-center gap-2">
          <Link
            href={`/internship/${internship.id}`}
            className="rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.45)] px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.7)] transition dark:bg-[rgba(15,23,42,0.35)] dark:hover:bg-[rgba(15,23,42,0.6)]"
          >
            Details
          </Link>
          <Link
            href={`/apply?id=${internship.id}`}
            className="rounded-xl bg-[var(--brand)] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110 transition"
          >
            Apply
          </Link>
        </div>
      </div>
    </div>
  );
}

