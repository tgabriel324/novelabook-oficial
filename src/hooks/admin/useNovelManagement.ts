
import { useState, useEffect } from 'react';
import { Novel } from '@/lib/data/types';
import { useToast } from '@/hooks/use-toast';

// Simulação de dados para desenvolvimento - em um cenário real, isso viria de uma API
const mockNovels: Novel[] = [
  {
    id: '1',
    title: 'O Último Guerreiro',
    author: { id: 'author1', name: 'Maria Silva' },
    cover: '/placeholder.svg',
    status: 'published',
    price: 19.90,
    description: 'Uma história épica de aventura e fantasia em um mundo de magia.',
    categories: ['Fantasia', 'Aventura'],
    tags: ['magia', 'guerreiros', 'medieval'],
    rating: 4.5,
    reads: 3250,
    purchases: 820,
    publishedAt: '2023-05-15T00:00:00Z',
    updatedAt: '2023-06-20T00:00:00Z',
    createdAt: '2023-04-10T00:00:00Z',
    chapters: 24
  },
  {
    id: '2',
    title: 'Códigos do Coração',
    author: { id: 'author2', name: 'João Pereira' },
    cover: '/placeholder.svg',
    status: 'draft',
    price: 0,
    description: 'Um romance contemporâneo sobre um programador e uma artista.',
    categories: ['Romance', 'Contemporâneo'],
    tags: ['romance', 'tecnologia', 'arte'],
    reads: 0,
    purchases: 0,
    updatedAt: '2023-07-05T00:00:00Z',
    createdAt: '2023-07-01T00:00:00Z',
    chapters: 5
  },
  {
    id: '3',
    title: 'Estrelas da Meia-Noite',
    author: { id: 'author3', name: 'Ana Costa' },
    cover: '/placeholder.svg',
    status: 'featured',
    price: 24.99,
    description: 'Thriller de suspense e mistério que vai te deixar sem fôlego.',
    categories: ['Suspense', 'Mistério'],
    tags: ['crime', 'investigação', 'noite'],
    rating: 4.8,
    reads: 5120,
    purchases: 1240,
    publishedAt: '2023-02-10T00:00:00Z',
    updatedAt: '2023-06-15T00:00:00Z',
    createdAt: '2023-01-20T00:00:00Z',
    chapters: 32
  }
];

export const useNovelManagement = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulando chamada à API
    const fetchNovels = async () => {
      try {
        setIsLoading(true);
        // Em um cenário real, isso seria uma chamada à API
        // const response = await fetch('/api/novels');
        // const data = await response.json();
        
        // Simulando um delay de rede
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        setNovels(mockNovels);
      } catch (error) {
        console.error('Erro ao buscar novelas:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as novelas",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNovels();
  }, [toast]);

  const addNovel = async (novelData: Partial<Novel>) => {
    try {
      setIsLoading(true);
      
      // Em um cenário real, isso seria uma chamada à API
      // const response = await fetch('/api/novels', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(novelData)
      // });
      // const data = await response.json();
      
      // Simulando um delay de rede
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Gera um ID simulado
      const newNovel: Novel = {
        id: `novel_${Date.now()}`,
        title: novelData.title || 'Sem título',
        author: { id: 'current_user', name: 'Usuário Atual' }, // Em um cenário real, isso viria do usuário logado
        cover: novelData.cover || '/placeholder.svg',
        status: novelData.status || 'draft',
        price: novelData.price || 0,
        description: novelData.description || '',
        categories: novelData.categories || [],
        tags: novelData.tags || [],
        reads: 0,
        purchases: 0,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        chapters: 0
      };
      
      setNovels(prev => [newNovel, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Novela criada com sucesso",
      });
      
      return newNovel;
    } catch (error) {
      console.error('Erro ao adicionar novela:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a novela",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateNovel = async (novelData: Partial<Novel>) => {
    if (!novelData.id) {
      toast({
        title: "Erro",
        description: "ID da novela não fornecido",
        variant: "destructive"
      });
      return null;
    }

    try {
      setIsLoading(true);
      
      // Em um cenário real, isso seria uma chamada à API
      // const response = await fetch(`/api/novels/${novelData.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(novelData)
      // });
      // const data = await response.json();
      
      // Simulando um delay de rede
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setNovels(prev => 
        prev.map(novel => 
          novel.id === novelData.id 
            ? { ...novel, ...novelData, updatedAt: new Date().toISOString() } 
            : novel
        )
      );
      
      toast({
        title: "Sucesso",
        description: "Novela atualizada com sucesso",
      });
      
      return novelData;
    } catch (error) {
      console.error('Erro ao atualizar novela:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a novela",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNovel = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Em um cenário real, isso seria uma chamada à API
      // await fetch(`/api/novels/${id}`, {
      //   method: 'DELETE'
      // });
      
      // Simulando um delay de rede
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setNovels(prev => prev.filter(novel => novel.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Novela excluída com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir novela:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a novela",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const filterNovels = (searchTerm: string): Novel[] => {
    const term = searchTerm.toLowerCase();
    return novels.filter(novel => {
      return (
        novel.title.toLowerCase().includes(term) ||
        novel.author.name.toLowerCase().includes(term) ||
        novel.description.toLowerCase().includes(term) ||
        novel.categories.some(cat => cat.toLowerCase().includes(term)) ||
        novel.tags.some(tag => tag.toLowerCase().includes(term))
      );
    });
  };

  return {
    novels,
    isLoading,
    addNovel,
    updateNovel,
    deleteNovel,
    filterNovels
  };
};
