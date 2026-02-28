import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Application } from "@/types/application";

const applicationsFile = path.join(process.cwd(), "data", "applications.json");

function ensureDataDir() {
  const dir = path.dirname(applicationsFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readApplications(): Application[] {
  try {
    ensureDataDir();
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
    ensureDataDir();
    fs.writeFileSync(applicationsFile, JSON.stringify(applications, null, 2));
  } catch (error) {
    console.error("Error writing applications:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, status } = body;

    if (!applicationId || !["verified", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid verification request" }, { status: 400 });
    }

    const applications = readApplications();
    const application = applications.find((a) => a.id === applicationId);
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (!application.paymentProofUrl) {
      return NextResponse.json({ error: "No payment proof uploaded" }, { status: 400 });
    }

    application.paymentStatus = status;
    if (status === "verified") {
      application.paid = true;
      application.paymentVerifiedAt = new Date().toISOString();
    } else {
      application.paid = false;
      application.paymentVerifiedAt = undefined;
    }

    writeApplications(applications);

    return NextResponse.json({ message: "Payment status updated", application });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
