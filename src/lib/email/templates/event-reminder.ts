import { transporter, FROM_ADDRESS, APP_NAME } from "../transporter";

interface EventReminder {
  clientName: string;
  eventType: string;
  eventDate: string; // formatted date string
  eventTime?: string | null;
  eventLocation?: string | null;
  packageName?: string | null;
}

/**
 * Sends a reminder email to a client for their upcoming event.
 */
export async function sendClientEventReminder(
  email: string,
  event: EventReminder,
  daysUntil: number,
) {
  const subject =
    daysUntil === 0
      ? `🎉 Today is the day! Your ${event.eventType} event`
      : `⏰ Reminder: Your ${event.eventType} event is tomorrow`;

  const timeNote = event.eventTime ? `at ${event.eventTime}` : "";
  const locationNote = event.eventLocation
    ? `<br/>📍 ${event.eventLocation}`
    : "";

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
    <body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
        <tr><td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
            <tr><td style="padding:32px 32px 0;text-align:center;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#0f172a;">${APP_NAME}</h1>
            </td></tr>
            <tr><td style="padding:24px 32px 32px;">
              <p style="margin:0 0 16px;font-size:15px;color:#334155;">Hi ${event.clientName},</p>
              <p style="margin:0 0 8px;font-size:15px;color:#334155;">
                ${daysUntil === 0 ? "Today is your event day! 🎉" : "This is a friendly reminder that your event is tomorrow."}
              </p>
              <div style="margin:16px 0;padding:16px;background-color:#f0f9ff;border-radius:12px;border:1px solid #bae6fd;">
                <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#0369a1;">📅 ${event.eventDate} ${timeNote}</p>
                <p style="margin:0 0 4px;font-size:14px;color:#0c4a6e;">🎊 ${event.eventType}</p>
                ${event.packageName ? `<p style="margin:0 0 4px;font-size:14px;color:#0c4a6e;">📦 ${event.packageName}</p>` : ""}
                ${locationNote ? `<p style="margin:0;font-size:14px;color:#0c4a6e;">${locationNote}</p>` : ""}
              </div>
              <p style="margin:16px 0 0;font-size:13px;color:#94a3b8;">If you have any questions, please contact your vendor directly.</p>
            </td></tr>
            <tr><td style="padding:0 32px 24px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#cbd5e1;">&copy; ${new Date().getFullYear()} ${APP_NAME}</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"${APP_NAME}" <${FROM_ADDRESS}>`,
    to: email,
    subject,
    html,
  });
}

/**
 * Sends a consolidated reminder email to a vendor about all their upcoming events.
 */
export async function sendVendorEventsReminder(
  email: string,
  vendorName: string,
  events: EventReminder[],
  daysUntil: number,
) {
  const subject =
    daysUntil === 0
      ? `🎉 You have ${events.length} event${events.length > 1 ? "s" : ""} today!`
      : `⏰ You have ${events.length} event${events.length > 1 ? "s" : ""} tomorrow`;

  const eventRows = events
    .map(
      (e) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;">
          <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#0f172a;">${e.clientName}</p>
          <p style="margin:0 0 2px;font-size:13px;color:#475569;">🎊 ${e.eventType}${e.eventTime ? ` — ${e.eventTime}` : ""}</p>
          ${e.eventLocation ? `<p style="margin:0;font-size:13px;color:#64748b;">📍 ${e.eventLocation}</p>` : ""}
          ${e.packageName ? `<p style="margin:0;font-size:12px;color:#94a3b8;">📦 ${e.packageName}</p>` : ""}
        </td>
      </tr>`,
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
    <body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
        <tr><td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
            <tr><td style="padding:32px 32px 0;text-align:center;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#0f172a;">${APP_NAME}</h1>
            </td></tr>
            <tr><td style="padding:24px 32px 32px;">
              <p style="margin:0 0 16px;font-size:15px;color:#334155;">Hi ${vendorName},</p>
              <p style="margin:0 0 16px;font-size:15px;color:#334155;">
                ${daysUntil === 0 ? "Here are your events for <strong>today</strong>:" : "Here are your events for <strong>tomorrow</strong>:"}
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                ${eventRows}
              </table>
              <p style="margin:16px 0 0;font-size:13px;color:#94a3b8;">Make sure everything is prepared. Good luck! 🚀</p>
            </td></tr>
            <tr><td style="padding:0 32px 24px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#cbd5e1;">&copy; ${new Date().getFullYear()} ${APP_NAME}</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"${APP_NAME}" <${FROM_ADDRESS}>`,
    to: email,
    subject,
    html,
  });
}
