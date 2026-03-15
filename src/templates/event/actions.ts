"use server";

/**
 * Event server actions — mock stubs (no DB).
 * TODO: Replace with real Prisma calls when backend is ready.
 */

export async function createEventAction(
  _formData: FormData,
): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}

export async function updateEventAction(
  _eventId: string,
  _formData: FormData,
): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}

export async function generateBookingLinkAction(): Promise<{
  success?: boolean;
  token?: string;
  error?: string;
}> {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const token = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return { success: true, token };
}
