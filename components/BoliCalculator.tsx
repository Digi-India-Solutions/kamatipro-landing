"use client";

import { useRef, useState } from "react";
import { formatINR } from "../lib/format";
import { track } from "../lib/track";
import CalculatorRow from "./CalculatorRow";

type Results = {
  total: number;
  winnerAmount: number;
  dividend: number;
  memberPays: number;
} | null;

type ErrorKind = "invalid" | "boliTooHigh" | null;

function calcResults(
  members: number,
  kisht: number,
  boli: number
): { results: Results; errorKind: ErrorKind; errorMsg: string } {
  if (members < 2 || kisht <= 0 || boli < 0) {
    return {
      results: null,
      errorKind: "invalid",
      errorMsg:
        "Members kam se kam 2, aur kisht aur boli sahi number mein daalein.",
    };
  }
  const total = members * kisht;
  if (boli >= total) {
    return {
      results: null,
      errorKind: "boliTooHigh",
      errorMsg: `Boli kul kameti (${formatINR(total)}) se kam honi chahiye.`,
    };
  }
  return {
    results: {
      total,
      winnerAmount: total - boli,
      dividend: boli / members,
      memberPays: kisht - boli / members,
    },
    errorKind: null,
    errorMsg: "",
  };
}

export default function BoliCalculator() {
  const [members, setMembers] = useState(20);
  const [kisht, setKisht] = useState(5000);
  const [boli, setBoli] = useState(15000);
  const tracked = useRef(false);

  const { results, errorKind, errorMsg } = calcResults(members, kisht, boli);

  const handleChange = () => {
    if (!tracked.current) {
      tracked.current = true;
      track("calculator_use");
    }
    try {
      window.dispatchEvent(new CustomEvent("kp_calc_change"));
    } catch {}
  };

  return (
    <div className="w-full rounded-[16px] bg-white shadow-lg" style={{ borderTop: "6px solid #F5A524" }}>
      <div className="p-5 pb-3">
        <h3 className="font-['Poppins'] text-lg font-bold text-[#111B3E]">
          Is mahine ka hisaab
        </h3>
        <p className="mt-0.5 text-[15px] text-[#5B6B8C]">
          Apni kameti ke number daal ke dekhiye
        </p>
      </div>

      <div className="px-5 pb-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="calc-members"
            className="text-[15px] font-medium text-[#0F1B2D] whitespace-nowrap"
          >
            Kul members
          </label>
          <input
            id="calc-members"
            type="number"
            min={2}
            value={members}
            onChange={(e) => {
              setMembers(Number(e.target.value));
              handleChange();
            }}
            className="w-28 rounded-[10px] border border-[#DDE3F0] px-3 py-2 text-right text-[15px] font-semibold text-[#0F1B2D] focus:border-[#3B4FD8] focus:outline-none focus:ring-2 focus:ring-[#3B4FD8]/20"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="calc-kisht"
            className="text-[15px] font-medium text-[#0F1B2D] whitespace-nowrap"
          >
            Mahine ki kisht (₹)
          </label>
          <input
            id="calc-kisht"
            type="number"
            min={1}
            value={kisht}
            onChange={(e) => {
              setKisht(Number(e.target.value));
              handleChange();
            }}
            className="w-28 rounded-[10px] border border-[#DDE3F0] px-3 py-2 text-right text-[15px] font-semibold text-[#0F1B2D] focus:border-[#3B4FD8] focus:outline-none focus:ring-2 focus:ring-[#3B4FD8]/20"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="calc-boli"
            className="text-[15px] font-medium text-[#0F1B2D] whitespace-nowrap"
          >
            Boli, kitna chhoda (₹)
          </label>
          <input
            id="calc-boli"
            type="number"
            min={0}
            value={boli}
            onChange={(e) => {
              setBoli(Number(e.target.value));
              handleChange();
            }}
            className="w-28 rounded-[10px] border border-[#DDE3F0] px-3 py-2 text-right text-[15px] font-semibold text-[#0F1B2D] focus:border-[#3B4FD8] focus:outline-none focus:ring-2 focus:ring-[#3B4FD8]/20"
          />
        </div>
      </div>

      <div className="mx-5 border-t border-[#DDE3F0]" />

      <div className="px-5 pt-3 pb-5 space-y-2">
        {errorKind ? (
          <p
            role="alert"
            aria-live="polite"
            className="rounded-[10px] bg-red-50 px-3 py-2 text-[15px] text-red-600"
          >
            {errorMsg}
          </p>
        ) : results ? (
          <>
            <CalculatorRow
              label="Kul kameti"
              value={formatINR(results.total)}
            />
            <CalculatorRow
              label="Boli jeetne wale ko"
              value={formatINR(results.winnerAmount)}
              boxed
              big
            />
            <CalculatorRow
              label="Har member ka dividend"
              value={formatINR(results.dividend)}
            />
            <CalculatorRow
              label="Is mahine har member bharega"
              value={formatINR(results.memberPays)}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}