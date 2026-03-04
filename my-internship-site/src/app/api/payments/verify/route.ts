import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

import dbConnect from "@/lib/mongodb";
import { Application as ApplicationModel } from "@/lib/models/Application";
import { toApiApplication } from "@/lib/applicationMapper";
import { requireAdminFromHeader } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  try {
    if (!requireAdminFromHeader(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, status } = body;

    if (!applicationId || !["verified", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid verification request" }, { status: 400 });
    }

    await dbConnect();
    const application = await ApplicationModel.findOne({ id: applicationId });
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (!application.paymentProof?.base64 && !application.paymentProofUrl) {
      return NextResponse.json({ error: "No payment proof uploaded" }, { status: 400 });
    }

    application.paymentStatus = status;
    if (status === "verified") {
      application.paid = true;
      application.paymentVerifiedAt = new Date();
    } else {
      application.paid = false;
      application.paymentVerifiedAt = undefined;
    }

    await application.save();

    return NextResponse.json(
      { message: "Payment status updated", application: toApiApplication(application) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
