
import { Card, CardContent } from "@/components/ui/card";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Clock, Award, Sparkles } from "lucide-react";

const Discover = () => {
  const featuredNovels = [
    { id: 1, title: "A Filha do Imperador", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+1", tags: ["Romance", "Fantasia"] },
    { id: 2, title: "O Príncipe das Sombras", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+2", tags: ["Aventura", "Mistério"] },
    { id: 3, title: "Renascendo em Outro Mundo", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+3", tags: ["Isekai", "Fantasia"] },
    { id: 4, title: "A Duquesa Rebelde", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+4", tags: ["Romance", "História"] },
  ];

  const trendingNovels = [
    { id: 5, title: "O Cavaleiro da Torre", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+5", tags: ["Aventura"] },
    { id: 6, title: "Alquimista Noturno", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+6", tags: ["Fantasia"] },
    { id: 7, title: "Segredos da Capital", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+7", tags: ["Política"] },
  ];

  return (
    <div className="container py-6">
      <div className="mb-6 relative">
        <Input 
          type="text" 
          placeholder="Buscar novelas, gêneros ou autores" 
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
      </div>

      <section className="mb-10">
        <div className="mb-4 flex items-center">
          <Sparkles className="mr-2 text-novel-gold-400" size={20} />
          <h2 className="text-xl font-semibold">Destaques</h2>
        </div>
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
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                        <h3 className="font-semibold">{novel.title}</h3>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {novel.tags.map((tag) => (
                            <span key={tag} className="inline-block text-xs bg-novel-gold-400/80 rounded-full px-2 py-0.5">
                              {tag}
                            </span>
                          ))}
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

      <section className="mb-10">
        <div className="mb-4 flex items-center">
          <TrendingUp className="mr-2 text-novel-gold-400" size={20} />
          <h2 className="text-xl font-semibold">Em Alta</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {trendingNovels.map((novel) => (
            <Card key={novel.id} className="overflow-hidden transition-transform hover:scale-105 duration-300">
              <CardContent className="p-0">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={novel.cover}
                    alt={novel.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                    <h3 className="font-semibold">{novel.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {novel.tags.map((tag) => (
                        <span key={tag} className="inline-block text-xs bg-novel-gold-400/80 rounded-full px-2 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center">
          <Award className="mr-2 text-novel-gold-400" size={20} />
          <h2 className="text-xl font-semibold">Categorias</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {["Romance", "Fantasia", "Ação", "Drama", "Mistério", "Aventura", "Histórico", "Ficção"].map((category, index) => (
            <Card key={category} className={`overflow-hidden ${index < 4 ? 'novel-gradient' : 'novel-gold-gradient'}`}>
              <CardContent className="flex items-center justify-center p-6 text-white">
                <h3 className="text-center font-medium">{category}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Discover;
