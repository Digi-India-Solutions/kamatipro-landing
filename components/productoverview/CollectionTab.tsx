"use client";

import { COLLECTIONS } from "./data";

const HEAD = ["Member", "Group", "Installment", "Late Fee", "Due Date", "Status"];
const NUMERIC = [2, 3];

function Pill({ status }: { status: "Paid" | "Pending" | "Overdue" }) {
  const styles = {
    Paid: { box: "bg-[#E4F7EF] text-[#0B7A5A]", dot: "bg-[#12A37A]" },
    Pending: { box: "bg-[#F1F4F9] text-[#667085]", dot: "bg-[#98A2B3]" },
    Overdue: { box: "bg-[#FEF3E2] text-[#B7791F]", dot: "bg-[#F5A524]" },
  } as const;
  const s = styles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ${s.box}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

export default function CollectionTab() {
  return (
    <div className="p-6">
      <h3 className="font-['Poppins'] text-[22px] font-bold text-[#0F1B2D]">Collection</h3>
      <p className="mt-0.5 text-[13px] text-[#5B6B8C]">
        Is mahine ka collection aur baaki ka status
      </p>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="rounded-[12px] border border-[#E5E9F2] bg-white p-4">
          <p className="text-[13px] text-[#5B6B8C]">Collected this month</p>
          <p className="mt-1 font-['Poppins'] text-[24px] font-bold text-[#12A37A]">
            ₹18,40,000.00
          </p>
        </div>
        <div className="rounded-[12px] border border-[#E5E9F2] bg-white p-4">
          <p className="text-[13px] text-[#5B6B8C]">Pending / Overdue</p>
          <p className="mt-1 font-['Poppins'] text-[24px] font-bold text-[#B7791F]">
            ₹1,45,000.00
          </p>
        </div>
        <div className="rounded-[12px] border border-[#E5E9F2] bg-white p-4">
          <p className="text-[13px] text-[#5B6B8C]">Members paid</p>
          <p className="mt-1 font-['Poppins'] text-[24px] font-bold text-[#0F1B2D]">
            196 / 240
          </p>
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
            {COLLECTIONS.map((c) => (
              <tr key={c.member}>
                <td className="font-medium">{c.member}</td>
                <td className="text-[#5B6B8C]">{c.group}</td>
                <td className="km-num">{c.installment}</td>
                <td className="km-num text-[#B7791F]">{c.lateFee}</td>
                <td className="text-[#5B6B8C]">{c.due}</td>
                <td>
                  <Pill status={c.status} />
                </td>
              </tr>
            ))}
            <tr className="bg-[#F9FAFD] font-bold">
              <td colSpan={2}>TOTALS</td>
              <td className="km-num">62,500.00</td>
              <td className="km-num text-[#B7791F]">350.00</td>
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}