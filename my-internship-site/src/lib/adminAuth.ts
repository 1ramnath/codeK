import { NextRequest } from "next/server";

export function expectedAdminAccessCode(): string {
  return process.env.ADMIN_ACCESS_CODE || "access123";
}

export function isValidAdminCode(code: string | null | undefined): boolean {
  if (!code) return false;
  return code === expectedAdminAccessCode();
}

export function requireAdminFromHeader(request: NextRequest): boolean {
  const headerCode = request.headers.get("x-admin-code") || request.headers.get("authorization");
  const code = headerCode?.startsWith("Bearer ") ? headerCode.slice("Bearer ".length) : headerCode;
  return isValidAdminCode(code);
}

