
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  PlusCircle, 
  Trash2, 
  Edit, 
  Eye, 
  BookOpen, 
  Tag, 
  FolderPlus 
} from "lucide-react";
import { Novel } from "@/lib/data/types";
import { NovelList } from "@/components/admin/content/NovelList";
import { CategoryList } from "@/components/admin/content/CategoryList";
import { NovelFormDialog } from "@/components/admin/content/NovelFormDialog";
import { useNovelManagement } from "@/hooks/admin/useNovelManagement";
import { useCategoryManagement } from "@/hooks/admin/useCategoryManagement";

const ContentManagement = () => {
  const [novelFormOpen, setNovelFormOpen] = useState(false);
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { 
    novels, 
    isLoading: novelsLoading, 
    addNovel, 
    updateNovel, 
    deleteNovel,
    filterNovels
  } = useNovelManagement();

  const {
    categories,
    isLoading: categoriesLoading,
  } = useCategoryManagement();
  
  const handleOpenNovelForm = (novel?: Novel) => {
    setSelectedNovel(novel || null);
    setNovelFormOpen(true);
  };
  
  const handleNovelSubmit = (novelData: Partial<Novel>) => {
    if (selectedNovel) {
      updateNovel({ ...selectedNovel, ...novelData });
    } else {
      addNovel(novelData);
    }
    setNovelFormOpen(false);
    setSelectedNovel(null);
  };
  
  const handleDeleteNovel = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta novela?")) {
      deleteNovel(id);
    }
  };
  
  const filteredNovels = searchTerm 
    ? filterNovels(searchTerm)
    : novels;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Conteúdo</h1>
        <Button onClick={() => handleOpenNovelForm()}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Novela
        </Button>
      </div>

      <Tabs defaultValue="novels" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="novels">Novelas</TabsTrigger>
          <TabsTrigger value="chapters">Capítulos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="novels">
          <Card>
            <CardHeader>
              <CardTitle>Novelas</CardTitle>
              <CardDescription>
                Gerencie todas as novelas da plataforma
              </CardDescription>
              <div className="flex w-full max-w-sm items-center space-x-2 mt-2">
                <Input 
                  placeholder="Buscar novelas..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" variant="secondary">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <NovelList 
                novels={filteredNovels}
                isLoading={novelsLoading}
                onEdit={handleOpenNovelForm}
                onDelete={handleDeleteNovel}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chapters">
          <Card>
            <CardHeader>
              <CardTitle>Capítulos</CardTitle>
              <CardDescription>
                Selecione uma novela para gerenciar seus capítulos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {novels.map(novel => (
                  <Card key={novel.id} className="cursor-pointer hover:bg-muted/50">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{novel.title}</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <CardDescription>
                        {novel.chapters || 0} capítulos
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categorias</CardTitle>
              <CardDescription>
                Gerencie categorias e tags para organizar o conteúdo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryList 
                categories={categories}
                isLoading={categoriesLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {novelFormOpen && (
        <NovelFormDialog
          novel={selectedNovel}
          categories={categories}
          onSubmit={handleNovelSubmit}
          onCancel={() => setNovelFormOpen(false)}
        />
      )}
    </div>
  );
};

export default ContentManagement;
