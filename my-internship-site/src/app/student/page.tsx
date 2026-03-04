"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Application } from "@/types/application";
import { internships } from "@/data/internships";
import { TaskSubmissionSection } from "@/components/TaskSubmissionSection";

const EMAIL_STORAGE_KEY = "codek_student_email";

function statusBadge(status: string) {
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

export default function StudentDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [emailLocked, setEmailLocked] = useState(false);
  const [showPaymentQR, setShowPaymentQR] = useState<string | null>(null);
  const [paymentProofs, setPaymentProofs] = useState<Record<string, File | null>>({});

  const getInternshipTitle = (id: string) => {
    return internships.find((i) => i.id === id)?.title || "Unknown Track";
  };

  const fetchApplicationsByEmail = useCallback(async (emailToSearch: string, source: "user" | "auto" = "user") => {
    const email = emailToSearch.trim();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/applications?email=${encodeURIComponent(email)}`);
      if (!response.ok) throw new Error("Failed to fetch applications");
      const userApps: Application[] = await response.json();

      if (userApps.length === 0) {
        setError("No applications found. Please check your email address.");
        setApplications([]);
        setEmailLocked(false);

        if (source === "auto") {
          try {
            localStorage.removeItem(EMAIL_STORAGE_KEY);
          } catch {}
        }
      } else {
        setApplications(userApps);
        setEmailLocked(true);
        try {
          localStorage.setItem(EMAIL_STORAGE_KEY, email);
        } catch {}
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setApplications([]);
      setEmailLocked(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchApplicationsByEmail(searchEmail, "user");
  };

  useEffect(() => {
    const emailFromUrl = new URLSearchParams(window.location.search).get("email")?.trim() || "";
    let savedEmail = "";
    try {
      savedEmail = localStorage.getItem(EMAIL_STORAGE_KEY)?.trim() || "";
    } catch {}

    const initialEmail = emailFromUrl || savedEmail;
    if (initialEmail) {
      setSearchEmail(initialEmail);
      setEmailLocked(true);
      fetchApplicationsByEmail(initialEmail, "auto");
    }
  }, [fetchApplicationsByEmail]);

  const handleChangeEmail = () => {
    try {
      localStorage.removeItem(EMAIL_STORAGE_KEY);
    } catch {}
    setEmailLocked(false);
    setSearchEmail("");
    setApplications([]);
    setError("");
  };

  const handlePay = (appId: string) => {
    setShowPaymentQR(appId);
  };

  const handleProofChange = (appId: string, file: File | null) => {
    setPaymentProofs((prev) => ({
      ...prev,
      [appId]: file,
    }));
  };

  const confirmPayment = async (appId: string) => {
    try {
      const paymentProof = paymentProofs[appId];
      if (!paymentProof) {
        alert("Please upload your payment success screenshot before confirming.");
        return;
      }

      const formData = new FormData();
      formData.append("applicationId", appId);
      formData.append("amount", "99");
      formData.append("paymentProof", paymentProof);

      const response = await fetch("/api/payments", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Payment failed");
      }

      const data = await response.json();
      setApplications((prev) => prev.map((a) => (a.id === appId ? data.application : a)));
      setShowPaymentQR(null);
      alert("Payment proof submitted. Awaiting verification.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Payment confirmation failed");
    }
  };

  const resultsTitle = useMemo(() => {
    if (!searchEmail) return "Search your applications";
    return `Results for ${searchEmail}`;
  }, [searchEmail]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:pt-10">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold tracking-wide text-[var(--muted-2)]">Student</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Student dashboard
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Enter the email you used to apply. You will see your status, tasks, and payment verification updates.
        </p>

        {emailLocked ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full flex-1 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-4 py-3 text-sm dark:bg-[rgba(15,23,42,0.35)]">
              <p className="text-xs font-semibold tracking-wide text-[var(--muted-2)]">Email</p>
              <p className="mt-1 font-semibold text-[var(--foreground)] break-all">{searchEmail}</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => fetchApplicationsByEmail(searchEmail, "auto")}
                disabled={loading}
                className="rounded-2xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-60 disabled:hover:brightness-100 transition"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
              <button
                type="button"
                onClick={handleChangeEmail}
                className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.85)] transition dark:bg-[rgba(15,23,42,0.35)] dark:hover:bg-[rgba(15,23,42,0.6)]"
              >
                Change email
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full flex-1 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-2)] outline-none focus:ring-4 focus:ring-[var(--ring)] dark:bg-[rgba(15,23,42,0.35)]"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-60 disabled:hover:brightness-100 transition"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        )}

        {error && (
          <div className="mt-5 rounded-2xl border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.10)] p-4 text-sm text-[var(--foreground)]">
            {error}
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
              {resultsTitle}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {applications.length > 0 ? `${applications.length} application(s)` : "No results yet."}
            </p>
          </div>
        </div>

        {!loading && applications.length === 0 && !error && searchEmail && (
          <div className="mt-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              No applications found for this email.
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Double-check the spelling, or apply from the homepage.
            </p>
          </div>
        )}

        <div className="mt-6 space-y-6">
          {applications.map((app) => (
            <article
              key={app.id}
              className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
                    {getInternshipTitle(app.internshipId)}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Applied on{" "}
                    {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>

                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(app.status || "pending")}`}>
                  {(app.status || "pending").toUpperCase()}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.45)] p-4 dark:bg-[rgba(15,23,42,0.30)]">
                  <p className="text-xs font-semibold text-[var(--muted-2)]">Email</p>
                  <p className="mt-1 text-sm text-[var(--foreground)] break-all">{app.email}</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.45)] p-4 dark:bg-[rgba(15,23,42,0.30)]">
                  <p className="text-xs font-semibold text-[var(--muted-2)]">Phone</p>
                  <p className="mt-1 text-sm text-[var(--foreground)] break-all">{app.phone}</p>
                </div>
              </div>

              {(app.status || "pending") === "approved" && (
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-[rgba(59,130,246,0.35)] bg-[rgba(59,130,246,0.10)] p-4 text-sm text-[var(--foreground)]">
                    Your application is approved. Complete the tasks below and submit links for review.
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.45)] p-4 dark:bg-[rgba(15,23,42,0.30)]">
                    <p className="text-sm font-semibold text-[var(--foreground)]">Offer letter</p>
                    <p className="mt-1 text-xs text-[var(--muted-2)]">
                      Download your offer letter for this track.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={`/api/certificates/${app.id}/offer`}
                        className="rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110 transition"
                      >
                        Download offer letter (PNG)
                      </a>
                    </div>
                  </div>
                  <TaskSubmissionSection
                    application={app}
                    onTaskSubmitted={() => fetchApplicationsByEmail(searchEmail)}
                  />
                </div>
              )}

              {(app.status || "pending") === "completed" && !app.paid && app.paymentStatus !== "pending" && app.paymentStatus !== "verified" && (
                <div className="mt-6 rounded-3xl border border-[rgba(234,179,8,0.35)] bg-[rgba(234,179,8,0.12)] p-5">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    Internship marked completed. Pay INR 99 to request document issuance.
                  </p>

                  {showPaymentQR === app.id ? (
                    <div className="mt-4 grid gap-4 lg:grid-cols-12">
                      <div className="lg:col-span-6 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] p-4 dark:bg-[rgba(15,23,42,0.35)]">
                        <p className="text-sm font-semibold text-[var(--foreground)] text-center">
                          Scan to pay INR 99
                        </p>
                        <div className="mt-4 rounded-2xl bg-[rgba(255,255,255,0.65)] p-4 text-center dark:bg-[rgba(15,23,42,0.25)]">
                          <img
                            src="/phonepe-qr.jpg"
                            alt="PhonePe payment QR code"
                            className="mx-auto w-56 max-w-full rounded-xl bg-white p-2"
                          />
                          <p className="mt-3 text-xs text-[var(--muted-2)]">
                            After payment, upload the success screenshot.
                          </p>
                        </div>
                      </div>

                      <div className="lg:col-span-6 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] p-4 dark:bg-[rgba(15,23,42,0.35)]">
                        <label className="block text-sm font-semibold text-[var(--foreground)]">
                          Upload payment success screenshot
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleProofChange(app.id, e.target.files?.[0] || null)}
                          className="mt-3 block w-full rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.65)] px-4 py-3 text-sm text-[var(--foreground)] file:mr-4 file:rounded-xl file:border-0 file:bg-[rgba(31,74,168,0.12)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--foreground)] hover:file:bg-[rgba(31,74,168,0.18)] dark:bg-[rgba(15,23,42,0.25)]"
                        />
                        {paymentProofs[app.id] && (
                          <p className="mt-2 text-xs text-[var(--muted-2)]">
                            Selected: {paymentProofs[app.id]?.name}
                          </p>
                        )}

                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            onClick={() => confirmPayment(app.id)}
                            className="flex-1 rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110 transition"
                          >
                            Confirm payment
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowPaymentQR(null)}
                            className="flex-1 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.85)] transition dark:bg-[rgba(15,23,42,0.35)] dark:hover:bg-[rgba(15,23,42,0.6)]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => handlePay(app.id)}
                        className="rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110 transition"
                      >
                        Pay INR 99
                      </button>
                    </div>
                  )}
                </div>
              )}

              {(app.status || "pending") === "completed" && app.paymentStatus === "pending" && (
                <div className="mt-6 rounded-3xl border border-[rgba(59,130,246,0.35)] bg-[rgba(59,130,246,0.10)] p-5">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                      Payment proof submitted. Waiting for verification.
                    </p>
                  <p className="mt-2 text-xs text-[var(--muted-2)]">
                    Your screenshot has been uploaded and is pending admin verification.
                  </p>
                </div>
              )}

              {(app.status || "pending") === "completed" && app.paymentStatus === "rejected" && (
                <div className="mt-6 rounded-3xl border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.10)] p-5">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    Payment proof rejected. Please upload a clear success screenshot and try again.
                  </p>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => handlePay(app.id)}
                      className="rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110 transition"
                    >
                      Re-submit payment proof
                    </button>
                  </div>
                </div>
              )}

              {(app.status || "pending") === "completed" && (app.paid || app.paymentStatus === "verified") && (
                <div className="mt-6 rounded-3xl border border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.10)] p-5">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    Payment verified. Download your completion certificate below.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={`/api/certificates/${app.id}/completion`}
                      className="rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110 transition"
                    >
                      Download certificate (PNG)
                    </a>
                    <a
                      href={`/api/certificates/${app.id}/offer`}
                      className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.55)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.85)] transition dark:bg-[rgba(15,23,42,0.35)] dark:hover:bg-[rgba(15,23,42,0.6)]"
                    >
                      Offer letter (PNG)
                    </a>
                  </div>
                </div>
              )}

              {(app.status || "pending") === "pending" && (
                <div className="mt-6 rounded-3xl border border-[rgba(234,179,8,0.35)] bg-[rgba(234,179,8,0.12)] p-5">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    Your application is under review. Please check back soon.
                  </p>
                </div>
              )}

              {(app.status || "pending") === "rejected" && (
                <div className="mt-6 rounded-3xl border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.10)] p-5">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    Unfortunately, your application was not approved this time.
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    You can apply to other tracks from the homepage.
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
