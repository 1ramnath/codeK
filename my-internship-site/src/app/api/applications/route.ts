import { Application } from "@/types/application";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Path to store applications
const applicationsFile = path.join(process.cwd(), "data", "applications.json");

// Ensure data directory exists
function ensureDataDir() {
  const dir = path.dirname(applicationsFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Read applications from file
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

// Write applications to file
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

    // Create new application
    const application: Application = {
      id: `app_${Date.now()}`,
      internshipId,
      fullName,
      email,
      phone,
      resume: "", // Can be added later with file upload
      coverLetter,
      status: "pending", // Default status is pending
      paid: false,
      // repoUrl is intentionally left undefined until the student submits the task
      appliedAt: new Date().toISOString(),
    };
    if (repoUrl) {
      application.repoUrl = repoUrl;
    }

    // Add to list
    const applications = readApplications();
    applications.push(application);
    writeApplications(applications);

    return NextResponse.json(
      { message: "Application submitted successfully", application },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      { error: "Failed to process application" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const applications = readApplications();

    const email = new URL(request.url).searchParams.get("email")?.trim() || "";
    const normalizedEmail = email.toLowerCase();

    const visible = normalizedEmail
      ? applications.filter((app) => (app.email || "").toLowerCase() === normalizedEmail)
      : applications;

    const sorted = [...visible].sort((a, b) => (b.appliedAt || "").localeCompare(a.appliedAt || ""));
    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
