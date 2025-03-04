
import { Card, CardContent } from "@/components/ui/card";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

const Discover = () => {
  const featuredNovels = [
    { id: 1, title: "A Filha do Imperador", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+1" },
    { id: 2, title: "O Príncipe das Sombras", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+2" },
    { id: 3, title: "Renascendo em Outro Mundo", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+3" },
    { id: 4, title: "A Duquesa Rebelde", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+4" },
  ];

  return (
    <div className="container py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Descobrir</h1>
        <p className="text-muted-foreground">Encontre novas histórias para ler</p>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Destaques</h2>
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
        <h2 className="mb-4 text-xl font-semibold">Categorias</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {["Romance", "Fantasia", "Ação", "Drama"].map((category) => (
            <Card key={category} className="overflow-hidden novel-gradient">
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
