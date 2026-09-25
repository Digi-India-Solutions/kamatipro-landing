"use client";

import { X, Check } from "lucide-react";

const PROBLEMS = [
  "Har boli ke baad dividend haath se calculate",
  "Ek member kai kametiyon mein, hisaab alag-alag panno pe",
  "Late payment ka record yaad ke bharose",
  "Member ne sawaal kiya to purane panne palatna",
];

const SOLUTIONS = [
  "Boli daalte hi winner ka amount aur sabka dividend tayyar",
  "Member ka group-wise aur total ledger ek click pe",
  "Grace days aur late fee apne niyam se automatic",
  "Kisi bhi member ka poora record turant dikhayein",
];

export default function ProblemSolutionSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="km-container">
        <h2 className="font-['Poppins'] text-[28px] font-bold text-[#0F1B2D] md:text-[38px]">
          Har mahine wahi sawaal: kisne bhara, kiska baaki, dividend kitna?
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#5B6B8C] md:text-lg">
          Kameti jitni badi hoti hai, diary utni hi uljhan banti hai. KametiPro
          woh saara hisaab khud rakhta hai.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-[12px] bg-[#F0F3FA] p-6">
            <h3 className="font-['Poppins'] text-base font-semibold text-[#5B6B8C]">
              Diary aur calculator se
            </h3>
            <ul className="mt-4 space-y-3">
              {PROBLEMS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[#5B6B8C]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DDE3F0] text-[#5B6B8C]">
                    <X size={13} aria-hidden="true" />
                  </span>
                  <span className="text-[15px] leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[12px] bg-[#111B3E] p-6 text-white">
            <h3 className="font-['Poppins'] text-base font-semibold text-[#F5A524]">
              KametiPro se
            </h3>
            <ul className="mt-4 space-y-3">
              {SOLUTIONS.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F5A524] text-[#111B3E]">
                    <Check size={13} aria-hidden="true" />
                  </span>
                  <span className="text-[15px] leading-relaxed text-[#C9D4F5]">
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}