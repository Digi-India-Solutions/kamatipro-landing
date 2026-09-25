"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, User, Phone, Mail, CheckCircle2, MessageCircle } from "lucide-react";
import { track } from "../lib/track";

function buildWhatsAppUrl(name: string, mobile: string, email: string, message: string): string {
  const parts = [
    `Namaste Digi India, mujhe KametiPro ka Free Demo chahiye.`,
    `Naam: ${name}`,
    `Mobile: ${mobile}`,
  ];
  if (email) parts.push(`Email: ${email}`);
  if (message) parts.push(`Sandesh: ${message}`);

  return `https://wa.me/918130543714?text=${encodeURIComponent(parts.join("\n"))}`;
}

export default function DesktopWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Free Demo Book Karein");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Listen for global open_demo_modal event from any Free Demo button
  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent<{ title?: string }>;
      if (customEvent.detail?.title) {
        setModalTitle(customEvent.detail.title);
      } else {
        setModalTitle("Free Demo Book Karein");
      }
      setIsOpen(true);
      setIsSuccess(false);
      setErrMsg("");
    };

    window.addEventListener("open_demo_modal", handleOpenModal);
    return () => window.removeEventListener("open_demo_modal", handleOpenModal);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Close when clicking outside modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        const toggleBtn = document.getElementById("floating-chat-toggle-btn");
        if (toggleBtn && toggleBtn.contains(e.target as Node)) return;
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrMsg("");

    const fd = new FormData(e.currentTarget);
    const honeypot = ((fd.get("website_alt") as string) ?? "").trim();
    if (honeypot !== "") {
      setIsSuccess(true);
      return;
    }

    const name = ((fd.get("name") as string) ?? "").trim();
    const mobile = ((fd.get("mobile") as string) ?? "").trim().replace(/\D/g, "");
    const email = ((fd.get("email") as string) ?? "").trim();
    const message = ((fd.get("message") as string) ?? "").trim();

    if (name.length < 2) {
      setErrMsg("Kripya apna poora naam likhein.");
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

    if (message.length < 3) {
      setErrMsg("Kripya apna sandesh/sawal likhein.");
      return;
    }

    setIsSubmitting(true);

    const waUrl = buildWhatsAppUrl(name, mobile, email, message);

    try {
      // 1. PEHLE EMAIL PAR MESSAGE JAYEGA (SMTP + Fail-safe Lead Storage)
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile,
          email,
          message,
          source: `Demo Form Modal (${modalTitle})`,
          website_alt: honeypot,
        }),
      });

      track("generate_lead", { source: "demo_modal" }, "Lead");

      // 2. USKE BAAD WHATSAPP PAR JAYEGA
      window.open(waUrl, "_blank", "noopener,noreferrer");

      // 3. UI MEIN SUCCESS STATE
      setIsSuccess(true);
      formRef.current?.reset();
    } catch {
      // In case of network issue, still open WhatsApp
      window.open(waUrl, "_blank", "noopener,noreferrer");
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setErrMsg("");
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-20 right-4 z-[70] sm:bottom-6 sm:right-6">
        <button
          id="floating-chat-toggle-btn"
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setModalTitle("Free Demo Book Karein");
              track("open_chat_widget", {}, "Interaction");
            }
          }}
          aria-label={isOpen ? "Demo form band karein" : "Free Demo form kholein"}
          className="group relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(17,27,62,0.28)] transition-all duration-300 hover:scale-105 hover:bg-[#1EBE5D] hover:shadow-[0_12px_28px_rgba(37,211,102,0.4)] active:scale-95"
        >
          {isOpen ? (
            <X size={26} className="transition-transform duration-300 rotate-90" aria-hidden="true" />
          ) : (
            <>
              <MessageSquare size={26} className="transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
              {/* Online Green Indicator Dot */}
              <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-[#10B981]"></span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[75] bg-black/50 backdrop-blur-[2px] transition-opacity"
        />
      )}

      {/* Floating Demo & Message Form Modal */}
      {isOpen && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-widget-title"
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] w-[calc(100vw-32px)] max-w-[440px] overflow-hidden rounded-2xl border border-[#DDE3F0] bg-white shadow-[0_25px_60px_rgba(15,27,45,0.3)] animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Card Header */}
          <div className="relative bg-gradient-to-r from-[#0F1B2D] via-[#16274E] to-[#1B2E6A] px-5 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#F5A524] to-[#FFC554] text-[#0F1B2D] font-bold shadow">
                  <MessageCircle size={22} className="text-[#0F1B2D]" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0F1B2D] bg-[#10B981]"></span>
                </div>
                <div>
                  <h3 id="demo-widget-title" className="text-base font-bold text-white leading-tight">
                    {modalTitle}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#C9D4F5] mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse"></span>
                    <span>Digi India Solutions • Online</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mt-2 text-[13px] text-[#A0B0E0]">
              Pehle aapki request email par jayegi, phir WhatsApp par connect ho jayega.
            </p>
          </div>

          {/* Card Body */}
          <div className="max-h-[80vh] overflow-y-auto p-5 sm:max-h-[600px]">
            {isSuccess ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF5] text-[#10B981]">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-lg font-bold text-[#0F1B2D]">
                  Demo Request Bhej Di Gayi!
                </h4>
                <p className="mt-2 text-sm text-[#5B6B8C] leading-relaxed">
                  Aapki details hamari team ke paas email par deliver ho chuki hain aur WhatsApp chat open ho gayi hai. Hum aapse jald hi sampark karenge.
                </p>

                <div className="mt-6 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full rounded-xl bg-[#0F1B2D] py-3 text-sm font-semibold text-white hover:bg-[#1B2E6A] transition-colors cursor-pointer"
                  >
                    Band Karein
                  </button>
                </div>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-3.5">
                {/* Name Field */}
                <div>
                  <label htmlFor="modal-name" className="mb-1 block text-xs font-semibold text-[#0F1B2D]">
                    Aapka Naam (Name) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7E8CA0]">
                      <User size={16} />
                    </span>
                    <input
                      id="modal-name"
                      name="name"
                      type="text"
                      required
                      maxLength={60}
                      placeholder="Jaise: Rajesh Sharma"
                      className="w-full rounded-lg border border-[#DDE3F0] py-2.5 pr-3 pl-9 text-sm text-[#0F1B2D] placeholder-[#A0ADB8] focus:border-[#3B4FD8] focus:outline-none focus:ring-2 focus:ring-[#3B4FD8]/20"
                    />
                  </div>
                </div>

                {/* Mobile Number Field */}
                <div>
                  <label htmlFor="modal-mobile" className="mb-1 block text-xs font-semibold text-[#0F1B2D]">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5B6B8C]">
                      +91
                    </span>
                    <input
                      id="modal-mobile"
                      name="mobile"
                      type="tel"
                      required
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      placeholder="10 digit mobile number"
                      className="w-full rounded-lg border border-[#DDE3F0] py-2.5 pr-3 pl-11 text-sm text-[#0F1B2D] placeholder-[#A0ADB8] focus:border-[#3B4FD8] focus:outline-none focus:ring-2 focus:ring-[#3B4FD8]/20"
                    />
                  </div>
                </div>

                {/* Email Address Field */}
                <div>
                  <label htmlFor="modal-email" className="mb-1 block text-xs font-semibold text-[#0F1B2D]">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7E8CA0]">
                      <Mail size={16} />
                    </span>
                    <input
                      id="modal-email"
                      name="email"
                      type="email"
                      required
                      maxLength={80}
                      placeholder="name@example.com"
                      className="w-full rounded-lg border border-[#DDE3F0] py-2.5 pr-3 pl-9 text-sm text-[#0F1B2D] placeholder-[#A0ADB8] focus:border-[#3B4FD8] focus:outline-none focus:ring-2 focus:ring-[#3B4FD8]/20"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="modal-message" className="mb-1 block text-xs font-semibold text-[#0F1B2D]">
                    Aapka Sandesh (Message) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="modal-message"
                      name="message"
                      required
                      rows={3}
                      maxLength={500}
                      placeholder="Mujhe KametiPro software ka demo chahiye..."
                      defaultValue="Mujhe KametiPro software ka live demo chahiye."
                      className="w-full rounded-lg border border-[#DDE3F0] p-2.5 text-sm text-[#0F1B2D] placeholder-[#A0ADB8] focus:border-[#3B4FD8] focus:outline-none focus:ring-2 focus:ring-[#3B4FD8]/20 resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Honeypot field for bot protection */}
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
                  <div className="rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-700 leading-snug">
                    {errMsg}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5A524] py-3 text-sm font-bold text-[#0F1B2D] shadow hover:bg-[#FFB93D] transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Email par bhej rahe hain...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Free Demo Book Karein</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[12px] text-[#7E8CA0]">
                  🔒 Pehle email par notify hoga, phir direct WhatsApp khulega.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}