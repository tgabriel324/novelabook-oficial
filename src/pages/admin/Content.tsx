
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash, 
  Eye, 
  BookOpenCheck,
  PlusCircle,
  FileText,
  Tag,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { useNovels, useCategories } from "@/hooks/useAdminData";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Novel, Category } from "@/lib/data/types";

const Content = () => {
  const { novels, addNovel, updateNovel, deleteNovel } = useNovels();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("novels");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Novel form state
  const [novelForm, setNovelForm] = useState<Partial<Novel>>({
    title: "",
    description: "",
    status: "draft",
    price: 0,
    categories: [],
    tags: []
  });

  // Category form state
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({
    name: "",
    slug: "",
    description: ""
  });

  // Filtered novels based on search and status
  const filteredNovels = novels.filter(novel => {
    const matchesSearch = novel.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         novel.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         novel.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus ? novel.status === selectedStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  // Filtered categories based on search
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle novel form change
  const handleNovelFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "price") {
      setNovelForm({ ...novelForm, [name]: parseFloat(value) || 0 });
    } else if (name === "categories" || name === "tags") {
      setNovelForm({ ...novelForm, [name]: value.split(",").map(item => item.trim()) });
    } else {
      setNovelForm({ ...novelForm, [name]: value });
    }
  };

  // Handle category form change
  const handleCategoryFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryForm({ ...categoryForm, [name]: value });
  };

  // Submit new novel
  const handleNovelSubmit = () => {
    if (!novelForm.title || !novelForm.description) return;
    
    const newNovel = {
      ...novelForm,
      author: { id: "author_1", name: "Admin User" }, // In a real app, this would be the current user
      cover: "/placeholder.svg", // Default cover
      reads: 0,
      purchases: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Omit<Novel, 'id'>;
    
    addNovel(newNovel);
    
    // Reset form
    setNovelForm({
      title: "",
      description: "",
      status: "draft",
      price: 0,
      categories: [],
      tags: []
    });
  };

  // Submit new category
  const handleCategorySubmit = () => {
    if (!categoryForm.name) return;
    
    // Generate slug if not provided
    const slug = categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-');
    
    const newCategory = {
      ...categoryForm,
      slug,
      count: 0
    } as Omit<Category, 'id'>;
    
    addCategory(newCategory);
    
    // Reset form
    setCategoryForm({
      name: "",
      slug: "",
      description: ""
    });
  };

  // Delete a novel
  const handleDeleteNovel = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta novela?")) {
      deleteNovel(id);
    }
  };

  // Delete a category
  const handleDeleteCategory = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      deleteCategory(id);
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="secondary" className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case 'draft':
        return <Badge variant="outline">{status}</Badge>;
      case 'featured':
        return <Badge variant="secondary" className="bg-purple-500 hover:bg-purple-600">{status}</Badge>;
      case 'archived':
        return <Badge variant="secondary" className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Gerenciamento de Conteúdo</h1>
        <p className="text-muted-foreground">Gerencie novelas, capítulos, categorias e tags.</p>
      </header>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="novels" className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>Novelas</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tag size={16} />
              <span>Categorias</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Pesquisar..."
                className="w-64 pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {activeTab === "novels" && (
              <select 
                className="h-10 rounded-md border border-input bg-background px-3 py-2"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
                <option value="featured">Destaque</option>
                <option value="archived">Arquivado</option>
              </select>
            )}
          </div>
        </div>
        
        <TabsContent value="novels" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Novelas</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusCircle size={16} />
                  <span>Nova Novela</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Novela</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes da novela. Clique em salvar quando finalizar.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Título</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={novelForm.title} 
                      onChange={handleNovelFormChange} 
                      placeholder="Título da novela" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descrição</Label>
                    <textarea 
                      id="description" 
                      name="description" 
                      value={novelForm.description} 
                      onChange={handleNovelFormChange} 
                      className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      placeholder="Descrição da novela" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <select 
                        id="status" 
                        name="status" 
                        value={novelForm.status} 
                        onChange={handleNovelFormChange}
                        className="h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      >
                        <option value="draft">Rascunho</option>
                        <option value="published">Publicado</option>
                        <option value="featured">Destaque</option>
                        <option value="archived">Arquivado</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="price">Preço</Label>
                      <Input 
                        id="price" 
                        name="price" 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        value={novelForm.price} 
                        onChange={handleNovelFormChange} 
                        placeholder="0.00" 
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="categories">Categorias</Label>
                    <Input 
                      id="categories" 
                      name="categories" 
                      value={novelForm.categories?.join(", ")} 
                      onChange={handleNovelFormChange} 
                      placeholder="Fantasia, Ação, Romance (separadas por vírgula)" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input 
                      id="tags" 
                      name="tags" 
                      value={novelForm.tags?.join(", ")} 
                      onChange={handleNovelFormChange} 
                      placeholder="magia, aventura, medieval (separadas por vírgula)" 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleNovelSubmit}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Novela</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Capítulos</TableHead>
                <TableHead>Leituras</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNovels.length > 0 ? (
                filteredNovels.map((novel) => (
                  <TableRow key={novel.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <img 
                          src={novel.cover} 
                          alt={novel.title} 
                          className="w-10 h-14 object-cover rounded-sm" 
                        />
                        <span>{novel.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{novel.author.name}</TableCell>
                    <TableCell>{getStatusBadge(novel.status)}</TableCell>
                    <TableCell>
                      {novel.price !== null ? `R$ ${novel.price.toFixed(2)}` : "Grátis"}
                    </TableCell>
                    <TableCell>{novel.chapters || 0}</TableCell>
                    <TableCell>{novel.reads}</TableCell>
                    <TableCell>{new Date(novel.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" title="Visualizar">
                          <Eye size={16} />
                        </Button>
                        <Button variant="outline" size="icon" title="Editar">
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Excluir"
                          onClick={() => handleDeleteNovel(novel.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhuma novela encontrada. Crie uma nova novela para começar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Categorias</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusCircle size={16} />
                  <span>Nova Categoria</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Categoria</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes da categoria. Clique em salvar quando finalizar.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category-name">Nome</Label>
                    <Input 
                      id="category-name" 
                      name="name" 
                      value={categoryForm.name} 
                      onChange={handleCategoryFormChange} 
                      placeholder="Nome da categoria" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category-slug">Slug (opcional)</Label>
                    <Input 
                      id="category-slug" 
                      name="slug" 
                      value={categoryForm.slug} 
                      onChange={handleCategoryFormChange} 
                      placeholder="nome-da-categoria" 
                    />
                    <p className="text-xs text-muted-foreground">
                      Deixe em branco para gerar automaticamente a partir do nome.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category-description">Descrição</Label>
                    <textarea 
                      id="category-description" 
                      name="description" 
                      value={categoryForm.description} 
                      onChange={handleCategoryFormChange} 
                      className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      placeholder="Descrição da categoria" 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCategorySubmit}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Quantidade de Novelas</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>{category.description || "-"}</TableCell>
                    <TableCell>{category.count}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" title="Editar">
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Excluir"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhuma categoria encontrada. Crie uma nova categoria para começar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Content;
