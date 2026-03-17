import { prisma } from "@/lib/prisma";

/**
 * Delete an add-on by ID.
 */
export async function deleteAddOn(id: string) {
  return prisma.addOn.delete({ where: { id } });
}
