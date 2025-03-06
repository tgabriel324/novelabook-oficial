
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Book, 
  Heart, 
  Settings, 
  LogOut, 
  ShoppingBag, 
  Shield, 
  BookOpen,
  Download,
  BookmarkCheck
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Componente para exibir listas de itens
const ItemList = ({ items, type }: { items: any[], type: string }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum item encontrado</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="relative aspect-[3/4]">
            <img 
              src={item.cover} 
              alt={item.title} 
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
              <h3 className="text-white font-medium">{item.title}</h3>
              <p className="text-white/80 text-sm">{item.author}</p>
              {type === 'history' && <p className="text-white/60 text-xs mt-1">Último acesso: {item.lastRead}</p>}
              {type === 'favorites' && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => toast.success(`Continuando leitura de ${item.title}`)}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Continuar Leitura
                </Button>
              )}
              {type === 'purchases' && <p className="text-white/60 text-xs mt-1">Comprado em: {item.purchaseDate}</p>}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState("account");
  const navigate = useNavigate();
  
  // Dados mockados
  const favoriteBooks = [
    { title: "A Filha do Imperador", author: "Ana Lima", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+1" },
    { title: "O Príncipe das Sombras", author: "Carlos Mendes", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+2" },
  ];
  
  const readingHistory = [
    { title: "A Filha do Imperador", author: "Ana Lima", lastRead: "Hoje", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+1" },
    { title: "O Príncipe das Sombras", author: "Carlos Mendes", lastRead: "Ontem", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+2" },
    { title: "Renascendo em Outro Mundo", author: "Luciana Fraga", lastRead: "2 dias atrás", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+3" },
  ];
  
  const purchaseHistory = [
    { title: "A Filha do Imperador", author: "Ana Lima", purchaseDate: "15/05/2023", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+1" },
    { title: "O Príncipe das Sombras", author: "Carlos Mendes", purchaseDate: "22/06/2023", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+2" },
  ];
  
  const offlineBooks = [
    { title: "A Filha do Imperador", author: "Ana Lima", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+1" }
  ];

  const handleLogout = () => {
    toast.success("Sessão encerrada com sucesso!");
    // Implementação real do logout iria aqui
    navigate("/login");
  };

  return (
    <div className="container py-6 pb-20 md:pb-6">
      <header className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full novel-gradient text-white">
          <User size={40} />
        </div>
        <h1 className="text-2xl font-bold">João Silva</h1>
        <p className="text-muted-foreground">Membro desde Mai 2023</p>
      </header>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full justify-start mb-6 overflow-x-auto flex-nowrap border-b rounded-none h-auto p-0">
          <TabsTrigger value="account" className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            Conta
          </TabsTrigger>
          <TabsTrigger value="favorites" className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            Favoritos
          </TabsTrigger>
          <TabsTrigger value="history" className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            Histórico
          </TabsTrigger>
          <TabsTrigger value="purchases" className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            Compras
          </TabsTrigger>
          <TabsTrigger value="offline" className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            Offline
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Minha Conta</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button 
                variant="outline" 
                className="flex w-full justify-start"
                onClick={() => navigate("/perfil/editar")}
              >
                <User className="mr-2" size={18} />
                Editar Perfil
              </Button>
              <Link to="/biblioteca">
                <Button variant="outline" className="flex w-full justify-start">
                  <Book className="mr-2" size={18} />
                  Minha Biblioteca
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="flex w-full justify-start"
                onClick={() => navigate("/perfil/compras")}
              >
                <ShoppingBag className="mr-2" size={18} />
                Histórico de Compras
              </Button>
              <Button 
                variant="outline" 
                className="flex w-full justify-start"
                onClick={() => navigate("/perfil/favoritos")}
              >
                <Heart className="mr-2" size={18} />
                Meus Favoritos
              </Button>
              <Button 
                variant="outline" 
                className="flex w-full justify-start"
                onClick={() => navigate("/perfil/preferencias")}
              >
                <Settings className="mr-2" size={18} />
                Preferências
              </Button>
              <Button 
                variant="outline" 
                className="flex w-full justify-start"
                onClick={() => navigate("/perfil/seguranca")}
              >
                <Shield className="mr-2" size={18} />
                Segurança da Conta
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 flex flex-col gap-3">
            <Button 
              variant="outline" 
              className="flex w-full justify-start"
              onClick={() => navigate("/termos-de-servico")}
            >
              Termos de Serviço
            </Button>
            <Button 
              variant="outline" 
              className="flex w-full justify-start"
              onClick={() => navigate("/politica-de-privacidade")}
            >
              Política de Privacidade
            </Button>
            <Button 
              variant="outline" 
              className="flex w-full justify-start text-destructive" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2" size={18} />
              Sair
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="favorites">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-primary">Meus Favoritos</h2>
            <p className="text-muted-foreground">Livros que você marcou como favoritos</p>
          </div>
          <ItemList items={favoriteBooks} type="favorites" />
        </TabsContent>
        
        <TabsContent value="history">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-primary">Histórico de Leitura</h2>
            <p className="text-muted-foreground">Seus livros lidos recentemente</p>
          </div>
          <ItemList items={readingHistory} type="history" />
        </TabsContent>
        
        <TabsContent value="purchases">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-primary">Compras</h2>
            <p className="text-muted-foreground">Histórico de suas compras</p>
          </div>
          <ItemList items={purchaseHistory} type="purchases" />
        </TabsContent>
        
        <TabsContent value="offline">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-primary">Leitura Offline</h2>
            <p className="text-muted-foreground">Livros disponíveis para leitura offline</p>
          </div>
          {offlineBooks.length === 0 ? (
            <div className="text-center py-8">
              <Download className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Nenhum livro salvo para leitura offline</p>
              <p className="text-sm text-muted-foreground">Salve livros para ler sem conexão com a internet</p>
            </div>
          ) : (
            <ItemList items={offlineBooks} type="offline" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
