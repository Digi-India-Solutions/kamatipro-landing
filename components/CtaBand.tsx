"use client";

import { MessageSquare } from "lucide-react";
import { track } from "../lib/track";
import { openDemoModal } from "../lib/openDemoModal";

export default function CtaBand() {
  return (
    <section className="bg-[#EEF2FF] py-16">
      <div className="km-container text-center">
        <h2 className="font-['Poppins'] text-[28px] font-bold text-[#0F1B2D]">
          Apni kameti ka hisaab ek baar system pe dekh lijiye
        </h2>
        <p className="mt-3 text-[19px] text-[#5B6B8C]">
          15 minute ka demo, aapke office pe ya online. Koi charge nahi.
        </p>

        <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
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
            className="flex min-h-[52px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border-2 border-[#3B4FD8] px-6 font-['Poppins'] text-base font-bold text-[#3B4FD8] hover:bg-[#3B4FD8]/5"
          >
            <span className="flex h-5 w-5 items-center justify-center">
              <MessageSquare size={18} aria-hidden="true" />
            </span>
            WhatsApp pe poochhein
          </button>
        </div>
      </div>
    </section>
  );
}