import { getVisitStats } from "@/lib/analytics";
import { StatTile } from "@/components/admin/StatTile";
import { DailyTrendChart } from "@/components/admin/DailyTrendChart";
import { HorizontalBarChart, type BarDatum } from "@/components/admin/HorizontalBarChart";

const LANGUAGE_LABEL: Record<string, string> = { vi: "Vietnamese", en: "English" };
const LANGUAGE_COLOR: Record<string, string> = { en: "var(--accent)", vi: "var(--chart-series-2)" };

const DEVICE_LABEL: Record<string, string> = { desktop: "Desktop", mobile: "Mobile", tablet: "Tablet" };
const DEVICE_COLOR: Record<string, string> = {
  desktop: "var(--accent)",
  mobile: "var(--chart-series-2)",
  tablet: "var(--chart-series-3)",
};

export default async function AdminStatsPage() {
  const stats = await getVisitStats();

  const languageData: BarDatum[] = stats.languageSplit.map((l) => ({
    key: l.language,
    label: LANGUAGE_LABEL[l.language] ?? l.language,
    value: l.count,
    color: LANGUAGE_COLOR[l.language] ?? "var(--accent)",
  }));

  const deviceData: BarDatum[] = stats.deviceSplit.map((d) => ({
    key: d.device,
    label: DEVICE_LABEL[d.device] ?? d.device,
    value: d.count,
    color: DEVICE_COLOR[d.device] ?? "var(--accent)",
  }));

  const referrerData: BarDatum[] = stats.referrers.map((r) => ({
    key: r.referrer,
    label: r.referrer,
    value: r.count,
    color: "var(--accent)",
  }));

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Visit stats</h1>

      <div className="grid gap-6 sm:grid-cols-2">
        <StatTile label="Total views (last 30 days)" value={stats.totalViews} />
        <StatTile label="Resume clicks (last 30 days)" value={stats.resumeClicks} />
      </div>

      <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
        <h2 className="mb-4 text-sm font-medium text-[var(--text-secondary)]">Views by day</h2>
        <DailyTrendChart data={stats.dailyViews} />
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
          <h2 className="mb-4 text-sm font-medium text-[var(--text-secondary)]">Language</h2>
          {languageData.length > 0 ? (
            <HorizontalBarChart data={languageData} total={stats.totalViews} />
          ) : (
            <EmptyState />
          )}
        </section>

        <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
          <h2 className="mb-4 text-sm font-medium text-[var(--text-secondary)]">Device</h2>
          {deviceData.length > 0 ? (
            <HorizontalBarChart data={deviceData} total={stats.totalViews} />
          ) : (
            <EmptyState />
          )}
        </section>
      </div>

      <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
        <h2 className="mb-4 text-sm font-medium text-[var(--text-secondary)]">Referrers</h2>
        {referrerData.length > 0 ? (
          <HorizontalBarChart data={referrerData} total={stats.totalViews} />
        ) : (
          <EmptyState />
        )}
      </section>
    </div>
  );
}

function EmptyState() {
  return <p className="text-sm text-[var(--text-muted)]">No data yet.</p>;
}
