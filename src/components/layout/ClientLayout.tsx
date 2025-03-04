
import { Outlet } from "react-router-dom";
import BottomNav from "@/components/navigation/BottomNav";
import { Toaster } from "@/components/ui/sonner";

const ClientLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-16 md:pb-0">
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomNav />
      <Toaster />
    </div>
  );
};

export default ClientLayout;
