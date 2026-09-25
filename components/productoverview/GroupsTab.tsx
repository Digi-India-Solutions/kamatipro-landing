"use client";

import { Search, Plus, SlidersHorizontal, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { GROUPS } from "./data";

const HEAD = ["Group Code", "Group Name", "Monthly Installment", "Total Members", "Chit Value", "Start Date", "Progress", "Next Auction", "Status"];
const NUMERIC = [2, 3, 4];

function StatusPill({ status }: { status: "Active" | "Draft" }) {
  const active = status === "Active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ${
        active ? "bg-[#E4F7EF] text-[#0B7A5A]" : "bg-[#FEF3E2] text-[#B7791F]"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#12A37A]" : "bg-[#F5A524]"}`} />
      {status}
    </span>
  );
}

export default function GroupsTab() {
  return (
    <div className="p-6">
      <p className="text-[12px] text-[#98A2B3]">Home / Groups</p>
      <div className="mt-1 flex items-end justify-between">
        <div>
          <h3 className="font-['Poppins'] text-[22px] font-bold text-[#0F1B2D]">Groups</h3>
          <p className="mt-0.5 text-[13px] text-[#5B6B8C]">12 chit groups</p>
        </div>
        <span className="flex cursor-default items-center gap-1.5 whitespace-nowrap rounded-[8px] bg-[#3B4FD8] px-3.5 py-2 text-[13px] font-semibold text-white">
          <Plus size={15} aria-hidden="true" />
          Create Group
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-9 w-[280px] items-center gap-2 rounded-[8px] border border-[#E5E9F2] bg-white px-3">
          <Search size={15} className="text-[#98A2B3]" aria-hidden="true" />
          <span className="text-[13px] text-[#98A2B3]">Search group name or code...</span>
        </div>
        <div className="flex h-9 items-center gap-2 rounded-[8px] border border-[#E5E9F2] bg-white px-3 text-[13px] text-[#3C4A63]">
          All statuses
          <ChevronRight size={13} className="rotate-90 text-[#98A2B3]" aria-hidden="true" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="flex h-9 w-9 cursor-default items-center justify-center rounded-[8px] border border-[#E5E9F2] bg-white text-[#5B6B8C]">
            <SlidersHorizontal size={15} aria-hidden="true" />
          </span>
          <span className="flex cursor-default items-center gap-1.5 whitespace-nowrap rounded-[8px] border border-[#E5E9F2] bg-white px-3 py-2 text-[13px] font-medium text-[#3C4A63]">
            <Download size={15} aria-hidden="true" />
            Export
          </span>
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
            {GROUPS.map((g) => (
              <tr key={g.code}>
                <td className="text-[#5B6B8C]">{g.code}</td>
                <td className="font-medium">{g.name}</td>
                <td className="km-num">{g.installment}</td>
                <td className="km-num">{g.members}</td>
                <td className="km-num">{g.chit}</td>
                <td className="text-[#5B6B8C]">{g.start}</td>
                <td>
                  {g.progress === "Not started" ? (
                    <span className="text-[12px] text-[#98A2B3]">Not started</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-[#EDF1F7]">
                        <span
                          className="block h-full rounded-full bg-[#12A594]"
                          style={{
                            width: `${(Number(g.progress.split("/")[0]) / Number(g.progress.split("/")[1])) * 100}%`,
                          }}
                        />
                      </span>
                      <span className="text-[12px] text-[#5B6B8C]">{g.progress}</span>
                    </span>
                  )}
                </td>
                <td className="text-[#5B6B8C]">{g.next}</td>
                <td>
                  <StatusPill status={g.status} />
                </td>
              </tr>
            ))}
            <tr className="bg-[#F9FAFD] font-bold">
              <td colSpan={2}>TOTALS</td>
              <td className="km-num">14,50,000.00</td>
              <td className="km-num">190</td>
              <td className="km-num">13,00,000.00</td>
              <td colSpan={4} />
            </tr>
          </tbody>
        </table>

        <div className="flex items-center justify-between px-4 py-3 text-[12px] text-[#5B6B8C]">
          <span>Rows per page: 10</span>
          <div className="flex items-center gap-3">
            <span>1–10 of 12</span>
            <span className="flex items-center gap-1">
              <span className="flex h-7 w-7 cursor-default items-center justify-center rounded-[6px] border border-[#E5E9F2] text-[#B9C2D6]">
                <ChevronLeft size={14} aria-hidden="true" />
              </span>
              <span className="flex h-7 w-7 cursor-default items-center justify-center rounded-[6px] border border-[#E5E9F2] text-[#3C4A63]">
                <ChevronRight size={14} aria-hidden="true" />
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}