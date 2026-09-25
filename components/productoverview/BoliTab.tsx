"use client";

import { Gavel, CheckCircle2 } from "lucide-react";
import { AUCTIONS } from "./data";

export default function BoliTab() {
  return (
    <div className="p-6">
      <h3 className="font-['Poppins'] text-[22px] font-bold text-[#0F1B2D]">Auction</h3>

      <div className="mt-3 flex items-center gap-2 rounded-[10px] border border-[#CFEBE0] bg-[#E4F7EF] px-4 py-3 text-[13px] font-medium text-[#0B7A5A]">
        <CheckCircle2 size={16} aria-hidden="true" />
        Aaj koi auction due nahi hai.
      </div>

      <div className="mt-5 flex items-center gap-2">
        <h4 className="font-['Poppins'] text-[15px] font-semibold text-[#0F1B2D]">
          Upcoming auctions
        </h4>
        <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[12px] font-semibold text-[#3B4FD8]">
          4
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {AUCTIONS.map((a) => (
          <div
            key={a.name + a.cycle}
            className="flex items-center gap-4 rounded-[12px] border border-[#E5E9F2] bg-white p-4"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#EEF2FF] text-[#3B4FD8]">
              <Gavel size={19} aria-hidden="true" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[15px] font-bold text-[#0F1B2D]">{a.name}</span>
                <span className="text-[12px] text-[#5B6B8C]">{a.code}</span>
                <span className="rounded-full bg-[#F1F4F9] px-2 py-0.5 text-[11px] font-medium text-[#5B6B8C]">
                  {a.cycle}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F7EF] px-2.5 py-0.5 text-[11px] font-medium text-[#0B7A5A]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#12A37A]" />
                  {a.status}
                </span>
              </div>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#5B6B8C]">
                <span>{a.month}</span>
                <span className="text-[#D6DCE8]">·</span>
                <span>{a.date}</span>
                <span className="text-[#D6DCE8]">·</span>
                <span>{a.note}</span>
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[11px] text-[#5B6B8C]">Pool</p>
              <p className="font-['Poppins'] text-[16px] font-bold text-[#0F1B2D]">
                {a.pool}
              </p>
            </div>

            <span className="shrink-0 cursor-default whitespace-nowrap rounded-[8px] bg-[#3B4FD8] px-3.5 py-2 text-[13px] font-semibold text-white">
              {a.action}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}