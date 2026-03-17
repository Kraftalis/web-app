import api from "@/services/api-client";
import type { ApiResponse } from "@/lib/api/types";
import type {
  EventDetail,
  CreateEventPayload,
  UpdateEventPayload,
  BookingSubmitPayload,
  BookingSubmitResponse,
  GenerateBookingLinkResponse,
} from "./types";

/**
 * Create a new event (vendor side).
 */
export async function createEvent(
  payload: CreateEventPayload,
): Promise<EventDetail> {
  const { data } = await api.post<ApiResponse<EventDetail>>("/events", payload);
  return data.data!;
}

/**
 * Update an existing event.
 */
export async function updateEvent(
  id: string,
  payload: UpdateEventPayload,
): Promise<EventDetail> {
  const { data } = await api.put<ApiResponse<EventDetail>>(
    `/events/${id}`,
    payload,
  );
  return data.data!;
}

/**
 * Delete an event.
 */
export async function deleteEvent(id: string): Promise<void> {
  await api.delete(`/events/${id}`);
}

/**
 * Generate a new booking link.
 */
export async function generateBookingLink(): Promise<GenerateBookingLinkResponse> {
  const { data } = await api.post<ApiResponse<GenerateBookingLinkResponse>>(
    "/events/booking-link",
  );
  return data.data!;
}

/**
 * Submit a booking form (public — client side).
 */
export async function submitBooking(
  payload: BookingSubmitPayload,
): Promise<BookingSubmitResponse> {
  const { data } = await api.post<ApiResponse<BookingSubmitResponse>>(
    "/booking",
    payload,
  );
  return data.data!;
}
