
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "@/components/navigation/BottomNav";
import { Toaster } from "@/components/ui/sonner";
import { BookOpen } from "lucide-react";

const ClientLayout = () => {
  const location = useLocation();
  
  const getHeaderTitle = () => {
    const path = location.pathname;
    
    // Verificar primeiro os caminhos exatos
    switch(path) {
      case '/': return 'Descobrir';
      case '/biblioteca': return 'Minha Biblioteca';
      case '/loja': return 'Loja de Novelas';
      case '/perfil': return 'Meu Perfil';
      case '/comunidade': return 'Comunidade';
      case '/suporte': return 'Suporte';
    }
    
    // Verificar caminhos de perfil para títulos específicos
    if (path.startsWith('/perfil/editar')) return 'Editar Perfil';
    if (path.startsWith('/perfil/compras')) return 'Histórico de Compras';
    if (path.startsWith('/perfil/favoritos')) return 'Meus Favoritos';
    if (path.startsWith('/perfil/preferencias')) return 'Preferências';
    if (path.startsWith('/perfil/seguranca')) return 'Segurança da Conta';
    if (path.startsWith('/termos-de-servico')) return 'Termos de Serviço';
    if (path.startsWith('/politica-de-privacidade')) return 'Política de Privacidade';
    
    // Título padrão para outras páginas
    return 'NovelBook';
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
