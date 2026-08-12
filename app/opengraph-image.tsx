import { ImageResponse } from "next/og";
import { getAboutContent, getHeroContent } from "@/lib/site-content";

export const alt = "Châu Quang Minh — Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SITE_NAME = "Châu Quang Minh";

// Google Fonts' own CSS API only serves woff2 (unreadable by satori/resvg,
// the renderer behind ImageResponse), and the family's only ttf in Google's
// source repo is a variable-font instance satori can't parse either. The
// google-webfonts-helper API resolves the current per-weight *static* ttf
// URL instead (same Nunito used elsewhere on the site, full Vietnamese-
// diacritic coverage) — resolved at request time so it tracks whatever
// gstatic version is current rather than a URL hardcoded to today's hash.
async function loadNunito() {
  const meta = await fetch("https://gwfh.mranftl.com/api/fonts/nunito?subsets=latin,vietnamese").then((res) =>
    res.json()
  );
  const ttfUrl = meta.variants?.find((v: { id: string }) => v.id === "800")?.ttf;
  if (!ttfUrl) throw new Error("Could not resolve Nunito ttf URL");
  return fetch(ttfUrl).then((res) => res.arrayBuffer());
}

export default async function Image() {
  const [hero, about] = await Promise.all([getHeroContent(), getAboutContent()]);
  const role = hero.titles[0] ?? "";
  const tagline = about.intro[0]?.en ?? "";

  const nunito = await loadNunito();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 100px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #111827 55%, #0a0a0a 100%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#3b82f6", letterSpacing: 1 }}>
          {"<Portfolio />"}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontFamily: "Nunito",
            color: "#f9fafb",
            marginTop: 24,
          }}
        >
          {SITE_NAME}
        </div>
        {role && (
          <div
            style={{
              display: "flex",
              fontSize: 36,
              fontFamily: "Nunito",
              color: "#3b82f6",
              marginTop: 20,
            }}
          >
            {role}
          </div>
        )}
        {tagline && (
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontFamily: "Nunito",
              color: "#9ca3af",
              marginTop: 20,
              maxWidth: 880,
            }}
          >
            {tagline}
          </div>
        )}
      </div>
    ),
    { ...size, fonts: [{ name: "Nunito", data: nunito, weight: 800, style: "normal" }] }
  );
}
