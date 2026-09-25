"use client";

import { AGEING } from "./data";

export default function OutstandingAgeing() {
  return (
    <div className="rounded-[12px] border border-[#E5E9F2] bg-white">
      <div className="flex items-start justify-between border-b border-[#EDF1F7] px-5 py-4">
        <div>
          <h4 className="font-['Poppins'] text-[15px] font-semibold text-[#0F1B2D]">
            Outstanding Ageing
          </h4>
          <p className="mt-0.5 text-[13px] text-[#5B6B8C]">
            Where the money owed is concentrated
          </p>
        </div>
        <span className="cursor-default text-[13px] font-medium text-[#3B4FD8]">View report</span>
      </div>

      <div className="grid grid-cols-5 gap-3 p-5">
        {AGEING.map((b) => (
          <div key={b.label} className="rounded-[10px] border border-[#EDF1F7] bg-white p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[13px] leading-tight text-[#5B6B8C]">{b.label}</p>
              <span
                className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  b.tone === "amber"
                    ? "bg-[#FEF3E2] text-[#B7791F]"
                    : "bg-[#F1F4F9] text-[#667085]"
                }`}
              >
                {b.pct}%
              </span>
            </div>
            <p className="mt-2 text-[15px] font-bold text-[#0F1B2D]">{b.amount}</p>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#EDF1F7]">
              <div
                className={`h-full rounded-full ${
                  b.tone === "amber" ? "bg-[#F5A524]" : "bg-[#B9C2D6]"
                }`}
                style={{ width: `${Math.max(b.pct, 2)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}