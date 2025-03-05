
import { Home, Book, ShoppingCart, User, MessageCircle, HelpCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      icon: Home,
      label: "Descobrir",
      path: "/",
    },
    {
      icon: Book,
      label: "Biblioteca",
      path: "/biblioteca",
    },
    {
      icon: ShoppingCart,
      label: "Loja",
      path: "/loja",
    },
    {
      icon: MessageCircle,
      label: "Comunidade",
      path: "/comunidade",
    },
    {
      icon: User,
      label: "Perfil",
      path: "/perfil",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-2 shadow-sm md:hidden">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex flex-col items-center justify-center px-2 py-1 text-xs",
            currentPath === item.path
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <item.icon size={20} className="mb-1" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;
