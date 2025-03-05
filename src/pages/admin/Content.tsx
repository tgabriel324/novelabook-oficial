
import React, { useState } from "react";
import { useNovels, useUsers, useCategories, useActivityLogs } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Novel } from "@/lib/data/types";
import { 
  BookOpen, 
  MoreVertical, 
  Plus, 
  Pencil, 
  Trash,
  Search,
  Tag,
  Filter,
  FileText,
  BookPlus,
  CheckCircle,
  Clock,
  Star,
  Archive 
} from "lucide-react";

type StatusColors = {
  [key in Novel['status']]: string;
};

const statusColors: StatusColors = {
  draft: "bg-yellow-100 text-yellow-800",
  published: "bg-green-100 text-green-800",
  featured: "bg-purple-100 text-purple-800",
  archived: "bg-gray-100 text-gray-800",
};

const statusLabels = {
  draft: "Rascunho",
  published: "Publicado",
  featured: "Destaque",
  archived: "Arquivado",
};

const Content = () => {
  const { novels, addNovel, updateNovel, deleteNovel } = useNovels();
  const { users } = useUsers();
  const { categories } = useCategories();
  const { addLog } = useActivityLogs();
  
  const [selectedTab, setSelectedTab] = useState("novels");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  const [isNewNovelOpen, setIsNewNovelOpen] = useState(false);
  const [isEditNovelOpen, setIsEditNovelOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  
  // Form State for New Novel
  const [newNovelForm, setNewNovelForm] = useState({
    title: "",
    authorId: "",
    cover: "/placeholder.svg",
    status: "draft" as const,
    price: 0,
    description: "",
    categories: [] as string[],
    tags: [] as string[],
  });
  
  // Filtered Novels
  const filteredNovels = novels.filter(novel => {
    const matchesSearch = novel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          novel.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || novel.status === statusFilter;
    const matchesCategory = !categoryFilter || novel.categories.includes(categoryFilter);
    
    return matchesSearch && matchesStatus && matchesCategory;
  });
  
  // Authors list for select dropdown
  const authors = users.filter(user => user.role === "author");
  
  // Reset form
  const resetForm = () => {
    setNewNovelForm({
      title: "",
      authorId: "",
      cover: "/placeholder.svg",
      status: "draft",
      price: 0,
      description: "",
      categories: [],
      tags: [],
    });
  };
  
  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewNovelForm({
      ...newNovelForm,
      [name]: value,
    });
  };
  
  // Handle form select change
  const handleSelectChange = (name: string, value: string) => {
    setNewNovelForm({
      ...newNovelForm,
      [name]: value,
    });
  };
  
  // Add new novel
  const handleAddNovel = () => {
    const author = users.find(user => user.id === newNovelForm.authorId);
    
    if (!author) {
      toast.error("Autor não encontrado");
      return;
    }
    
    const newNovel = {
      title: newNovelForm.title,
      author: {
        id: author.id,
        name: author.name,
      },
      cover: newNovelForm.cover,
      status: newNovelForm.status,
      price: newNovelForm.price,
      description: newNovelForm.description,
      categories: newNovelForm.categories,
      tags: newNovelForm.tags,
    };
    
    const fullNovel = {
      ...newNovel,
      reads: 0,
      purchases: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    addNovel(fullNovel);
    
    addLog({
      user: {
        id: "admin",
        name: "Administrador",
      },
      action: "Criou uma nova novela",
      entity: {
        type: "novel",
        id: "new",
        name: newNovelForm.title,
      },
      details: `Novela "${newNovelForm.title}" criada com status ${statusLabels[newNovelForm.status]}`,
    });
    
    setIsNewNovelOpen(false);
    resetForm();
    toast.success("Novela adicionada com sucesso!");
  };
  
  // Edit novel
  const handleEditNovel = () => {
    if (!selectedNovel) return;
    
    const author = users.find(user => user.id === newNovelForm.authorId);
    
    if (!author) {
      toast.error("Autor não encontrado");
      return;
    }
    
    const updatedNovel = {
      title: newNovelForm.title,
      author: {
        id: author.id,
        name: author.name,
      },
      cover: newNovelForm.cover,
      status: newNovelForm.status,
      price: newNovelForm.price,
      description: newNovelForm.description,
      categories: newNovelForm.categories,
      tags: newNovelForm.tags,
      updatedAt: new Date().toISOString(),
    };
    
    updateNovel(selectedNovel.id, updatedNovel);
    
    addLog({
      user: {
        id: "admin",
        name: "Administrador",
      },
      action: "Atualizou uma novela",
      entity: {
        type: "novel",
        id: selectedNovel.id,
        name: newNovelForm.title,
      },
      details: `Novela "${newNovelForm.title}" atualizada com status ${statusLabels[newNovelForm.status]}`,
    });
    
    setIsEditNovelOpen(false);
    setSelectedNovel(null);
    resetForm();
    toast.success("Novela atualizada com sucesso!");
  };
  
  // Delete novel
  const handleDeleteNovel = () => {
    if (!selectedNovel) return;
    
    deleteNovel(selectedNovel.id);
    
    addLog({
      user: {
        id: "admin",
        name: "Administrador",
      },
      action: "Excluiu uma novela",
      entity: {
        type: "novel",
        id: selectedNovel.id,
        name: selectedNovel.title,
      },
      details: `Novela "${selectedNovel.title}" removida do sistema`,
    });
    
    setIsDeleteConfirmOpen(false);
    setSelectedNovel(null);
    toast.success("Novela excluída com sucesso!");
  };
  
  // Open edit dialog
  const openEditDialog = (novel: Novel) => {
    setSelectedNovel(novel);
    setNewNovelForm({
      title: novel.title,
      authorId: novel.author.id,
      cover: novel.cover,
      status: novel.status,
      price: novel.price || 0,
      description: novel.description,
      categories: novel.categories,
      tags: novel.tags,
    });
    setIsEditNovelOpen(true);
  };
  
  // Open delete confirm dialog
  const openDeleteDialog = (novel: Novel) => {
    setSelectedNovel(novel);
    setIsDeleteConfirmOpen(true);
  };
  
  // Get status icon
  const getStatusIcon = (status: Novel['status']) => {
    switch (status) {
      case "draft":
        return <Clock className="h-4 w-4 mr-1" />;
      case "published":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "featured":
        return <Star className="h-4 w-4 mr-1" />;
      case "archived":
        return <Archive className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Conteúdo</h1>
          <p className="text-muted-foreground">
            Gerencie novelas, capítulos e categorias.
          </p>
        </div>
        <Button onClick={() => setIsNewNovelOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nova Novela
        </Button>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="novels" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" /> Novelas
          </TabsTrigger>
          <TabsTrigger value="chapters" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" /> Capítulos
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center">
            <Tag className="h-4 w-4 mr-2" /> Categorias
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-4 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-1/3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={statusFilter || ""}
              onValueChange={(value) => setStatusFilter(value || null)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="featured">Destaque</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={categoryFilter || ""}
              onValueChange={(value) => setCategoryFilter(value || null)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="novels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Novelas ({filteredNovels.length})</CardTitle>
              <CardDescription>
                Lista de todas as novelas disponíveis na plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Leituras</TableHead>
                    <TableHead className="text-right">Vendas</TableHead>
                    <TableHead>Atualização</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNovels.length > 0 ? (
                    filteredNovels.map((novel) => (
                      <TableRow key={novel.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded overflow-hidden bg-muted">
                              <img 
                                src={novel.cover || "/placeholder.svg"} 
                                alt={novel.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span className="truncate max-w-[150px]">{novel.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{novel.author.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[novel.status]}>
                            {getStatusIcon(novel.status)}
                            {statusLabels[novel.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{novel.reads}</TableCell>
                        <TableCell className="text-right">{novel.purchases}</TableCell>
                        <TableCell>
                          {new Date(novel.updatedAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="flex items-center"
                                onClick={() => openEditDialog(novel)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center text-destructive"
                                onClick={() => openDeleteDialog(novel)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        Nenhuma novela encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chapters" className="space-y-4">
          <Card className="pt-6">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <BookPlus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Gerenciamento de Capítulos</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Selecione uma novela para gerenciar seus capítulos, adicionar conteúdo
                e controlar a publicação.
              </p>
              <Button>Selecionar Novela</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <Card className="pt-6">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Tag className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Gerenciamento de Categorias</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Adicione, edite ou remova categorias para organizar as novelas
                e melhorar a experiência de descoberta.
              </p>
              <Button>Gerenciar Categorias</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Nova Novela Dialog */}
      <Dialog open={isNewNovelOpen} onOpenChange={setIsNewNovelOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Novela</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para adicionar uma nova novela à plataforma.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Título
              </label>
              <Input
                id="title"
                name="title"
                value={newNovelForm.title}
                onChange={handleInputChange}
                placeholder="Título da novela"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="authorId" className="text-sm font-medium">
                Autor
              </label>
              <Select
                value={newNovelForm.authorId}
                onValueChange={(value) => handleSelectChange("authorId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um autor" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select
                value={newNovelForm.status}
                onValueChange={(value) => handleSelectChange("status", value as Novel['status'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="featured">Destaque</SelectItem>
                  <SelectItem value="archived">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="price" className="text-sm font-medium">
                Preço (R$)
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={newNovelForm.price}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descrição
              </label>
              <Textarea
                id="description"
                name="description"
                value={newNovelForm.description}
                onChange={handleInputChange}
                placeholder="Descrição da novela"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsNewNovelOpen(false);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button onClick={handleAddNovel}>Adicionar Novela</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Editar Novela Dialog */}
      <Dialog open={isEditNovelOpen} onOpenChange={setIsEditNovelOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Novela</DialogTitle>
            <DialogDescription>
              Atualize as informações da novela.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-title" className="text-sm font-medium">
                Título
              </label>
              <Input
                id="edit-title"
                name="title"
                value={newNovelForm.title}
                onChange={handleInputChange}
                placeholder="Título da novela"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-authorId" className="text-sm font-medium">
                Autor
              </label>
              <Select
                value={newNovelForm.authorId}
                onValueChange={(value) => handleSelectChange("authorId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um autor" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-status" className="text-sm font-medium">
                Status
              </label>
              <Select
                value={newNovelForm.status}
                onValueChange={(value) => handleSelectChange("status", value as Novel['status'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="featured">Destaque</SelectItem>
                  <SelectItem value="archived">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-price" className="text-sm font-medium">
                Preço (R$)
              </label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={newNovelForm.price}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-description" className="text-sm font-medium">
                Descrição
              </label>
              <Textarea
                id="edit-description"
                name="description"
                value={newNovelForm.description}
                onChange={handleInputChange}
                placeholder="Descrição da novela"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditNovelOpen(false);
              setSelectedNovel(null);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button onClick={handleEditNovel}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmar Exclusão Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a novela "{selectedNovel?.title}"?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteNovel}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Content;
