
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthCheck from "@/components/layout/AuthCheck";
import ClientLayout from "@/components/layout/ClientLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import SeoMetaTags from "@/components/seo/SeoMetaTags";

// Admin Pages
import Dashboard from "@/pages/admin/Dashboard";
import ReadingAnalytics from "@/components/admin/ReadingAnalytics";
import PerformanceOptimizer from "@/components/admin/PerformanceOptimizer";
import CompatibilityTester from "@/components/admin/CompatibilityTester";

// Client Pages
import Discover from "@/pages/client/Discover";
import Library from "@/pages/client/Library";
import Profile from "@/pages/client/Profile";
import Store from "@/pages/client/Store";
import Reader from "@/pages/client/Reader";
import Community from "@/pages/client/Community";
import Support from "@/pages/client/Support";
import Documentation from "@/pages/client/Documentation";

// Auth Pages
import Login from "@/pages/auth/Login";

// Error Pages
import NotFound from "./pages/NotFound";
import Unauthorized from "@/pages/errors/Unauthorized";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Metadados SEO padrão para todas as páginas */}
      <SeoMetaTags />
      
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Client Routes */}
          <Route element={
            <AuthCheck allowedRoles={['user']}>
              <ClientLayout />
            </AuthCheck>
          }>
            <Route path="/" element={<Discover />} />
            <Route path="/biblioteca" element={<Library />} />
            <Route path="/loja" element={<Store />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/comunidade" element={<Community />} />
            <Route path="/suporte" element={<Support />} />
            <Route path="/documentacao" element={<Documentation />} />
          </Route>

          {/* Reader Route - Standalone without bottom navigation */}
          <Route path="/leitor" element={
            <AuthCheck allowedRoles={['user']}>
              <Reader />
            </AuthCheck>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AuthCheck allowedRoles={['admin']}>
              <AdminLayout />
            </AuthCheck>
          }>
            <Route index element={<Dashboard />} />
            <Route path="conteudo" element={<div>Gerenciamento de Conteúdo</div>} /> {/* Placeholder */}
            <Route path="usuarios" element={<div>Administração de Usuários</div>} /> {/* Placeholder */}
            <Route path="relatorios" element={<div>Relatórios</div>} /> {/* Placeholder */}
            <Route path="comunicacoes" element={<div>Comunicações</div>} /> {/* Placeholder */}
            <Route path="configuracoes" element={<div>Configurações</div>} /> {/* Placeholder */}
            
            {/* Novas rotas de análise */}
            <Route path="analytics/leitura" element={<ReadingAnalytics />} />
            <Route path="performance" element={<PerformanceOptimizer />} />
            <Route path="compatibilidade" element={<CompatibilityTester />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
