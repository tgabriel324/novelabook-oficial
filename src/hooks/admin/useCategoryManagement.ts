
import { useState, useEffect } from 'react';
import { Category } from '@/lib/data/types';
import { useToast } from '@/hooks/use-toast';

// Simulação de dados para desenvolvimento - em um cenário real, isso viria de uma API
const mockCategories: Category[] = [
  {
    id: 'cat1',
    name: 'Fantasia',
    slug: 'fantasia',
    description: 'Histórias com elementos mágicos e sobrenaturais',
    count: 24
  },
  {
    id: 'cat2',
    name: 'Romance',
    slug: 'romance',
    description: 'Histórias centradas em relacionamentos amorosos',
    count: 56
  },
  {
    id: 'cat3',
    name: 'Suspense',
    slug: 'suspense',
    description: 'Narrativas que mantêm o leitor em tensão',
    count: 18
  },
  {
    id: 'cat4',
    name: 'Aventura',
    slug: 'aventura',
    description: 'Jornadas emocionantes e desafiadoras',
    count: 32
  },
  {
    id: 'cat5',
    name: 'Ficção Científica',
    slug: 'ficcao-cientifica',
    description: 'Histórias baseadas em avanços científicos imaginários',
    count: 15
  }
];

export const useCategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulando chamada à API
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        // Em um cenário real, isso seria uma chamada à API
        // const response = await fetch('/api/categories');
        // const data = await response.json();
        
        // Simulando um delay de rede
        await new Promise((resolve) => setTimeout(resolve, 600));
        
        setCategories(mockCategories);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as categorias",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const addCategory = async (categoryData: Partial<Category>) => {
    try {
      setIsLoading(true);
      
      // Em um cenário real, isso seria uma chamada à API
      // const response = await fetch('/api/categories', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(categoryData)
      // });
      // const data = await response.json();
      
      // Simulando um delay de rede
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      // Gera um ID simulado
      const newCategory: Category = {
        id: `cat_${Date.now()}`,
        name: categoryData.name || 'Nova categoria',
        slug: categoryData.slug || 'nova-categoria',
        description: categoryData.description,
        count: 0
      };
      
      setCategories(prev => [...prev, newCategory]);
      
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso",
      });
      
      return newCategory;
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a categoria",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      setIsLoading(true);
      
      // Em um cenário real, isso seria uma chamada à API
      // const response = await fetch(`/api/categories/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(categoryData)
      // });
      // const data = await response.json();
      
      // Simulando um delay de rede
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      setCategories(prev => 
        prev.map(category => 
          category.id === id 
            ? { ...category, ...categoryData } 
            : category
        )
      );
      
      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a categoria",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Em um cenário real, isso seria uma chamada à API
      // await fetch(`/api/categories/${id}`, {
      //   method: 'DELETE'
      // });
      
      // Simulando um delay de rede
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      setCategories(prev => prev.filter(category => category.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a categoria",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    categories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory
  };
};
