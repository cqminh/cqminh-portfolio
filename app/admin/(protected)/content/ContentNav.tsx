"use client";

import { useEffect, useState } from "react";

interface ContentNavItem {
  id: string;
  label: string;
}

// Sticks to the top of the scrollable content area (see the `main` in
// app/admin/(protected)/layout.tsx) once the page's own heading scrolls
// past it — a quick-jump bar so a long content page doesn't need endless
// scrolling to reach a section near the bottom.
export function ContentNav({ items }: { items: ContentNavItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const elements = items.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // rootMargin's negative bottom shrinks the observed viewport to a thin
    // band just below the sticky nav, so "active" tracks whichever section
    // sits right under it instead of whatever merely happens to be on screen.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topmost = visible.reduce((best, entry) => (entry.boundingClientRect.top < best.boundingClientRect.top ? entry : best));
        setActiveId(topmost.target.id);
      },
      { rootMargin: "-120px 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="sticky top-0 z-10 -mx-4 flex gap-2 overflow-x-auto border-b border-[var(--card-border)] bg-[var(--background)]/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            activeId === item.id
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--card-bg)] text-[var(--text-secondary)] hover:bg-[var(--card-bg-hover)]"
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
