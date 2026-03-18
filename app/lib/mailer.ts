

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendActivationEmail(to: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const activationUrl = `${baseUrl}/merchant/activate?token=${token}`;

  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME ?? "SchoolPay"}" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject: "Activate your merchant account",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
            <tr>
              <td align="center">
                <table width="520" cellpadding="0" cellspacing="0"
                  style="background:#ffffff;border-radius:12px;overflow:hidden;
                         box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                  <!-- Header -->
                  <tr>
                    <td style="background:#0f172a;padding:32px 40px;">
                      <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;
                                 letter-spacing:-0.5px;">
                        SchoolPay <span style="color:#38bdf8;">Merchant</span>
                      </p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">
                      <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;
                                  color:#0f172a;letter-spacing:-0.5px;">
                        Activate your account
                      </h1>
                      <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#475569;">
                        Thanks for signing up as a merchant. Click the button below to
                        verify your email address and activate your account.
                        This link expires in <strong>24 hours</strong>.
                      </p>
                      <a href="${activationUrl}"
                         style="display:inline-block;background:#0f172a;color:#ffffff;
                                text-decoration:none;padding:14px 28px;border-radius:8px;
                                font-size:15px;font-weight:600;letter-spacing:0.2px;">
                        Activate Account →
                      </a>
                      <p style="margin:32px 0 0;font-size:13px;color:#94a3b8;line-height:1.5;">
                        Or copy this link into your browser:<br/>
                        <span style="color:#0f172a;word-break:break-all;">${activationUrl}</span>
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="padding:20px 40px;border-top:1px solid #f1f5f9;">
                      <p style="margin:0;font-size:12px;color:#cbd5e1;">
                        If you didn't create a merchant account, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}