// app/SiteChrome.tsx
"use client";
import { usePathname } from "next/navigation";
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";
import ContactFab from "./components/ui/ContactFab";
import ScrollToTop from "./components/ui/ScrollToTop";
import MobileNavBar from "./components/ui/MobileNavbar";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isUser = pathname.startsWith("/user");
  const isAuth = pathname.startsWith("/auth");

  // ادمین: کاملاً بدون هدر/فوتر
  if (isAdmin) return <>{children}</>;
  if (isAuth) return <>{children}</>;

  // سایر مسیرها (از جمله /user): Navbar عمومی نمایش داده شود
  return (
    <>
      <Navbar />
      {children}

      {/* اینها اختیاری‌اند؛ اگه برای /user نمی‌خوایشون، شرط بذار */}
      <ContactFab />
      <ScrollToTop />
      <MobileNavBar />

      {/* Footer عمومی فقط وقتی که مسیر user نیست */}
      {!isUser && <Footer />}
    </>
  );
}
