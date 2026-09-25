import { NextResponse } from "next/server";
import { sendSmtpMail } from "../../../lib/smtp";
import { saveLead, getLeads } from "../../../lib/leadStorage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const leads = getLeads();
  return NextResponse.json({
    status: "ok",
    service: "KametiPro SMTP Email Service",
    provider: "smtp.gmail.com",
    port: 465,
    totalLeadsSaved: leads.length,
    recentLeads: leads.slice(0, 10),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const { name, mobile, email, message, groups, source, website_alt } = body;

    // Honeypot check for spam bots
    if (website_alt && String(website_alt).trim() !== "") {
      return NextResponse.json({ success: true, message: "OK" });
    }

    // Validation
    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanMobile = typeof mobile === "string" ? mobile.trim().replace(/\D/g, "") : "";
    const cleanEmail = typeof email === "string" ? email.trim() : "";
    const cleanMessage = typeof message === "string" ? message.trim() : "";
    const cleanGroups = typeof groups === "string" ? groups.trim() : "";
    const leadSource = typeof source === "string" ? source : "Website Contact Form";

    if (cleanName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Apna sahi naam likhiye." },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      return NextResponse.json(
        { success: false, error: "10 digit ka sahi mobile number daaliye." },
        { status: 400 }
      );
    }

    // IST Formatted Timestamp
    const now = new Date();
    const istTime = now.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    });

    const isMessageForm = Boolean(cleanMessage || cleanEmail);
    const waLink = `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(
      `Namaste ${cleanName} ji, Digi India Solutions (KametiPro) se sampark karne ke liye dhanyawad.`
    )}`;

    const subject = isMessageForm
      ? `💬 Naya Sandesh: ${cleanName} (${cleanMobile}) - KametiPro`
      : `🔥 Nayi Demo Enquiry: ${cleanName} (${cleanMobile}) - KametiPro`;

    // Professional HTML Email Template
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
                      Source: <strong>${leadSource}</strong>
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
                    ${cleanName}
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;font-size:14px;color:#64748B;font-weight:600;">
                    📞 Mobile Number:
                  </td>
                  <td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;font-size:16px;color:#0F1B2D;font-weight:700;">
                    <a href="tel:+91${cleanMobile}" style="color:#2563EB;text-decoration:none;">+91 ${cleanMobile}</a>
                  </td>
                </tr>
                ${
                  cleanEmail
                    ? `
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;font-size:14px;color:#64748B;font-weight:600;">
                    ✉️ Email Address:
                  </td>
                  <td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;font-size:15px;color:#0F1B2D;font-weight:600;">
                    <a href="mailto:${cleanEmail}" style="color:#2563EB;text-decoration:none;">${cleanEmail}</a>
                  </td>
                </tr>`
                    : ""
                }
                ${
                  cleanGroups
                    ? `
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;font-size:14px;color:#64748B;font-weight:600;">
                    👥 Kameti Groups:
                  </td>
                  <td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;font-size:15px;color:#0F1B2D;font-weight:600;">
                    ${cleanGroups}
                  </td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding:14px 18px;font-size:14px;color:#64748B;font-weight:600;">
                    ⏰ Samay (IST):
                  </td>
                  <td style="padding:14px 18px;font-size:14px;color:#334155;">
                    ${istTime}
                  </td>
                </tr>
              </table>

              ${
                cleanMessage
                  ? `
              <!-- Customer Message Box -->
              <div style="margin-bottom:26px;">
                <label style="display:block;font-size:14px;font-weight:700;color:#0F1B2D;margin-bottom:8px;">
                  💬 Grahak Ka Sandesh (Message):
                </label>
                <div style="background:#EEF2FF;border-left:4px solid #3B4FD8;padding:16px 20px;border-radius:0 8px 8px 0;font-size:15px;color:#1E293B;line-height:1.6;white-space:pre-wrap;">${cleanMessage}</div>
              </div>`
                  : ""
              }

              <!-- Action Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:4px;" width="50%">
                    <a href="tel:+91${cleanMobile}" style="display:block;box-sizing:border-box;background:#0F1B2D;color:#ffffff;text-align:center;padding:13px 16px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">
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
                  cleanEmail
                    ? `
                <tr>
                  <td colspan="2" style="padding:4px;">
                    <a href="mailto:${cleanEmail}?subject=${encodeURIComponent("Re: KametiPro Demo Enquiry")}" style="display:block;box-sizing:border-box;background:#3B4FD8;color:#ffffff;text-align:center;padding:13px 16px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">
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
    `;

    // 1. ALWAYS Save lead locally first so it is never lost!
    let emailSent = false;
    let emailError = "";
    let messageId = "";

    // 2. Attempt SMTP Email Dispatch
    try {
      const mailResult = await sendSmtpMail({
        subject,
        replyTo: cleanEmail || undefined,
        html,
        text: `Naya Message/Enquiry:\nNaam: ${cleanName}\nMobile: ${cleanMobile}\nEmail: ${cleanEmail || "N/A"}\nMessage: ${cleanMessage || "N/A"}\nGroups: ${cleanGroups || "N/A"}\nSource: ${leadSource}\nTime: ${istTime}`,
      });
      emailSent = true;
      messageId = mailResult.messageId;
    } catch (smtpErr: any) {
      emailError = smtpErr?.message || String(smtpErr);
      console.warn("⚠️ SMTP warning (Lead is still safely saved locally):", emailError);
    }

    // Persist lead with status
    const savedRecord = saveLead({
      name: cleanName,
      mobile: cleanMobile,
      email: cleanEmail,
      message: cleanMessage,
      groups: cleanGroups,
      source: leadSource,
      emailSent,
      emailError: emailError || undefined,
    });

    // Return success to the user so the customer gets a smooth confirmation!
    return NextResponse.json({
      success: true,
      message: "Message processed successfully",
      leadId: savedRecord.id,
      emailSent,
      smtpWarning: emailError ? "Google SMTP credentials need update" : undefined,
      messageId: messageId || undefined,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("Critical error processing lead:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Message submit error",
        details: errorMsg,
      },
      { status: 500 }
    );
  }
}
