export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { sendSmtpMail } from "../../../lib/smtp";
import { saveLead } from "../../../lib/leadStorage";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

/**
 * In-memory rate limiter per IP address using x-real-ip header (fallback 'unknown').
 * Allows at most 5 submissions per 10-minute window.
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  // Prune expired entries to maintain bounded memory
  if (rateLimitMap.size > 500) {
    for (const [key, entry] of rateLimitMap.entries()) {
      if (entry.resetAt <= now) {
        rateLimitMap.delete(key);
      }
    }
  }

  const record = rateLimitMap.get(ip);
  if (!record || record.resetAt <= now) {
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

/**
 * Escapes characters to prevent HTML injection in email templates.
 */
function escapeHtml(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function GET() {
  return NextResponse.json(
    { success: false, message: "Method Not Allowed" },
    { status: 405 }
  );
}

export async function POST(req: Request) {
  try {
    // 1. Rate limiting by IP (x-real-ip header with fallback 'unknown')
    const clientIp = (req.headers.get("x-real-ip") || "unknown").trim();
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
        },
        { status: 429 }
      );
    }

    // 2. Validate JSON payload
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const {
      name,
      mobile,
      phone,
      email,
      message,
      groups,
      source,
      website_alt,
      company_alt,
      phone_alt,
    } = body;

    // 3. Honeypot check for automated bots
    const honeypot = website_alt || company_alt || phone_alt;
    if (honeypot && String(honeypot).trim() !== "") {
      return NextResponse.json({
        success: true,
        message: "Message processed successfully",
      });
    }

    // 4. Validate and trim inputs
    const rawName = typeof name === "string" ? name.trim() : "";
    const rawMobile = typeof (mobile || phone) === "string" ? String(mobile || phone).trim() : "";
    const cleanMobileDigits = rawMobile.replace(/\D/g, "");
    const cleanEmail = typeof email === "string" ? email.trim() : "";
    const cleanMessage = typeof message === "string" ? message.trim() : "";
    const cleanGroups = typeof groups === "string" ? groups.trim() : "";
    const leadSource = typeof source === "string" ? source.trim() : "Website Contact Form";

    // Length and format validation
    if (rawName.length < 2 || rawName.length > 100) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid name (2-100 characters)." },
        { status: 400 }
      );
    }

    // Accept 10 digits or 12 digits starting with country code 91
    let cleanMobile = cleanMobileDigits;
    if (cleanMobile.length === 12 && cleanMobile.startsWith("91")) {
      cleanMobile = cleanMobile.slice(2);
    }

    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    if (cleanEmail) {
      if (cleanEmail.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return NextResponse.json(
          { success: false, message: "Please provide a valid email address." },
          { status: 400 }
        );
      }
    }

    if (cleanMessage.length > 2000) {
      return NextResponse.json(
        { success: false, message: "Message cannot exceed 2000 characters." },
        { status: 400 }
      );
    }

    if (cleanGroups.length > 100) {
      return NextResponse.json(
        { success: false, message: "Groups input exceeds allowed length." },
        { status: 400 }
      );
    }

    if (leadSource.length > 150) {
      return NextResponse.json(
        { success: false, message: "Source input exceeds allowed length." },
        { status: 400 }
      );
    }

    // 5. IST Formatted Timestamp
    const now = new Date();
    const istTime = now.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    });

    const isMessageForm = Boolean(cleanMessage || cleanEmail);
    const safeHeaderName = rawName.replace(/[\r\n]+/g, " ");
    const safeHeaderMobile = cleanMobile.replace(/[\r\n]+/g, " ");

    const subject = isMessageForm
      ? `💬 Naya Sandesh: ${safeHeaderName} (${safeHeaderMobile}) - KametiPro`
      : `🔥 Nayi Demo Enquiry: ${safeHeaderName} (${safeHeaderMobile}) - KametiPro`;

    const waLink = `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(
      `Namaste ${rawName} ji, Digi India Solutions (KametiPro) se sampark karne ke liye dhanyawad.`
    )}`;

    // 6. Escape all dynamic variables to prevent HTML injection in email
    const safeNameHtml = escapeHtml(rawName);
    const safeMobileHtml = escapeHtml(cleanMobile);
    const safeEmailHtml = escapeHtml(cleanEmail);
    const safeMessageHtml = escapeHtml(cleanMessage);
    const safeGroupsHtml = escapeHtml(cleanGroups);
    const safeSourceHtml = escapeHtml(leadSource);
    const safeTimeHtml = escapeHtml(istTime);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isMessageForm ? "Naya Customer Sandesh" : "Nayi Demo Enquiry"}</title>
