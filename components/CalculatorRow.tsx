"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  label: string;
  value: string;
  boxed?: boolean;
  big?: boolean;
};

export default function CalculatorRow({ label, value, boxed, big }: Props) {
  const [flash, setFlash] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setFlash(true);
    const timer = setTimeout(() => setFlash(false), 700);
    return () => clearTimeout(timer);
  }, [value]);

  const content = (
    <div className="flex items-baseline justify-between gap-4">
      <span
        className={
          boxed
            ? "text-[15px] font-semibold text-[#0F1B2D]"
            : "text-[15px] text-[#5B6B8C]"
        }
      >
        {label}
      </span>
      <span
        className={[
          "whitespace-nowrap font-['Poppins'] font-bold transition-colors duration-300 motion-reduce:transition-none",
          big ? "text-2xl" : "text-base",
          boxed ? "text-[#12A594]" : "text-[#0F1B2D]",
          flash ? "text-[#F5A524]" : "",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );

  if (boxed) {
    return (
      <div className="rounded-[12px] bg-[#EEF2FF] px-4 py-3">{content}</div>
    );
  }

  return <div className="py-1">{content}</div>;
}