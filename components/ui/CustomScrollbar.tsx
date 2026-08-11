"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useOnScroll } from "@/hooks/useOnScroll";

export default function CustomScrollbar() {
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(
    () => typeof window !== 'undefined' && window.scrollY !== 0
  );
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  const handleScroll = useCallback(() => {
    if (!thumbRef.current || !scrollbarRef.current) return;

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight === 0) return;

    const isAtTop = window.scrollY === 0;

    setIsVisible((prev) => {
      if (isAtTop && prev) {
        setIsAnimatingIn(false);
        return false;
      }
      if (!isAtTop && !prev) {
        setIsAnimatingIn(true);
        return true;
      }
      return prev;
    });

    const scrollPercent = window.scrollY / scrollHeight;
    const thumbHeight = scrollbarRef.current.clientHeight;
    const maxThumbTravel = thumbHeight - thumbRef.current.clientHeight;

    thumbRef.current.style.top = `${scrollPercent * maxThumbTravel}px`;
  }, []);

  useOnScroll(handleScroll);

  // Starting a drag only needs a listener on the thumb itself — cheap,
  // stays attached for the component's whole lifetime.
  useEffect(() => {
    const thumb = thumbRef.current;
    if (!thumb) return;

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      e.preventDefault();
    };

    thumb.addEventListener("mousedown", handleMouseDown);
    return () => thumb.removeEventListener("mousedown", handleMouseDown);
  }, []);

  // mousemove fires far more often than scroll (every pixel of cursor
  // motion, anywhere on the page) — these listeners only need to exist for
  // the brief window an actual drag is in progress, not for the component's
  // entire mounted lifetime, so they're scoped to `isDragging` here instead
  // of living in the mousedown effect above with an internal ref-guard.
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e: MouseEvent) => {
      if (!scrollbarRef.current || !thumbRef.current) return;

      const scrollbar = scrollbarRef.current;
      const rect = scrollbar.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const thumbHeight = thumbRef.current.clientHeight;
      const maxTravel = scrollbar.clientHeight - thumbHeight;

      const clampedY = Math.max(0, Math.min(relativeY - thumbHeight / 2, maxTravel));
      const scrollPercent = clampedY / maxTravel;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Explicit 'auto': globals.css sets `html { scroll-behavior: smooth }`
      // for normal navigation, but that makes every scrollTo() call here
      // animate to its target — with mousemove firing many times a second,
      // each call interrupts the previous animation before it settles, so
      // the thumb/page visibly lags behind the cursor and only catches up
      // once the drag stops. A drag needs to track the cursor 1:1, instantly.
      window.scrollTo({ top: scrollPercent * scrollHeight, left: 0, behavior: 'auto' });
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging]);

  return (
    <div
      ref={scrollbarRef}
      className="custom-scrollbar"
      style={{
        position: "fixed",
        right: "8px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "6px",
        height: "50vh",
        backgroundColor: "var(--scrollbar-track)",
        borderRadius: "3px",
        pointerEvents: isVisible ? "auto" : "none",
        zIndex: 40,
        opacity: isVisible ? 1 : 0,
        animation: isAnimatingIn
          ? "slideInScrollbar 2s var(--ease-bounce) forwards"
          : "slideOutScrollbar 2s var(--ease-bounce) forwards",
        transition: isDragging ? "none" : "opacity 0.3s ease",
      }}
    >
      <div
        ref={thumbRef}
        className="custom-scrollbar-thumb"
        style={{
          position: "absolute",
          width: "100%",
          height: "60px",
          backgroundColor: "var(--scrollbar-thumb)",
          borderRadius: "3px",
          cursor: "grab",
          transition: isDragging ? "none" : "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.backgroundColor =
            "var(--scrollbar-thumb-hover)";
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            (e.currentTarget as HTMLDivElement).style.backgroundColor =
              "var(--scrollbar-thumb)";
          }
        }}
      />
      <style>{`
        @keyframes slideInScrollbar {
          from {
            transform: translateX(20px) translateY(-50%);
            opacity: 0;
          }
          to {
            transform: translateX(0) translateY(-50%);
            opacity: 1;
          }
        }

        @keyframes slideOutScrollbar {
          from {
            transform: translateX(0) translateY(-50%);
            opacity: 1;
          }
          to {
            transform: translateX(20px) translateY(-50%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
