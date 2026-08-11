import { sql } from "@/lib/db";

const RANGE_DAYS = 30;

export interface DailyViews {
  date: string;
  count: number;
}

export interface LanguageSplit {
  language: "vi" | "en";
  count: number;
}

export interface DeviceSplit {
  device: "desktop" | "mobile" | "tablet";
  count: number;
}

export interface ReferrerBreakdown {
  referrer: string;
  count: number;
}

export interface VisitStats {
  totalViews: number;
  dailyViews: DailyViews[];
  languageSplit: LanguageSplit[];
  deviceSplit: DeviceSplit[];
  referrers: ReferrerBreakdown[];
}

export async function getVisitStats(days = RANGE_DAYS): Promise<VisitStats> {
  const [totalRows, dailyRows, languageRows, deviceRows, referrerRows] = await Promise.all([
    sql`SELECT COUNT(*)::int AS count FROM visits WHERE created_at >= now() - (${days} || ' days')::interval`,
    sql`
      SELECT to_char(day, 'YYYY-MM-DD') AS date, COUNT(visits.id)::int AS count
      FROM generate_series(
        date_trunc('day', now()) - ((${days} - 1) || ' days')::interval,
        date_trunc('day', now()),
        '1 day'
      ) AS day
      LEFT JOIN visits ON date_trunc('day', visits.created_at) = day
      GROUP BY 1
      ORDER BY 1
    `,
    sql`
      SELECT language, COUNT(*)::int AS count
      FROM visits
      WHERE created_at >= now() - (${days} || ' days')::interval
      GROUP BY 1
    `,
    sql`
      SELECT device, COUNT(*)::int AS count
      FROM visits
      WHERE created_at >= now() - (${days} || ' days')::interval
      GROUP BY 1
    `,
    sql`
      SELECT COALESCE(referrer_host, 'Direct') AS referrer, COUNT(*)::int AS count
      FROM visits
      WHERE created_at >= now() - (${days} || ' days')::interval
      GROUP BY 1
      ORDER BY 2 DESC
      LIMIT 8
    `,
  ]);

  return {
    totalViews: (totalRows[0]?.count as number) ?? 0,
    dailyViews: dailyRows as DailyViews[],
    languageSplit: languageRows as LanguageSplit[],
    deviceSplit: deviceRows as DeviceSplit[],
    referrers: referrerRows as ReferrerBreakdown[],
  };
}
