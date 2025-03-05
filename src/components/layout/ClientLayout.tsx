
import { Outlet } from "react-router-dom";
import BottomNav from "@/components/navigation/BottomNav";
import { Toaster } from "@/components/ui/sonner";
import { useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";

const ClientLayout = () => {
  const location = useLocation();
  const getHeaderTitle = () => {
    switch(location.pathname) {
      case '/': return 'Descobrir';
      case '/biblioteca': return 'Minha Biblioteca';
      case '/loja': return 'Loja de Novelas';
      case '/perfil': return 'Meu Perfil';
      case '/comunidade': return 'Comunidade';
      case '/suporte': return 'Suporte';
      default: return 'NovelBook';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-16 md:pb-0">
      <header className="sticky top-0 z-10 bg-card py-4 px-4 shadow-sm">
        <div className="container flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="text-novel-lilac-400" size={24} />
            <span className="ml-2 text-xl font-bold text-novel-lilac-500">NovelBook</span>
          </div>
          <div className="text-right">
            <h1 className="text-xl font-bold text-primary">{getHeaderTitle()}</h1>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomNav />
      <Toaster />
    </div>
  );
};

export default ClientLayout;
