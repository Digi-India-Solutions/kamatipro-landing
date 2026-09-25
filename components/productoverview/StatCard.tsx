"use client";

import { Layers, Users, TrendingUp, AlertCircle } from "lucide-react";

const TONES = {
  indigo: { chip: "bg-[#EEF2FF] text-[#3B4FD8]", value: "text-[#0F1B2D]", Icon: Layers },
  teal: { chip: "bg-[#E6F7F4] text-[#12A594]", value: "text-[#0F1B2D]", Icon: Users },
  green: { chip: "bg-[#E4F7EF] text-[#12A37A]", value: "text-[#12A37A]", Icon: TrendingUp },
  amber: { chip: "bg-[#FEF3E2] text-[#B7791F]", value: "text-[#B7791F]", Icon: AlertCircle },
};

export default function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "indigo" | "teal" | "green" | "amber";
}) {
  const t = TONES[tone];
  const Icon = t.Icon;
  return (
    <div className="min-w-0 rounded-[12px] border border-[#E5E9F2] bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 text-[13px] leading-tight text-[#5B6B8C]">
          {label}
        </p>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${t.chip}`}
        >
          <Icon size={18} aria-hidden="true" />
        </span>
      </div>
      <p
        className={`mt-2 min-w-0 truncate font-['Poppins'] text-[22px] font-bold leading-tight ${t.value}`}
      >
        {value}
      </p>
    </div>
  );
}