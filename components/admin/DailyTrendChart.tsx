"use client";

import { useState } from "react";

interface DailyTrendChartProps {
  data: { date: string; count: number }[];
  color?: string;
}

const WIDTH = 600;
const HEIGHT = 200;
const PADDING_TOP = 12;
const PADDING_BOTTOM = 8;
const PLOT_HEIGHT = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
const GRID_STEPS = [0, 0.25, 0.5, 0.75, 1];

function niceMax(value: number): number {
  if (value <= 0) return 4;
  const steps = [1, 2, 4, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
  const step = steps.find((s) => value <= s);
  if (step) return step;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  return Math.ceil(value / magnitude) * magnitude;
}

function formatShortDate(iso: string): string {
  const [, month, day] = iso.split("-");
  return `${day}/${month}`;
}

export function DailyTrendChart({ data, color = "var(--accent)" }: DailyTrendChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const max = niceMax(Math.max(...data.map((d) => d.count), 0));
  const stepX = data.length > 1 ? WIDTH / (data.length - 1) : 0;

  const points = data.map((d, i) => ({
    x: data.length > 1 ? i * stepX : WIDTH / 2,
    y: PADDING_TOP + PLOT_HEIGHT - (d.count / max) * PLOT_HEIGHT,
    date: d.date,
    count: d.count,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const baselineY = PADDING_TOP + PLOT_HEIGHT;
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x} ${baselineY} Z`
      : "";

  const active = activeIndex !== null ? points[activeIndex] : null;

  return (
    <div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full overflow-visible"
          preserveAspectRatio="none"
          role="img"
          aria-label="Daily views chart, last 30 days"
        >
          {GRID_STEPS.map((step) => (
            <line
              key={step}
              x1={0}
              x2={WIDTH}
              y1={PADDING_TOP + PLOT_HEIGHT * step}
              y2={PADDING_TOP + PLOT_HEIGHT * step}
              stroke="var(--border)"
              strokeWidth={1}
            />
          ))}
          {areaPath && <path d={areaPath} fill={color} opacity={0.1} stroke="none" />}
          <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          {active && (
            <>
              <line
                x1={active.x}
                x2={active.x}
                y1={PADDING_TOP}
                y2={baselineY}
                stroke="var(--border)"
                strokeWidth={1}
              />
              <circle cx={active.x} cy={active.y} r={4} fill={color} stroke="var(--card-bg)" strokeWidth={2} />
            </>
          )}
        </svg>

        <div className="absolute inset-0 flex">
          {points.map((p, i) => (
            <button
              key={p.date}
              type="button"
              tabIndex={0}
              className="h-full flex-1 outline-none"
              onMouseEnter={() => setActiveIndex(i)}
              onFocus={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              onBlur={() => setActiveIndex(null)}
              aria-label={`${formatShortDate(p.date)}: ${p.count} views`}
            />
          ))}
        </div>

        {active && (
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] px-2.5 py-1.5 text-xs shadow-lg"
            style={{ left: `${(active.x / WIDTH) * 100}%` }}
          >
            <p className="font-semibold text-[var(--text-primary)]">{active.count} views</p>
            <p className="text-[var(--text-muted)]">{formatShortDate(active.date)}</p>
          </div>
        )}
      </div>

      <div className="mt-1 flex justify-between text-xs text-[var(--text-muted)]">
        <span>{formatShortDate(data[0]?.date ?? "")}</span>
        <span>{formatShortDate(data[data.length - 1]?.date ?? "")}</span>
      </div>

      <details className="mt-3 text-xs text-[var(--text-secondary)]">
        <summary className="cursor-pointer select-none">View as table</summary>
        <div className="mt-2 max-h-48 overflow-y-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[var(--text-muted)]">
                <th className="py-1 font-normal">Date</th>
                <th className="py-1 text-right font-normal">Views</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.date} className="border-t border-[var(--border)]">
                  <td className="py-1">{d.date}</td>
                  <td className="py-1 text-right tabular-nums">{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
