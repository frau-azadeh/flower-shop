import ScrollToTop from "@/app/components/ui/ScrollToTop";
import UserFooter from "@/app/components/user/UserFooter";
import UserNavbar from "@/app/components/user/UserNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr]">
        <UserNavbar/>
        <main className="p-4 md:p-6">{children}</main>
      </div>
      <ScrollToTop />
      <UserFooter/>
    </div>
  );
}
