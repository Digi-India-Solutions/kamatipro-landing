"use client";

import {
  Gavel,
  Users,
  Layers,
  BookOpen,
  Clock,
  ListChecks,
  Smartphone,
} from "lucide-react";

const FEATURES = [
  {
    icon: <Gavel size={22} aria-hidden="true" />,
    title: "Har mahine ki boli",
    desc: "Boli entry karte hi winner ko milne wala amount aur har member ka dividend apne aap calculate.",
  },
  {
    icon: <Users size={22} aria-hidden="true" />,
    title: "Sabko barabar dividend",
    desc: "Dividend har member mein baraabar batta hai, jinhone kameti utha li unmein bhi.",
  },
  {
    icon: <Layers size={22} aria-hidden="true" />,
    title: "Kai kameti groups ek saath",
    desc: "Jitne chahein groups chalayein. Ek member kai groups mein ho sakta hai.",
  },
  {
    icon: <BookOpen size={22} aria-hidden="true" />,
    title: "Member-wise ledger",
    desc: "Har member ka hisaab group ke hisaab se bhi aur sabhi groups ka total bhi.",
  },
  {
    icon: <Clock size={22} aria-hidden="true" />,
    title: "Late payment ke niyam",
    desc: "Grace days kitne, late fee kitni, yeh aap apni kameti ke hisaab se set karein.",
  },
  {
    icon: <ListChecks size={22} aria-hidden="true" />,
    title: "Mahine ki baaki list",
    desc: "Kisne bhara, kiska baaki hai, ek nazar mein. Collection ke liye list tayyar.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-[#EEF2FF] py-16 md:py-24">
      <div className="km-container">
        <h2 className="font-['Poppins'] text-[28px] font-bold text-[#0F1B2D] md:text-[38px]">
          Boli wali kameti ke liye banaya gaya
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex flex-col rounded-[12px] bg-white p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B4FD8]">
                {f.icon}
              </span>
              <h3 className="mt-4 font-['Poppins'] text-base font-semibold text-[#0F1B2D]">
                {f.title}
              </h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-[#5B6B8C]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 text-[#3B4FD8]">
          <span className="flex h-6 w-6 items-center justify-center">
            <Smartphone size={20} aria-hidden="true" />
          </span>
          <span className="text-[15px] font-medium text-[#5B6B8C]">
            Phone ya laptop, kahin se bhi login karein. Koi software install
            nahi karna.
          </span>
        </div>
      </div>
    </section>
  );
}