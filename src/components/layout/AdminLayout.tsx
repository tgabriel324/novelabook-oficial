
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/navigation/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bell, Shield, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleLogout = () => {
    // No futuro, implementar lógica real de logout
    navigate("/login");
  };

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
            <div className="text-right flex items-center gap-2 md:gap-4">
              <h1 className="text-xl font-bold text-primary hidden md:block">Painel Administrativo</h1>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b">
                    <h2 className="font-medium">Notificações</h2>
                  </div>
                  <div className="max-h-80 overflow-auto">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="p-4 border-b last:border-0 hover:bg-muted/50 cursor-pointer">
                        <p className="font-medium">Nova novela adicionada</p>
                        <p className="text-sm text-muted-foreground">Um autor acabou de publicar uma nova novela</p>
                        <p className="text-xs text-muted-foreground mt-1">Há {item} hora{item > 1 ? 's' : ''}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t">
                    <Button variant="ghost" size="sm" className="w-full">Ver todas as notificações</Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 border">
                    <User size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Perfil</DropdownMenuItem>
                  <DropdownMenuItem>Configurações</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
