export interface BarDatum {
  key: string;
  label: string;
  value: number;
  color: string;
}

interface HorizontalBarChartProps {
  data: BarDatum[];
  total: number;
}

export function HorizontalBarChart({ data, total }: HorizontalBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <ul className="flex flex-col gap-3">
      {data.map((d) => {
        const percent = total > 0 ? Math.round((d.value / total) * 100) : 0;
        return (
          <li key={d.key} tabIndex={0} className="group outline-none">
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span className="text-[var(--text-primary)]">{d.label}</span>
              <span className="tabular-nums text-[var(--text-muted)]">
                {d.value.toLocaleString("en-US")} · {percent}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--card-border)]/40">
              <div
                className="h-full rounded-r-full transition-[filter] duration-200 group-hover:brightness-110 group-focus-visible:brightness-110"
                style={{ width: `${(d.value / max) * 100}%`, backgroundColor: d.color }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
