import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

import dbConnect from "@/lib/mongodb";
import { Application as ApplicationModel } from "@/lib/models/Application";
import type { ITask } from "@/lib/models/Application";

export async function POST(request: NextRequest) {
  try {
    const { applicationId, taskId, submittedUrl } = await request.json();

    if (!applicationId || !taskId || !submittedUrl) {
      return NextResponse.json(
        { error: "Missing required fields: applicationId, taskId, submittedUrl" },
        { status: 400 }
      );
    }

    await dbConnect();
    const application = await ApplicationModel.findOne({ id: applicationId });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.status !== "approved") {
      return NextResponse.json(
        { error: "Application must be in approved status to submit tasks" },
        { status: 403 }
      );
    }

    if (!application.tasks) {
      return NextResponse.json(
        { error: "No tasks assigned to this application" },
        { status: 404 }
      );
    }

    const tasks = (application.tasks as unknown as ITask[]) || [];
    const task = tasks.find((t) => t.id === taskId);
    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Validate URL format (basic check for GitHub or typical project URLs)
    if (!submittedUrl.includes("github.com") && !submittedUrl.startsWith("http")) {
      return NextResponse.json(
        { error: "Please provide a valid GitHub repository URL or project link" },
        { status: 400 }
      );
    }

    // Update task submission
    task.submittedUrl = submittedUrl;
    task.submittedAt = new Date();
    task.status = "submitted";

    await application.save();

    return NextResponse.json({
      message: "Task submitted successfully",
      task,
      applicationStatus: application.status,
    });
  } catch (error) {
    console.error("Task submission error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
