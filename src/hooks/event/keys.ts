/**
 * Shared query keys for event-related queries.
 */
export const eventKeys = {
  all: ["events"] as const,
  detail: (id: string) => ["events", id] as const,
  bookingLink: (token: string) => ["booking-link", token] as const,
};
