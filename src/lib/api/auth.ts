import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unauthorizedError, forbiddenError } from "./response";

/**
 * Extract and verify the authenticated user from the session.
 * Returns the user ID or a 401 error response.
 */
export async function requireAuth(): Promise<
  | { userId: string; error?: never }
  | { userId?: never; error: ReturnType<typeof unauthorizedError> }
> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: unauthorizedError() };
  }

  return { userId: session.user.id };
}

/**
 * Resolve the authenticated user's business profile ID.
 * Returns userId + businessProfileId, or an error if not found.
 */
export async function requireBusinessProfile(): Promise<
  | { userId: string; businessProfileId: string; error?: never }
  | {
      userId?: never;
      businessProfileId?: never;
      error: ReturnType<typeof unauthorizedError | typeof forbiddenError>;
    }
> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: unauthorizedError() };
  }

  const profile = await prisma.businessProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!profile) {
    return {
      error: forbiddenError(
        "Business profile not found. Complete onboarding first.",
      ),
    };
  }

  return { userId: session.user.id, businessProfileId: profile.id };
}
