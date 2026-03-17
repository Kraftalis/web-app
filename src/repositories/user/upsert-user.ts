import { prisma } from "@/lib/prisma";

/**
 * Create a new user (credentials sign-up).
 */
export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      status: "PENDING_VERIFICATION",
      role: "USER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });
}

/**
 * Update user profile fields.
 */
export async function updateUserProfile(
  userId: string,
  data: { name?: string; image?: string | null },
) {
  return prisma.user.update({
    where: { id: userId },
    data,
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
 * Verify a user's email address.
 */
export async function verifyUserEmail(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      emailVerified: new Date(),
      status: "ACTIVE",
    },
  });
}

/**
 * Update a user's password hash.
 */
export async function updateUserPassword(userId: string, passwordHash: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}
