import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

import dbConnect from "@/lib/mongodb";
import { Application as ApplicationModel } from "@/lib/models/Application";
import { isValidAdminCode, requireAdminFromHeader } from "@/lib/adminAuth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const code = url.searchParams.get("code") || undefined;

    const allowed = requireAdminFromHeader(request) || isValidAdminCode(code);
    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const app = await ApplicationModel.findOne({ id }).lean();
    if (!app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const mime = app.paymentProof?.mime;
    const base64 = app.paymentProof?.base64;
    if (!mime || !base64) {
      return NextResponse.json({ error: "No payment proof uploaded" }, { status: 404 });
    }

    const bytes = Buffer.from(base64, "base64");
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Payment proof fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

