import { prisma } from "@/lib/prisma";

/**
 * User service — modular data access layer for user operations.
 * All database queries related to users go through here.
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

export async function verifyUserEmail(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      emailVerified: new Date(),
      status: "ACTIVE",
    },
  });
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}

export async function isUserActive(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { status: true },
  });

  return user?.status === "ACTIVE";
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string; image?: string },
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
