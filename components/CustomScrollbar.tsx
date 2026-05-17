"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomScrollbar() {
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!thumbRef.current || !scrollbarRef.current) return;

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight === 0) return;

      const isAtTop = window.scrollY === 0;
      const wasVisible = isVisible;

      if (isAtTop && wasVisible) {
        setIsAnimatingIn(false);
        setIsVisible(false);
      } else if (!isAtTop && !wasVisible) {
        setIsVisible(true);
        setIsAnimatingIn(true);
      }

      const scrollPercent = window.scrollY / scrollHeight;
      const thumbHeight = scrollbarRef.current.clientHeight;
      const maxThumbTravel = thumbHeight - thumbRef.current.clientHeight;

      thumbRef.current.style.top = `${scrollPercent * maxThumbTravel}px`;
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      e.preventDefault();
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !scrollbarRef.current || !thumbRef.current) return;

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

    window.addEventListener("scroll", handleScroll);
    thumbRef.current?.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      thumbRef.current?.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging, isVisible]);

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
        backgroundColor: "rgba(200, 200, 200, 0.2)",
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
          backgroundColor: "rgba(100, 100, 100, 0.6)",
          borderRadius: "3px",
          cursor: "grab",
          transition: isDragging ? "none" : "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.backgroundColor =
            "rgba(100, 100, 100, 0.9)";
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            (e.currentTarget as HTMLDivElement).style.backgroundColor =
              "rgba(100, 100, 100, 0.6)";
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
