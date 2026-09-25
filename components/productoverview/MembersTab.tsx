"use client";

import { Search, Plus, ChevronRight } from "lucide-react";
import { MEMBERS } from "./data";

const HEAD = ["Member", "Mobile", "Groups", "Total Payable", "Paid Till Date", "Outstanding", "Status"];
const NUMERIC = [2, 3, 4, 5];

export default function MembersTab() {
  return (
    <div className="p-6">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="font-['Poppins'] text-[22px] font-bold text-[#0F1B2D]">Members</h3>
          <p className="mt-0.5 text-[13px] text-[#5B6B8C]">240 members</p>
        </div>
        <span className="flex cursor-default items-center gap-1.5 whitespace-nowrap rounded-[8px] bg-[#3B4FD8] px-3.5 py-2 text-[13px] font-semibold text-white">
          <Plus size={15} aria-hidden="true" />
          Add Member
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-9 w-[280px] items-center gap-2 rounded-[8px] border border-[#E5E9F2] bg-white px-3">
          <Search size={15} className="text-[#98A2B3]" aria-hidden="true" />
          <span className="text-[13px] text-[#98A2B3]">Search member name or mobile...</span>
        </div>
        <div className="flex h-9 items-center gap-2 rounded-[8px] border border-[#E5E9F2] bg-white px-3 text-[13px] text-[#3C4A63]">
          All groups
          <ChevronRight size={13} className="rotate-90 text-[#98A2B3]" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-4 rounded-[12px] border border-[#E5E9F2] bg-white">
        <table className="km-table">
          <thead>
            <tr>
              {HEAD.map((h, i) => (
                <th key={h} className={NUMERIC.includes(i) ? "km-num" : ""}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MEMBERS.map((m) => (
              <tr key={m.member}>
                <td className="font-medium">{m.member}</td>
                <td className="text-[#5B6B8C]">{m.mobile}</td>
                <td className="km-num">{m.groups}</td>
                <td className="km-num">{m.payable}</td>
                <td className="km-num">{m.paid}</td>
                <td className={`km-num ${m.outstanding === "0.00" ? "text-[#98A2B3]" : "text-[#B7791F]"}`}>
                  {m.outstanding}
                </td>
                <td>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F7EF] px-2.5 py-1 text-[12px] font-medium text-[#0B7A5A]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#12A37A]" />
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}