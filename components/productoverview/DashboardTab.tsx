"use client";

import StatCard from "./StatCard";
import OutstandingAgeing from "./OutstandingAgeing";
import CollectionsChart from "./CollectionsChart";
import GroupPerformanceChart from "./GroupPerformanceChart";
import { STATS } from "./data";

export default function DashboardTab() {
  return (
    <div className="p-6">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="font-['Poppins'] text-[22px] font-bold text-[#0F1B2D]">Dashboard</h3>
          <p className="mt-0.5 text-[13px] text-[#5B6B8C]">Welcome back, Super Admin</p>
        </div>
        <p className="text-[13px] text-[#5B6B8C]">Collections this month: ₹18,40,000.00</p>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-4">
        {STATS.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            tone={s.tone as "indigo" | "teal" | "green" | "amber"}
          />
        ))}
      </div>

      <div className="mt-4">
        <OutstandingAgeing />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <CollectionsChart />
        <GroupPerformanceChart />
      </div>
    </div>
  );
}