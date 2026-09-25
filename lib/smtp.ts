import tls from "tls";

interface SendMailOptions {
  to?: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
}

export interface MailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromName?: string;
}

export function getMailConfig(): MailConfig {
  const host = process.env.MAIL_EMAIL_HOST || "smtp.hostinger.com";
  const port = parseInt(process.env.MAIL_EMAIL_PORT || "465", 10);
  const user = process.env.MAIL_EMAIL_ID || "info@digiindiasolutions.com";
  // Strip surrounding quotes and outer spaces, keep hyphens/internal chars intact
  const rawPass = process.env.MAIL_EMAIL_PASSWORD || "eshj-o3oo-hycv-mvdw";
  const pass = rawPass.replace(/^["']|["']$/g, "").trim();

  return {
    host,
    port,
    user,
    pass,
    fromName: "Digi India Solutions | KametiPro",
  };
}

/**
 * Sends an email using pure Node.js TLS socket over port 465 (SMTPS).
 * Requires zero external dependencies (no separate backend or nodemailer needed).
 */
export async function sendSmtpMail(options: SendMailOptions): Promise<{ success: boolean; messageId: string }> {
  const config = getMailConfig();
  const recipient = options.to || process.env.MAIL_TO_EMAIL || config.user;

  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      {
        host: config.host,
        port: config.port,
        rejectUnauthorized: false,
        timeout: 15000,
      },
      () => {
        // Socket connected
      }
    );

    let buffer = "";
    let step = 0;
    const senderDomain = config.user.split("@")[1] || "digiindiasolutions.com";
    const messageId = `<${Date.now()}.${Math.random().toString(36).slice(2)}@${senderDomain}>`;

    const timeoutId = setTimeout(() => {
      socket.destroy();
      reject(new Error("SMTP connection timed out after 15 seconds"));
    }, 15000);

    const cleanUp = () => {
      clearTimeout(timeoutId);
      socket.removeAllListeners();
      socket.destroy();
    };

    socket.on("error", (err) => {
      cleanUp();
      reject(err);
    });

    socket.on("timeout", () => {
      cleanUp();
      reject(new Error("SMTP socket timeout"));
    });

    socket.on("data", (data) => {
      buffer += data.toString("utf-8");

      // SMTP responses can be multiline.
      // The final line of an SMTP reply begins with 3 digits followed by a space (e.g. "250 OK\r\n").
      // Intermediate lines have a hyphen (e.g. "250-SIZE 35882577\r\n").
      const lines = buffer.split(/\r?\n/);
      const lastLine = lines[lines.length - 2] ?? "";

      const match = lastLine.match(/^(\d{3})\s(.*)$/);
      if (!match) {
        return; // Wait for complete response
      }

      const statusCode = parseInt(match[1], 10);
      buffer = ""; // reset buffer for next command response

      // Check for error status codes
      if (statusCode >= 400 && statusCode < 600) {
        cleanUp();
        return reject(new Error(`SMTP Error (${statusCode}): ${match[2]}`));
      }

      try {
        switch (step) {
          case 0:
            // 220 Server Greeting received
            if (statusCode === 220) {
              step = 1;
              socket.write("EHLO digiindiasolutions.com\r\n");
            }
            break;

          case 1:
            // 250 EHLO response received
            if (statusCode === 250) {
              step = 2;
              socket.write("AUTH LOGIN\r\n");
            }
            break;

          case 2:
            // 334 Username challenge received
            if (statusCode === 334) {
              step = 3;
              const encodedUser = Buffer.from(config.user).toString("base64");
              socket.write(`${encodedUser}\r\n`);
            }
            break;

          case 3:
            // 334 Password challenge received
            if (statusCode === 334) {
              step = 4;
              const encodedPass = Buffer.from(config.pass).toString("base64");
              socket.write(`${encodedPass}\r\n`);
            }
            break;

          case 4:
            // 235 Authentication successful
            if (statusCode === 235) {
              step = 5;
              socket.write(`MAIL FROM:<${config.user}>\r\n`);
            }
            break;

          case 5:
            // 250 MAIL FROM ok
            if (statusCode === 250) {
              step = 6;
              socket.write(`RCPT TO:<${recipient}>\r\n`);
            }
            break;

          case 6:
            // 250 RCPT TO ok
            if (statusCode === 250) {
              step = 7;
              socket.write("DATA\r\n");
            }
            break;

          case 7:
            // 354 Start mail input
            if (statusCode === 354) {
              step = 8;
              const encodedSubject = `=?UTF-8?B?${Buffer.from(options.subject, "utf-8").toString("base64")}?=`;
              const headerLines = [
                `From: "${config.fromName}" <${config.user}>`,
                `To: <${recipient}>`,
                options.replyTo ? `Reply-To: <${options.replyTo}>` : null,
                `Subject: ${encodedSubject}`,
                `Date: ${new Date().toUTCString()}`,
                `Message-ID: ${messageId}`,
                `MIME-Version: 1.0`,
                `Content-Type: text/html; charset=UTF-8`,
              ].filter(Boolean);

              const headers = headerLines.join("\r\n") + "\r\n\r\n";
              const normalizedHtml = options.html.replace(/\r?\n/g, "\r\n");
              const body = normalizedHtml + "\r\n.\r\n";

              socket.write(headers + body);
            }
            break;

          case 8:
            // 250 Message accepted for delivery
            if (statusCode === 250) {
              step = 9;
              socket.write("QUIT\r\n");
            }
            break;

          case 9:
            // 221 Bye
            cleanUp();
            resolve({ success: true, messageId });
            break;

          default:
            cleanUp();
            resolve({ success: true, messageId });
            break;
        }
      } catch (err) {
        cleanUp();
        reject(err);
      }
    });
  });
}
