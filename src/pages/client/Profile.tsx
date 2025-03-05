
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Book, Heart, Settings, LogOut, Crown, Shield } from "lucide-react";

const Profile = () => {
  return (
    <div className="container py-6">
      <header className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full novel-gold-gradient text-white">
          <User size={40} />
        </div>
        <h1 className="text-2xl font-bold">João Silva</h1>
        <p className="text-muted-foreground">Membro desde Mai 2023</p>
        <Button variant="secondary" className="mt-4 shadow-md">
          <Crown className="mr-2" size={18} />
          Tornar-se Premium
        </Button>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Minha Conta</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button variant="outline" className="flex w-full justify-start">
            <User className="mr-2" size={18} />
            Editar Perfil
          </Button>
          <Button variant="outline" className="flex w-full justify-start">
            <Book className="mr-2" size={18} />
            Histórico de Leitura
          </Button>
          <Button variant="outline" className="flex w-full justify-start">
            <Heart className="mr-2" size={18} />
            Favoritos
          </Button>
          <Button variant="outline" className="flex w-full justify-start">
            <Settings className="mr-2" size={18} />
            Preferências
          </Button>
          <Button variant="outline" className="flex w-full justify-start">
            <Shield className="mr-2" size={18} />
            Segurança da Conta
          </Button>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-col gap-3">
        <Button variant="outline" className="flex w-full justify-start">
          Termos de Serviço
        </Button>
        <Button variant="outline" className="flex w-full justify-start">
          Política de Privacidade
        </Button>
        <Button variant="outline" className="flex w-full justify-start text-destructive">
          <LogOut className="mr-2" size={18} />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default Profile;
