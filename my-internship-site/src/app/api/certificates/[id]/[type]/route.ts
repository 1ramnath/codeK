import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

import fs from "fs";
import path from "path";
import { Resvg } from "@resvg/resvg-js";

import { Application } from "@/types/application";
import { internships } from "@/data/internships";

const COMPANY_NAME = "codeK";
const COMPANY_TAGLINE = "Virtual Internship Platform";
const COMPANY_WEBSITE = "codek.io";
const COMPANY_EMAIL = "support@codek.io";
const COMPANY_ADDRESS = "Remote, Global";

const applicationsFile = path.join(process.cwd(), "data", "applications.json");
const LOGO_FILE_PATH = path.join(process.cwd(), "Gemini_Generated_Image_6oua0i6oua0i6oua.png");
const SIGNATURE_FILE_CANDIDATES = [
  path.join(process.cwd(), "public", "signature.png"),
  path.join(process.cwd(), "public", "signature.jpg"),
  path.join(process.cwd(), "public", "signature.jpeg"),
  path.join(process.cwd(), "public", "signature.webp"),
];

let cachedLogoDataUri: string | null | undefined;
let cachedSignatureDataUri: string | null | undefined;

function guessMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

function fileToDataUri(filePath: string): string | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const base64 = fs.readFileSync(filePath).toString("base64");
    const mime = guessMimeType(filePath);
    return `data:${mime};base64,${base64}`;
  } catch (error) {
    console.warn(`Failed to load asset: ${filePath}`, error);
    return null;
  }
}

function getLogoDataUri(): string | null {
  if (cachedLogoDataUri !== undefined) return cachedLogoDataUri;
  cachedLogoDataUri = fileToDataUri(LOGO_FILE_PATH);
  return cachedLogoDataUri;
}

function getSignatureDataUri(): string | null {
  if (cachedSignatureDataUri !== undefined) return cachedSignatureDataUri;

  for (const candidate of SIGNATURE_FILE_CANDIDATES) {
    const uri = fileToDataUri(candidate);
    if (uri) {
      cachedSignatureDataUri = uri;
      return cachedSignatureDataUri;
    }
  }

  cachedSignatureDataUri = null;
  return cachedSignatureDataUri;
}

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
  return internships.find((i) => i.id === id)?.title || "Virtual Internship";
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&apos;");
}

