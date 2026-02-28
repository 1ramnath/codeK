import { internships } from "../../data/internships";
import ApplicationForm from "@/components/ApplicationForm";

type SearchParams = Record<string, string | string[] | undefined>;

type ApplyPageProps = {
  searchParams?: SearchParams | Promise<SearchParams>;
};

function firstString(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] || "";
  return "";
}

export default async function ApplyPage({ searchParams }: ApplyPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});

  const id = (
    firstString(resolvedSearchParams.id) ||
    firstString(resolvedSearchParams.internshipId) ||
    firstString(resolvedSearchParams.trackId)
  ).trim();
  const internship = internships.find((i) => i.id === id);

  if (!internship) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <p className="text-sm font-semibold text-[var(--foreground)]">Invalid internship.</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Please go back and pick a track from the homepage.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:pt-10">
      <div className="grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-5">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold tracking-wide text-[var(--muted-2)]">
              Application
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              {internship.title}
            </h1>
            <p className="mt-3 text-sm text-[var(--muted)]">
              {internship.company} <span className="mx-2">|</span> {internship.location}
            </p>
            <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
              Fill in your details and submit your application. If approved, tasks will appear in your student dashboard.
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
          </div>
        </section>

        <section className="lg:col-span-7">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
            <ApplicationForm internshipId={internship.id} internshipTitle={internship.title} />
          </div>
        </section>
      </div>
    </main>
  );
}

