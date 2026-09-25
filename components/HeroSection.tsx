"use client";

import { MessageSquare } from "lucide-react";
import BoliCalculator from "./BoliCalculator";
import { WHATSAPP_LINK } from "../lib/config";
import { track } from "../lib/track";
import { openDemoModal } from "../lib/openDemoModal";

const TRUST_POINTS = [
  "Delhi NCR mein free office visit",
  "Mobile aur laptop dono pe",
  "Rohini, Delhi ki company",
];

export default function HeroSection() {
  const onWhatsApp = () => track("whatsapp", {}, "Contact");

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 90% 20%, #3B4FD8 0%, #111B3E 55%)",
      }}
    >
      <div className="km-container pt-[56px] pb-[56px] md:pt-20 md:pb-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <h1 className="font-['Poppins'] text-[34px] font-bold leading-[1.1] text-white md:text-5xl lg:text-[52px]">
              Kameti management software jo boli aur dividend{" "}
              <span className="text-[#F5A524]">khud calculate kare</span>
            </h1>

            <p className="mt-5 text-base leading-relaxed text-[#C9D4F5] md:text-lg">
              Diary, calculator aur har mahine ke hisaab ki galti se chhutti.
              Saari kameti groups, har member ka ledger, ek jagah.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => openDemoModal("Free Demo Book Karein")}
                className="flex min-h-[52px] cursor-pointer items-center justify-center whitespace-nowrap rounded-[10px] bg-[#F5A524] px-6 font-['Poppins'] text-base font-bold text-[#0F1B2D] hover:bg-[#FFB93D]"
              >
                Free demo book karein
              </button>
              <button
                type="button"
                onClick={() => openDemoModal("WhatsApp Demo Chat")}
                className="flex min-h-[52px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border-2 border-white px-6 font-['Poppins'] text-base font-bold text-white hover:bg-white/10"
              >
                <span className="flex h-5 w-5 items-center justify-center">
                  <MessageSquare size={18} aria-hidden="true" />
                </span>
                WhatsApp karein
              </button>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
              {TRUST_POINTS.map((pt) => (
                <li
                  key={pt}
                  className="flex items-center gap-2 text-[15px] text-[#C9D4F5]"
                >
                  <span className="text-[#F5A524]">✓</span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full">
            <BoliCalculator />
          </div>
        </div>
      </div>
    </section>
  );
}