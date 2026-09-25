"use client";

const STEPS = [
  {
    n: "01",
    title: "Demo dekhiye",
    desc: "Hum aapke office ya dukaan pe aakar live demo denge. Delhi NCR mein visit free hai.",
  },
  {
    n: "02",
    title: "Groups set karwaiye",
    desc: "Aapki chal rahi kametiyan aur members hum system mein daalne mein madad karenge.",
  },
  {
    n: "03",
    title: "Hisaab software pe",
    desc: "Agli boli se sab KametiPro pe. Training aur phone support saath mein.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-[#EEF2FF] py-16 md:py-[88px]">
      <div className="km-container">
        <h2 className="font-['Poppins'] text-[28px] font-bold text-[#0F1B2D] md:text-[38px]">
          Shuru karna aasaan hai
        </h2>

        <div className="relative mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="absolute left-0 top-8 hidden h-0.5 w-full bg-[#3B4FD8]/30 md:block" />
          {STEPS.map((s) => (
            <div key={s.n} className="relative flex flex-col items-start">
              <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5A524] font-['Poppins'] text-xl font-bold text-[#0F1B2D]">
                {s.n}
              </span>
              <h3 className="mt-4 font-['Poppins'] text-lg font-semibold text-[#111B3E]">
                {s.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#5B6B8C]">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}