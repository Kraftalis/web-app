/**
 * Generates a Google Calendar "Add Event" URL.
 * This opens a pre-filled Google Calendar event creation page.
 * No OAuth required — works by URL scheme.
 */
export function buildGoogleCalendarUrl(event: {
  title: string;
  date: string; // ISO date string "2026-03-25"
  time?: string | null; // "10:00" or null
  location?: string | null;
  description?: string | null;
}): string {
  const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";

  // Format dates for Google Calendar (YYYYMMDDTHHmmss)
  const dateObj = new Date(event.date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  let startDate: string;
  let endDate: string;

  if (event.time) {
    // Timed event
    const [h, m] = event.time.split(":").map(Number);
    startDate = `${year}${month}${day}T${String(h).padStart(2, "0")}${String(m).padStart(2, "0")}00`;
    // Default 2-hour duration
    const endH = h + 2;
    endDate = `${year}${month}${day}T${String(endH).padStart(2, "0")}${String(m).padStart(2, "0")}00`;
  } else {
    // All-day event
    startDate = `${year}${month}${day}`;
    // All-day events need next day as end
    const next = new Date(dateObj);
    next.setDate(next.getDate() + 1);
    const ny = next.getFullYear();
    const nm = String(next.getMonth() + 1).padStart(2, "0");
    const nd = String(next.getDate()).padStart(2, "0");
    endDate = `${ny}${nm}${nd}`;
  }

  const params = new URLSearchParams();
  params.set("text", event.title);
  params.set("dates", `${startDate}/${endDate}`);

  if (event.location) params.set("location", event.location);
  if (event.description) params.set("details", event.description);

  return `${base}&${params.toString()}`;
}
