"use client";

import { useCallback, useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BrowserFrame from "./BrowserFrame";
import AppShell from "./AppShell";
import DashboardTab from "./DashboardTab";
import MembersTab from "./MembersTab";
import GroupsTab from "./GroupsTab";
import BoliTab from "./BoliTab";
import CollectionTab from "./CollectionTab";
import { usePrefersReducedMotion } from "../../lib/hooks";

const SCREENS = [
  { label: "Dashboard", node: <DashboardTab key="dashboard" /> },
  { label: "Members", node: <MembersTab key="members" /> },
  { label: "Groups", node: <GroupsTab key="groups" /> },
  { label: "Auction", node: <BoliTab key="auction" /> },
  { label: "Collection", node: <CollectionTab key="collection" /> },
];

export default function ProductOverviewSection() {
  const [active, setActive] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [stopped, setStopped] = useState(false);
  const reduced = usePrefersReducedMotion();

  const stop = useCallback(() => setStopped(true), []);

  const select = useCallback((screen: number) => {
    setStopped(true);
    setActive(screen);
    setShowHint(false);
  }, []);

  const step = useCallback((dir: number) => {
    setStopped(true);
    setShowHint(false);
    setActive((i) => (i + dir + SCREENS.length) % SCREENS.length);
  }, []);

  useEffect(() => {
    if (stopped || reduced) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % SCREENS.length),
      7000
    );
    return () => window.clearInterval(id);
  }, [stopped, reduced]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    }
  };

  return (
    <section
      className="bg-white py-16 md:py-24"
      onMouseEnter={stop}
      onFocus={stop}
    >
      <div className="km-container">
        <h2 className="font-['Poppins'] text-[28px] font-bold text-[#0F1B2D] md:text-[38px]">
          Aisa dikhta hai aapka KametiPro
        </h2>
        <p className="mt-3 text-[17px] text-[#5B6B8C]">
          Chal raha software, demo data ke saath.
        </p>

        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto md:hidden">
          {SCREENS.map((s, i) => (
            <button
              key={s.label}
              type="button"
              onClick={() => select(i)}
              aria-current={i === active ? "true" : undefined}
              className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                i === active
                  ? "bg-[#3B4FD8] text-white"
                  : "bg-[#EEF2FF] text-[#5B6B8C]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-4 md:mt-8">
          <BrowserFrame>
            <AppShell active={active} onSelect={select} showHint={showHint}>
              {SCREENS[active].node}
            </AppShell>
          </BrowserFrame>
        </div>

        <div
          className="mt-5 flex items-center justify-center gap-4"
          onKeyDown={onKeyDown}
        >
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Pichla screen"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#DDE3F0] text-[#5B6B8C] transition-colors hover:border-[#3B4FD8] hover:bg-[#EEF2FF] hover:text-[#3B4FD8]"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>

          <div className="flex items-center gap-1">
            {SCREENS.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => select(i)}
                aria-label={s.label}
                aria-current={i === active ? "true" : undefined}
                className="flex h-8 cursor-pointer items-center justify-center px-1"
              >
                <span
                  className={`block rounded-full transition-all ${
                    i === active ? "h-2.5 w-6 bg-[#3B4FD8]" : "h-2.5 w-2.5 bg-[#C7CFE4]"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Agla screen"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#DDE3F0] text-[#5B6B8C] transition-colors hover:border-[#3B4FD8] hover:bg-[#EEF2FF] hover:text-[#3B4FD8]"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>

        <p className="mt-3 text-center text-[17px] text-[#5B6B8C]">
          <span className="hidden md:inline">Sidebar ya arrows se screens dekhiye.</span>
          <span className="md:hidden">Tabs ya arrows se screens dekhiye.</span>
        </p>
      </div>
    </section>
  );
}