interface StatTileProps {
  label: string;
  value: number;
}

export function StatTile({ label, value }: StatTileProps) {
  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1 text-5xl font-semibold text-[var(--text-primary)]">
        {value.toLocaleString("en-US")}
      </p>
    </div>
  );
}
