import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

import crypto from "crypto";

import dbConnect from "@/lib/mongodb";
import { Application as ApplicationModel } from "@/lib/models/Application";
import { toApiApplication } from "@/lib/applicationMapper";
import { requireAdminFromHeader } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { internshipId, fullName, email, phone, coverLetter, repoUrl } = body;

    // Validation
    if (!internshipId || !fullName || !email || !phone || !coverLetter) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // if a repo URL was provided, perform basic sanity check
    if (repoUrl && typeof repoUrl === "string" && !repoUrl.includes("codeK_")) {
      return NextResponse.json(
        { error: "Repository URL (if provided) must include 'codeK_' in the repo name" },
        { status: 400 }
      );
    }

    await dbConnect();

    const applicationId = `app_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
    const created = await ApplicationModel.create({
      id: applicationId,
      internshipId: String(internshipId).trim(),
      fullName: String(fullName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      resume: "",
      coverLetter: String(coverLetter).trim(),
      status: "pending",
      paid: false,
      repoUrl: repoUrl ? String(repoUrl).trim() : undefined,
      appliedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Application submitted successfully", application: toApiApplication(created) },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      { error: "Failed to process application" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const email = new URL(request.url).searchParams.get("email")?.trim() || "";
    const normalizedEmail = email.toLowerCase();

    if (!normalizedEmail && !requireAdminFromHeader(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const query = normalizedEmail ? { email: normalizedEmail } : {};
    const apps = await ApplicationModel.find(query).sort({ appliedAt: -1 }).lean();
    return NextResponse.json(apps.map(toApiApplication), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!requireAdminFromHeader(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const result = await ApplicationModel.deleteMany({});
    return NextResponse.json(
      { message: "All applications cleared", deletedCount: result.deletedCount || 0 },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error clearing applications:", error);
    return NextResponse.json(
      { error: "Failed to clear applications" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
