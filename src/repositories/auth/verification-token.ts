import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

const TOKEN_EXPIRY_HOURS = 24;

/**
 * Creates a new email verification token.
 * Deletes any existing tokens for the email first.
 */
export async function createEmailVerificationToken(email: string) {
  await prisma.emailVerificationToken.deleteMany({
    where: { email },
  });

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  return prisma.emailVerificationToken.create({
    data: { email, token, expires },
  });
}

/**
 * Finds and validates an email verification token.
 * Returns the token record if valid, null if expired or not found.
 */
export async function findValidVerificationToken(token: string) {
  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!record) return null;

  if (record.expires < new Date()) {
    await prisma.emailVerificationToken.delete({ where: { token } });
    return null;
  }

  return record;
}

/**
 * Deletes a verification token after successful verification.
 */
export async function deleteVerificationToken(token: string) {
  await prisma.emailVerificationToken.delete({ where: { token } });
}

/**
 * Deletes all expired verification tokens (cleanup job).
 */
export async function cleanupExpiredTokens() {
  await prisma.emailVerificationToken.deleteMany({
    where: { expires: { lt: new Date() } },
  });
}
