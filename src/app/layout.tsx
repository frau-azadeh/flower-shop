import "./globals.css";
import "../styles/fonts.css";
import SiteChrome from "./SiteChrome";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
