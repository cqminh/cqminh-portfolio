import type { Metadata } from "next";
import { Geist, Geist_Mono, Courier_Prime, Nunito, Fuzzy_Bubbles } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/ui/LoadingScreen";
import CustomScrollbar from "@/components/ui/CustomScrollbar";
import BackToTop from "@/components/ui/BackToTop";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { VisitTracker } from "@/components/analytics/VisitTracker";

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

export const metadata: Metadata = {
  title: "Châu Quang Minh - Portfolio",
  description: "Full Stack Developer Portfolio",
  icons: {
    icon: [
      { url: "/favicon_io/favicon.ico" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicon_io/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${courierPrime.variable} ${nunito.variable} ${fuzzyBubbles.variable} h-full antialiased`}
    >
      <head>
        <script
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
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <LanguageProvider>
            <LoadingProvider>
              <LoadingScreen />
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

