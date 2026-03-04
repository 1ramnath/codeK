import mongoose, { Schema, Document } from "mongoose";

interface ITask {
  id: string;
  title: string;
  description: string;
  submittedUrl?: string;
  submittedAt?: Date;
  status: "pending" | "submitted" | "completed";
}

interface IApplication extends Document {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  resume?: string;
  coverLetter: string;
  internshipId: string;
  repoUrl?: string;
  status: "pending" | "approved" | "rejected" | "completed";
  tasks?: ITask[];
  paid: boolean;
  paymentId?: string;
  paidAt?: Date;
  paymentProofUrl?: string;
  paymentProofUploadedAt?: Date;
  paymentProof?: {
    mime?: string;
    base64?: string;
    fileName?: string;
    size?: number;
  };
  paymentStatus?: "pending" | "verified" | "rejected";
  paymentVerifiedAt?: Date;
  appliedAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  submittedUrl: { type: String },
  submittedAt: { type: Date },
  status: {
    type: String,
    enum: ["pending", "submitted", "completed"],
    default: "pending",
  },
});

const ApplicationSchema = new Schema<IApplication>(
  {
    id: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    resume: { type: String },
    coverLetter: { type: String, required: true },
    internshipId: { type: String, required: true },
    repoUrl: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    tasks: [TaskSchema],
    paid: { type: Boolean, default: false },
    paymentId: { type: String },
    paidAt: { type: Date },
    paymentProofUrl: { type: String },
    paymentProofUploadedAt: { type: Date },
    paymentProof: {
      mime: { type: String },
      base64: { type: String },
      fileName: { type: String },
      size: { type: Number },
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
    },
    paymentVerifiedAt: { type: Date },
    appliedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const Application =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);

export type { IApplication, ITask };
