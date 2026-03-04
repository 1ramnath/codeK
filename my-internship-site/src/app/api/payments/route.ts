import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

import crypto from "crypto";

import dbConnect from "@/lib/mongodb";
import { Application as ApplicationModel } from "@/lib/models/Application";
import { toApiApplication } from "@/lib/applicationMapper";

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

    await dbConnect();
    const application = await ApplicationModel.findOne({ id: applicationId });
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

    const buffer = Buffer.from(await paymentProof.arrayBuffer());
    const base64 = buffer.toString("base64");

    // Record payment proof for verification
    application.paid = false;
    application.paymentId = `pay_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
    application.paidAt = new Date();
    application.paymentProofUploadedAt = new Date();
    application.paymentProof = {
      mime: paymentProof.type,
      base64,
      fileName: paymentProof.name,
      size: buffer.byteLength,
    };
    application.paymentProofUrl = `/api/payments/proof/${encodeURIComponent(application.id)}`;
    application.paymentStatus = "pending";

    await application.save();

    return NextResponse.json(
      { message: "Payment recorded", application: toApiApplication(application) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}
