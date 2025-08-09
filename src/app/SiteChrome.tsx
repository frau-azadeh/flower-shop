// app/SiteChrome.tsx
"use client";
import { usePathname } from "next/navigation";
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";
import ContactFab from "./components/ui/ContactFab";
import ScrollToTop from "./components/ui/ScrollToTop";
import MobileNavBar from "./components/ui/MobileNavbar";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>; // بدون هدر/فوتر

  return (
    <>
      <Navbar />
      {children}
      <ContactFab />
      <ScrollToTop />
      <MobileNavBar />
      <Footer />
    </>
  );
}
