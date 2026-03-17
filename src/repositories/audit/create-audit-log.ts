import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

/**
 * Audit action types for security event logging.
 */
export type AuditAction =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "LOGOUT"
  | "REGISTER"
  | "EMAIL_VERIFICATION_SENT"
  | "EMAIL_VERIFIED"
  | "PASSWORD_RESET_REQUEST"
  | "PASSWORD_RESET_COMPLETE"
  | "ACCOUNT_LINKED"
  | "ACCOUNT_SUSPENDED"
  | "ACCOUNT_REACTIVATED"
  | "SESSION_CREATED"
  | "SESSION_EXPIRED";

interface CreateAuditLogParams {
  userId?: string | null;
  action: AuditAction;
  metadata?: Record<string, unknown>;
}

/**
 * Extracts client IP and user-agent from request headers.
 */
async function getRequestContext() {
  try {
    const headersList = await headers();
    const ipAddress =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headersList.get("x-real-ip") ??
      "unknown";
    const userAgent = headersList.get("user-agent") ?? "unknown";
    return { ipAddress, userAgent };
  } catch {
    return { ipAddress: "unknown", userAgent: "unknown" };
  }
}

/**
 * Create an immutable audit log entry.
 */
export async function createAuditLog(params: CreateAuditLogParams) {
  const { ipAddress, userAgent } = await getRequestContext();

  return prisma.auditLog.create({
    data: {
      userId: params.userId ?? null,
      action: params.action,
      ipAddress,
      userAgent,
      metadata: (params.metadata as object) ?? undefined,
    },
  });
}
