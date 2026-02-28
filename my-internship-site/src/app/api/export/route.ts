import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Application } from "@/types/application";
import { internships } from "@/data/internships";

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

function getInternshipTitle(id: string): string {
  return internships.find((i) => i.id === id)?.title || "Unknown Program";
}

export async function GET(request: NextRequest) {
  try {
    const applications = readApplications();

    // Format the data as a readable text file
    let textContent = "==============================================================\n";
    textContent += "         VIRTUAL INTERNSHIP PLATFORM - APPLICATIONS REPORT\n";
    textContent += "==============================================================\n\n";
    textContent += `Generated on: ${new Date().toLocaleString()}\n`;
    textContent += `Total Applications: ${applications.length}\n\n`;

    // Summary statistics
    const pending = applications.filter((a) => (a.status || "pending") === "pending").length;
    const approved = applications.filter((a) => a.status === "approved").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;

    textContent += "SUMMARY:\n";
    textContent += `- Pending: ${pending}\n`;
    textContent += `- Approved: ${approved}\n`;
    textContent += `- Rejected: ${rejected}\n`;
    textContent += "\n==============================================================\n\n";

    // Detailed applications
    applications.forEach((app, index) => {
      textContent += `APPLICATION #${index + 1}\n`;
      textContent += "--------------------------------------------------------------\n";
      textContent += `Applicant Name: ${app.fullName}\n`;
      textContent += `Email: ${app.email}\n`;
      textContent += `Phone: ${app.phone}\n`;
      textContent += `Internship Program: ${getInternshipTitle(app.internshipId)}\n`;
      textContent += `Status: ${(app.status || "pending").toUpperCase()}\n`;
      textContent += `Applied Date: ${new Date(app.appliedAt).toLocaleString()}\n`;
      textContent += `\nCover Letter:\n`;
      textContent += `${app.coverLetter}\n`;
      textContent += "\n--------------------------------------------------------------\n\n";
    });

    textContent += "==============================================================\n";
    textContent += "QUICK EMAIL LIST\n";
    textContent += "==============================================================\n\n";

    // Email list grouped by status
    const pendingApps = applications.filter((a) => (a.status || "pending") === "pending");
    const approvedApps = applications.filter((a) => a.status === "approved");
    const rejectedApps = applications.filter((a) => a.status === "rejected");

    if (pendingApps.length > 0) {
      textContent += "PENDING APPLICATIONS (To Review):\n";
      pendingApps.forEach((app) => {
        textContent += `${app.fullName} - ${app.email} - ${getInternshipTitle(
          app.internshipId
        )}\n`;
      });
      textContent += "\n";
    }

    if (approvedApps.length > 0) {
      textContent += "APPROVED APPLICATIONS (Send Approval Email):\n";
      approvedApps.forEach((app) => {
        textContent += `${app.fullName} - ${app.email} - ${getInternshipTitle(
          app.internshipId
        )}\n`;
      });
      textContent += "\n";
    }

    if (rejectedApps.length > 0) {
      textContent += "REJECTED APPLICATIONS (Send Rejection Email):\n";
      rejectedApps.forEach((app) => {
        textContent += `${app.fullName} - ${app.email} - ${getInternshipTitle(
          app.internshipId
        )}\n`;
      });
      textContent += "\n";
    }

    const filename = `applications_${new Date().toISOString().split("T")[0]}.txt`;

    return new NextResponse(textContent, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting applications:", error);
    return NextResponse.json(
      { error: "Failed to export applications" },
      { status: 500 }
    );
  }
}
