"use client";

const LABELS = ["SKS-001", "SKS-002", "SKS-003", "SKS-004", "SKS-005", "SKS-006", "SKS-007", "SKS-008"];
const SUBS = ["50K/20", "3L/14", "5L/10", "50K/10", "50K/15", "1L/15", "50K/20", "1L/20"];
const EXPECTED = [5, 12, 25, 2.5, 5, 7.5, 5, 10];
const COLLECTED = [4.8, 11.5, 24, 2.4, 4.7, 7.2, 4.8, 9.5];

const W = 360;
const H = 236;
const PL = 40;
const PR = 8;
const PT = 12;
const PB = 42;
const IW = W - PL - PR;
const IH = H - PT - PB;
const MAX = 26;
const SLOT = IW / LABELS.length;
const BAR = 16;
const GAP = 3;

const y = (v: number) => PT + IH - (v / MAX) * IH;

export default function GroupPerformanceChart() {
  return (
    <div className="rounded-[12px] border border-[#E5E9F2] bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-['Poppins'] text-[15px] font-semibold text-[#0F1B2D]">
            Group Performance
          </h4>
          <p className="mt-0.5 text-[13px] text-[#5B6B8C]">
            Collected vs expected, current cycle
          </p>
        </div>
        <span className="cursor-default text-[13px] font-medium text-[#3B4FD8]">Report</span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-4 w-full"
        role="img"
        aria-label="Collected versus expected amounts for eight groups"
      >
        {[0, 6.5, 13, 19.5, 26].map((t) => (
          <g key={t}>
            <line x1={PL} y1={y(t)} x2={W - PR} y2={y(t)} stroke="#EDF1F7" strokeWidth={1} />
            <text x={PL - 6} y={y(t) + 3} textAnchor="end" fontSize={8.5} fill="#98A2B3">
              ₹{t}L
            </text>
          </g>
        ))}

        {LABELS.map((_, i) => {
          const cx = PL + i * SLOT + SLOT / 2;
          const startX = cx - (BAR * 2 + GAP) / 2;
          return (
            <g key={i}>
              <rect
                x={startX}
                y={y(EXPECTED[i])}
                width={BAR}
                height={PT + IH - y(EXPECTED[i])}
                rx={2.5}
                fill="#C3CBF5"
              />
              <rect
                x={startX + BAR + GAP}
                y={y(COLLECTED[i])}
                width={BAR}
                height={PT + IH - y(COLLECTED[i])}
                rx={2.5}
                fill="#3B4FD8"
              />
              <text x={cx} y={H - 22} textAnchor="middle" fontSize={8} fontWeight={600} fill="#3C4A63">
                {LABELS[i]}
              </text>
              <text x={cx} y={H - 11} textAnchor="middle" fontSize={7.5} fill="#98A2B3">
                {SUBS[i]}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-3 flex items-center gap-5 text-[12px] text-[#5B6B8C]">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-[#C3CBF5]" />
          Expected
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-[#3B4FD8]" />
          Collected
        </span>
      </div>
    </div>
  );
}