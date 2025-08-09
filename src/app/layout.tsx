import type { Metadata } from "next";
import "./globals.css";
import "../styles/fonts.css";
import Navbar from "./components/ui/Navbar";

export const metadata: Metadata = {
  title: "Flower Shop",
  description: "Flower Shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
