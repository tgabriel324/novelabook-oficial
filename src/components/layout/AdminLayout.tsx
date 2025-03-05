
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/navigation/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Crown, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className={`flex flex-col flex-1 ${!isMobile ? "md:ml-64" : ""}`}>
        <header className="sticky top-0 z-10 bg-card py-3 px-4 shadow-sm border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Painel Administrativo</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Bell size={18} />
              </Button>
              <Button variant="secondary" className="gap-1.5">
                <Crown size={18} className="text-novel-gold-400" />
                <span>Admin</span>
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminLayout;
