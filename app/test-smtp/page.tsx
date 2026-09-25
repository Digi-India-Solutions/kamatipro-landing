"use client";

import { useState, useEffect } from "react";

export default function SmtpTestPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState("");
  const [leads, setLeads] = useState<any[]>([]);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/send-email");
      const data = await res.json();
      if (data.recentLeads) {
        setLeads(data.recentLeads);
      }
    } catch {}
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleTest = async () => {
    setLoading(true);
    setStatus("idle");
    setMessage("Hostinger SMTP par bhej rahe hain...");
    setDetails("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test Customer",
          mobile: "9131734930",
          email: "aasibkhan155471@gmail.com",
          message: "Hostinger SMTP configuration live verification test.",
          source: "Dashboard Verification",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setMessage("✅ Email successfully sent via Hostinger SMTP (info@digiindiasolutions.com)!");
        setDetails(JSON.stringify(data, null, 2));
        fetchLeads();
      } else {
        setStatus("error");
        setMessage("❌ Failed to process lead");
        setDetails(data?.details || data?.error || JSON.stringify(data, null, 2));
      }
    } catch (err: any) {
      setStatus("error");
      setMessage("❌ Network error");
      setDetails(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D", color: "#fff", padding: "40px 20px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", background: "#17233D", padding: "32px", borderRadius: "12px", border: "1px solid #2B3A67" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px", color: "#F5A524" }}>
          Digi India - Hostinger SMTP Live Dashboard
        </h1>
        <p style={{ fontSize: "14px", color: "#A0ADB8", marginBottom: "24px" }}>
          Hostinger SMTP Active (info@digiindiasolutions.com) • Zero External Backend
        </p>

        <div style={{ background: "#0D1626", padding: "16px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", lineHeight: "1.6" }}>
          <div><strong>Host:</strong> smtp.hostinger.com</div>
          <div><strong>Port:</strong> 465 (SSL / SMTPS)</div>
          <div><strong>Sender Email:</strong> info@digiindiasolutions.com</div>
          <div><strong>Delivery Inbox:</strong> info@digiindiasolutions.com</div>
          <div style={{ marginTop: "6px", color: "#10B981" }}><strong>Status:</strong> 🟢 Connected &amp; Verified Working</div>
        </div>

        <button
          onClick={handleTest}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading ? "#5B6B8C" : "#F5A524",
            color: "#0F1B2D",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "20px",
          }}
        >
          {loading ? "Sending via Hostinger..." : "Send Test Email to info@digiindiasolutions.com"}
        </button>

        {message && (
          <div
            style={{
              padding: "16px",
              borderRadius: "8px",
              background: status === "success" ? "#064E3B" : "#7F1D1D",
              color: "#fff",
              fontSize: "14px",
              marginBottom: "12px",
            }}
          >
            <strong>{message}</strong>
            {details && (
              <pre
                style={{
                  marginTop: "10px",
                  background: "rgba(0,0,0,0.3)",
                  padding: "10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                {details}
              </pre>
            )}
          </div>
        )}

        <div style={{ marginTop: "28px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px", color: "#F5A524" }}>
            📥 Recent Leads ({leads.length} recorded):
          </h3>
          {leads.length === 0 ? (
            <p style={{ color: "#7E8CA0", fontSize: "13px" }}>Koi lead nahi hai.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {leads.map((ld, i) => (
                <div key={ld.id || i} style={{ background: "#0D1626", padding: "14px", borderRadius: "8px", border: "1px solid #2B3A67", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <strong style={{ fontSize: "14px", color: "#fff" }}>{ld.name}</strong>
                    <span style={{ color: "#F5A524" }}>{ld.mobile}</span>
                  </div>
                  {ld.email && <div style={{ color: "#93C5FD" }}>✉️ {ld.email}</div>}
                  {ld.message && <div style={{ color: "#E2E8F0", marginTop: "4px", background: "rgba(255,255,255,0.05)", padding: "6px 10px", borderRadius: "4px" }}>"{ld.message}"</div>}
                  <div style={{ marginTop: "8px", fontSize: "11px", color: "#7E8CA0", display: "flex", justifyContent: "space-between" }}>
                    <span>Source: {ld.source}</span>
                    <span>Status: {ld.emailSent ? "✅ Sent" : "Saved"} • {ld.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
