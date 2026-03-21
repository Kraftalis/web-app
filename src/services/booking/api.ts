import api from "@/services/api-client";
import type { ApiResponse } from "@/lib/api/types";
import type {
  BookingLinkItem,
  CreateBookingLinkPayload,
  CreateBookingLinkResponse,
} from "./types";

/**
 * Fetch all booking links for the current vendor.
 */
export async function getBookingLinks(): Promise<BookingLinkItem[]> {
  const { data } =
    await api.get<ApiResponse<BookingLinkItem[]>>("/booking/links");
  return data.data!;
}

/**
 * Create a new booking link with snapshot data.
 */
export async function createBookingLink(
  payload: CreateBookingLinkPayload,
): Promise<CreateBookingLinkResponse> {
  const { data } = await api.post<ApiResponse<CreateBookingLinkResponse>>(
    "/booking/links",
    payload,
  );
  return data.data!;
}
