import nodemailer from "nodemailer";

/**
 * Pre-configured SMTP transporter.
 * Configured via environment variables.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const FROM_ADDRESS = process.env.SMTP_FROM ?? "noreply@kraftalis.com";
const APP_NAME = "Kraftalis";

export { transporter, FROM_ADDRESS, APP_NAME };
