
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <ShieldAlert size={64} className="mb-6 text-destructive" />
      <h1 className="mb-2 text-3xl font-bold">Acesso Não Autorizado</h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        Você não tem permissão para acessar esta página. Se você acredita que isso é um erro,
        entre em contato com o administrador.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/">Voltar para Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/login">Fazer Login</Link>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
