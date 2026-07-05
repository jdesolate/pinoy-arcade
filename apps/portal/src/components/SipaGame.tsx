"use client";

import { useEffect, useRef } from "react";

export default function SipaGame() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    let game: import("phaser").Game | undefined;
    let cancelled = false;
    // Phaser touches window at import time, so it must load client-side only.
    void import("@pinoy-arcade/sipa").then(({ createSipaGame }) => {
      if (!cancelled) {
        game = createSipaGame(container);
      }
    });
    return () => {
      cancelled = true;
      game?.destroy(true);
    };
  }, []);

  return <div ref={containerRef} className="h-[600px] w-full max-w-[800px]" />;
}
