import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users,
  BarChart, 
  MessageSquare, 
  Settings,
  ChevronLeft,
  ChevronRight,
  BookOpenCheck,
  Cpu,
  Smartphone,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/admin",
  },
  {
    icon: CreditCard,
    label: "Transações",
    path: "/admin/transactions",
  },
  {
    icon: BookOpen,
    label: "Conteúdo",
    path: "/admin/conteudo",
  },
  {
    icon: Users,
    label: "Usuários",
    path: "/admin/usuarios",
  },
  {
    icon: BarChart,
    label: "Relatórios",
    path: "/admin/relatorios",
  },
  {
    icon: MessageSquare,
    label: "Comunicações",
    path: "/admin/comunicacoes",
  },
  {
    icon: Settings,
    label: "Configurações",
    path: "/admin/configuracoes",
  },
];

const optimizationItems = [
  {
    icon: BookOpenCheck,
    label: "Análise de Leitura",
    path: "/admin/analytics/leitura",
  },
  {
    icon: Cpu,
    label: "Performance",
    path: "/admin/performance",
  },
  {
    icon: Smartphone,
    label: "Compatibilidade",
    path: "/admin/compatibilidade",
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [expanded, setExpanded] = useState(true);
  const [optimizationOpen, setOptimizationOpen] = useState(false);
  const isMobile = useIsMobile();

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-6 py-6">
      <div className="flex items-center px-4">
        <h1 className={cn("flex items-center font-semibold", 
          expanded ? "text-xl" : "text-xs")}>
          {expanded ? "NovelaBook Admin" : "NB"}
        </h1>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(!expanded)}
            className="ml-auto"
          >
            {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-1 px-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center rounded-md px-3 py-2 hover:bg-accent",
              currentPath === item.path ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <item.icon size={20} className="shrink-0" />
            {(expanded || isMobile) && <span className="ml-3">{item.label}</span>}
          </Link>
        ))}
        
        {(expanded || isMobile) ? (
          <Collapsible 
            open={optimizationOpen} 
            onOpenChange={setOptimizationOpen}
            className="mt-4"
          >
            <CollapsibleTrigger asChild>
              <div className="flex items-center rounded-md px-3 py-2 hover:bg-accent cursor-pointer text-muted-foreground">
                <BarChart size={20} className="shrink-0" />
                <span className="ml-3 flex-1">Análise & Otimização</span>
                <ChevronRight 
                  size={16} 
                  className={cn("transition-transform duration-200", 
                    optimizationOpen && "transform rotate-90")} 
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-3">
              {optimizationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 mt-1 hover:bg-accent",
                    currentPath === item.path ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  <item.icon size={18} className="shrink-0" />
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          optimizationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center rounded-md px-3 py-2 hover:bg-accent",
                currentPath === item.path ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <item.icon size={20} className="shrink-0" />
            </Link>
          ))
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed left-4 top-4 z-50">
            <ChevronRight size={18} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className={cn(
      "hidden h-screen border-r bg-card md:fixed md:flex md:flex-col", 
      expanded ? "md:w-64" : "md:w-16"
    )}>
      <SidebarContent />
    </aside>
  );
};

export default AdminSidebar;
