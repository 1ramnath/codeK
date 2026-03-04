const fs = require('fs');
const path = require('path');

const content = `import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

import fs from "fs";
import path from "path";
import { Resvg } from "@resvg/resvg-js";

import dbConnect from "@/lib/mongodb";
import { Application as ApplicationModel, IApplication, ITask } from "@/lib/models/Application";
import { internships } from "@/data/internships";

const COMPANY_NAME = "codeK";
const COMPANY_TAGLINE = "Virtual Internship Platform";
const COMPANY_WEBSITE = "codek.io";
const COMPANY_EMAIL = "support@codek.io";
const COMPANY_ADDRESS = "pune, Maharashtra, India";

const LOGO_FILE_PATH = path.join(process.cwd(), "Gemini_Generated_Image_6oua0i6oua0i6oua.png");
const SIGNATURE_FILE_CANDIDATES = [
  path.join(process.cwd(), "signature.png"),
  path.join(process.cwd(), "signature.jpg"),
  path.join(process.cwd(), "signature.jpeg"),
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
    return \`data:\${mime};base64,\${base64}\`;
  } catch (error) {
    console.warn(\`Failed to load asset: \${filePath}\`, error);
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

function getInternshipTitle(id: string): string {
  return internships.find((i) => i.id === id)?.title || "Virtual Internship";
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "<")
    .replaceAll(">", ">")
    .replaceAll('"', """)
    .replaceAll("'", "&apos;");
}

function renderPngFromSvg(svg: string): Buffer {
  const resvg = new Resvg(svg);
  return resvg.render().asPng();
}

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

function renderOfferLetterSvg(application: IApplication): string {
  const logoDataUri = getLogoDataUri();
  const logoImg = logoDataUri ? \`<image href="\${logoDataUri}" x="50" y="30" width="80" height="80" />\` : "";
  const signatureDataUri = getSignatureDataUri();
  const signatureImg = signatureDataUri ? \`<image href="\${signatureDataUri}" x="400" y="580" width="150" height="60" />\` : "";

  const internshipTitle = getInternshipTitle(application.internshipId);
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return \`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="700" viewBox="0 0 800 700">
  <rect width="800" height="700" fill="#ffffff"/>
  <rect x="20" y="20" width="760" height="660" fill="none" stroke="#1a365d" stroke-width="3"/>
  <rect x="30" y="30" width="740" height="640" fill="none" stroke="#2c5282" stroke-width="1"/>
  
  \${logoImg}
  
  <text x="400" y="60" font-family="Arial, sans-serif" font-size="14" fill="#4a5568" text-anchor="middle">\${COMPANY_WEBSITE} | \${COMPANY_EMAIL}</text>
  
  <text x="400" y="130" font-family="Georgia, serif" font-size="32" font-weight="bold" fill="#1a365d" text-anchor="middle">OFFER LETTER</text>
  
  <text x="400" y="170" font-family="Arial, sans-serif" font-size="14" fill="#2d3748" text-anchor="middle">\${COMPANY_ADDRESS}</text>
  
  <line x1="100" y1="200" x2="700" y2="200" stroke="#cbd5e0" stroke-width="1"/>
  
  <text x="100" y="240" font-family="Arial, sans-serif" font-size="14" fill="#4a5568">Date:</text>
  <text x="200" y="240" font-family="Arial, sans-serif" font-size="14" fill="#2d3748">\${escapeXml(currentDate)}</text>
  
  <text x="100" y="270" font-family="Arial, sans-serif" font-size="14" fill="#4a5568">Candidate Name:</text>
  <text x="200" y="270" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#2d3748">\${escapeXml(application.fullName)}</text>
  
  <text x="100" y="300" font-family="Arial, sans-serif" font-size="14" fill="#4a5568">Email:</text>
  <text x="200" y="300" font-family="Arial, sans-serif" font-size="14" fill="#2d3748">\${escapeXml(application.email)}</text>
  
  <text x="100" y="330" font-family="Arial, sans-serif" font-size="14" fill="#4a5568">Internship Program:</text>
  <text x="250" y="330" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#2d3748">\${escapeXml(internshipTitle)}</text>
  
  <text x="100" y="370" font-family="Arial, sans-serif" font-size="14" fill="#4a5568">Application ID:</text>
  <text x="200" y="370" font-family="Arial, sans-serif" font-size="14" fill="#2d3748">\${escapeXml(application.id)}</text>
  
  <text x="100" y="420" font-family="Arial, sans-serif" font-size="14" fill="#2d3748">Dear \${escapeXml(application.fullName)},</text>
  
  <text x="100" y="450" font-family="Arial, sans-serif" font-size="12" fill="#4a5568">We are pleased to offer you a virtual internship at \${COMPANY_NAME}. This internship</text>
  <text x="100" y="470" font-family="Arial, sans-serif" font-size="12" fill="#4a5568">is a great opportunity to gain practical experience in your chosen field.</text>
  
  <text x="100" y="500" font-family="Arial, sans-serif" font-size="12" fill="#4a5568">Internship Details:</text>
  <text x="120" y="520" font-family="Arial, sans-serif" font-size="12" fill="#4a5568">• Program: \${escapeXml(internshipTitle)}</text>
  <text x="120" y="540" font-family="Arial, sans-serif" font-size="12" fill="#4a5568">• Duration: 4-6 weeks</text>
  <text x="120" y="560" font-family="Arial, sans-serif" font-size="12" fill="#4a5568">• Mode: Virtual/Remote</text>
  
  <text x="100" y="600" font-family="Arial, sans-serif" font-size="12" fill="#4a5568">Please accept this offer by logging into your student portal and confirming your acceptance.</text>
  
  <text x="100" y="640" font-family="Arial, sans-serif" font-size="14" fill="#2d3748">Sincerely,</text>
  <text x="100" y="660" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#1a365d">\${COMPANY_NAME} Team</text>
  
  \${signatureImg}
  
  <text x="475" y="660" font-family="Arial, sans-serif" font-size="10" fill="#718096" text-anchor="middle">Authorized Signature</text>
  
  <text x="400" y="690" font-family="Arial, sans-serif" font-size="10" fill="#a0aec0" text-anchor="middle">\${COMPANY_TAGLINE} | \${COMPANY_WEBSITE}</text>
</svg>
\`.trim();
}

function renderCompletionCertificateSvg(application: IApplication): string {
  const logoDataUri = getLogoDataUri();
  const logoImg = logoDataUri ? \`<image href="\${logoDataUri}" x="350" y="40" width="100" height="100" />\` : "";
  const signatureDataUri = getSignatureDataUri();
  const signatureImg = signatureDataUri ? \`<image href="\${signatureDataUri}" x="520" y="580" width="180" height="70" />\` : "";

  const internshipTitle = getInternshipTitle(application.internshipId);
  const completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return \`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="700" viewBox="0 0 800 700">
  <defs>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a365d;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#2c5282;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a365d;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="800" height="700" fill="#ffffff"/>
  <rect x="15" y="15" width="770" height="670" fill="none" stroke="url(#borderGrad)" stroke-width="4"/>
  <rect x="25" y="25" width="750" height="650" fill="none" stroke="#cbd5e0" stroke-width="1"/>
  
  \${logoImg}
  
  <text x="400" y="80" font-family="Arial, sans-serif" font-size="12" fill="#718096" text-anchor="middle">\${COMPANY_WEBSITE} | \${COMPANY_EMAIL}</text>
  
  <text x="400" y="160" font-family="Georgia, serif" font-size="38" font-weight="bold" fill="#1a365d" text-anchor="middle">CERTIFICATE</text>
  <text x="400" y="195" font-family="Georgia, serif" font-size="24" fill="#2c5282" text-anchor="middle">of Completion</text>
  
  <line x1="250" y1="220" x2="550" y2="220" stroke="#cbd5e0" stroke-width="2"/>
  
  <text x="400" y="250" font-family="Arial, sans-serif" font-size="16" fill="#4a5568" text-anchor="middle">This is to certify that</text>
  
  <text x="400" y="290" font-family="Georgia, serif" font-size="32" font-weight="bold" fill="#1a365d" text-anchor="middle">\${escapeXml(application.fullName)}</text>
  
  <line x1="300" y1="310" x2="500" y2="310" stroke="#cbd5e0" stroke-width="1"/>
  
  <text x="400" y="340" font-family="Arial, sans-serif" font-size="14" fill="#4a5568" text-anchor="middle">has successfully completed the Virtual Internship program in</text>
  
  <text x="400" y="375" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#2c5282" text-anchor="middle">\${escapeXml(internshipTitle)}</text>
  
  <text x="400" y="410" font-family="Arial, sans-serif" font-size="14" fill="#4a5568" text-anchor="middle">Duration: 4-6 Weeks</text>
  
  <text x="400" y="440" font-family="Arial, sans-serif" font-size="14" fill="#4a5568" text-anchor="middle">Date of Completion: \${escapeXml(completionDate)}</text>
  
  <text x="400" y="475" font-family="Arial, sans-serif" font-size="12" fill="#718096" text-anchor="middle">Application ID: \${escapeXml(application.id)}</text>
  
  <rect x="150" y="510" width="200" height="2" fill="#cbd5e0"/>
  <text x="250" y="535" font-family="Arial, sans-serif" font-size="12" fill="#4a5568" text-anchor="middle">Program Coordinator</text>
  <text x="250" y="550" font-family="Arial, sans-serif" font-size="10" fill="#718096" text-anchor="middle">\${COMPANY_NAME}</text>
  
  \${signatureImg}
  <rect x="450" y="510" width="200" height="2" fill="#cbd5e0"/>
  <text x="550" y="535" font-family="Arial, sans-serif" font-size="12" fill="#4a5568" text-anchor="middle">Director</text>
  <text x="550" y="550" font-family="Arial, sans-serif" font-size="10" fill="#718096" text-anchor="middle">\${COMPANY_NAME}</text>
  
  <text x="400" y="680" font-family="Arial, sans-serif" font-size="11" fill="#a0aec0" text-anchor="middle">\${COMPANY_TAGLINE} | \${COMPANY_WEBSITE}</text>
  
  <text x="400" y="695" font-family="Arial, sans-serif" font-size="9" fill="#cbd5e0" text-anchor="middle">Certificate ID: \${escapeXml(application.id)}-\${Date.now()}</text>
</svg>
\`.trim();
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; type: string }> }) {
  try {
    const { id, type } = await params;

    // Connect to MongoDB and fetch application
    await dbConnect();
    const application = await ApplicationModel.findOne({ id });
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
          "Content-Disposition": \`attachment; filename="Offer_\${application.fullName.replace(/\\s+/g, "_")}.png"\`,
          "Cache-Control": "no-store",
        },
      });
    }

    if (type === "completion") {
      const paymentVerified = application.paid || application.paymentStatus === "verified";
      const submittedTasksCount =
        application.tasks?.filter((t: ITask) => t.status !== "pending" && t.submittedUrl).length || 0;

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
          "Content-Disposition": \`attachment; filename="Certificate_\${application.fullName.replace(/\\s+/g, "_")}.png"\`,
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
`;

const targetPath = path.join(__dirname, 'src/app/api/certificates/[id]/[type]/route.ts');

// Ensure directory exists
const dir = path.dirname(targetPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('File written successfully to:', targetPath);
