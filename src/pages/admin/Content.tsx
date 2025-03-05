
import { useState } from "react";
import { Novel } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  PlusCircle, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Filter, 
  FileText,
  Download,
  ArrowUpDown
} from "lucide-react";
import { toast } from "sonner";

// Mock data para demonstração
const mockNovels: Novel[] = [
  {
    id: "1",
    title: "A Filha do Imperador",
    cover: "https://via.placeholder.com/100x150/9b87f5/ffffff?text=Novel+1",
    author: "Maria Silva",
    authorId: "a1",
    description: "Uma história de intrigas palacianas onde a protagonista precisa navegar as complexas relações da corte imperial.",
    price: 19.9,
    publishedAt: "2023-01-15T00:00:00Z",
    status: "published",
    categories: ["Romance", "Fantasia"],
    language: "Português",
    length: "longa",
    rating: 4.5,
    reviewCount: 128,
    chapterCount: 42,
    wordCount: 185000,
    salesCount: 750,
    featuredUntil: "2023-05-15T00:00:00Z"
  },
  {
    id: "2",
    title: "O Príncipe das Sombras",
    cover: "https://via.placeholder.com/100x150/9b87f5/ffffff?text=Novel+2",
    author: "João Costa",
    authorId: "a2",
    description: "Um príncipe criado nas sombras precisa confrontar seu destino e assumir o trono usurpado.",
    price: 15.9,
    publishedAt: "2023-02-28T00:00:00Z",
    status: "published",
    categories: ["Aventura", "Mistério"],
    language: "Português",
    length: "média",
    rating: 4.2,
    reviewCount: 95,
    chapterCount: 28,
    wordCount: 120000,
    salesCount: 530
  },
  {
    id: "3",
    title: "Renascendo em Outro Mundo",
    cover: "https://via.placeholder.com/100x150/9b87f5/ffffff?text=Novel+3",
    author: "Ana Reis",
    authorId: "a3",
    description: "Após um acidente, o protagonista renasce em um mundo de fantasia com magia e criaturas místicas.",
    price: 21.9,
    publishedAt: "2023-03-10T00:00:00Z",
    status: "published",
    categories: ["Isekai", "Fantasia"],
    language: "Português",
    length: "longa",
    rating: 4.7,
    reviewCount: 200,
    chapterCount: 56,
    wordCount: 245000,
    salesCount: 980,
    featuredUntil: "2023-06-10T00:00:00Z"
  },
  {
    id: "4",
    title: "A Duquesa Rebelde",
    cover: "https://via.placeholder.com/100x150/9b87f5/ffffff?text=Novel+4",
    author: "Laura Bennett",
    authorId: "a4",
    description: "Uma duquesa que se recusa a seguir as convenções da sociedade e luta por seus próprios ideais.",
    price: 12.9,
    publishedAt: "2023-04-05T00:00:00Z",
    status: "draft",
    categories: ["Romance", "Histórico"],
    language: "Inglês (Traduzido)",
    length: "curta",
    rating: 4.0,
    reviewCount: 75,
    chapterCount: 18,
    wordCount: 75000,
    salesCount: 320
  },
  {
    id: "5",
    title: "O Cavaleiro da Torre",
    cover: "https://via.placeholder.com/100x150/9b87f5/ffffff?text=Novel+5",
    author: "Ricardo Mendes",
    authorId: "a5",
    description: "Um cavaleiro solitário protege uma torre mágica que guarda segredos do passado.",
    price: 18.9,
    publishedAt: "2023-05-20T00:00:00Z",
    status: "published",
    categories: ["Aventura", "Fantasia"],
    language: "Português",
    length: "média",
    rating: 4.3,
    reviewCount: 64,
    chapterCount: 32,
    wordCount: 135000,
    salesCount: 420
  },
];

