import { prisma } from "@/lib/prisma";

/**
 * Delete a package and all its items (cascade).
 */
export async function deletePackage(id: string) {
  return prisma.package.delete({ where: { id } });
}
