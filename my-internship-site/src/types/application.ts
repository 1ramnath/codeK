export interface Task {
  id: string;
  title: string;
  description: string;
  submittedUrl?: string; // GitHub repo or project link
  submittedAt?: string; // ISO timestamp
  status: "pending" | "submitted" | "completed";
}

export interface Application {
  id: string;
  internshipId: string;
  fullName: string;
  email: string;
  phone: string;
  resume: string; // URL or file path
  coverLetter: string;
  // Application status: pending -> approved -> completed | rejected
  status: "pending" | "approved" | "completed" | "rejected";
  // Tasks assigned after approval
  tasks?: Task[];
  // Git repo URL submitted for final project
  repoUrl?: string;
  // Payment info for document generation
  paid?: boolean;
  paymentId?: string;
  paidAt?: string;
  paymentProofUrl?: string;
  paymentProofUploadedAt?: string;
  paymentStatus?: "pending" | "verified" | "rejected";
  paymentVerifiedAt?: string;
  appliedAt: string; // ISO timestamp
  approvedAt?: string; // ISO timestamp when approved
}

