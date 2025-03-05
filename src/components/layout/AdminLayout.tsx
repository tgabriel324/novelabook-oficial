
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/navigation/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className={`flex flex-col flex-1 ${!isMobile ? "md:ml-64" : ""}`}>
        <header className="sticky top-0 z-10 bg-card py-3 px-4 shadow-sm border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="text-primary" size={24} />
              <span className="ml-2 text-xl font-bold">NovelBook</span>
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold text-primary">Painel Administrativo</h1>
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
