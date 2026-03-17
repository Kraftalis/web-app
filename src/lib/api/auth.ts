import { auth } from "@/lib/auth";
import { unauthorizedError } from "./response";

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
