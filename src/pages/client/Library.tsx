
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Library = () => {
  const myNovels = [
    { id: 1, title: "A Filha do Imperador", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+1", progress: 45 },
    { id: 2, title: "O Príncipe das Sombras", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+2", progress: 78 },
    { id: 3, title: "Renascendo em Outro Mundo", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+3", progress: 15 },
  ];

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Input 
            type="text" 
            placeholder="Pesquisar minha biblioteca" 
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        </div>
        <Button variant="secondary" className="shrink-0">
          Filtrar
        </Button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary">Minhas Leituras</h2>
        <Button variant="link" className="text-novel-gold-400 font-medium p-0">
          Ver Todas
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {myNovels.map((novel) => (
          <Card key={novel.id} className="overflow-hidden transition-transform hover:scale-105 duration-300">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={novel.cover}
                  alt={novel.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                  <h3 className="font-semibold">{novel.title}</h3>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/30">
                    <div
                      className="h-full rounded-full bg-novel-gold-400"
                      style={{ width: `${novel.progress}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-white/80">{novel.progress}% lido</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-10 mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary">Recém Adquiridos</h2>
        <Button variant="link" className="text-novel-gold-400 font-medium p-0">
          Ver Todos
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {myNovels.slice(0, 2).map((novel) => (
          <Card key={novel.id} className="overflow-hidden transition-transform hover:scale-105 duration-300">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={novel.cover}
                  alt={novel.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                  <h3 className="font-semibold">{novel.title}</h3>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/30">
                    <div
                      className="h-full rounded-full bg-novel-gold-400"
                      style={{ width: `${novel.progress}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-white/80">{novel.progress}% lido</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Library;
