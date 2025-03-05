
import { Novel } from "@/lib/data/types";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TelegramShareButton from "@/components/sharing/TelegramShareButton";

interface RecommendationCarouselProps {
  title: string;
  novels: Novel[];
  onPurchase?: (novel: Novel) => void;
}

const RecommendationCarousel = ({ 
  title, 
  novels,
  onPurchase 
}: RecommendationCarouselProps) => {
  const navigate = useNavigate();

  const handleNovelClick = (novel: Novel) => {
    // Aqui seria a navegação para a página da novela
    if (onPurchase) {
      onPurchase(novel);
    } else {
      navigate(`/loja?highlight=${novel.id}`);
    }
  };

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-semibold text-primary">{title}</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {novels.map((novel) => (
            <CarouselItem key={novel.id} className="md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              <Card 
                className="overflow-hidden cursor-pointer" 
                onClick={() => handleNovelClick(novel)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                      src={novel.cover}
                      alt={novel.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                      <h3 className="font-semibold line-clamp-1">{novel.title}</h3>
                      {novel.rating && (
                        <div className="mt-1 flex items-center">
                          <Star size={14} className="text-novel-gold-400 fill-novel-gold-400" />
                          <span className="ml-1 text-sm">{novel.rating}</span>
                        </div>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-bold text-novel-gold-400">
                          {novel.price 
                            ? novel.price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
                            : "Grátis"}
                        </span>
                        <div className="flex gap-1">
                          {onPurchase && (
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              className="h-8 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                onPurchase(novel);
                              }}
                            >
                              Comprar
                            </Button>
                          )}
                          <TelegramShareButton
                            text={`Confira esta incrível novela no NovelBook: ${novel.title}`}
                            variant="outline"
                            size="sm"
                            className="bg-transparent border-white text-white hover:bg-white/20 h-8 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
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
        <CarouselPrevious className="left-1" />
        <CarouselNext className="right-1" />
      </Carousel>
    </section>
  );
};

export default RecommendationCarousel;
