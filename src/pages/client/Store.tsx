import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Star } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { toast } from "sonner";
import PaymentModal from "@/components/payment/PaymentModal";
import { Novel } from "@/lib/data/types";
import TelegramShareButton from "@/components/sharing/TelegramShareButton";

const Store = () => {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  
  const featuredNovels: Novel[] = [
    { 
      id: "1", 
      title: "A Filha do Imperador", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+1", 
      price: 19.90,
      author: { id: "a1", name: "Ana Silva" },
      status: "published",
      description: "Uma história épica sobre a filha de um imperador que precisa lutar pelo seu direito ao trono.",
      categories: ["Fantasia", "Romance"],
      tags: ["Realeza", "Política", "Intriga"],
      reads: 12500,
      purchases: 2300,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: "2", 
      title: "O Príncipe das Sombras", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+2", 
      price: 15.90,
      author: { id: "a2", name: "Carlos Mendes" },
      status: "published",
      description: "Um príncipe exilado retorna para reclamar seu trono, mas descobre que sua família guarda segredos sombrios.",
      categories: ["Fantasia", "Aventura"],
      tags: ["Magia", "Realeza", "Mistério"],
      reads: 9800,
      purchases: 1800,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: "3", 
      title: "Renascendo em Outro Mundo", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+3", 
      price: 22.90,
      author: { id: "a3", name: "Luciana Fraga" },
      status: "published",
      description: "Após um acidente fatal, um programador renasce em um mundo de fantasia com seus conhecimentos intactos.",
      categories: ["Isekai", "Aventura"],
      tags: ["Reencarnação", "Magia", "Aventura"],
      reads: 15700,
      purchases: 3200,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
  ];
  
  const storeNovels: Novel[] = [
    { 
      id: "4", 
      title: "O Cavaleiro da Torre", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+4", 
      price: 12.90,
      author: { id: "a4", name: "Paulo Cavalcanti" },
      status: "published",
      description: "A história de um jovem escudeiro que sonha em se tornar cavaleiro da lendária Torre de Cristal.",
      categories: ["Fantasia Medieval", "Aventura"],
      tags: ["Cavaleiros", "Fantasia", "Aventura"],
      reads: 7800,
      purchases: 1200,
      rating: 4.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: "5", 
      title: "Alquimista Noturno", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+5", 
      price: 17.90,
      author: { id: "a5", name: "João Oliveira" },
      status: "published",
      description: "Um alquimista noturno que busca a chave para a liberdade e a paz.",
      categories: ["Fantasia", "Mistério"],
      tags: ["Magia", "Intriga", "Política"],
      reads: 10500,
      purchases: 1500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: "6", 
      title: "Segredos da Capital", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+6", 
      price: 14.90,
      author: { id: "a6", name: "Maria Santos" },
      status: "published",
      description: "Um jovem estudante de história que descobre segredos escondidos na capital.",
      categories: ["História", "Aventura"],
      tags: ["Política", "Intriga", "Mistério"],
      reads: 8200,
      purchases: 1300,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: "7", 
      title: "Reinos em Guerra", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+7", 
      price: 19.90,
      author: { id: "a7", name: "Pedro Costa" },
      status: "published",
      description: "Um guerreiro que luta para proteger seu reino e seus amigos contra um inimigo poderoso.",
      categories: ["Aventura", "Política"],
      tags: ["Guerra", "Intriga", "Mistério"],
      reads: 11000,
      purchases: 1800,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: "8", 
      title: "A Profecia Perdida", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+8", 
      price: 20.90,
      author: { id: "a8", name: "Ana Oliveira" },
      status: "published",
      description: "Uma jovem que descobre que sua família é a última esperança de um mundo perigoso.",
      categories: ["Fantasia", "Mistério"],
      tags: ["Magia", "Intriga", "Política"],
      reads: 12000,
      purchases: 2000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: "9", 
      title: "Espada do Destino", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+9", 
      price: 16.90,
      author: { id: "a9", name: "Carlos Silva" },
      status: "published",
      description: "Uma guerreira que luta para proteger seu reino e seus amigos contra um inimigo poderoso.",
      categories: ["Aventura", "Política"],
      tags: ["Guerra", "Intriga", "Mistério"],
      reads: 10000,
      purchases: 1700,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
  ];

  const filters = ["Todos", "Romance", "Fantasia", "Aventura", "Mistério"];

  const handlePurchase = (novel: Novel) => {
    setSelectedNovel(novel);
    setPaymentModalOpen(true);
  };

  const handleShare = (novel: Novel) => {
    toast.success(`Compartilhando "${novel.title}" no Telegram`);
  };

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
          >
            {filter}
          </Button>
        ))}
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-primary">Promoções</h2>
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
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-bold text-novel-gold-400">
                            {novel.price?.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                          </span>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              onClick={() => handlePurchase(novel)}
                            >
                              Comprar
                            </Button>
                            <TelegramShareButton
                              text={`Confira esta incrível novela no NovelBook: ${novel.title}`}
                              variant="outline"
                              size="sm"
                              className="bg-transparent border-white text-white hover:bg-white/20"
                            >
                              Compartilhar
                            </TelegramShareButton>
                          </div>
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
        <h2 className="mb-4 text-xl font-semibold text-primary">Catálogo</h2>
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
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                    <h3 className="font-semibold">{novel.title}</h3>
                    <div className="mt-1 flex items-center">
                      <Star size={14} className="text-novel-gold-400 fill-novel-gold-400" />
                      <span className="ml-1 text-sm">{novel.rating}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-novel-gold-400">
                        {novel.price?.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                      </span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          onClick={() => handlePurchase(novel)}
                        >
                          Comprar
                        </Button>
                        <TelegramShareButton
                          text={`Confira esta incrível novela no NovelBook: ${novel.title}`}
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-white text-white hover:bg-white/20"
                        >
                          Compartilhar
                        </TelegramShareButton>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {selectedNovel && (
        <PaymentModal
          novel={selectedNovel}
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Store;
