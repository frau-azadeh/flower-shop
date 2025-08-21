"use client";
import { usePathname } from "next/navigation";
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";
import ContactFab from "./components/ui/ContactFab";
import ScrollToTop from "./components/ui/ScrollToTop";
import MobileNavBar from "./components/ui/MobileNavbar";
import BackButton from "./components/ui/BackButton";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isUser = pathname.startsWith("/user");
  const isAuth = pathname.startsWith("/auth");

  if (isAdmin) return <>{children}</>;
  if (isAuth) return <>{children}</>;

  return (
    <>
      <Navbar />
      {children}
      <ContactFab />
      <ScrollToTop />
      <BackButton />
      <MobileNavBar />
      {!isUser && <Footer />}
    </>
  );
}
