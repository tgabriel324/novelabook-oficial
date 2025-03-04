
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/navigation/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminLayout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className={`flex-1 p-4 md:p-8 ${!isMobile ? "md:ml-64" : ""}`}>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

export default AdminLayout;
