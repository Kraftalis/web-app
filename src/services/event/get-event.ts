import api from "@/services/api-client";
import type { ApiResponse } from "@/lib/api/types";
import type { EventItem, EventDetail, BookingLinkData } from "./types";

/**
 * Fetch all events for the current vendor.
 */
export async function getEvents(): Promise<EventItem[]> {
  const { data } = await api.get<ApiResponse<EventItem[]>>("/events");
  return data.data!;
}

/**
 * Fetch a single event by ID with full details.
 */
export async function getEventById(id: string): Promise<EventDetail> {
  const { data } = await api.get<ApiResponse<EventDetail>>(`/events/${id}`);
  return data.data!;
}

/**
 * Fetch booking link info (public — no auth needed).
 */
export async function getBookingLink(
  token: string,
): Promise<BookingLinkData | null> {
  const { data } = await api.get<ApiResponse<BookingLinkData | null>>(
    `/events/booking-link?token=${token}`,
  );
  return data.data ?? null;
}
