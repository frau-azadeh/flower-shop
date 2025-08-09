import AdminHeader from "@/app/components/admin/AdminHeader";
import AdminFooter from "@/app/components/admin/AdminFooter";
import ScrollToTop from "@/app/components/ui/ScrollToTop";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-background">
                  <div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr]">
        <AdminHeader />
        <main className="p-4 md:p-6">{children}</main>
        
        </div>
        <ScrollToTop/>
        <AdminFooter/>
        </div>

        )}