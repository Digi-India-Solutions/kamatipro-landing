"use client";

import { MapPin, Phone } from "lucide-react";
import { PHONE_TEL, MAPS_LINK } from "../lib/config";
import { track } from "../lib/track";

const SHOW_TESTIMONIALS = false;

const TESTIMONIAL_SLOTS = [
  { quote: "", name: "", area: "Area" },
  { quote: "", name: "", area: "Area" },
  { quote: "", name: "", area: "Area" },
];

export default function TrustSection() {
  const onClickCall = () => track("call", {}, "Contact");

  return (
    <section className="bg-white py-16 md:py-[88px]">
      <div className="km-container">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="font-['Poppins'] text-[28px] font-bold text-[#0F1B2D] md:text-[38px]">
              Delhi ki company, Delhi mein support
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#5B6B8C]">
              Software sirf online bech ke gayab hone wali company nahi. Zaroorat
              pade to hum milne aa sakte hain, ya aap hamare Rohini office aa
              sakte hain.
            </p>
            <p className="mt-4 flex items-start gap-2 text-[15px] text-[#5B6B8C]">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-[#3B4FD8]">
                <MapPin size={16} aria-hidden="true" />
              </span>
              Delhi, Noida, Greater Noida, Ghaziabad, Gurugram aur Faridabad
              mein office visit.
            </p>
          </div>

          <div className="rounded-[12px] border-2 border-[#3B4FD8] p-6">
            <h3 className="font-['Poppins'] text-base font-semibold text-[#111B3E]">
              Digi India Solutions
            </h3>
            <p className="mt-1 text-[15px] text-[#5B6B8C]">Sector 24, Rohini, Delhi</p>
            <a
              href={PHONE_TEL}
              onClick={onClickCall}
              className="mt-3 flex cursor-pointer items-center gap-2 text-[15px] font-semibold text-[#3B4FD8] hover:underline"
            >
              <span className="flex h-5 w-5 items-center justify-center">
                <Phone size={15} aria-hidden="true" />
              </span>
              +91 81305 43714
            </a>
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex cursor-pointer items-center gap-1 text-[15px] font-semibold text-[#3B4FD8] hover:underline"
            >
              <span className="flex h-5 w-5 items-center justify-center">
                <MapPin size={15} aria-hidden="true" />
              </span>
              Google Maps pe dekhein
            </a>
          </div>
        </div>

        {SHOW_TESTIMONIALS && (
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {TESTIMONIAL_SLOTS.map((t, i) => (
              <div
                key={i}
                className="rounded-[12px] border border-[#DDE3F0] bg-[#EEF2FF] p-5"
              >
                <p className="text-[15px] italic text-[#5B6B8C]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="mt-3 text-[15px] font-semibold text-[#0F1B2D]">
                  {t.name}
                </p>
                <p className="text-[15px] text-[#5B6B8C]">
                  Kameti Organizer, {t.area}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}