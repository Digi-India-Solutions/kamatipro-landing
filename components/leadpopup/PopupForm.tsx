"use client";

import { useState } from "react";
import { LEAD_API } from "../../lib/config";
import { track, trackConversion } from "../../lib/track";
import { markLeadSent } from "../../lib/popupStorage";

type Props = {
  onSuccess: () => void;
};

export default function PopupForm({ onSuccess }: Props) {
  const [errMsg, setErrMsg] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrMsg("");

    const fd = new FormData(e.currentTarget);
    const hp = ((fd.get("website_alt") as string) ?? "").trim();
    if (hp !== "") {
      onSuccess();
      return;
    }

    const name = ((fd.get("name") as string) ?? "").trim();
    const mobile = ((fd.get("mobile") as string) ?? "").trim().replace(/\D/g, "");
    const email = ((fd.get("email") as string) ?? "").trim();
    const message = ((fd.get("message") as string) ?? "").trim();

    if (name.length < 2) {
      setErrMsg("Apna naam likhiye.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setErrMsg("10 digit ka sahi mobile number daaliye.");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrMsg("Kripya sahi email address daalein (jaise: example@gmail.com).");
      return;
    }

    setSending(true);

    const parts = [
      `Namaste, mujhe KametiPro ka demo chahiye.`,
      `Naam: ${name}`,
      `Mobile: ${mobile}`,
      `Email: ${email}`,
    ];
    if (message) parts.push(`Message: ${message}`);

    const waUrl = `https://wa.me/918130543714?text=${encodeURIComponent(parts.join("\n"))}`;

    // 1. PEHLE EMAIL PAR MESSAGE JAYEGA
    try {
      await fetch(LEAD_API || "/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile,
          email,
          message: message || "Demo request from popup",
          groups: "Popup lead",
          product: "KametiPro",
          source: "Exit Lead Popup",
          website_alt: hp,
        }),
      });
    } catch {}

    // 2. USKE BAAD WHATSAPP PAR JAYEGA
    markLeadSent();
    window.open(waUrl, "_blank", "noopener,noreferrer");
    track("generate_lead", { source: "popup" }, "Lead");
    trackConversion();
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]" noValidate>
      <div>
        <label
          htmlFor="kp-popup-name"
          className="mb-1 block text-sm font-medium text-[#0F1B2D]"
        >
          Aapka naam <span className="text-red-500">*</span>
        </label>
        <input
          id="kp-popup-name"
          name="name"
          type="text"
          required
          maxLength={60}
          placeholder="Jaise: Ramesh Gupta"
          className="w-full rounded-[10px] border border-[#DDE3F0] px-3 py-2.5 text-sm text-[#0F1B2D] placeholder-[#A0ADB8] focus:border-[#3B4FD8] focus:outline-none focus:ring-2 focus:ring-[#3B4FD8]/20"
        />
      </div>

      <div>
        <label
          htmlFor="kp-popup-mobile"
          className="mb-1 block text-sm font-medium text-[#0F1B2D]"
        >
          Mobile number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#5B6B8C]"
          >
            +91
          </span>
          <input
            id="kp-popup-mobile"
            name="mobile"
            type="tel"
            required
            maxLength={10}
            inputMode="numeric"
            pattern="[0-9]{10}"
            placeholder="10 digit number"
            className="w-full rounded-[10px] border border-[#DDE3F0] py-2.5 pl-[52px] pr-3 text-sm text-[#0F1B2D] placeholder-[#A0ADB8] focus:border-[#3B4FD8] focus:outline-none focus:ring-2 focus:ring-[#3B4FD8]/20"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="kp-popup-email"
          className="mb-1 block text-sm font-medium text-[#0F1B2D]"
        >
          Email address <span className="text-red-500">*</span>
        </label>
        <input
          id="kp-popup-email"
          name="email"
          type="email"
          required
          maxLength={80}
          placeholder="ramesh@gmail.com"
          className="w-full rounded-[10px] border border-[#DDE3F0] px-3 py-2.5 text-sm text-[#0F1B2D] placeholder-[#A0ADB8] focus:border-[#3B4FD8] focus:outline-none focus:ring-2 focus:ring-[#3B4FD8]/20"
        />
      </div>

      <div>
        <label
          htmlFor="kp-popup-msg"
          className="mb-1 block text-sm font-medium text-[#0F1B2D]"
        >
          Aapka Sandesh (Message)
        </label>
        <textarea
          id="kp-popup-msg"
          name="message"
          rows={2}
          maxLength={500}
          placeholder="Aapko kameti software ke baare mein kya jankari chahiye?..."
          className="w-full rounded-[10px] border border-[#DDE3F0] p-2.5 text-sm text-[#0F1B2D] placeholder-[#A0ADB8] focus:border-[#3B4FD8] focus:outline-none focus:ring-2 focus:ring-[#3B4FD8]/20 resize-none"
        ></textarea>
      </div>

      {/* Honeypot */}
      <input
        name="website_alt"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        readOnly
        className="hp-field"
      />

      {errMsg && (
        <p role="alert" aria-live="assertive" className="text-sm text-red-600">
          {errMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="flex min-h-[50px] w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-[10px] bg-[#F5A524] font-['Poppins'] text-base font-bold text-[#0F1B2D] hover:bg-[#FFB93D] disabled:opacity-60"
      >
        {sending ? "Bhej rahe hain…" : "Free Demo Book Karein"}
      </button>

      <p className="text-center text-xs text-[#5B6B8C]">
        🔒 Pehle email notification jayega, uske baad WhatsApp open hoga.
      </p>
    </form>
  );
}