
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // No futuro, implementar autenticação real
    navigate("/");
  };

  const handleAdminLogin = () => {
    navigate("/admin");
  };

  return (
    <div className="container flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">NovelaBook</CardTitle>
          <CardDescription>
            Entre na sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Button variant="link" className="h-auto p-0 text-xs">
                  Esqueceu sua senha?
                </Button>
              </div>
              <Input id="password" type="password" />
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span>Não tem uma conta? </span>
            <Button variant="link" className="h-auto p-0">
              Cadastre-se
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleAdminLogin}
            className="text-xs text-muted-foreground"
          >
            Acesso Administrativo
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
