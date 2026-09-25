"use client";

import type { ReactNode } from "react";

export default function BrowserFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[420px] flex-col overflow-hidden rounded-[12px] border border-[#DDE3F0] bg-white shadow-[0_14px_44px_rgba(17,27,62,0.10)] md:h-[560px]">
      <div className="flex h-9 shrink-0 items-center gap-1.5 border-b border-[#E5E9F2] bg-[#F7F9FC] px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-[#CBD5E1]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#CBD5E1]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#CBD5E1]" />
      </div>
      <div className="no-scrollbar flex min-h-0 flex-1 overflow-x-auto">
        <div className="min-h-full w-full min-w-[860px]">{children}</div>
      </div>
    </div>
  );
}