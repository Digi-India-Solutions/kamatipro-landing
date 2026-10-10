/**
 * Next.js Instrumentation hook.
 * Runs on server startup in the Node.js runtime to verify required environment configuration.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const missing: string[] = [];
    if (!(process.env.MAIL_HOST || process.env.MAIL_EMAIL_HOST)) missing.push("MAIL_HOST");
    if (!(process.env.MAIL_PORT || process.env.MAIL_EMAIL_PORT)) missing.push("MAIL_PORT");
    if (!(process.env.MAIL_EMAIL || process.env.MAIL_EMAIL_ID)) missing.push("MAIL_EMAIL");
    if (!process.env.MAIL_EMAIL_PASSWORD) missing.push("MAIL_EMAIL_PASSWORD");
    if (!(process.env.MAIL_TO || process.env.MAIL_TO_EMAIL)) missing.push("MAIL_TO");

    if (missing.length > 0) {
      console.error(
        `[KametiPro Mail] ERROR: Missing mail env variables: ${missing.join(", ")}. Contact form emails will fail until these are set in PM2 / environment.`
      );
    } else {
      console.log("[KametiPro Mail] SMTP configuration verified on server start.");
    }
  }
}
