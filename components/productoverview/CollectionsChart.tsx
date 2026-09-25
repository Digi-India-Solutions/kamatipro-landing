"use client";

const MONTHS = ["Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", "Jun 26", "Jul 26", "Aug 26", "Sep 26"];
const COLLECTIONS = [12, 13, 13.5, 14, 15, 15.5, 16, 16.5, 17, 18, 18.5, 19.5];
const PAYOUTS = [10, 11, 11.5, 12, 12.5, 13, 14, 14.5, 15, 15.5, 16, 17];

const W = 360;
const H = 232;
const PL = 40;
const PR = 8;
const PT = 12;
const PB = 30;
const IW = W - PL - PR;
const IH = H - PT - PB;
const MAX = 26;
const SLOT = IW / MONTHS.length;
const BAR = 13;

const y = (v: number) => PT + IH - (v / MAX) * IH;

export default function CollectionsChart() {
  const line = COLLECTIONS.map((_, i) => `${PL + i * SLOT + SLOT / 2},${y(PAYOUTS[i])}`).join(" ");

  return (
    <div className="rounded-[12px] border border-[#E5E9F2] bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-['Poppins'] text-[15px] font-semibold text-[#0F1B2D]">
            Collections vs Payouts
          </h4>
          <p className="mt-0.5 text-[13px] text-[#5B6B8C]">Last 12 months</p>
        </div>
        <span className="cursor-default text-[13px] font-medium text-[#3B4FD8]">Ledger</span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-4 w-full"
        role="img"
        aria-label="Collections versus payouts over the last 12 months"
      >
        {[0, 6.5, 13, 19.5, 26].map((t) => (
          <g key={t}>
            <line x1={PL} y1={y(t)} x2={W - PR} y2={y(t)} stroke="#EDF1F7" strokeWidth={1} />
            <text x={PL - 6} y={y(t) + 3} textAnchor="end" fontSize={8.5} fill="#98A2B3">
              ₹{t}L
            </text>
          </g>
        ))}

        {COLLECTIONS.map((v, i) => (
          <rect
            key={i}
            x={PL + i * SLOT + (SLOT - BAR) / 2}
            y={y(v)}
            width={BAR}
            height={PT + IH - y(v)}
            rx={2.5}
            fill="#3B4FD8"
          />
        ))}

        <polyline points={line} fill="none" stroke="#12A594" strokeWidth={2} strokeLinejoin="round" />
        {PAYOUTS.map((v, i) => (
          <circle key={i} cx={PL + i * SLOT + SLOT / 2} cy={y(v)} r={2.4} fill="#12A594" />
        ))}

        {MONTHS.map((m, i) => (
          <text
            key={m}
            x={PL + i * SLOT + SLOT / 2}
            y={H - 8}
            textAnchor="middle"
            fontSize={7.5}
            fill="#98A2B3"
          >
            {m}
          </text>
        ))}
      </svg>

      <div className="mt-3 flex items-center gap-5 text-[12px] text-[#5B6B8C]">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-[#3B4FD8]" />
          Collections
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-4 rounded-full bg-[#12A594]" />
          <span className="-ml-3 h-1.5 w-1.5 rounded-full bg-[#12A594]" />
          Payouts
        </span>
      </div>
    </div>
  );
}