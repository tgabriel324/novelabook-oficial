
import { useState, useEffect } from "react";
import { Novel } from "@/lib/data/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Star } from "lucide-react";
import { 
  getSimilarNovels, 
  getPersonalizedRecommendations, 
  getMockUserPreferences 
} from "@/lib/recommendation/personalizedRecommendations";

interface ReaderRecommendationsProps {
  currentNovelId: string;
  novels: Novel[];
}

const ReaderRecommendations = ({ currentNovelId, novels }: ReaderRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Novel[]>([]);
  
  useEffect(() => {
    // Obter romances similares ao atual
    const similarNovels = getSimilarNovels(novels, currentNovelId, 3);
    
    // Obter preferências do usuário mock
    const userPreferences = getMockUserPreferences("user_current");
    
    // Obter recomendações personalizadas
    const personalizedRecs = getPersonalizedRecommendations(
      novels.filter(n => n.id !== currentNovelId), 
      userPreferences, 
      2
    );
    
    // Combinar e remover duplicatas
    const allRecommendations = [...similarNovels];
    personalizedRecs.forEach(novel => {
      if (!allRecommendations.some(n => n.id === novel.id)) {
        allRecommendations.push(novel);
      }
    });
    
    setRecommendations(allRecommendations.slice(0, 3));
  }, [currentNovelId, novels]);
  
  if (recommendations.length === 0) {
    return null;
  }
  
  return (
    <div className="my-6 space-y-3">
      <h3 className="text-lg font-semibold">Recomendações para você</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {recommendations.map(novel => (
          <Card key={novel.id} className="overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-0">
              <div className="relative aspect-[2/3] overflow-hidden">
                <img
                  src={novel.cover}
                  alt={novel.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:from-black/80 transition-all" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <h4 className="font-semibold text-sm line-clamp-2">{novel.title}</h4>
                  <div className="flex items-center mt-1">
                    <Star size={12} className="text-novel-gold-400 fill-novel-gold-400" />
                    <span className="text-xs ml-1">{novel.rating || 4.5}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="w-full mt-2 text-xs py-1 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Book size={12} className="mr-1" />
                    Ler agora
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReaderRecommendations;
