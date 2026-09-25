"use client";

import { Phone } from "lucide-react";
import { MessageSquare } from "lucide-react";
import { PHONE_TEL } from "../lib/config";
import { track } from "../lib/track";
import { openDemoModal } from "../lib/openDemoModal";

export default function StickyMobileBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-[#DDE3F0] bg-white pb-[env(safe-area-inset-bottom)] sm:hidden">
      <a
        href={PHONE_TEL}
        onClick={() => track("call", {}, "Contact")}
        className="flex min-h-[52px] flex-1 cursor-pointer items-center justify-center gap-2 bg-[#111B3E] whitespace-nowrap font-semibold text-white text-[15px]"
      >
        <span className="flex h-5 w-5 items-center justify-center">
          <Phone size={17} aria-hidden="true" />
        </span>
        Call karein
      </a>
      <button
        type="button"
        onClick={() => {
          track("whatsapp_click_bar", {}, "Contact");
          openDemoModal("Free Demo & WhatsApp Chat");
        }}
        className="flex min-h-[52px] flex-1 cursor-pointer items-center justify-center gap-2 bg-[#25D366] whitespace-nowrap font-semibold text-white text-[15px]"
      >
        <span className="flex h-5 w-5 items-center justify-center">
          <MessageSquare size={17} aria-hidden="true" />
        </span>
        Free Demo / WhatsApp
      </button>
    </div>
  );
}