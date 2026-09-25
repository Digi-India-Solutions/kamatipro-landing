"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "../../lib/track";
import {
  canShowPopup,
  markPopupClosed,
  markShownThisSession,
} from "../../lib/popupStorage";
import PopupForm from "./PopupForm";

type TriggerName = "exit_intent" | "scroll_depth" | "dwell_time" | "calculator";

export default function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [triggerName, setTriggerName] = useState<TriggerName | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canShowPopup()) return;

    const demo = document.getElementById("demo");
    let demoInView = false;
    let io: IntersectionObserver | undefined;
    if (demo && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          demoInView = entries[0]?.isIntersecting ?? false;
        },
        { threshold: 0.1 }
      );
      io.observe(demo);
    }

    let fired = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const fire = (name: TriggerName) => {
      if (fired || demoInView) return;
      fired = true;
      markShownThisSession();
      setTriggerName(name);
      setOpen(true);
    };

    const isDesktop =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(min-width: 768px)").matches
        : false;

    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) fire("exit_intent");
    };
    if (isDesktop) document.addEventListener("mouseout", onMouseOut);

    const onScroll = () => {
      const total = document.documentElement.scrollHeight;
      if (total <= 0) return;
      const ratio = (window.scrollY + window.innerHeight) / total;
      if (ratio >= 0.5) fire("scroll_depth");
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    timers.push(setTimeout(() => fire("dwell_time"), 30000));

    const onCalc = () => {
      timers.push(setTimeout(() => fire("calculator"), 8000));
    };
    window.addEventListener("kp_calc_change", onCalc);

    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("kp_calc_change", onCalc);
      timers.forEach(clearTimeout);
      io?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (open && triggerName) {
      track("popup_shown", { trigger: triggerName });
    }
  }, [open, triggerName]);

  const handleDismiss = useCallback(() => {
    markPopupClosed();
    track("popup_dismissed");
    setOpen(false);
  }, []);

  const handleSuccess = useCallback(() => {
    setSubmitted(true);
  }, []);

  useEffect(() => {
    if (open && submitted) {
      const t = setTimeout(() => setOpen(false), 3000);
      return () => clearTimeout(t);
    }
  }, [open, submitted]);

  useEffect(() => {
    if (!open) return;
    const card = cardRef.current;
    const previous = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const getFocusable = () =>
      card
        ? Array.from(
            card.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => !el.hasAttribute("disabled"))
        : [];

    getFocusable()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (submitted) setOpen(false);
        else handleDismiss();
        return;
      }
      if (e.key === "Tab") {
        const list = getFocusable();
        if (list.length === 0) return;
        const firstEl = list[0];
        const lastEl = list[list.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [open, submitted, handleDismiss]);

  if (!open) return null;

  return (
    <div
      className="kp-popup-backdrop fixed inset-0 z-[100] flex items-end justify-center bg-black/45 md:items-center md:p-4"
      role="presentation"
      onClick={handleDismiss}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kp-popup-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          paddingBottom: "calc(32px + env(safe-area-inset-bottom))",
        }}
        className="kp-popup-card relative w-full max-w-[460px] rounded-t-[16px] bg-white p-8 shadow-2xl md:rounded-[16px]"
      >
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Band karein"
          className="absolute right-2 top-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[#5B6B8C] hover:bg-[#F1F4FB]"
        >
          <span className="flex h-6 w-6 items-center justify-center text-2xl">
            <i className="ri-close-line" />
          </span>
        </button>

        {submitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#12A594]">
              <span className="flex h-8 w-8 items-center justify-center text-2xl text-white">
                <i className="ri-check-line" />
              </span>
            </div>
            <h2 className="mt-4 font-['Poppins'] text-[26px] font-bold text-[#111B3E]">
              Mil gaya!
            </h2>
            <p className="mt-2 text-[18px] text-[#5B6B8C]">
              Hamari team jald call karegi.
            </p>
          </div>
        ) : (
          <>
            <span className="inline-block rounded-full bg-[#F5A524]/20 px-3 py-1 text-[15px] font-semibold text-[#B7791F]">
              Free demo
            </span>
            <h2
              id="kp-popup-title"
              className="mt-3 font-['Poppins'] text-[26px] font-bold leading-snug text-[#111B3E]"
            >
              Ek call mein poora system dikha denge
            </h2>
            <p className="mt-2 mb-5 text-[18px] leading-relaxed text-[#5B6B8C]">
              Naam aur number chhodiye. Hamari team aaj hi call karegi, aur
              Delhi NCR mein office pe aakar demo bhi de degi.
            </p>
            <PopupForm onSuccess={handleSuccess} />
          </>
        )}
      </div>
    </div>
  );
}