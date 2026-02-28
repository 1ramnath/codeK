"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface ApplicationFormProps {
  internshipId: string;
  internshipTitle: string;
}

export default function ApplicationForm({ internshipId, internshipTitle }: ApplicationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
  });

  const coverLetterCount = useMemo(() => formData.coverLetter.trim().length, [formData.coverLetter]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internshipId,
          ...formData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit application");
      }

      setSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        coverLetter: "",
      });

      setTimeout(() => {
        router.push("/student");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-wide text-[var(--muted-2)]">Applying for</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          {internshipTitle}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Use an email you can access later. You will need it to track your application.
        </p>
      </div>

      {success && (
        <div className="mb-6 rounded-2xl border border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.10)] p-4 text-sm text-[var(--foreground)]">
          Application submitted. Redirecting you to your dashboard...
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.10)] p-4 text-sm text-[var(--foreground)]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Full name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              autoComplete="name"
              className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-2)] outline-none focus:ring-4 focus:ring-[var(--ring)] dark:bg-[rgba(15,23,42,0.35)]"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Phone number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              autoComplete="tel"
              className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-2)] outline-none focus:ring-4 focus:ring-[var(--ring)] dark:bg-[rgba(15,23,42,0.35)]"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-2)] outline-none focus:ring-4 focus:ring-[var(--ring)] dark:bg-[rgba(15,23,42,0.35)]"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <div className="flex items-end justify-between gap-3">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Cover letter
            </label>
            <span className="text-xs text-[var(--muted-2)] mb-2">
              {coverLetterCount}/600
            </span>
          </div>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            required
            rows={7}
            maxLength={600}
            className="w-full resize-y rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-2)] outline-none focus:ring-4 focus:ring-[var(--ring)] dark:bg-[rgba(15,23,42,0.35)]"
            placeholder="Tell us why you are interested, what you have built, and what you want to learn..."
          />
          <p className="mt-2 text-xs text-[var(--muted-2)]">
            Tip: Mention your strongest projects, links, or skills relevant to this track.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[var(--brand)] py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-60 disabled:hover:brightness-100 transition"
        >
          {loading ? "Submitting..." : "Submit application"}
        </button>
      </form>
    </div>
  );
}

