
import { Navigate, useLocation } from "react-router-dom";

type AuthCheckProps = {
  children: React.ReactNode;
  allowedRoles: Array<'user' | 'admin'>;
};

// Simulação de autenticação (deve ser substituída com uma real)
const useAuth = () => {
  // Retorna user ou admin dependendo da URL para demo
  const isAdmin = window.location.pathname.includes('/admin');
  return {
    isAuthenticated: true,
    role: isAdmin ? 'admin' : 'user',
  };
};

const AuthCheck = ({ children, allowedRoles }: AuthCheckProps) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role as 'user' | 'admin')) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthCheck;
