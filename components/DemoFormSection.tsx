"use client";

import { useState, useRef } from "react";
import { LEAD_API, FORM_SUBMIT_ADDR, WHATSAPP_LINK } from "../lib/config";
import { track, trackConversion } from "../lib/track";
import { markLeadSent } from "../lib/popupStorage";

const GROUP_OPTIONS = [
  "Chuniye",
  "1-2",
  "3-5",
  "6-10",
  "10 se zyada",
  "Shuru karne wala hoon",
];

type FormState = "idle" | "submitting" | "success" | "error";

function buildWaLink(name: string, mobile: string, email: string, message: string, groups: string): string {
  const parts = [
    `Namaste, mujhe KametiPro ka demo chahiye.`,
    `Naam: ${name}`,
    `Mobile: ${mobile}`,
  ];
  if (email) parts.push(`Email: ${email}`);
  if (groups && groups !== "Chuniye") parts.push(`Kameti groups: ${groups}`);
  if (message) parts.push(`Message: ${message}`);

  return `https://wa.me/918130543714?text=${encodeURIComponent(parts.join("\n"))}`;
}

export default function DemoFormSection() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errMsg, setErrMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    const honeypot = (fd.get("website_alt") as string) ?? "";
    if (honeypot.trim() !== "") {
      setFormState("success");
      return;
    }

    const name = (fd.get("name") as string).trim();
    const mobile = (fd.get("mobile") as string).trim();
    const email = ((fd.get("email") as string) ?? "").trim();
    const message = ((fd.get("message") as string) ?? "").trim();
    const groups = (fd.get("groups") as string) ?? "";

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
    if (!groups || groups === "Chuniye") {
      setErrMsg("Kitni kameti chala rahe hain, yeh chuniye.");
      return;
    }

    setFormState("submitting");

    const waUrl = buildWaLink(name, mobile, email, message, groups);

    const payload = new URLSearchParams();
    payload.append("name", name);
    payload.append("mobile", mobile);
    payload.append("email", email);
    payload.append("message", message);
    payload.append("groups", groups);

    // 1. PEHLE EMAIL PAR MESSAGE JAYEGA
    try {
      await fetch(LEAD_API || "/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile,
          email,
          message: message || `Demo booking request (${groups} groups)`,
          groups,
          source: "Free Demo Booking Section",
          website_alt: honeypot,
        }),
      });
    } catch {
      // ignore, fallback
    }

    // Backup submit to FORM_SUBMIT_ADDR if needed
    if (FORM_SUBMIT_ADDR) {
      try {
        await fetch(FORM_SUBMIT_ADDR, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: payload.toString(),
        });
      } catch {
        // ignore
      }
    }

    // 2. USKE BAAD WHATSAPP PAR JAYEGA
    window.open(waUrl, "_blank", "noopener,noreferrer");

    markLeadSent();
    track("generate_lead", {}, "Lead");
    trackConversion();
    setFormState("success");
    formRef.current?.reset();
  };

  return (
    <section id="demo" className="bg-[#111B3E] py-16 md:py-24">
      <div className="km-container">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-['Poppins'] text-[28px] font-bold text-white md:text-[38px]">
              Free demo book karein
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#C9D4F5]">
              Number chhodiye, hamari team aaj hi call karegi aur aapke hisaab
              se demo ka time tay karegi.
            </p>
            <ul className="mt-6 space-y-2">
              {["Free demo", "Delhi NCR mein office visit", "Koi commitment nahi"].map(
                (pt) => (
                  <li
                    key={pt}
                    className="flex items-center gap-2 text-[15px] text-[#C9D4F5]"
                  >
                    <span className="text-[#F5A524]">✓</span>
                    {pt}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="rounded-[16px] bg-white p-8 shadow-xl">
            {formState === "success" ? (
              <p
                role="status"
                aria-live="polite"
                className="py-8 text-center text-base font-semibold text-[#12A594]"
              >
                Demo request mil gayi. Hamari team jald call karegi.
              </p>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                data-readdy-form
                id="demo-form"
                className="flex flex-col gap-[18px]"
                noValidate
              >
                <div>
                  <label
                    htmlFor="demo-name"
                    className="mb-1 block text-[15px] font-medium text-[#0F1B2D]"
                  >
                    Aapka naam
                  </label>
                  <input
                    id="demo-name"
                    name="name"
                    type="text"
                    required
                    maxLength={60}
                    placeholder="Jaise: Ramesh Gupta"
                    className="w-full rounded-[10px] border border-[#DDE3F0] px-3 py-3 text-[15px] text-[#0F1B2D] placeholder-[#A0ADB8] focus:border-[#3B4FD8] focus:outline-none focus:ring-2 focus:ring-[#3B4FD8]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="demo-mobile"
                    className="mb-1 block text-[15px] font-medium text-[#0F1B2D]"
                  >
                    Mobile number
                  </label>
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[#5B6B8C]"
                    >
                      +91
                    </span>
                    <input
                      id="demo-mobile"
                      name="mobile"
                      type="tel"
                      required
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      placeholder="10 digit number"
                      className="w-full rounded-[10px] border border-[#DDE3F0] py-3 pl-[52px] pr-3 text-[15px] text-[#0F1B2D] placeholder-[#A0ADB8] focus:border-[#3B4FD8] focus:outline-none focus:ring-2 focus:ring-[#3B4FD8]/20"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="demo-email"
                    className="mb-1 block text-[15px] font-medium text-[#0F1B2D]"
                  >
                    Email address
                  </label>
                  <input
                    id="demo-email"
                    name="email"
                    type="email"
                    required
                    maxLength={80}
                    placeholder="Jaise: ramesh@gmail.com"
                    className="w-full rounded-[10px] border border-[#DDE3F0] px-3 py-3 text-[15px] text-[#0F1B2D] placeholder-[#A0ADB8] focus:border-[#3B4FD8] focus:outline-none focus:ring-2 focus:ring-[#3B4FD8]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="demo-message"
                    className="mb-1 block text-[15px] font-medium text-[#0F1B2D]"
                  >
                    Aapka sandesh / sawal (Message)
                  </label>
                  <textarea
                    id="demo-message"
                    name="message"
                    rows={2}
                    maxLength={500}
                    placeholder="Mujhe software ke live demo ke baare mein poochna hai..."
                    className="w-full rounded-[10px] border border-[#DDE3F0] px-3 py-3 text-[15px] text-[#0F1B2D] placeholder-[#A0ADB8] focus:border-[#3B4FD8] focus:outline-none focus:ring-2 focus:ring-[#3B4FD8]/20 resize-none"
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="demo-groups"
                    className="mb-1 block text-[15px] font-medium text-[#0F1B2D]"
                  >
                    Abhi kitni kameti chala rahe hain?
                  </label>
                  <div className="relative">
                    <select
                      id="demo-groups"
                      name="groups"
                      defaultValue="Chuniye"
                      className="w-full cursor-pointer appearance-none rounded-[10px] border border-[#DDE3F0] bg-white px-3 py-3 pr-8 text-[15px] text-[#0F1B2D] focus:border-[#3B4FD8] focus:outline-none focus:ring-2 focus:ring-[#3B4FD8]/20"
                    >
                      {GROUP_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} disabled={opt === "Chuniye"}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#5B6B8C]">
                      ▾
                    </span>
                  </div>
                </div>

                {/* Honeypot */}
                <input
                  name="website_alt"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hp-field"
                />

                {errMsg && (
                  <p
                    role="alert"
                    aria-live="assertive"
                    className="text-[15px] text-red-600"
                  >
                    {errMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="mt-1 flex min-h-[52px] w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-[10px] bg-[#F5A524] font-['Poppins'] text-base font-bold text-[#0F1B2D] hover:bg-[#FFB93D] disabled:opacity-60"
                >
                  {formState === "submitting"
                    ? "Bhej rahe hain…"
                    : "Demo book karein"}
                </button>

                <p className="text-center text-[17px] text-[#5B6B8C]">
                  Ya seedha WhatsApp pe baat karein:{" "}
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("whatsapp", {}, "Contact")}
                    className="cursor-pointer font-semibold text-[#3B4FD8] hover:underline"
                  >
                    +91 81305 43714
                  </a>
                </p>

                <p className="text-center text-[15px] text-[#5B6B8C]">
                  Aapka number sirf demo ke liye use hoga.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}