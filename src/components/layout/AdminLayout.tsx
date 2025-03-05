
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
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const AdminLayout = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Nova novela adicionada",
      description: "Um autor acabou de publicar uma nova novela",
      time: "Há 1 hora",
      read: false,
    },
    {
      id: 2,
      title: "Novo usuário registrado",
      description: "Um novo usuário se cadastrou na plataforma",
      time: "Há 2 horas",
      read: false,
    },
    {
      id: 3,
      title: "Relatório mensal disponível",
      description: "O relatório de vendas do mês está disponível",
      time: "Há 3 horas",
      read: false,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    // No futuro, implementar lógica real de logout
    navigate("/login");
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(n => ({ ...n, read: true }))
    );
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
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-medium">Notificações</h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllAsRead}
                      className="text-xs h-7 px-2"
                    >
                      Marcar todas como lidas
                    </Button>
                  </div>
                  <div className="max-h-80 overflow-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id}

                          className={`p-4 border-b last:border-0 hover:bg-muted/50 cursor-pointer ${
                            notification.read ? "bg-background" : "bg-muted/30"
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex justify-between items-start">
                            <p className="font-medium">{notification.title}</p>
                            {!notification.read && (
                              <Badge variant="secondary" className="ml-2 h-2 w-2 p-0 rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        Nenhuma notificação
                      </div>
                    )}
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
                  <DropdownMenuItem onClick={() => navigate("/admin/perfil")}>Perfil</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/admin/configuracoes")}>Configurações</DropdownMenuItem>
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
