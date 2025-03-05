
import { Novel, User } from "@/lib/data/types";

// Categorias para recomendação
const CATEGORIES = [
  "Romance", 
  "Fantasia", 
  "Aventura", 
  "Mistério", 
  "Ficção Científica",
  "Terror",
  "Drama",
  "Ação",
  "Isekai"
];

// Função para obter recomendações com base no histórico do usuário
export const getPersonalizedRecommendations = (
  user: User, 
  allNovels: Novel[], 
  purchasedNovels: Novel[] = [],
  readHistory: string[] = []
): Novel[] => {
  
  // Se não tiver histórico suficiente, retorna recomendações populares
  if (!readHistory.length && !purchasedNovels.length) {
    return getPopularRecommendations(allNovels);
  }

  // Extrai as categorias que o usuário já leu/comprou
  const userCategories = new Set<string>();
  
  // Adiciona categorias das novelas compradas
  purchasedNovels.forEach(novel => {
    novel.categories.forEach(category => userCategories.add(category));
  });

  // Adiciona categorias das novelas lidas (assumindo que temos acesso aos IDs)
  const readNovels = allNovels.filter(novel => readHistory.includes(novel.id));
  readNovels.forEach(novel => {
    novel.categories.forEach(category => userCategories.add(category));
  });
  
  // Se ainda não tiver categorias, retorna recomendações populares
  if (userCategories.size === 0) {
    return getPopularRecommendations(allNovels);
  }

  // Filtra as novelas não compradas pelo usuário
  const availableNovels = allNovels.filter(
    novel => !purchasedNovels.some(purchased => purchased.id === novel.id)
  );

  // Pontua cada novela com base nas categorias favoritas
  const scoredNovels = availableNovels.map(novel => {
    let score = 0;
    
    // Pontua com base nas categorias
    novel.categories.forEach(category => {
      if (userCategories.has(category)) {
        score += 1;
      }
    });
    
    // Considerar popularidade como fator secundário
    score += (novel.reads / 10000);
    
    return { novel, score };
  });
  
  // Ordena por pontuação e retorna apenas as novelas
  return scoredNovels
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(item => item.novel);
};

// Recomendações populares para usuários sem histórico
export const getPopularRecommendations = (allNovels: Novel[]): Novel[] => {
  return [...allNovels]
    .sort((a, b) => (b.reads + b.purchases) - (a.reads + a.purchases))
    .slice(0, 10);
};

// Recomendações por categoria específica
export const getRecommendationsByCategory = (
  allNovels: Novel[],
  category: string
): Novel[] => {
  return allNovels
    .filter(novel => novel.categories.includes(category))
    .sort((a, b) => (b.reads + b.purchases) - (a.reads + a.purchases))
    .slice(0, 10);
};
