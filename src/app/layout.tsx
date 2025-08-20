import type { Metadata } from "next";
import "./globals.css";
import "../styles/fonts.css";
import SiteChrome from "./SiteChrome";
import ReduxProvider from "./ReduxProvider";

export const metadata: Metadata = {
  title: "گل‌فروش",
  description: "فروشگاه گل",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html dir="rtl" lang="fa">
      <body>
        <ReduxProvider>
          <SiteChrome>{children}</SiteChrome>
        </ReduxProvider>
      </body>
    </html>
  );
}
