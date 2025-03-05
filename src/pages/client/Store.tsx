
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Crown, Star } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

const Store = () => {
  const [activeFilter, setActiveFilter] = useState("Todos");
  
  const featuredNovels = [
    { id: 1, title: "A Filha do Imperador", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+1", price: "R$ 19,90", tags: ["Premium"] },
    { id: 2, title: "O Príncipe das Sombras", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+2", price: "R$ 15,90", tags: [] },
    { id: 3, title: "Renascendo em Outro Mundo", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+3", price: "R$ 22,90", tags: ["Premium"] },
  ];
  
  const storeNovels = [
    { id: 4, title: "O Cavaleiro da Torre", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+4", price: "R$ 12,90", tags: [], rating: 4.5 },
    { id: 5, title: "Alquimista Noturno", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+5", price: "R$ 17,90", tags: [], rating: 4.8 },
    { id: 6, title: "Segredos da Capital", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+6", price: "R$ 14,90", tags: ["Premium"], rating: 4.2 },
    { id: 7, title: "Reinos em Guerra", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+7", price: "R$ 19,90", tags: [], rating: 4.6 },
    { id: 8, title: "A Profecia Perdida", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+8", price: "R$ 20,90", tags: ["Premium"], rating: 4.9 },
    { id: 9, title: "Espada do Destino", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+9", price: "R$ 16,90", tags: [], rating: 4.3 },
  ];

  const filters = ["Todos", "Romance", "Fantasia", "Aventura", "Mistério", "Premium"];

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Input 
            type="text" 
            placeholder="Pesquisar na loja" 
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        </div>
        <Button variant="outline" className="shrink-0">
          <Filter size={18} className="mr-2" />
          Filtros
        </Button>
      </div>

      <div className="mb-6 flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "secondary" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter)}
            className={filter === "Premium" ? "border-novel-gold-400 text-novel-gold-400" : ""}
          >
            {filter === "Premium" && <Crown size={14} className="mr-1" />}
            {filter}
          </Button>
        ))}
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Promoções</h2>
        <Carousel className="w-full">
          <CarouselContent>
            {featuredNovels.map((novel) => (
              <CarouselItem key={novel.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img
                        src={novel.cover}
                        alt={novel.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      {novel.tags.includes("Premium") && (
                        <div className="absolute top-2 right-2 bg-novel-gold-400 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                          <Crown size={12} className="mr-1" />
                          Premium
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                        <h3 className="font-semibold">{novel.title}</h3>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-bold text-novel-gold-400">{novel.price}</span>
                          <Button size="sm" variant="secondary">Comprar</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Catálogo</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {storeNovels.map((novel) => (
            <Card key={novel.id} className="overflow-hidden transition-transform hover:scale-105 duration-300">
              <CardContent className="p-0">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={novel.cover}
                    alt={novel.title}
                    className="h-full w-full object-cover"
                  />
                  {novel.tags.includes("Premium") && (
                    <div className="absolute top-2 right-2 bg-novel-gold-400 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                      <Crown size={12} className="mr-1" />
                      Premium
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                    <h3 className="font-semibold">{novel.title}</h3>
                    <div className="mt-1 flex items-center">
                      <Star size={14} className="text-novel-gold-400 fill-novel-gold-400" />
                      <span className="ml-1 text-sm">{novel.rating}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-novel-gold-400">{novel.price}</span>
                      <Button size="sm" variant="secondary">Comprar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Store;
