"use client";

import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Kya yeh mobile pe chalega?",
    a: "Haan. KametiPro browser mein chalta hai, isliye phone, tablet aur laptop teeno pe use kar sakte hain.",
  },
  {
    q: "Kya yeh lucky draw (parchi) wali kameti ke liye bhi hai?",
    a: "Abhi KametiPro boli (auction) wali kameti ke liye bana hai. Aapki kameti ka tareeka alag hai to demo mein bataiye, hum dekh lenge ki kya ho sakta hai.",
  },
  {
    q: "Meri kameti ke niyam thode alag hain. Chalega?",
    a: "Grace days aur late fee jaise niyam settings se badle ja sakte hain. Baaki zarooraton ke liye hum software customize bhi karte hain.",
  },
  {
    q: "Kitne groups aur members rakh sakte hain?",
    a: "Aap kai groups ek saath chala sakte hain, aur ek member ek se zyada groups mein ho sakta hai.",
  },
  {
    q: "Price kitna hai?",
    a: "Plan aapke groups aur members ki ginti ke hisaab se banta hai. Demo mein poori jaankari aur price dono milenge.",
  },
  {
    q: "Chal rahi kameti ka purana hisaab kaise aayega?",
    a: "Setup ke time hamari team aapke chal rahe groups, members aur ab tak ke payments system mein daalne mein madad karti hai.",
  },
];

function FaqItem({
  q,
  a,
  isOpen,
  onClick,
  index,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <div className="border-b border-[#DDE3F0]">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A524]"
        aria-expanded={isOpen}
        aria-controls={`faq-ans-${index}`}
        onClick={onClick}
      >
        <span className="text-[15px] font-semibold text-[#0F1B2D] md:text-[17px]">
          {q}
        </span>
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center text-[#3B4FD8] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <ChevronDown size={20} aria-hidden="true" />
        </span>
      </button>
      <div
        id={`faq-ans-${index}`}
        role="region"
        hidden={!isOpen}
        className="pb-4 text-[15px] leading-relaxed text-[#5B6B8C]"
      >
        {a}
      </div>
    </div>
  );
}

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = useCallback(
    (i: number) => setOpen((prev) => (prev === i ? null : i)),
    []
  );

  return (
    <section className="bg-[#EEF2FF] py-16 md:py-24">
      <div className="km-container">
        <h2 className="font-['Poppins'] text-[28px] font-bold text-[#0F1B2D] md:text-[38px]">
          Aksar pooche jaane wale sawaal
        </h2>
        <div className="mt-8 max-w-3xl">
          {FAQS.map((f, i) => (
            <FaqItem
              key={i}
              q={f.q}
              a={f.a}
              isOpen={open === i}
              onClick={() => toggle(i)}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}