const Content = () => {
  const [novels, setNovels] = useState<Novel[]>(mockNovels);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof Novel | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [newNovel, setNewNovel] = useState<Partial<Novel>>({
    title: "",
    author: "",
    description: "",
    price: 0,
    status: "draft",
    categories: [],
    language: "Português",
    length: "média"
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredNovels = novels.filter(novel => 
    novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    novel.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    novel.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedNovels = sortField 
    ? [...filteredNovels].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
      })
    : filteredNovels;

  const handleSort = (field: keyof Novel) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const viewNovel = (novel: Novel) => {
    setSelectedNovel(novel);
    setIsViewDialogOpen(true);
  };

  const editNovel = (novel: Novel) => {
    setSelectedNovel(novel);
    setNewNovel(novel);
    setIsEditDialogOpen(true);
  };

  const deleteNovel = (novel: Novel) => {
    setSelectedNovel(novel);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedNovel) {
      setNovels(novels.filter(novel => novel.id !== selectedNovel.id));
      toast.success("Novela excluída com sucesso!");
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCreateNovel = () => {
    const id = Math.random().toString(36).substring(2, 9);
    const createdNovel: Novel = {
      id,
      title: newNovel.title || "Nova Novela",
      cover: "https://via.placeholder.com/100x150/9b87f5/ffffff?text=New+Novel",
      author: newNovel.author || "Autor Anônimo",
      authorId: "new",
      description: newNovel.description || "Sem descrição",
      price: newNovel.price || 0,
      publishedAt: new Date().toISOString(),
      status: newNovel.status as 'draft' | 'published' | 'archived' || "draft",
      categories: newNovel.categories || [],
      language: newNovel.language || "Português",
      length: newNovel.length as 'curta' | 'média' | 'longa' || "média",
      rating: 0,
      reviewCount: 0,
      chapterCount: 0,
      wordCount: 0,
      salesCount: 0
    };
    
    setNovels([...novels, createdNovel]);
    toast.success("Novela criada com sucesso!");
    setIsCreateDialogOpen(false);
    setNewNovel({});
  };

  const handleUpdateNovel = () => {
    if (selectedNovel && newNovel) {
      const updatedNovels = novels.map(novel => 
        novel.id === selectedNovel.id 
          ? { ...novel, ...newNovel } 
          : novel
      );
      setNovels(updatedNovels);
      toast.success("Novela atualizada com sucesso!");
      setIsEditDialogOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewNovel({
      ...newNovel,
      [name]: name === 'price' ? parseFloat(value) : value
    });
  };

  const handleCategoryChange = (category: string) => {
    const currentCategories = newNovel.categories || [];
    
    if (currentCategories.includes(category)) {
      setNewNovel({
        ...newNovel,
        categories: currentCategories.filter(c => c !== category)
      });
    } else {
      setNewNovel({
        ...newNovel,
        categories: [...currentCategories, category]
      });
    }
  };

  const handleStatusChange = (status: 'draft' | 'published' | 'archived') => {
    setNewNovel({
      ...newNovel,
      status
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'published':
        return <Badge className="bg-green-500">Publicado</Badge>;
      case 'draft':
        return <Badge variant="outline">Rascunho</Badge>;
      case 'archived':
        return <Badge variant="secondary">Arquivado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Conteúdo</h1>
          <p className="text-muted-foreground">
            Adicione, edite e gerencie as novelas da plataforma
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Novela
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Estatísticas de Conteúdo</CardTitle>
          <CardDescription>Visão geral do conteúdo na plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-muted-foreground text-sm">Total de Novelas</p>
              <p className="text-2xl font-bold">{novels.length}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-muted-foreground text-sm">Publicadas</p>
              <p className="text-2xl font-bold">{novels.filter(n => n.status === 'published').length}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-muted-foreground text-sm">Em Rascunho</p>
              <p className="text-2xl font-bold">{novels.filter(n => n.status === 'draft').length}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-muted-foreground text-sm">Mais Vendida</p>
              <p className="text-sm font-medium truncate">
                {novels.sort((a, b) => b.salesCount - a.salesCount)[0]?.title}
              </p>
              <p className="text-xl font-bold">{novels.sort((a, b) => b.salesCount - a.salesCount)[0]?.salesCount} vendas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-card rounded-md border shadow-sm">
        <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center border-b">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Buscar por título, autor ou categoria" 
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">ID</TableHead>
                <TableHead className="w-[250px]">Novela</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('author')}>
                  <div className="flex items-center">
                    Autor
                    {sortField === 'author' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Categorias</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('price')}>
                  <div className="flex items-center">
                    Preço
                    {sortField === 'price' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('salesCount')}>
                  <div className="flex items-center">
                    Vendas
                    {sortField === 'salesCount' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedNovels.map((novel) => (
                <TableRow key={novel.id}>
                  <TableCell className="font-mono text-xs">{novel.id.substring(0, 5)}...</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={novel.cover} 
                        alt={novel.title} 
                        className="h-12 w-9 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium truncate max-w-[180px]">{novel.title}</p>
                        <p className="text-xs text-muted-foreground">{novel.publishedAt.substring(0, 10)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{novel.author}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {novel.categories.map(category => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>R$ {novel.price.toFixed(2)}</TableCell>
                  <TableCell>{novel.salesCount}</TableCell>
                  <TableCell>{getStatusBadge(novel.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewNovel(novel)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Visualizar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => editNovel(novel)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteNovel(novel)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {sortedNovels.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-lg font-medium">Nenhuma novela encontrada</p>
                    <p className="text-muted-foreground">
                      Tente ajustar sua busca ou adicione uma nova novela.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog para visualizar novela */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Novela</DialogTitle>
          </DialogHeader>
          {selectedNovel && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img 
                    src={selectedNovel.cover} 
                    alt={selectedNovel.title} 
                    className="h-48 object-cover rounded"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div>{getStatusBadge(selectedNovel.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categorias</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedNovel.categories.map(category => (
                      <Badge key={category} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Título</p>
                  <p className="text-lg font-medium">{selectedNovel.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Autor</p>
                  <p>{selectedNovel.author}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                  <p className="text-sm">{selectedNovel.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Preço</p>
                    <p>R$ {selectedNovel.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Publicação</p>
                    <p>{new Date(selectedNovel.publishedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avaliação</p>
                    <p>⭐ {selectedNovel.rating} ({selectedNovel.reviewCount} avaliações)</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vendas</p>
                    <p>{selectedNovel.salesCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Capítulos</p>
                    <p>{selectedNovel.chapterCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Palavras</p>
                    <p>{selectedNovel.wordCount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
            {selectedNovel && (
              <Button onClick={() => {
                setIsViewDialogOpen(false);
                editNovel(selectedNovel);
              }}>
                Editar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para criar nova novela */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Criar Nova Novela</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da nova novela abaixo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  name="title"
                  value={newNovel.title}
                  onChange={handleInputChange}
                  placeholder="Título da novela"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Autor *</Label>
                <Input
                  id="author"
                  name="author"
                  value={newNovel.author}
                  onChange={handleInputChange}
                  placeholder="Nome do autor"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={newNovel.description}
                onChange={handleInputChange}
                placeholder="Descrição da novela"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={newNovel.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="status-draft" 
                      name="status" 
                      checked={newNovel.status === 'draft'} 
                      onChange={() => handleStatusChange('draft')} 
                    />
                    <Label htmlFor="status-draft">Rascunho</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="status-published" 
                      name="status" 
                      checked={newNovel.status === 'published'} 
                      onChange={() => handleStatusChange('published')} 
                    />
                    <Label htmlFor="status-published">Publicar</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Categorias</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["Romance", "Fantasia", "Aventura", "Mistério", "Histórico", "Isekai"].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category}`}
                      checked={(newNovel.categories || []).includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label htmlFor={`category-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateNovel}>Criar Novela</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar novela */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Novela</DialogTitle>
            <DialogDescription>
              Modifique os detalhes da novela abaixo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Título *</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={newNovel.title}
                  onChange={handleInputChange}
                  placeholder="Título da novela"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-author">Autor *</Label>
                <Input
                  id="edit-author"
                  name="author"
                  value={newNovel.author}
                  onChange={handleInputChange}
                  placeholder="Nome do autor"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={newNovel.description}
                onChange={handleInputChange}
                placeholder="Descrição da novela"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Preço (R$)</Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={newNovel.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="edit-status-draft" 
                      name="edit-status" 
                      checked={newNovel.status === 'draft'} 
                      onChange={() => handleStatusChange('draft')} 
                    />
                    <Label htmlFor="edit-status-draft">Rascunho</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="edit-status-published" 
                      name="edit-status" 
                      checked={newNovel.status === 'published'} 
                      onChange={() => handleStatusChange('published')} 
                    />
                    <Label htmlFor="edit-status-published">Publicar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="edit-status-archived" 
                      name="edit-status" 
                      checked={newNovel.status === 'archived'} 
                      onChange={() => handleStatusChange('archived')} 
                    />
                    <Label htmlFor="edit-status-archived">Arquivar</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Categorias</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["Romance", "Fantasia", "Aventura", "Mistério", "Histórico", "Isekai"].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`edit-category-${category}`}
                      checked={(newNovel.categories || []).includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label htmlFor={`edit-category-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateNovel}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Excluir Novela</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta novela? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedNovel && (
              <div className="flex items-center gap-3">
                <img 
                  src={selectedNovel.cover} 
                  alt={selectedNovel.title} 
                  className="h-16 w-12 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{selectedNovel.title}</p>
                  <p className="text-sm text-muted-foreground">por {selectedNovel.author}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Content;
