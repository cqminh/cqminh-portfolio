import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Courier_Prime, Nunito, Fuzzy_Bubbles } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/ui/LoadingScreen";
import CustomScrollbar from "@/components/ui/CustomScrollbar";
import BackToTop from "@/components/ui/BackToTop";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { VisitTracker } from "@/components/analytics/VisitTracker";
import { getAboutContent, getHeroContent, getLoadingScreenContent } from "@/lib/site-content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito-loaded",
  subsets: ["vietnamese"],
});

const fuzzyBubbles = Fuzzy_Bubbles({
  variable: "--font-fuzzy-bubbles",
  weight: "400",
  subsets: ["latin", "vietnamese"],
});

const SITE_NAME = "Châu Quang Minh";

// No manual setup needed: VERCEL_PROJECT_PRODUCTION_URL is injected
// automatically by Vercel at build time and tracks whatever domain
// (default or custom) is assigned to the production deployment.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

// Dynamic rather than a static object so the link-preview title/description
// stay in sync with whatever the admin has actually configured for Hero/
// About, instead of drifting from a hardcoded string over time.
export async function generateMetadata(): Promise<Metadata> {
  const [hero, about] = await Promise.all([getHeroContent(), getAboutContent()]);

  const role = hero.titles[0];
  const title = role ? `${SITE_NAME} - ${role}` : `${SITE_NAME} - Portfolio`;
  const description = about.intro[0]?.en || `Portfolio of ${SITE_NAME}.`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    icons: {
      icon: [
        { url: "/favicon_io/favicon.ico" },
        { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/favicon_io/apple-touch-icon.png",
    },
    openGraph: {
      title,
      description,
      url: "/",
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loadingScreenContent = await getLoadingScreenContent();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${courierPrime.variable} ${nunito.variable} ${fuzzyBubbles.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="theme-language-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  // Default to 'auto' if no theme is saved
                  const theme = savedTheme || 'auto';
                  let finalTheme = theme;
                  if (theme === 'auto') {
                    finalTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  if (finalTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // localStorage may not be available in some environments
                  document.documentElement.classList.remove('dark');
                }
                try {
                  const savedLanguage = localStorage.getItem('language');
                  document.documentElement.lang = savedLanguage || 'en';
                } catch (e) {
                  // localStorage may not be available in some environments
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <LoadingProvider>
              <LoadingScreen messages={loadingScreenContent.messages} />
              <CustomScrollbar />
              <BackToTop />
              <VisitTracker />
              {children}
            </LoadingProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

