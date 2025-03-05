
import { Novel } from "@/lib/data/types";

// Tipo para definir a preferência do usuário
export interface UserPreference {
  userId: string;
  categories: string[];
  authors: string[];
  lastRead: string[];
  readCount: Record<string, number>; // novelId: count
}

// Função para obter recomendações baseadas nas preferências do usuário
export const getPersonalizedRecommendations = (
  novels: Novel[],
  userPreference: UserPreference,
  limit: number = 5
): Novel[] => {
  // Clone os romances para não modificar o original
  const scoredNovels = novels.map(novel => {
    let score = 0;
    
    // Pontue com base nas categorias favoritas
    const categoryMatches = novel.categories.filter(category => 
      userPreference.categories.includes(category)
    ).length;
    score += categoryMatches * 2;
    
    // Pontue com base nos autores favoritos
    if (userPreference.authors.includes(novel.author.id)) {
      score += 3;
    }
    
    // Não recomende livros que o usuário leu recentemente
    if (userPreference.lastRead.includes(novel.id)) {
      score -= 5;
    }
    
    // Dê uma pontuação maior para livros populares
    score += Math.log(novel.reads || 1) * 0.2;
    
    // Se o usuário já começou a ler este livro, aumente a pontuação
    if (userPreference.readCount[novel.id]) {
      score += Math.min(userPreference.readCount[novel.id], 5);
    }
    
    return { novel, score };
  });
  
  // Ordene por pontuação e retorne os top N
  return scoredNovels
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.novel);
};

// Função para obter recomendações baseadas em um romance específico
export const getSimilarNovels = (
  novels: Novel[],
  targetNovelId: string,
  limit: number = 3
): Novel[] => {
  const targetNovel = novels.find(novel => novel.id === targetNovelId);
  
  if (!targetNovel) {
    return novels.slice(0, limit);
  }
  
  // Clone os romances para não modificar o original
  const scoredNovels = novels
    .filter(novel => novel.id !== targetNovelId) // Exclua o romance de destino
    .map(novel => {
      let score = 0;
      
      // Pontue com base em categorias compartilhadas
      const categoryMatches = novel.categories.filter(category => 
        targetNovel.categories.includes(category)
      ).length;
      score += categoryMatches * 3;
      
      // Pontue com base em tags compartilhadas
      const tagMatches = novel.tags.filter(tag => 
        targetNovel.tags.includes(tag)
      ).length;
      score += tagMatches * 2;
      
      // Pontue com base no mesmo autor
      if (novel.author.id === targetNovel.author.id) {
        score += 4;
      }
      
      return { novel, score };
    });
  
  // Ordene por pontuação e retorne os top N
  return scoredNovels
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.novel);
};

// Mock de preferências do usuário para teste
export const getMockUserPreferences = (userId: string): UserPreference => {
  return {
    userId,
    categories: ["Fantasia", "Aventura", "Romance"],
    authors: ["a1", "a3", "a5"],
    lastRead: ["3", "5"],
    readCount: {
      "1": 3,
      "4": 2,
      "7": 1
    }
  };
};
