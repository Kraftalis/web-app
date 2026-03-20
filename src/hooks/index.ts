// ─── Event hooks ────────────────────────────────────────────
export {
  eventKeys,
  useEvents,
  useEventDetail,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  useBookingLink,
  useGenerateBookingLink,
  useSubmitBooking,
} from "./event";

// ─── Pricing hooks ──────────────────────────────────────────
export {
  pricingKeys,
  usePricing,
  useAddOns,
  useCategories,
  useCreatePackage,
  useUpdatePackage,
  useDeletePackage,
  useCreateAddOn,
  useUpdateAddOn,
  useDeleteAddOn,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCreateSubcategory,
  useUpdateSubcategory,
  useDeleteSubcategory,
} from "./pricing";

// ─── User hooks ─────────────────────────────────────────────
export { userKeys, useProfile, useUpdateProfile } from "./user";
