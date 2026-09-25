"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  LayoutDashboard,
  Users,
  Layers,
  Gavel,
  Wallet,
  HandCoins,
  BarChart3,
  Settings,
  UserCircle,
  PanelLeftClose,
} from "lucide-react";

const TABS = [
  { label: "Dashboard", screen: 0, Icon: LayoutDashboard },
  { label: "Members", screen: 1, Icon: Users },
  { label: "Groups", screen: 2, Icon: Layers },
  { label: "Auction", screen: 3, Icon: Gavel },
  { label: "Collection", screen: 4, Icon: Wallet },
];

const LOCKED = [
  { label: "Payout", Icon: HandCoins },
  { label: "Reports", Icon: BarChart3 },
  { label: "Settings", Icon: Settings },
];

const TIP_TEXT = "Demo mein dekhiye";

export default function AppSidebar({
  active,
  onSelect,
  showHint,
}: {
  active: number;
  onSelect: (screen: number) => void;
  showHint: boolean;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [tip, setTip] = useState<number | null>(null);

  const move = (i: number) => {
    const next = (i + TABS.length) % TABS.length;
    onSelect(TABS[next].screen);
    refs.current[next]?.focus();
  };

  const onKeyDown = (e: ReactKeyboardEvent, i: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(i + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      move(0);
    } else if (e.key === "End") {
      e.preventDefault();
      move(TABS.length - 1);
    }
  };

  const showTip = (e: { currentTarget: HTMLButtonElement }) => {
    const el = e.currentTarget;
    setTip(el.offsetTop + el.offsetHeight / 2);
  };

  return (
    <aside className="relative flex h-full w-[200px] shrink-0 flex-col border-r border-[#E5E9F2] bg-white md:w-[230px]">
      <div className="flex shrink-0 items-center justify-center px-4 py-4">
        <img
          src="https://storage.helloreaddy.io/project_files/9bb86594-2c5f-46b8-bd7f-b7ec7098d2d5/0cb6167c-f2c4-4579-8d4c-616b5fe81bcb_compressed_ChatGPT-Image-Sep-24-2026-02_59_07-PM.webp"
          alt="Kameti Management Software by Digi India Solutions"
          className="h-10 w-auto shrink-0 object-contain"
        />
      </div>

      <nav className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-2 py-1">
        <div role="tablist" aria-orientation="vertical" aria-label="KametiPro screens" className="flex flex-col gap-0.5">
          {TABS.map(({ label, screen, Icon }, i) => {
            const on = screen === active;
            return (
              <button
                key={label}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`kpro-tab-${screen}`}
                aria-selected={on}
                aria-controls="kpro-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => onSelect(screen)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`flex h-[44px] shrink-0 cursor-pointer items-center gap-3 rounded-[8px] px-3 text-[15px] transition-colors ${
                  on
                    ? "rounded-[10px] bg-[#3B4FD8] font-semibold text-white"
                    : "text-[#3C4A63] hover:bg-[#EEF2FF]"
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
                {label === "Groups" && showHint && (
                  <span className="km-hint-dot ml-auto h-2 w-2 rounded-full bg-[#F5A524]" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-0.5 flex flex-col gap-0.5">
          {LOCKED.map(({ label, Icon }) => (
            <button
              key={label}
              type="button"
              aria-disabled="true"
              onMouseEnter={showTip}
              onMouseLeave={() => setTip(null)}
              onFocus={showTip}
              onBlur={() => setTip(null)}
              className="flex h-[44px] shrink-0 cursor-not-allowed items-center gap-3 rounded-[8px] px-3 text-[15px] text-[#9AA6BC]"
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="mx-1 my-2 shrink-0 border-t border-[#E5E9F2]" />

        <button
          type="button"
          aria-disabled="true"
          onMouseEnter={showTip}
          onMouseLeave={() => setTip(null)}
          onFocus={showTip}
          onBlur={() => setTip(null)}
          className="flex h-[44px] shrink-0 cursor-not-allowed items-center gap-3 rounded-[8px] px-3 text-[15px] text-[#9AA6BC]"
        >
          <UserCircle size={18} aria-hidden="true" />
          <span>My Profile</span>
        </button>
      </nav>

      <div className="flex h-[52px] shrink-0 items-center gap-3 border-t border-[#E5E9F2] px-4 text-[15px] text-[#5B6B8C]">
        <PanelLeftClose size={18} aria-hidden="true" />
        Collapse
      </div>

      {tip !== null && (
        <span
          style={{ top: tip }}
          className="pointer-events-none absolute left-[calc(100%+8px)] z-50 -translate-y-1/2 whitespace-nowrap rounded-[8px] bg-[#0F1B2D] px-2.5 py-1.5 text-[12px] font-medium text-white shadow-lg"
        >
          {TIP_TEXT}
        </span>
      )}
    </aside>
  );
}