import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Grid, List, Heart, BookOpen, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator, 
  DropdownMenuLabel 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Library = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    category: "all",
    length: "all",
    status: "all"
  });
  const [favorites, setFavorites] = useState<number[]>([1]);

  const myNovels = [
    { 
      id: 1, 
      title: "A Filha do Imperador", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+1", 
      progress: 45,
      description: "Uma história de intrigas palacianas onde a protagonista precisa navegar as complexas relações da corte imperial.",
      categories: ["Romance", "Fantasia"],
      length: "Longa",
      status: "Em andamento",
      rating: 4.5,
      reviews: 128
    },
    { 
      id: 2, 
      title: "O Príncipe das Sombras", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+2", 
      progress: 78,
      description: "Um príncipe criado nas sombras precisa confrontar seu destino e assumir o trono usurpado.",
      categories: ["Aventura", "Mistério"],
      length: "Média",
      status: "Concluída",
      rating: 4.2,
      reviews: 95
    },
    { 
      id: 3, 
      title: "Renascendo em Outro Mundo", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+3", 
      progress: 15,
      description: "Após um acidente, o protagonista renasce em um mundo de fantasia com magia e criaturas místicas.",
      categories: ["Isekai", "Fantasia"],
      length: "Longa",
      status: "Em andamento",
      rating: 4.7,
      reviews: 200
    },
    { 
      id: 4, 
      title: "A Duquesa Rebelde", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+4", 
      progress: 60,
      description: "Uma duquesa que se recusa a seguir as convenções da sociedade e luta por seus próprios ideais.",
      categories: ["Romance", "Histórico"],
      length: "Curta",
      status: "Concluída",
      rating: 4.0,
      reviews: 75
    },
  ];

  const recentlyAcquired = [
    { 
      id: 5, 
      title: "O Cavaleiro da Torre", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+5", 
      progress: 0,
      description: "Um cavaleiro solitário protege uma torre mágica que guarda segredos do passado.",
      categories: ["Aventura", "Fantasia"],
      length: "Média",
      status: "Em andamento",
      rating: 4.3,
      reviews: 42
    },
    { 
      id: 6, 
      title: "Alquimista Noturno", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+6", 
      progress: 0,
      description: "Um alquimista que trabalha apenas durante a noite, criando poções mágicas proibidas.",
      categories: ["Fantasia", "Mistério"],
      length: "Curta",
      status: "Concluída",
      rating: 4.8,
      reviews: 64
    },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(bookId => bookId !== id));
      toast.success("Removido dos favoritos");
    } else {
      setFavorites([...favorites, id]);
      toast.success("Adicionado aos favoritos");
    }
  };

  const openBookDetails = (book: any) => {
    setSelectedBook(book);
  };

  const closeBookDetails = () => {
    setSelectedBook(null);
  };

  const handleContinueReading = (bookId: number) => {
    navigate(`/leitor?book=${bookId}`);
    toast.success("Continuando a leitura...");
  };

  const handleViewDetails = (bookId: number) => {
    navigate(`/livro/${bookId}`);
  };

  const filterBooks = (books: any[]) => {
    return books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filters.category === "all" || book.categories.includes(filters.category);
      const matchesLength = filters.length === "all" || book.length === filters.length;
      const matchesStatus = filters.status === "all" || book.status === filters.status;
      const matchesFavorite = activeTab === "favorites" ? favorites.includes(book.id) : true;
      
      return matchesSearch && matchesCategory && matchesLength && matchesStatus && matchesFavorite;
    });
  };

  const filteredNovels = filterBooks(myNovels);
  const filteredRecent = filterBooks(recentlyAcquired);
  const favoriteNovels = [...myNovels, ...recentlyAcquired].filter(book => favorites.includes(book.id));

  const renderBookCard = (book: any) => {
    const isFavorite = favorites.includes(book.id);

    return (
      <Card 
        key={book.id} 
        className="overflow-hidden transition-transform hover:scale-105 duration-300 h-full"
        onClick={() => openBookDetails(book)}
      >
        <CardContent className="p-0 relative">
          <div className={`relative ${viewType === 'grid' ? 'aspect-[2/3]' : 'aspect-auto'}`}>
            <img
              src={book.cover}
              alt={book.title}
              className="h-full w-full object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full z-10"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(book.id);
              }}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
              <h3 className="font-semibold">{book.title}</h3>
              {viewType === 'list' && (
                <p className="text-xs text-white/80 mt-1 line-clamp-2">{book.description}</p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/30">
                <div
                  className="h-full rounded-full bg-novel-gold-400"
                  style={{ width: `${book.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-white/80">{book.progress}% lido</p>
                {viewType === 'list' && (
                  <div className="flex gap-1">
                    {book.categories.map((cat: string) => (
                      <Badge key={cat} variant="outline" className="text-xs bg-novel-gold-400/30 border-novel-gold-400/50">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container py-6 pb-20 md:pb-6">
      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos os Livros</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos</TabsTrigger>
        </TabsList>
        
        <div className="mb-6 flex flex-wrap items-center gap-2 md:gap-4">
          <div className="relative flex-1">
            <Input 
              type="text" 
              placeholder="Pesquisar minha biblioteca" 
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="shrink-0">
                <Filter size={16} className="mr-2" />
                Filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Categoria</DropdownMenuLabel>
                {["all", "Romance", "Fantasia", "Aventura", "Mistério", "Histórico", "Isekai"].map(category => (
                  <DropdownMenuItem 
                    key={category}
                    className={filters.category === category ? "bg-accent" : ""}
                    onClick={() => setFilters({...filters, category})}
                  >
                    {category === "all" ? "Todas as categorias" : category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Tamanho</DropdownMenuLabel>
                {["all", "Curta", "Média", "Longa"].map(length => (
                  <DropdownMenuItem 
                    key={length}
                    className={filters.length === length ? "bg-accent" : ""}
                    onClick={() => setFilters({...filters, length})}
                  >
                    {length === "all" ? "Todos os tamanhos" : length}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Status</DropdownMenuLabel>
                {["all", "Em andamento", "Concluída"].map(status => (
                  <DropdownMenuItem 
                    key={status}
                    className={filters.status === status ? "bg-accent" : ""}
                    onClick={() => setFilters({...filters, status})}
                  >
                    {status === "all" ? "Todos os status" : status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex border rounded-md">
            <Button 
              variant={viewType === 'grid' ? 'default' : 'ghost'} 
              size="icon" 
              className="rounded-none rounded-l-md"
              onClick={() => setViewType('grid')}
            >
              <Grid size={16} />
            </Button>
            <Button 
              variant={viewType === 'list' ? 'default' : 'ghost'} 
              size="icon" 
              className="rounded-none rounded-r-md"
              onClick={() => setViewType('list')}
            >
              <List size={16} />
            </Button>
          </div>
        </div>

        {Object.values(filters).some(f => f !== 'all') && (
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            {filters.category !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1">
                {filters.category}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilters({...filters, category: 'all'})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.length !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1">
                {filters.length}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilters({...filters, length: 'all'})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.status !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1">
                {filters.status}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilters({...filters, status: 'all'})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setFilters({category: 'all', length: 'all', status: 'all'})}>
              Limpar filtros
            </Button>
          </div>
        )}

        <TabsContent value="all">
          {filteredNovels.length === 0 && filteredRecent.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Nenhuma novela encontrada</h3>
              <p className="text-muted-foreground">Tente ajustar seus filtros ou buscar por outro termo.</p>
            </div>
          ) : (
            <>
              {filteredNovels.length > 0 && (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-primary">Minhas Leituras</h2>
                    <Button variant="link" className="text-novel-gold-400 font-medium p-0">
                      Ver Todas
                    </Button>
                  </div>

                  <div className={`grid gap-4 ${
                    viewType === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                      : 'grid-cols-1'
                  }`}>
                    {filteredNovels.map(novel => renderBookCard(novel))}
                  </div>
                </>
              )}
              
              {filteredRecent.length > 0 && (
                <>
                  <div className="mt-10 mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-primary">Recém Adquiridos</h2>
                    <Button variant="link" className="text-novel-gold-400 font-medium p-0">
                      Ver Todos
                    </Button>
                  </div>
                  
                  <div className={`grid gap-4 ${
                    viewType === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                      : 'grid-cols-1'
                  }`}>
                    {filteredRecent.map(novel => renderBookCard(novel))}
                  </div>
                </>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="favorites">
          {favoriteNovels.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Nenhum favorito encontrado</h3>
              <p className="text-muted-foreground">Adicione livros aos favoritos clicando no ícone de coração.</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-primary">Meus Favoritos</h2>
              </div>
              
              <div className={`grid gap-4 ${
                viewType === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {favoriteNovels.map(novel => renderBookCard(novel))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedBook} onOpenChange={(open) => {
        if (!open) closeBookDetails();
      }}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          {selectedBook && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedBook.title}</DialogTitle>
                <DialogDescription className="flex flex-wrap gap-2 mt-1">
                  {selectedBook.categories.map((category: string) => (
                    <Badge key={category} variant="outline" className="bg-novel-gold-400/20 border-novel-gold-400/40">
                      {category}
                    </Badge>
                  ))}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative sm:w-1/3">
                  <img 
                    src={selectedBook.cover} 
                    alt={selectedBook.title}
                    className="w-full rounded-lg object-cover"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-black rounded-full"
                    onClick={() => toggleFavorite(selectedBook.id)}
                  >
                    <Heart className={`h-5 w-5 ${favorites.includes(selectedBook.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
                
                <div className="sm:w-2/3">
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Sinopse</h4>
                    <p className="text-sm">{selectedBook.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Tamanho:</span> {selectedBook.length}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span> {selectedBook.status}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avaliação:</span> ⭐ {selectedBook.rating}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reviews:</span> {selectedBook.reviews}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Progresso de leitura</h4>
                    <div className="h-2 rounded-full bg-gray-200">
                      <div 
                        className="h-full rounded-full bg-novel-gold-400" 
                        style={{ width: `${selectedBook.progress}%` }} 
                      />
                    </div>
                    <p className="text-xs text-right mt-1">{selectedBook.progress}% concluído</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleViewDetails(selectedBook.id)}
                >
                  Ver todos os detalhes
                </Button>
                <Button 
                  onClick={() => handleContinueReading(selectedBook.id)}
                >
                  Continuar leitura
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Library;
