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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!["pending", "approved", "completed", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const applications = readApplications();
    const application = applications.find((app) => app.id === id);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (status === "completed") {
      const submittedTasksCount =
        application.tasks?.filter((t) => t.status !== "pending" && t.submittedUrl).length || 0;

      if (submittedTasksCount < 2) {
        return NextResponse.json(
          { error: "At least 2 task submissions are required before marking an application completed." },
          { status: 400 }
        );
      }
    }

    application.status = status;
    writeApplications(applications);

    return NextResponse.json({
      message: "Application status updated",
      application,
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
    const { id } = await params;
    const applications = readApplications();
    const application = applications.find((app) => app.id === id);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}