</head>
<body style="margin:0;padding:0;background-color:#F0F4FA;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F0F4FA;padding:30px 10px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 30px rgba(17,27,62,0.12);border:1px solid #E2E8F0;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0F1B2D 0%,#1B2E6A 100%);padding:30px;text-align:left;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="display:inline-block;padding:4px 10px;background:rgba(245,165,36,0.2);border:1px solid #F5A524;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1px;color:#F5A524;text-transform:uppercase;margin-bottom:10px;">
                      Digi India Solutions • KametiPro
                    </span>
                    <h1 style="margin:0;font-size:23px;color:#ffffff;font-weight:700;line-height:1.3;">
                      ${isMessageForm ? "💬 Naya Message Prapt Hua Hai!" : "🎉 Nayi Demo Enquiry Prapt Hui!"}
                    </h1>
                    <p style="margin:6px 0 0 0;font-size:13px;color:#C9D4F5;">
                      Source: <strong>${safeSourceHtml}</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding:32px 30px 24px 30px;">
              <p style="margin:0 0 20px 0;font-size:15px;color:#334155;line-height:1.5;">
                KametiPro landing page par ek naye customer ne aapse sampark kiya hai. Details neeche di gayi hain:
              </p>

              <!-- Lead Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;margin-bottom:24px;border-collapse:collapse;">
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;font-size:14px;color:#64748B;width:34%;font-weight:600;">
                    👤 Grahak Ka Naam:
                  </td>
                  <td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;font-size:16px;color:#0F1B2D;font-weight:700;">
                    ${safeNameHtml}
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;font-size:14px;color:#64748B;font-weight:600;">
                    📞 Mobile Number:
                  </td>
                  <td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;font-size:16px;color:#0F1B2D;font-weight:700;">
                    <a href="tel:+91${safeMobileHtml}" style="color:#2563EB;text-decoration:none;">+91 ${safeMobileHtml}</a>
                  </td>
                </tr>
                ${
                  safeEmailHtml
                    ? `
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;font-size:14px;color:#64748B;font-weight:600;">
                    ✉️ Email Address:
                  </td>
                  <td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;font-size:15px;color:#0F1B2D;font-weight:600;">
                    <a href="mailto:${safeEmailHtml}" style="color:#2563EB;text-decoration:none;">${safeEmailHtml}</a>
                  </td>
                </tr>`
                    : ""
                }
                ${
                  safeGroupsHtml
                    ? `
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;font-size:14px;color:#64748B;font-weight:600;">
                    👥 Kameti Groups:
                  </td>
                  <td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;font-size:15px;color:#0F1B2D;font-weight:600;">
                    ${safeGroupsHtml}
                  </td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding:14px 18px;font-size:14px;color:#64748B;font-weight:600;">
                    ⏰ Samay (IST):
                  </td>
                  <td style="padding:14px 18px;font-size:14px;color:#334155;">
                    ${safeTimeHtml}
                  </td>
                </tr>
              </table>

              ${
                safeMessageHtml
                  ? `
              <!-- Customer Message Box -->
              <div style="margin-bottom:26px;">
                <label style="display:block;font-size:14px;font-weight:700;color:#0F1B2D;margin-bottom:8px;">
                  💬 Grahak Ka Sandesh (Message):
                </label>
                <div style="background:#EEF2FF;border-left:4px solid #3B4FD8;padding:16px 20px;border-radius:0 8px 8px 0;font-size:15px;color:#1E293B;line-height:1.6;white-space:pre-wrap;">${safeMessageHtml}</div>
              </div>`
                  : ""
              }

              <!-- Action Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:4px;" width="50%">
                    <a href="tel:+91${safeMobileHtml}" style="display:block;box-sizing:border-box;background:#0F1B2D;color:#ffffff;text-align:center;padding:13px 16px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">
                      📞 Direct Call Karein
                    </a>
                  </td>
                  <td style="padding:4px;" width="50%">
                    <a href="${waLink}" target="_blank" style="display:block;box-sizing:border-box;background:#25D366;color:#ffffff;text-align:center;padding:13px 16px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">
                      💬 WhatsApp Karein
                    </a>
                  </td>
                </tr>
                ${
                  safeEmailHtml
                    ? `
                <tr>
                  <td colspan="2" style="padding:4px;">
                    <a href="mailto:${safeEmailHtml}?subject=${encodeURIComponent("Re: KametiPro Demo Enquiry")}" style="display:block;box-sizing:border-box;background:#3B4FD8;color:#ffffff;text-align:center;padding:13px 16px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">
                      ✉️ Customer Ko Email Par Reply Karein
                    </a>
                  </td>
                </tr>`
                    : ""
                }
              </table>

              <p style="margin:0;font-size:13px;color:#64748B;line-height:1.5;">
                <em>Yeh email automated KametiPro website notification system dwara bheji gayi hai.</em>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F8FAFC;border-top:1px solid #E2E8F0;padding:18px 30px;text-align:center;">
              <span style="font-size:12px;color:#94A3B8;">
                © Digi India Solutions | KametiPro Software • Sector 24, Rohini, Delhi
              </span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    // 7. Attempt SMTP Email Dispatch
    let emailSent = false;
    let emailError = "";
    let messageId = "";

    try {
      const mailResult = await sendSmtpMail({
        subject,
        replyTo: cleanEmail || undefined,
        html,
        text: `Naya Message/Enquiry:\nNaam: ${rawName}\nMobile: ${cleanMobile}\nEmail: ${cleanEmail || "N/A"}\nMessage: ${cleanMessage || "N/A"}\nGroups: ${cleanGroups || "N/A"}\nSource: ${leadSource}\nTime: ${istTime}`,
      });
      emailSent = true;
      messageId = mailResult.messageId;
    } catch (smtpErr: unknown) {
      const errMessage = smtpErr instanceof Error ? smtpErr.message : String(smtpErr);

      // Explicit requirement: if mail env variables are missing, return 500 without leaking details
      if (errMessage.includes("Missing mail env variables")) {
        console.error("Mail configuration error:", errMessage);
        return NextResponse.json(
          { success: false, message: "Email service not configured" },
          { status: 500 }
        );
      }

      emailError = errMessage;
      console.warn("⚠️ SMTP dispatch error (lead will still be saved locally):", emailError);
    }

    // 8. Persist lead safely to local storage
    const savedRecord = saveLead({
      name: rawName,
      mobile: cleanMobile,
      email: cleanEmail || undefined,
      message: cleanMessage || undefined,
      groups: cleanGroups || undefined,
      source: leadSource,
      emailSent,
      emailError: emailError || undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Message processed successfully",
      leadId: savedRecord.id,
      emailSent,
      messageId: messageId || undefined,
    });
  } catch (error: unknown) {
    console.error("Critical error processing contact request:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process enquiry",
      },
      { status: 500 }
    );
  }
}