function formatIssueDate(isoMaybe: string | undefined): string {
  const d = isoMaybe ? new Date(isoMaybe) : new Date();
  if (Number.isNaN(d.getTime())) return new Date().toLocaleDateString("en-US");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function getCertificateId(application: Application): string {
  const year = new Date().getFullYear();
  const short = application.id.replace("app_", "").slice(-8).toUpperCase();
  return `CODEK-${year}-${short}`;
}

function nameFontSize(fullName: string, base: number): number {
  const n = fullName.trim().length;
  if (n <= 18) return base;
  if (n <= 26) return Math.max(54, base - 10);
  if (n <= 34) return Math.max(48, base - 16);
  return Math.max(42, base - 22);
}

function renderCompletionCertificateSvg(application: Application): string {
  const internshipTitle = escapeXml(getInternshipTitle(application.internshipId));

  const rawName = (application.fullName || "INTERN NAME").trim();
  const fullNameUpper = escapeXml(rawName.toUpperCase());

  const issueDate = escapeXml(formatIssueDate(application.paymentVerifiedAt || application.paidAt));
  const certId = escapeXml(getCertificateId(application));
  const nameSize = nameFontSize(rawName, 96);

  const logoDataUri = getLogoDataUri();
  const signatureDataUri = getSignatureDataUri();

  // A4 landscape at ~300dpi
  const width = 3508;
  const height = 2480;

  const logoMarkup = logoDataUri
    ? `<image href="${logoDataUri}" x="220" y="200" width="760" height="240" preserveAspectRatio="xMidYMid meet" opacity="0.96" />`
    : `<text x="220" y="310" fill="#0f1f3d" font-family="Arial, Helvetica, sans-serif" font-size="54" font-weight="800">${COMPANY_NAME}</text>`;

  const signatureMarkup = signatureDataUri
    ? `<image href="${signatureDataUri}" x="${width - 1260}" y="1860" width="1040" height="280" preserveAspectRatio="xMidYMid meet" opacity="0.96" />`
    : `<path d="M${width - 1210} 2040 C ${width - 1120} 1940, ${width - 1060} 2140, ${width - 960} 2035 C ${width - 860} 1930, ${width - 820} 2130, ${width - 720} 2040 C ${width - 620} 1955, ${width - 560} 2100, ${width - 440} 2020" fill="none" stroke="#1f4aa8" stroke-width="12" stroke-linecap="round" />`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f6f2e9"/>
      <stop offset="55%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#eef5ff"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0f1f3d"/>
      <stop offset="100%" stop-color="#1f4aa8"/>
    </linearGradient>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="2" fill="#d7d2c6" opacity="0.35"/>
    </pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
  </defs>

  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#bg)"/>
  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#dots)" opacity="0.15"/>

  <g filter="url(#shadow)">
    <rect x="140" y="140" width="${width - 280}" height="${height - 280}" rx="34" fill="#fffdf8" stroke="#0f1f3d" stroke-width="14"/>
    <rect x="190" y="190" width="${width - 380}" height="${height - 380}" rx="28" fill="none" stroke="#b6bfcd" stroke-width="6"/>
  </g>

  <rect x="190" y="190" width="${width - 380}" height="10" fill="url(#accent)" opacity="0.85"/>

  ${logoMarkup}

  <text x="${width - 220}" y="260" text-anchor="end" fill="#0f1f3d" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">DATE</text>
  <text x="${width - 220}" y="298" text-anchor="end" fill="#111827" font-family="Arial, Helvetica, sans-serif" font-size="28">${issueDate}</text>

  <text x="${width - 220}" y="355" text-anchor="end" fill="#0f1f3d" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">CERTIFICATE ID</text>
  <text x="${width - 220}" y="393" text-anchor="end" fill="#111827" font-family="Arial, Helvetica, sans-serif" font-size="28">${certId}</text>

  <text x="${width / 2}" y="680" text-anchor="middle" fill="#0f1f3d"
    font-family="Georgia, 'Times New Roman', serif" font-size="92" font-weight="700" letter-spacing="2">
    CERTIFICATE OF ACHIEVEMENT
  </text>
  <text x="${width / 2}" y="775" text-anchor="middle" fill="#0f1f3d"
    font-family="Georgia, 'Times New Roman', serif" font-size="66" font-weight="700" letter-spacing="1.4">
    AND INTERNSHIP COMPLETION
  </text>

  <text x="${width / 2}" y="910" text-anchor="middle" fill="#374151"
    font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" letter-spacing="2.2">
    THIS IS TO CERTIFY THAT
  </text>

  <text x="${width / 2}" y="1060" text-anchor="middle" fill="#111827"
    font-family="Georgia, 'Times New Roman', serif" font-size="${nameSize}" font-weight="700">
    ${fullNameUpper}
  </text>

  <line x1="${width / 2 - 780}" y1="1100" x2="${width / 2 + 780}" y2="1100" stroke="#0f1f3d" stroke-width="4" opacity="0.35"/>

  <text x="${width / 2}" y="1255" text-anchor="middle" fill="#111827"
    font-family="Arial, Helvetica, sans-serif" font-size="30">
    <tspan x="${width / 2}" dy="0">has successfully completed a Virtual Internship in</tspan>
    <tspan x="${width / 2}" dy="48" font-weight="700">${internshipTitle}</tspan>
    <tspan x="${width / 2}" dy="48">at ${COMPANY_NAME}. This certificate is awarded in recognition of dedication,</tspan>
    <tspan x="${width / 2}" dy="48">professional conduct, and performance during the internship program.</tspan>
  </text>

  <line x1="${width - 1210}" y1="2150" x2="${width - 220}" y2="2150" stroke="#0f1f3d" stroke-width="5"/>
  ${signatureMarkup}
  <text x="${width - 715}" y="2222" text-anchor="middle" fill="#0f1f3d"
    font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">AUTHORIZED SIGNATORY</text>

  <text x="${width / 2}" y="${height - 190}" text-anchor="middle" fill="#475569"
    font-family="Arial, Helvetica, sans-serif" font-size="24">
    ${COMPANY_NAME} | ${COMPANY_WEBSITE} | ${COMPANY_EMAIL}
  </text>
  <text x="${width / 2}" y="${height - 150}" text-anchor="middle" fill="#475569"
    font-family="Arial, Helvetica, sans-serif" font-size="24">
    ${COMPANY_ADDRESS}
  </text>
</svg>`;
}

function renderOfferLetterSvg(application: Application): string {
  const internshipTitle = escapeXml(getInternshipTitle(application.internshipId));
  const fullName = escapeXml(application.fullName || "Intern Name");
  const email = escapeXml(application.email || "");
  const phone = escapeXml(application.phone || "");

  const issueDate = escapeXml(formatIssueDate(application.approvedAt));
  const ref = escapeXml(`CODEK/OFFER-${application.id.replace("app_", "").slice(-8).toUpperCase()}`);

  const logoDataUri = getLogoDataUri();
  const signatureDataUri = getSignatureDataUri();

  const width = 2480; // A4 portrait at ~300dpi
  const height = 3508;

  const logoMarkup = logoDataUri
    ? `<image href="${logoDataUri}" x="150" y="76" width="760" height="220" preserveAspectRatio="xMidYMid meet" opacity="0.96" />`
    : `<text x="160" y="170" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="800">${COMPANY_NAME}</text>`;

  const signatureMarkup = signatureDataUri
    ? `<image href="${signatureDataUri}" x="${width - 980}" y="2735" width="820" height="240" preserveAspectRatio="xMidYMid meet" opacity="0.96" />`
    : `<path d="M${width - 940} 2895 C ${width - 820} 2800, ${width - 770} 3010, ${width - 650} 2900 C ${width - 540} 2790, ${width - 490} 3000, ${width - 360} 2890" fill="none" stroke="#1f4aa8" stroke-width="12" stroke-linecap="round" />`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="header" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0f1f3d"/>
      <stop offset="100%" stop-color="#1f4aa8"/>
    </linearGradient>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f7f7fb"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000000" flood-opacity="0.10"/>
    </filter>
  </defs>

  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#paper)"/>

  <rect x="0" y="0" width="${width}" height="320" fill="url(#header)"/>
  ${logoMarkup}
  <text x="980" y="205" fill="#c7d2fe" font-family="Arial, Helvetica, sans-serif" font-size="28">${COMPANY_TAGLINE}</text>

  <text x="${width - 160}" y="125" text-anchor="end" fill="#e5e7eb" font-family="Arial, Helvetica, sans-serif" font-size="22">DATE: ${issueDate}</text>
  <text x="${width - 160}" y="160" text-anchor="end" fill="#e5e7eb" font-family="Arial, Helvetica, sans-serif" font-size="22">REF: ${ref}</text>

  <g filter="url(#shadow)">
    <rect x="120" y="420" width="${width - 240}" height="${height - 620}" rx="26" fill="#ffffff" stroke="#e5e7eb" stroke-width="6"/>
  </g>

  <text x="180" y="565" fill="#111827" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700">${fullName}</text>
  <text x="180" y="610" fill="#374151" font-family="Arial, Helvetica, sans-serif" font-size="24">${email}</text>
  <text x="180" y="650" fill="#374151" font-family="Arial, Helvetica, sans-serif" font-size="24">${phone ? `Contact: ${phone}` : ""}</text>

  <text x="${width / 2}" y="820" text-anchor="middle" fill="#0f1f3d" font-family="Georgia, 'Times New Roman', serif" font-size="54" font-weight="700">
    OFFER OF VIRTUAL INTERNSHIP
  </text>

  <text x="180" y="950" fill="#111827" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700">
    Subject: Appointment for ${internshipTitle} Internship
  </text>

  <text x="180" y="1035" fill="#111827" font-family="Arial, Helvetica, sans-serif" font-size="28">
    Dear ${fullName},
  </text>

  <text x="180" y="1110" fill="#111827" font-family="Arial, Helvetica, sans-serif" font-size="27">
    <tspan x="180" dy="0">We are pleased to offer you an internship position at ${COMPANY_NAME}.</tspan>
    <tspan x="180" dy="44">This program is designed to provide practical experience in a professional</tspan>
    <tspan x="180" dy="44">virtual environment.</tspan>
  </text>

  <text x="180" y="1315" fill="#111827" font-family="Arial, Helvetica, sans-serif" font-size="27">
    <tspan x="180" dy="0" font-weight="700">Internship Details</tspan>
    <tspan x="180" dy="44">- Role: ${internshipTitle}</tspan>
    <tspan x="180" dy="44">- Mode: Remote</tspan>
    <tspan x="180" dy="44">- Duration: 4 to 6 weeks</tspan>
    <tspan x="180" dy="44">- Certificate: Issued after successful completion</tspan>
  </text>

  <text x="180" y="1605" fill="#111827" font-family="Arial, Helvetica, sans-serif" font-size="27">
    We look forward to your contributions and wish you a rewarding learning journey.
  </text>

  <text x="180" y="1740" fill="#111827" font-family="Arial, Helvetica, sans-serif" font-size="27">
    Sincerely,
  </text>

  ${signatureMarkup}
  <line x1="${width - 980}" y1="3010" x2="${width - 160}" y2="3010" stroke="#0f1f3d" stroke-width="4"/>
  <text x="${width - 570}" y="3065" text-anchor="middle" fill="#0f1f3d" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">
    AUTHORIZED SIGNATORY
  </text>

  <text x="${width / 2}" y="${height - 120}" text-anchor="middle" fill="#6b7280"
    font-family="Arial, Helvetica, sans-serif" font-size="22">
    ${COMPANY_WEBSITE} | ${COMPANY_EMAIL} | ${COMPANY_ADDRESS}
  </text>
</svg>`;
}

function renderPngFromSvg(svg: string): Uint8Array {
  const resvg = new Resvg(svg, { background: "white" });
  const rendered = resvg.render();
  const pngData = rendered.asPng();
  return pngData;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; type: string }> }
) {
  try {
    const { id, type } = await params;

    const applications = readApplications();
    const application = applications.find((app) => app.id === id);
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (type === "offer") {
      if (!["approved", "completed"].includes(application.status)) {
        return NextResponse.json({ error: "Offer letter is available after approval" }, { status: 403 });
      }

      const svg = renderOfferLetterSvg(application);
      const png = renderPngFromSvg(svg);
      const arrayBuffer = toArrayBuffer(png);
      return new Response(arrayBuffer, {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": `attachment; filename="Offer_${application.fullName.replace(/\s+/g, "_")}.png"`,
          "Cache-Control": "no-store",
        },
      });
    }

    if (type === "completion") {
      const paymentVerified = application.paid || application.paymentStatus === "verified";
      const submittedTasksCount =
        application.tasks?.filter((t) => t.status !== "pending" && t.submittedUrl).length || 0;

      if (application.status !== "completed") {
        return NextResponse.json(
          { error: "Certificate is available after the application is marked completed." },
          { status: 403 }
        );
      }

      if (submittedTasksCount < 2) {
        return NextResponse.json(
          { error: "At least 2 task submissions are required before generating a certificate." },
          { status: 403 }
        );
      }

      if (!paymentVerified) {
        return NextResponse.json(
          { error: "Certificate is available after payment verification." },
          { status: 403 }
        );
      }

      const svg = renderCompletionCertificateSvg(application);
      const png = renderPngFromSvg(svg);
      const arrayBuffer = toArrayBuffer(png);
      return new Response(arrayBuffer, {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": `attachment; filename="Certificate_${application.fullName.replace(/\s+/g, "_")}.png"`,
          "Cache-Control": "no-store",
        },
      });
    }

    return NextResponse.json({ error: "Invalid certificate request" }, { status: 400 });
  } catch (error) {
    console.error("Certificate API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
