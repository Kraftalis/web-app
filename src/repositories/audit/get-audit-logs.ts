import { prisma } from "@/lib/prisma";

/**
 * Fetch audit logs for a specific user (paginated).
 */
export async function getAuditLogsByUserId(
  userId: string,
  options?: { limit?: number; offset?: number },
) {
  return prisma.auditLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: options?.limit ?? 50,
    skip: options?.offset ?? 0,
  });
}
