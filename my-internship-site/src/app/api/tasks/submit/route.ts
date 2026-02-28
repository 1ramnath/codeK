import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Application, Task } from "@/types/application";

const applicationsFile = path.join(process.cwd(), "data", "applications.json");

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
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { applicationId, taskId, submittedUrl } = await request.json();

    if (!applicationId || !taskId || !submittedUrl) {
      return NextResponse.json(
        { error: "Missing required fields: applicationId, taskId, submittedUrl" },
        { status: 400 }
      );
    }

    const applications = readApplications();
    const application = applications.find((app) => app.id === applicationId);

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

    const task = application.tasks.find((t) => t.id === taskId);
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
    task.submittedAt = new Date().toISOString();
    task.status = "submitted";

    // Save updated applications
    writeApplications(applications);

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
