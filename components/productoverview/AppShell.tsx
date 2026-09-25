"use client";

import type { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import AppTopBar from "./AppTopBar";

export default function AppShell({
  active,
  onSelect,
  showHint,
  children,
}: {
  active: number;
  onSelect: (screen: number) => void;
  showHint: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 bg-[#F7F9FC]">
      <AppSidebar active={active} onSelect={onSelect} showHint={showHint} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopBar />
        <div
          key={active}
          id="kpro-panel"
          role="tabpanel"
          aria-labelledby={`kpro-tab-${active}`}
          className="screen-fade thin-scrollbar min-h-0 flex-1 overflow-auto"
        >
          {children}
        </div>
      </div>
    </div>
  );
}