import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

import dbConnect from "@/lib/mongodb";
import { Application as ApplicationModel } from "@/lib/models/Application";
import { toApiApplication } from "@/lib/applicationMapper";
import { requireAdminFromHeader } from "@/lib/adminAuth";
import type { ITask } from "@/lib/models/Application";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!requireAdminFromHeader(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!["pending", "approved", "completed", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    await dbConnect();
    const application = await ApplicationModel.findOne({ id });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (status === "completed") {
      const tasks = (application.tasks as unknown as ITask[] | undefined) || [];
      const submittedTasksCount = tasks.filter((t) => t.status !== "pending" && t.submittedUrl).length;

      if (submittedTasksCount < 2) {
        return NextResponse.json(
          { error: "At least 2 task submissions are required before marking an application completed." },
          { status: 400 }
        );
      }
    }

    application.status = status;
    if (status === "approved" && !application.approvedAt) {
      application.approvedAt = new Date();
    }
    if (status === "completed" && !application.completedAt) {
      application.completedAt = new Date();
    }
    await application.save();

    return NextResponse.json({
      message: "Application status updated",
      application: toApiApplication(application),
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!requireAdminFromHeader(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const application = await ApplicationModel.findOne({ id }).lean();

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(toApiApplication(application), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}
