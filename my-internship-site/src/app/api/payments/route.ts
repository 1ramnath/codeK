import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Application } from "@/types/application";

const applicationsFile = path.join(process.cwd(), "data", "applications.json");
const paymentProofDir = path.join(process.cwd(), "public", "uploads", "payments");

function readApplications(): Application[] {
  try {
    if (fs.existsSync(applicationsFile)) {
      const data = fs.readFileSync(applicationsFile, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading applications:", error);
  }
  return [];
}

function writeApplications(applications: Application[]): void {
  try {
    fs.writeFileSync(applicationsFile, JSON.stringify(applications, null, 2));
  } catch (error) {
    console.error("Error writing applications:", error);
  }
}

function ensurePaymentProofDir(): void {
  if (!fs.existsSync(paymentProofDir)) {
    fs.mkdirSync(paymentProofDir, { recursive: true });
  }
}

function getSafeExtension(fileName: string, fileType: string): string {
  const fallback = fileType.split("/")[1];
  const cleanedName = fileName.toLowerCase();
  if (cleanedName.endsWith(".png")) return "png";
  if (cleanedName.endsWith(".jpg") || cleanedName.endsWith(".jpeg")) return "jpg";
  if (cleanedName.endsWith(".webp")) return "webp";
  if (fallback === "png" || fallback === "jpeg" || fallback === "webp") {
    return fallback === "jpeg" ? "jpg" : fallback;
  }
  return "png";
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let applicationId = "";
    let amount = 0;
    let paymentProof: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      applicationId = String(formData.get("applicationId") || "");
      amount = Number(formData.get("amount") || 0);
      paymentProof = formData.get("paymentProof") as File | null;
    } else {
      const body = await request.json();
      applicationId = body.applicationId;
      amount = body.amount;
    }

    if (!applicationId || typeof amount !== "number") {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    // For now we expect amount to be 99 (INR)
    if (amount !== 99) {
      return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
    }

    const applications = readApplications();
    const application = applications.find((a) => a.id === applicationId);
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (!paymentProof) {
      return NextResponse.json(
        { error: "Payment proof screenshot is required" },
        { status: 400 }
      );
    }

    if (!paymentProof.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Payment proof must be an image file" },
        { status: 400 }
      );
    }

    ensurePaymentProofDir();
    const extension = getSafeExtension(paymentProof.name, paymentProof.type);
    const safeFileName = `${applicationId}_${Date.now()}.${extension}`;
    const filePath = path.join(paymentProofDir, safeFileName);
    const buffer = Buffer.from(await paymentProof.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Record payment proof for verification
    application.paid = false;
    application.paymentId = `pay_${Date.now()}`;
    application.paidAt = new Date().toISOString();
    application.paymentProofUrl = `/uploads/payments/${safeFileName}`;
    application.paymentProofUploadedAt = new Date().toISOString();
    application.paymentStatus = "pending";

    writeApplications(applications);

    return NextResponse.json({ message: "Payment recorded", application });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}
