import "server-only";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export interface SendMailOptions {
  from?: string;
  to?: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
}

export interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
  fromName?: string;
  missing: string[];
}

/**
 * Reads mail configuration strictly from environment variables without any hardcoded credentials or fallbacks.
 * Primary variables:
 * - MAIL_HOST
 * - MAIL_PORT
 * - MAIL_SECURE
 * - MAIL_EMAIL (login user)
 * - MAIL_EMAIL_PASSWORD
 * - MAIL_FROM (default MAIL_EMAIL)
 * - MAIL_TO (where enquiries go)
 *
 * Supported backwards-compatible aliases:
 * - MAIL_EMAIL_HOST (alias for MAIL_HOST)
 * - MAIL_EMAIL_PORT (alias for MAIL_PORT)
 * - MAIL_EMAIL_ID (alias for MAIL_EMAIL)
 * - MAIL_TO_EMAIL (alias for MAIL_TO)
 */
export function getMailConfig(): MailConfig {
  const host = (process.env.MAIL_HOST || process.env.MAIL_EMAIL_HOST || "").trim();
  const rawPort = (process.env.MAIL_PORT || process.env.MAIL_EMAIL_PORT || "").trim();
  const rawSecure = process.env.MAIL_SECURE;
  const user = (process.env.MAIL_EMAIL || process.env.MAIL_EMAIL_ID || "").trim();
  const pass = (process.env.MAIL_EMAIL_PASSWORD || "").trim().replace(/^["']|["']$/g, "");
  const to = (process.env.MAIL_TO || process.env.MAIL_TO_EMAIL || "").trim();
  const from = (process.env.MAIL_FROM || "").trim() || user;

  const port = rawPort ? parseInt(rawPort, 10) : 0;
  const secure =
    rawSecure !== undefined
      ? rawSecure.toLowerCase() === "true"
      : port === 465;

  const missing: string[] = [];
  if (!host) missing.push("MAIL_HOST");
  if (!rawPort) missing.push("MAIL_PORT");
  if (!user) missing.push("MAIL_EMAIL");
  if (!pass) missing.push("MAIL_EMAIL_PASSWORD");
  if (!to) missing.push("MAIL_TO");

  return {
    host,
    port,
    secure,
    user,
    pass,
    from,
    to,
    fromName: "Digi India Solutions | KametiPro",
    missing,
  };
}

let transporterInstance: Transporter | null = null;

/**
 * Lazily creates and returns the Nodemailer transporter.
 * If required environment variables are missing, throws an Error with only variable names.
 */
export function getTransporter(): Transporter {
  const config = getMailConfig();

  if (config.missing.length > 0) {
    throw new Error(`Missing mail env variables: ${config.missing.join(", ")}`);
  }

  if (!transporterInstance) {
    transporterInstance = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
    });
  }

  return transporterInstance;
}

/**
 * Sends email via Nodemailer SMTP.
 */
export async function sendSmtpMail(
  options: SendMailOptions
): Promise<{ success: boolean; messageId: string }> {
  const config = getMailConfig();
  const transporter = getTransporter();

  const recipient = options.to || config.to;
  const fromAddress = options.from || `"${config.fromName}" <${config.from}>`;

  const info = await transporter.sendMail({
    from: fromAddress,
    to: recipient,
    replyTo: options.replyTo,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });

  return {
    success: true,
    messageId: info.messageId || "",
  };
}
