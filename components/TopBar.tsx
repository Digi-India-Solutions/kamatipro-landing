"use client";

import { Phone } from "lucide-react";
import { PHONE_DISPLAY, PHONE_TEL } from "../lib/config";
import { track } from "../lib/track";
import { openDemoModal } from "../lib/openDemoModal";

export default function TopBar() {
  const onClickCall = () => track("call", {}, "Contact");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#DDE3F0] bg-white">
      <div className="flex h-16 w-full items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-3 cursor-pointer">
          <img
            src="https://storage.helloreaddy.io/project_files/9bb86594-2c5f-46b8-bd7f-b7ec7098d2d5/0cb6167c-f2c4-4579-8d4c-616b5fe81bcb_compressed_ChatGPT-Image-Sep-24-2026-02_59_07-PM.webp"
            alt="Kameti Management Software by Digi India Solutions"
            className="h-10 w-auto object-contain sm:h-11"
          />
        </a>

        <nav className="flex items-center gap-2 md:gap-4">
          <a
            href={PHONE_TEL}
            onClick={onClickCall}
            aria-label={`Call ${PHONE_DISPLAY}`}
            className="hidden items-center gap-2 rounded-[10px] px-3 py-2 text-[15px] font-semibold text-[#3B4FD8] hover:bg-[#EEF2FF] md:flex"
          >
            <span className="flex h-5 w-5 items-center justify-center">
              <Phone size={18} aria-hidden="true" />
            </span>
            <span className="whitespace-nowrap">{PHONE_DISPLAY}</span>
          </a>

          <a
            href={PHONE_TEL}
            onClick={onClickCall}
            aria-label={`Call ${PHONE_DISPLAY}`}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border border-[#DDE3F0] text-[#3B4FD8] hover:bg-[#EEF2FF] md:hidden"
          >
            <Phone size={18} aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => openDemoModal("Free Demo Book Karein")}
            className="cursor-pointer whitespace-nowrap rounded-[10px] bg-[#F5A524] px-4 py-2.5 text-[15px] font-bold text-[#0F1B2D] hover:bg-[#FFB93D]"
          >
            Free Demo
          </button>
        </nav>
      </div>
    </header>
  );
}