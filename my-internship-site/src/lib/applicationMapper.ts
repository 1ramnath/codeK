import { Application as ApiApplication, Task as ApiTask } from "@/types/application";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function getString(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return undefined;
}

function toIso(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export function toApiApplication(doc: unknown): ApiApplication {
  let plain: unknown = doc;

  if (isRecord(doc) && "toObject" in doc) {
    const toObjectMaybe = (doc as UnknownRecord).toObject;
    if (typeof toObjectMaybe === "function") {
      // Call as a method to preserve Mongoose `this` binding.
      plain = (doc as { toObject: (opts?: unknown) => unknown }).toObject({ virtuals: false });
    }
  }

  const raw = isRecord(plain) ? plain : {};

  const tasksRaw = raw.tasks;
  const tasks: ApiTask[] | undefined = Array.isArray(tasksRaw)
    ? tasksRaw.map((t): ApiTask => {
        const task = isRecord(t) ? t : {};
        const status = (getString(task.status) || "pending") as ApiTask["status"];
        return {
          id: getString(task.id) || "",
          title: getString(task.title) || "",
          description: getString(task.description) || "",
          submittedUrl: getString(task.submittedUrl),
          submittedAt: toIso(task.submittedAt),
          status,
        };
      })
    : undefined;

  const paymentProof = isRecord(raw.paymentProof) ? raw.paymentProof : undefined;
  const hasInlinePaymentProof = Boolean(paymentProof?.mime) && Boolean(paymentProof?.base64);

  const id = getString(raw.id) || "";
  const paymentProofUrl =
    getString(raw.paymentProofUrl) ||
    (hasInlinePaymentProof && id ? `/api/payments/proof/${encodeURIComponent(id)}` : undefined);

  return {
    id,
    internshipId: getString(raw.internshipId) || "",
    fullName: getString(raw.fullName) || "",
    email: getString(raw.email) || "",
    phone: getString(raw.phone) || "",
    resume: getString(raw.resume) || "",
    coverLetter: getString(raw.coverLetter) || "",
    status: (getString(raw.status) || "pending") as ApiApplication["status"],
    tasks,
    repoUrl: getString(raw.repoUrl),
    paid: Boolean(raw.paid),
    paymentId: getString(raw.paymentId),
    paidAt: toIso(raw.paidAt),
    paymentProofUrl,
    paymentProofUploadedAt: toIso(raw.paymentProofUploadedAt),
    paymentStatus: getString(raw.paymentStatus) as ApiApplication["paymentStatus"],
    paymentVerifiedAt: toIso(raw.paymentVerifiedAt),
    appliedAt: toIso(raw.appliedAt) || new Date().toISOString(),
    approvedAt: toIso(raw.approvedAt),
  };
}
