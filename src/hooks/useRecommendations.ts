
import { useState, useEffect } from "react";
import { Novel, User } from "@/lib/data/types";
import { 
  getPersonalizedRecommendations, 
  getPopularRecommendations, 
  getRecommendationsByCategory 
} from "@/lib/recommendation/recommendationService";

// Dados de exemplo para demonstração
const MOCK_NOVELS: Novel[] = [
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
    rating: 4.7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // ... adicionar mais novelas mock para testes
];

// Hook para obter recomendações
export const useRecommendations = (
  currentUser?: User, 
  purchasedIds: string[] = []
) => {
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<Novel[]>([]);
  const [popularRecommendations, setPopularRecommendations] = useState<Novel[]>([]);
  const [categoryRecommendations, setCategoryRecommendations] = useState<Record<string, Novel[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Em um ambiente real, isso viria da API
    const fetchRecommendations = async () => {
      setLoading(true);
      
      try {
        // Simule um atraso de API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Obter todas as novelas (em um app real, isso viria do backend)
        const allNovels = MOCK_NOVELS;
        
        // Novelas compradas pelo usuário
        const purchasedNovels = allNovels.filter(novel => 
          purchasedIds.includes(novel.id)
        );
        
        // Obter recomendações personalizadas
        if (currentUser) {
          const personalized = getPersonalizedRecommendations(
            currentUser, 
            allNovels, 
            purchasedNovels
          );
          setPersonalizedRecommendations(personalized);
        }
        
        // Obter recomendações populares
        const popular = getPopularRecommendations(allNovels);
        setPopularRecommendations(popular);
        
        // Obter recomendações por categoria
        const categories = ["Fantasia", "Romance", "Aventura"];
        const byCategory: Record<string, Novel[]> = {};
        
        for (const category of categories) {
          byCategory[category] = getRecommendationsByCategory(allNovels, category);
        }
        
        setCategoryRecommendations(byCategory);
      } catch (error) {
        console.error("Erro ao obter recomendações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentUser, purchasedIds]);

  return {
    personalizedRecommendations,
    popularRecommendations,
    categoryRecommendations,
    loading
  };
};
