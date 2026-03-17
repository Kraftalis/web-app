import { transporter, FROM_ADDRESS, APP_NAME } from "../transporter";

/**
 * Sends an email verification link to the user.
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
  name?: string | null,
) {
  const baseUrl = process.env.AUTH_URL ?? "http://localhost:3000";
  const verifyUrl = `${baseUrl}/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
              <!-- Header -->
              <tr>
                <td style="padding:32px 32px 0;text-align:center;">
                  <h1 style="margin:0;font-size:24px;font-weight:700;color:#0f172a;letter-spacing:-0.025em;">
                    ${APP_NAME}
                  </h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:24px 32px 32px;">
                  <p style="margin:0 0 16px;font-size:15px;color:#334155;line-height:1.6;">
                    Hi${name ? ` ${name}` : ""},
                  </p>
                  <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.6;">
                    Thanks for signing up! Please verify your email address by clicking the button below.
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${verifyUrl}" target="_blank"
                          style="display:inline-block;padding:12px 32px;background-color:#2563eb;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
                          Verify Email Address
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;line-height:1.6;">
                    This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
                  </p>
                  <hr style="margin:24px 0;border:none;border-top:1px solid #e2e8f0;" />
                  <p style="margin:0;font-size:12px;color:#cbd5e1;line-height:1.5;">
                    If the button doesn't work, copy and paste this link into your browser:<br/>
                    <a href="${verifyUrl}" style="color:#2563eb;word-break:break-all;">${verifyUrl}</a>
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:0 32px 24px;text-align:center;">
                  <p style="margin:0;font-size:11px;color:#cbd5e1;">
                    &copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"${APP_NAME}" <${FROM_ADDRESS}>`,
    to: email,
    subject: `Verify your email — ${APP_NAME}`,
    html,
  });
}
