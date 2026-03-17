import { prisma } from "@/lib/prisma";

/**
 * Find a user by email (for auth).
 */
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      passwordHash: true,
      role: true,
      status: true,
      emailVerified: true,
    },
  });
}

/**
 * Find a user by ID (for profile).
 */
export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
    },
  });
}

/**
 * Check if a user's status is active.
 */
export async function isUserActive(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { status: true },
  });
  return user?.status === "ACTIVE";
}
