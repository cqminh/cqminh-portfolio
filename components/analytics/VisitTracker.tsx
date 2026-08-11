"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function VisitTracker() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/admin") || lastSent.current === pathname) return;
    lastSent.current = pathname;

    // Read localStorage directly (same key LanguageProvider persists to) instead of
    // useLanguage(), since the provider restores it asynchronously on mount and this
    // effect can fire before that happens.
    const language = localStorage.getItem("language") === "vi" ? "vi" : "en";

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, language }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
