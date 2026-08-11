import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

const BOT_UA = /bot|crawl|spider|slurp|facebookexternalhit|preview/i;

function classifyDevice(ua: string): "mobile" | "tablet" | "desktop" {
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobile|iphone|android/i.test(ua)) return "mobile";
  return "desktop";
}

function referrerHost(referrer: string | null, siteHost: string): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname;
    return host === siteHost ? null : host;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (typeof body?.path !== "string" || (body.language !== "vi" && body.language !== "en")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ua = request.headers.get("user-agent") ?? "";
  if (BOT_UA.test(ua)) {
    return NextResponse.json({ ok: true });
  }

  const referrer = referrerHost(request.headers.get("referer"), request.nextUrl.hostname);

  await sql`
    INSERT INTO visits (path, language, device, referrer_host)
    VALUES (${body.path}, ${body.language}, ${classifyDevice(ua)}, ${referrer})
  `;

  return NextResponse.json({ ok: true });
}
