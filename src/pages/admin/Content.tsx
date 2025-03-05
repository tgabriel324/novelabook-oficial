
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { useNovels, useCategories } from "@/hooks/useAdminData";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Eye, 
  Edit2, 
  Trash2, 
  Search, 
  Plus, 
  Filter, 
  ArrowUpDown,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Novel } from "@/lib/data/types";
import { format } from "date-fns";

// Enum para ordenação
type SortField = "title" | "author" | "status" | "publishedAt" | "price";
type SortOrder = "asc" | "desc";

const Content = () => {
  const { novels, addNovel, updateNovel, deleteNovel } = useNovels();
  const { categories } = useCategories();
  
  // Estado para filtragem e ordenação
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("publishedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  
  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Estado para formulário de nova novela
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  
  const [newNovel, setNewNovel] = useState<Partial<Novel>>({
    title: "",
    author: {
      id: "1",
      name: "Autor Padrão"
    },
    cover: "/placeholder.svg",
    status: "draft",
    price: null,
    description: "",
    categories: [],
    tags: [],
    reads: 0,
    purchases: 0,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });
  
  // Filtragem de novelas
  const filteredNovels = novels
    .filter(novel => {
      // Filtro de busca
      const matchesSearch = searchQuery === "" || 
        novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        novel.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtro de status
      const matchesStatus = !statusFilter || novel.status === statusFilter;
      
      // Filtro de categoria
      const matchesCategory = !categoryFilter || 
        novel.categories.includes(categoryFilter);
      
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      // Ordenação
      if (sortField === "title") {
        return sortOrder === "asc" 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      
      if (sortField === "author") {
        return sortOrder === "asc" 
          ? a.author.name.localeCompare(b.author.name)
          : b.author.name.localeCompare(a.author.name);
      }
      
      if (sortField === "status") {
        return sortOrder === "asc" 
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      
      if (sortField === "publishedAt") {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
      
      if (sortField === "price") {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
      }
      
      return 0;
    });
  
  // Paginação
  const totalPages = Math.ceil(filteredNovels.length / itemsPerPage);
  const currentNovels = filteredNovels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Manipuladores
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  
  const handleCreateNovel = () => {
    const now = new Date().toISOString();
    const novelToCreate = {
      ...newNovel,
      tags: (newNovel.tags as string[] || []),
      categories: (newNovel.categories as string[] || []),
      updatedAt: now,
      createdAt: now
    };
    
    addNovel(novelToCreate as Omit<Novel, "id">);
    toast.success("Novela criada com sucesso!");
    setIsCreateDialogOpen(false);
    
    // Reset form
    setNewNovel({
      title: "",
      author: {
        id: "1",
        name: "Autor Padrão"
      },
      cover: "/placeholder.svg",
      status: "draft",
      price: null,
      description: "",
      categories: [],
      tags: [],
      reads: 0,
      purchases: 0,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  };
  
  const handleEditNovel = () => {
    if (!selectedNovel) return;
    
    updateNovel(selectedNovel.id, {
      ...selectedNovel,
      updatedAt: new Date().toISOString()
    });
    
    toast.success("Novela atualizada com sucesso!");
    setIsEditDialogOpen(false);
    setSelectedNovel(null);
  };
  
  const handleDeleteNovel = () => {
    if (!selectedNovel) return;
    
    deleteNovel(selectedNovel.id);
    toast.success("Novela excluída com sucesso!");
    setIsDeleteDialogOpen(false);
    setSelectedNovel(null);
  };
  
  const getStatusBadge = (status: Novel['status']) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500 hover:bg-green-600">Publicada</Badge>;
      case 'draft':
        return <Badge variant="outline">Rascunho</Badge>;
      case 'featured':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Destaque</Badge>;
      case 'archived':
        return <Badge variant="secondary">Arquivada</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Conteúdo</h1>
        <p className="text-muted-foreground">Administre novelas, capítulos e categorias</p>
      </header>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Novelas</CardTitle>
              <CardDescription>
                Gerencie todas as novelas disponíveis na plataforma
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Nova Novela
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Nova Novela</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes da nova novela abaixo.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={newNovel.title}
                        onChange={(e) => setNewNovel({ ...newNovel, title: e.target.value })}
                        placeholder="Título da novela"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        onValueChange={(value) => setNewNovel({ ...newNovel, status: value as Novel['status'] })}
                        defaultValue="draft"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="published">Publicada</SelectItem>
                          <SelectItem value="featured">Destaque</SelectItem>
                          <SelectItem value="archived">Arquivada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Preço (R$)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newNovel.price?.toString() || ""}
                        onChange={(e) => setNewNovel({ 
                          ...newNovel, 
                          price: e.target.value ? parseFloat(e.target.value) : null 
                        })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author">Autor</Label>
                      <Select 
                        onValueChange={(value) => {
                          const [id, name] = value.split('|');
                          setNewNovel({ 
                            ...newNovel, 
                            author: { id, name } 
                          });
                        }}
                        defaultValue="2|Maria Oliveira"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o autor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2|Maria Oliveira">Maria Oliveira</SelectItem>
                          <SelectItem value="5|Carlos Ferreira">Carlos Ferreira</SelectItem>
                          <SelectItem value="8|Fernanda Lima">Fernanda Lima</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={newNovel.description}
                      onChange={(e) => setNewNovel({ ...newNovel, description: e.target.value })}
                      placeholder="Descrição da novela"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Categorias</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category.id}`}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewNovel({
                                  ...newNovel,
                                  categories: [...(newNovel.categories || []), category.name]
                                });
                              } else {
                                setNewNovel({
                                  ...newNovel,
                                  categories: (newNovel.categories || []).filter(c => c !== category.name)
                                });
                              }
                            }}
                          />
                          <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                    <Input
                      id="tags"
                      placeholder="aventura, magia, ação"
                      onChange={(e) => setNewNovel({ 
                        ...newNovel, 
                        tags: e.target.value.split(',').map(tag => tag.trim()) 
                      })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="button" onClick={handleCreateNovel}>
                    Criar Novela
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar novelas..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="min-w-32">
                      <Filter className="mr-2 h-4 w-4" />
                      Filtros
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                      Todos os Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("published")}>
                      Publicada
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                      Rascunho
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("featured")}>
                      Destaque
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("archived")}>
                      Arquivada
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filtrar por Categoria</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
                      Todas as Categorias
                    </DropdownMenuItem>
                    {categories.map((category) => (
                      <DropdownMenuItem 
                        key={category.id}
                        onClick={() => setCategoryFilter(category.name)}
                      >
                        {category.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 font-medium"
                        onClick={() => handleSort("title")}
                      >
                        Título
                        <ArrowUpDown size={14} />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 font-medium"
                        onClick={() => handleSort("author")}
                      >
                        Autor
                        <ArrowUpDown size={14} />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 font-medium"
                        onClick={() => handleSort("status")}
                      >
                        Status
                        <ArrowUpDown size={14} />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Categorias</TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 font-medium"
                        onClick={() => handleSort("publishedAt")}
                      >
                        Publicado em
                        <ArrowUpDown size={14} />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 font-medium"
                        onClick={() => handleSort("price")}
                      >
                        Preço
                        <ArrowUpDown size={14} />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentNovels.length > 0 ? (
                    currentNovels.map((novel) => (
                      <TableRow key={novel.id}>
                        <TableCell className="font-medium">{novel.title}</TableCell>
                        <TableCell>{novel.author.name}</TableCell>
                        <TableCell>{getStatusBadge(novel.status)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {novel.categories.slice(0, 2).map((category, i) => (
                              <Badge key={i} variant="secondary" className="mr-1">
                                {category}
                              </Badge>
                            ))}
                            {novel.categories.length > 2 && (
                              <Badge variant="secondary">+{novel.categories.length - 2}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {novel.publishedAt 
                            ? format(new Date(novel.publishedAt), "dd/MM/yyyy") 
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {novel.price !== null 
                            ? `R$ ${novel.price.toFixed(2)}` 
                            : "Gratuito"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setSelectedNovel(novel);
                                // Aqui abriria um modal de visualização
                              }}
                            >
                              <Eye size={16} />
                            </Button>
                            
                            <Dialog open={isEditDialogOpen && selectedNovel?.id === novel.id} onOpenChange={setIsEditDialogOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setSelectedNovel(novel)}
                                >
                                  <Edit2 size={16} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Editar Novela</DialogTitle>
                                  <DialogDescription>
                                    Atualize os detalhes da novela abaixo.
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedNovel && (
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-title">Título</Label>
                                        <Input
                                          id="edit-title"
                                          value={selectedNovel.title}
                                          onChange={(e) => setSelectedNovel({ 
                                            ...selectedNovel, 
                                            title: e.target.value 
                                          })}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-status">Status</Label>
                                        <Select 
                                          value={selectedNovel.status}
                                          onValueChange={(value) => setSelectedNovel({ 
                                            ...selectedNovel, 
                                            status: value as Novel['status'] 
                                          })}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="draft">Rascunho</SelectItem>
                                            <SelectItem value="published">Publicada</SelectItem>
                                            <SelectItem value="featured">Destaque</SelectItem>
                                            <SelectItem value="archived">Arquivada</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-price">Preço (R$)</Label>
                                      <Input
                                        id="edit-price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={selectedNovel.price?.toString() || ""}
                                        onChange={(e) => setSelectedNovel({ 
                                          ...selectedNovel, 
                                          price: e.target.value ? parseFloat(e.target.value) : null 
                                        })}
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-description">Descrição</Label>
                                      <Textarea
                                        id="edit-description"
                                        value={selectedNovel.description}
                                        onChange={(e) => setSelectedNovel({ 
                                          ...selectedNovel, 
                                          description: e.target.value 
                                        })}
                                        rows={3}
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label>Categorias</Label>
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {categories.map((category) => (
                                          <div key={category.id} className="flex items-center space-x-2">
                                            <Checkbox 
                                              id={`edit-category-${category.id}`}
                                              checked={selectedNovel.categories.includes(category.name)}
                                              onCheckedChange={(checked) => {
                                                if (checked) {
                                                  setSelectedNovel({
                                                    ...selectedNovel,
                                                    categories: [...selectedNovel.categories, category.name]
                                                  });
                                                } else {
                                                  setSelectedNovel({
                                                    ...selectedNovel,
                                                    categories: selectedNovel.categories.filter(c => c !== category.name)
                                                  });
                                                }
                                              }}
                                            />
                                            <Label htmlFor={`edit-category-${category.id}`}>{category.name}</Label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-tags">Tags (separadas por vírgula)</Label>
                                      <Input
                                        id="edit-tags"
                                        value={selectedNovel.tags.join(", ")}
                                        onChange={(e) => setSelectedNovel({ 
                                          ...selectedNovel, 
                                          tags: e.target.value.split(',').map(tag => tag.trim())
                                        })}
                                      />
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancelar
                                  </Button>
                                  <Button type="button" onClick={handleEditNovel}>
                                    Salvar Alterações
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            <Dialog open={isDeleteDialogOpen && selectedNovel?.id === novel.id} onOpenChange={setIsDeleteDialogOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setSelectedNovel(novel)}
                                >
                                  <Trash2 size={16} className="text-red-500" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirmar Exclusão</DialogTitle>
                                  <DialogDescription>
                                    Tem certeza que deseja excluir a novela "{selectedNovel?.title}"? Esta ação não pode ser desfeita.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-4">
                                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                    Cancelar
                                  </Button>
                                  <Button variant="destructive" onClick={handleDeleteNovel}>
                                    Excluir
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <BookOpen className="h-8 w-8 mb-2" />
                          <p>Nenhuma novela encontrada</p>
                          <p className="text-sm">Tente ajustar seus filtros ou criar uma nova novela</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {filteredNovels.length > itemsPerPage && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Content;
