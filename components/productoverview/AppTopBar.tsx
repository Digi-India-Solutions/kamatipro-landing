"use client";

import { PanelLeft, Calendar, Search, Bell } from "lucide-react";

export default function AppTopBar() {
  return (
    <div className="flex h-[56px] shrink-0 items-center gap-4 border-b border-[#E5E9F2] bg-white px-5">
      <div className="flex items-center gap-4">
        <span className="flex h-5 w-5 items-center justify-center text-[#5B6B8C]">
          <PanelLeft size={18} aria-hidden="true" />
        </span>
        <span className="flex items-center gap-2 text-[13px] text-[#3C4A63]">
          <Calendar size={16} className="text-[#5B6B8C]" aria-hidden="true" />
          Wed, 23 Sep 2026
        </span>
      </div>

      <div className="mx-auto flex h-9 w-[340px] items-center gap-2 rounded-full border border-[#E5E9F2] bg-[#F7F9FC] px-3">
        <Search size={15} className="text-[#98A2B3]" aria-hidden="true" />
        <span className="truncate text-[13px] text-[#98A2B3]">
          Search members, groups, transactions...
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-full border border-[#E5E9F2] bg-[#F7F9FC] px-3 py-1 text-[12px] font-medium text-[#5B6B8C]">
          Role: Super Admin
        </span>
        <span className="relative flex h-5 w-5 items-center justify-center text-[#5B6B8C]">
          <Bell size={17} aria-hidden="true" />
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#F5A524] text-[9px] font-bold text-[#0F1B2D]">
            5
          </span>
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B4FD8] text-[12px] font-bold text-white">
          SK
        </span>
      </div>
    </div>
  );
}