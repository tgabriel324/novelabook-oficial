
import { useState } from "react";
import { useNovels, useCategories } from "@/hooks/useAdminData";
import { Novel } from "@/lib/data/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  BookOpen,
  MoreVertical,
  Plus,
  Pencil,
  Trash2,
  FileText,
  Search,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
} from "lucide-react";

export default function Content() {
  const { novels, addNovel, updateNovel, deleteNovel } = useNovels();
  const { categories } = useCategories();
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "date" | "reads" | "purchases">(
    "date"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Form state for new/edit novel
  const [formData, setFormData] = useState({
    title: "",
    author: { id: "", name: "" },
    cover: "",
    status: "draft",
    price: "",
    description: "",
    categories: [] as string[],
    tags: [] as string[],
  });

  // Reset form data
  const resetFormData = () => {
    setFormData({
      title: "",
      author: { id: "1", name: "Admin" }, // Default author
      cover: "https://placehold.co/300x450/purple/white?text=Cover",
      status: "draft",
      price: "",
      description: "",
      categories: [],
      tags: [],
    });
  };

  // Load novel data for editing
  const loadNovelForEdit = (novel: Novel) => {
    setFormData({
      title: novel.title,
      author: novel.author,
      cover: novel.cover,
      status: novel.status,
      price: novel.price ? String(novel.price) : "",
      description: novel.description,
      categories: novel.categories,
      tags: novel.tags,
    });
    setSelectedNovel(novel);
    setIsEditing(true);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(categoryId);
      if (exists) {
        return {
          ...prev,
          categories: prev.categories.filter((id) => id !== categoryId),
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, categoryId],
        };
      }
    });
  };

  // Handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      e.currentTarget.value = "";
    }
  };

  // Remove tag
  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // Submit form for create/edit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const novelData = {
        ...formData,
        price: formData.price ? Number(formData.price) : null,
      };
      
      if (isEditing && selectedNovel) {
        updateNovel(selectedNovel.id, novelData);
        toast.success("Novela atualizada com sucesso!");
      } else {
        addNovel({
          ...novelData,
          reads: 0,
          purchases: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        toast.success("Novela criada com sucesso!");
      }
      
      resetFormData();
      setIsEditing(false);
      setIsCreating(false);
    } catch (error) {
      toast.error("Erro ao salvar a novela");
      console.error(error);
    }
  };

  // Delete novel
  const confirmDelete = (novelId: string) => {
    deleteNovel(novelId);
    toast.success("Novela excluída com sucesso!");
  };

  // Filter and sort novels
  const filteredNovels = novels
    .filter((novel) => {
      const matchesStatus = filterStatus === "all" || novel.status === filterStatus;
      const matchesSearch = novel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          novel.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          novel.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "date":
          comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          break;
        case "reads":
          comparison = b.reads - a.reads;
          break;
        case "purchases":
          comparison = b.purchases - a.purchases;
          break;
      }
      
      return sortOrder === "asc" ? comparison * -1 : comparison;
    });

  // Toggle sort order
  const toggleSort = (field: "title" | "date" | "reads" | "purchases") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Status badge renderer
  const renderStatusBadge = (status: Novel["status"]) => {
    switch (status) {
      case "published":
        return <Badge variant="secondary" className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="mr-1 h-3 w-3" /> Publicado</Badge>;
      case "draft":
        return <Badge variant="outline"><Clock className="mr-1 h-3 w-3" /> Rascunho</Badge>;
      case "featured":
        return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600"><Star className="mr-1 h-3 w-3" /> Destaque</Badge>;
      case "archived":
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Arquivado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Conteúdo</h2>
          <p className="text-muted-foreground">
            Gerencie as novelas e capítulos da plataforma
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetFormData();
              setIsCreating(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Nova Novela
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Novela</DialogTitle>
              <DialogDescription>
                Preencha os detalhes da nova novela. Clique em salvar quando terminar.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cover">URL da Capa</Label>
                    <Input
                      id="cover"
                      name="cover"
                      value={formData.cover}
                      onChange={handleInputChange}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Deixe em branco para gratuito"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Categorias</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category.id}
                        variant={formData.categories.includes(category.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleCategoryChange(category.id)}
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Digite uma tag e pressione Enter"
                    onKeyDown={handleTagInput}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} <XCircle className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetFormData();
                    setIsCreating(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <Tabs defaultValue="novels">
            <TabsList>
              <TabsTrigger value="novels">Novelas</TabsTrigger>
              <TabsTrigger value="chapters">Capítulos</TabsTrigger>
              <TabsTrigger value="categories">Categorias</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <TabsContent value="novels" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Pesquisar novelas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                  prefix={<Search className="h-4 w-4 text-muted-foreground" />}
                />
              </div>
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="published">Publicados</SelectItem>
                  <SelectItem value="draft">Rascunhos</SelectItem>
                  <SelectItem value="featured">Destaques</SelectItem>
                  <SelectItem value="archived">Arquivados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Novela</TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => toggleSort("title")}
                        className="flex items-center"
                      >
                        Título
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => toggleSort("date")}
                        className="flex items-center"
                      >
                        Atualizado
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => toggleSort("reads")}
                        className="flex items-center"
                      >
                        Leituras
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => toggleSort("purchases")}
                        className="flex items-center"
                      >
                        Vendas
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNovels.length > 0 ? (
                    filteredNovels.map((novel) => (
                      <TableRow key={novel.id}>
                        <TableCell>
                          <div className="w-[40px] h-[60px] rounded overflow-hidden">
                            <img
                              src={novel.cover || "https://placehold.co/300x450/purple/white?text=Cover"}
                              alt={novel.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{novel.title}</span>
                            <span className="text-xs text-muted-foreground">por {novel.author.name}</span>
                            {novel.price ? (
                              <span className="text-xs text-green-600 font-medium">R$ {novel.price.toFixed(2)}</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Gratuito</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{renderStatusBadge(novel.status)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(novel.updatedAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="font-medium">
                          {novel.reads.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {novel.purchases.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Dialog open={isEditing && selectedNovel?.id === novel.id} onOpenChange={(open) => {
                            if (!open) setIsEditing(false);
                          }}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => loadNovelForEdit(novel)}>
                                  <Pencil className="h-4 w-4 mr-2" /> Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => confirmDelete(novel.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" /> Excluir
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="h-4 w-4 mr-2" /> Gerenciar Capítulos
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Editar Novela</DialogTitle>
                                <DialogDescription>
                                  Atualize os detalhes da novela. Clique em salvar quando terminar.
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleSubmit}>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-title">Título</Label>
                                      <Input
                                        id="edit-title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-status">Status</Label>
                                      <Select
                                        value={formData.status}
                                        onValueChange={(value) => handleSelectChange("status", value)}
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
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-cover">URL da Capa</Label>
                                      <Input
                                        id="edit-cover"
                                        name="cover"
                                        value={formData.cover}
                                        onChange={handleInputChange}
                                        placeholder="https://exemplo.com/imagem.jpg"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-price">Preço (R$)</Label>
                                      <Input
                                        id="edit-price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="Deixe em branco para gratuito"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-description">Descrição</Label>
                                    <Textarea
                                      id="edit-description"
                                      name="description"
                                      value={formData.description}
                                      onChange={handleInputChange}
                                      rows={4}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Categorias</Label>
                                    <div className="flex flex-wrap gap-2">
                                      {categories.map((category) => (
                                        <Badge
                                          key={category.id}
                                          variant={formData.categories.includes(category.id) ? "default" : "outline"}
                                          className="cursor-pointer"
                                          onClick={() => handleCategoryChange(category.id)}
                                        >
                                          {category.name}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-tags">Tags</Label>
                                    <Input
                                      id="edit-tags"
                                      placeholder="Digite uma tag e pressione Enter"
                                      onKeyDown={handleTagInput}
                                    />
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {formData.tags.map((tag) => (
                                        <Badge
                                          key={tag}
                                          variant="secondary"
                                          className="cursor-pointer"
                                          onClick={() => removeTag(tag)}
                                        >
                                          {tag} <XCircle className="ml-1 h-3 w-3" />
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button type="submit">Salvar</Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Nenhuma novela encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="chapters" className="space-y-4">
            <div className="p-8 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Gerenciamento de Capítulos</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Selecione uma novela para gerenciar seus capítulos.
              </p>
              <Button className="mt-4">
                Selecionar Novela
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-4">
            <div className="p-8 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Gerenciamento de Categorias</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Adicione ou edite categorias para organizar as novelas.
              </p>
              <Button className="mt-4">
                Gerenciar Categorias
              </Button>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
}
