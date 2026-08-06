"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function CustomScrollbar() {
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    const thumb = thumbRef.current;
    if (!thumb) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      e.preventDefault();
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !scrollbarRef.current || !thumbRef.current) return;

      const scrollbar = scrollbarRef.current;
      const rect = scrollbar.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const thumbHeight = thumbRef.current.clientHeight;
      const maxTravel = scrollbar.clientHeight - thumbHeight;

      const clampedY = Math.max(0, Math.min(relativeY - thumbHeight / 2, maxTravel));
      const scrollPercent = clampedY / maxTravel;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      window.scrollTo(0, scrollPercent * scrollHeight);
    };

    thumb.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      thumb.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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
          ? "slideInScrollbar 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
          : "slideOutScrollbar 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
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
