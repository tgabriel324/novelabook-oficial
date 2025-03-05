
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
      default: return 'NovelBook';
    }
  };

  // Check if we're on a path that needs the fancy gold header
  const useGoldHeader = location.pathname === '/' || location.pathname === '/loja';

  return (
    <div className="flex min-h-screen flex-col bg-background pb-16 md:pb-0">
      <header className={`sticky top-0 z-10 ${useGoldHeader ? 'novel-gold-gradient' : 'bg-card'} py-4 px-4 shadow-sm`}>
        <div className="container flex items-center justify-between">
          <div className="flex items-center text-2xl font-bold">
            {useGoldHeader ? (
              <span className="text-white">
                <BookOpen className="mr-2 inline-block" size={24} />
                {getHeaderTitle()}
              </span>
            ) : (
              <span className="text-foreground">
                <BookOpen className="mr-2 inline-block" size={24} />
                {getHeaderTitle()}
              </span>
            )}
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
