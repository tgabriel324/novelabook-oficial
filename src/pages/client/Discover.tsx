
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  TrendingUp, 
  Award, 
  Sparkles, 
  Filter, 
  SlidersHorizontal,
  X,
  Heart
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const Discover = () => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedLength, setSelectedLength] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedNovel, setSelectedNovel] = useState<any | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const categories = [
    "Romance", "Fantasia", "Ação", "Drama", "Mistério", 
    "Aventura", "Histórico", "Ficção", "Isekai", "Suspense"
  ];

  const featuredNovels = [
    { 
      id: 1, 
      title: "A Filha do Imperador", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+1", 
      tags: ["Romance", "Fantasia"],
      status: "Em andamento",
      length: "Longa",
      language: "Português",
      author: "Maria Silva",
      rating: 4.8,
      reviews: 156,
      description: "Uma história de intrigas palacianas onde a protagonista precisa navegar as complexas relações da corte imperial enquanto descobre segredos sobre sua origem.",
      price: "R$ 19,90"
    },
    { 
      id: 2, 
      title: "O Príncipe das Sombras", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+2", 
      tags: ["Aventura", "Mistério"],
      status: "Concluída",
      length: "Média",
      language: "Português",
      author: "João Costa",
      rating: 4.5,
      reviews: 98,
      description: "Um príncipe criado nas sombras precisa confrontar seu destino e assumir o trono usurpado por forças malignas que dominaram o reino.",
      price: "R$ 15,90"
    },
    { 
      id: 3, 
      title: "Renascendo em Outro Mundo", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+3", 
      tags: ["Isekai", "Fantasia"],
      status: "Em andamento",
      length: "Longa",
      language: "Português",
      author: "Ana Reis",
      rating: 4.7,
      reviews: 203,
      description: "Após um acidente fatal, o protagonista renasce em um mundo de fantasia com magia e criaturas místicas, precisando se adaptar às novas regras.",
      price: "R$ 21,90"
    },
    { 
      id: 4, 
      title: "A Duquesa Rebelde", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+4", 
      tags: ["Romance", "Histórico"],
      status: "Concluída",
      length: "Curta",
      language: "Inglês (Traduzido)",
      author: "Laura Bennett",
      rating: 4.3,
      reviews: 87,
      description: "Uma duquesa que se recusa a seguir as convenções da sociedade do século XIX e luta por seus próprios ideais, mesmo contra a vontade de sua família.",
      price: "R$ 12,90"
    },
  ];

  const trendingNovels = [
    { 
      id: 5, 
      title: "O Cavaleiro da Torre", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+5", 
      tags: ["Aventura", "Fantasia"],
      status: "Em andamento",
      length: "Média",
      language: "Português",
      author: "Ricardo Mendes",
      rating: 4.2,
      reviews: 64,
      description: "Um cavaleiro solitário protege uma torre mágica que guarda segredos do passado e mantém o equilíbrio entre os reinos.",
      price: "R$ 18,90"
    },
    { 
      id: 6, 
      title: "Alquimista Noturno", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+6", 
      tags: ["Fantasia", "Mistério"],
      status: "Concluída",
      length: "Curta",
      language: "Português",
      author: "Carla Lima",
      rating: 4.6,
      reviews: 78,
      description: "Um alquimista que trabalha apenas durante a noite, criando poções mágicas proibidas que podem mudar o destino das pessoas.",
      price: "R$ 14,90"
    },
    { 
      id: 7, 
      title: "Segredos da Capital", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+7", 
      tags: ["Política", "Suspense"],
      status: "Em andamento",
      length: "Longa",
      language: "Inglês (Traduzido)",
      author: "Miguel Santos",
      rating: 4.4,
      reviews: 112,
      description: "Uma trama de conspiração política na capital do império, onde nada é o que parece e todos têm segundas intenções.",
      price: "R$ 22,90"
    },
  ];

  const allNovels = [...featuredNovels, ...trendingNovels];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedStatus("all");
    setSelectedLength("all");
    setSelectedLanguage("all");
    setActiveFilters([]);
  };

  const applyFilters = () => {
    const newActiveFilters: string[] = [];
    
    if (selectedCategories.length > 0) {
      newActiveFilters.push(`Categorias (${selectedCategories.length})`);
    }
    
    if (selectedStatus !== "all") {
      newActiveFilters.push(`Status: ${selectedStatus}`);
    }
    
    if (selectedLength !== "all") {
      newActiveFilters.push(`Tamanho: ${selectedLength}`);
    }
    
    if (selectedLanguage !== "all") {
      newActiveFilters.push(`Idioma: ${selectedLanguage}`);
    }
    
    setActiveFilters(newActiveFilters);
    toast.success("Filtros aplicados com sucesso!");
  };

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(novelId => novelId !== id));
      toast.success("Removido dos favoritos");
    } else {
      setFavorites([...favorites, id]);
      toast.success("Adicionado aos favoritos");
    }
  };

  const openNovelDetails = (novel: any) => {
    setSelectedNovel(novel);
  };

  const closeNovelDetails = () => {
    setSelectedNovel(null);
  };

  const filterNovels = (novels: any[]) => {
    return novels.filter(novel => {
      const matchesSearch = novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           novel.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           novel.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategories = selectedCategories.length === 0 || 
                               novel.tags.some((tag: string) => selectedCategories.includes(tag));
      
      const matchesStatus = selectedStatus === "all" || novel.status === selectedStatus;
      const matchesLength = selectedLength === "all" || novel.length === selectedLength;
      const matchesLanguage = selectedLanguage === "all" || novel.language.includes(selectedLanguage);
      
      return matchesSearch && matchesCategories && matchesStatus && matchesLength && matchesLanguage;
    });
  };

  const filteredFeatured = filterNovels(featuredNovels);
  const filteredTrending = filterNovels(trendingNovels);
  const hasActiveFilters = activeFilters.length > 0 || searchQuery.length > 0;

  const FilterContent = () => (
    <>
      <div className="mb-4">
        <h3 className="font-medium mb-2">Categorias</h3>
        <div className="grid grid-cols-2 gap-2">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category}`} 
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label htmlFor={`category-${category}`} className="text-sm">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="mb-4">
        <h3 className="font-medium mb-2">Status</h3>
        <RadioGroup value={selectedStatus} onValueChange={setSelectedStatus}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="status-all" />
            <Label htmlFor="status-all">Todos</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Em andamento" id="status-ongoing" />
            <Label htmlFor="status-ongoing">Em andamento</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Concluída" id="status-completed" />
            <Label htmlFor="status-completed">Concluída</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Separator className="my-4" />
      
      <div className="mb-4">
        <h3 className="font-medium mb-2">Tamanho</h3>
        <RadioGroup value={selectedLength} onValueChange={setSelectedLength}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="length-all" />
            <Label htmlFor="length-all">Todos</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Curta" id="length-short" />
            <Label htmlFor="length-short">Curta</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Média" id="length-medium" />
            <Label htmlFor="length-medium">Média</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Longa" id="length-long" />
            <Label htmlFor="length-long">Longa</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Separator className="my-4" />
      
      <div className="mb-4">
        <h3 className="font-medium mb-2">Idioma</h3>
        <RadioGroup value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="lang-all" />
            <Label htmlFor="lang-all">Todos</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Português" id="lang-pt" />
            <Label htmlFor="lang-pt">Português</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Inglês" id="lang-en" />
            <Label htmlFor="lang-en">Inglês (Traduzido)</Label>
          </div>
        </RadioGroup>
      </div>
    </>
  );

  return (
    <div className="container py-6 pb-20 md:pb-6">
      <div className="mb-6 flex flex-wrap gap-2">
        <div className="relative flex-1">
          <Input 
            type="text" 
            placeholder="Buscar novelas, gêneros ou autores" 
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        </div>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">
                <Filter size={16} className="mr-2" />
                Filtros {activeFilters.length > 0 && `(${activeFilters.length})`}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-10rem)] px-1">
                <FilterContent />
              </ScrollArea>
              <div className="flex justify-between mt-4 pt-4 border-t">
                <Button variant="outline" onClick={clearFilters}>Limpar</Button>
                <SheetClose asChild>
                  <Button onClick={applyFilters}>Aplicar Filtros</Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary">
                <Filter size={16} className="mr-2" />
                Filtros {activeFilters.length > 0 && `(${activeFilters.length})`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-6" align="end">
              <ScrollArea className="h-[500px] pr-4">
                <FilterContent />
              </ScrollArea>
              <div className="flex justify-between mt-4 pt-4 border-t">
                <Button variant="outline" onClick={clearFilters}>Limpar</Button>
                <Button onClick={applyFilters}>Aplicar</Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1">
              {filter}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  // Remove this filter
                  setActiveFilters(activeFilters.filter((_, i) => i !== index));
                  // Reset corresponding filter state (simplified)
                  if (filter.includes("Categorias")) setSelectedCategories([]);
                  if (filter.includes("Status")) setSelectedStatus("all");
                  if (filter.includes("Tamanho")) setSelectedLength("all");
                  if (filter.includes("Idioma")) setSelectedLanguage("all");
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" className="text-xs" onClick={clearFilters}>
            Limpar todos
          </Button>
        </div>
      )}

      {hasActiveFilters && filteredFeatured.length === 0 && filteredTrending.length === 0 ? (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Nenhuma novela encontrada</h3>
          <p className="text-muted-foreground">Tente ajustar seus filtros ou buscar por outro termo.</p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>
            Limpar filtros
          </Button>
        </div>
      ) : (
        <>
          {(!hasActiveFilters || filteredFeatured.length > 0) && (
            <section className="mb-10">
              <div className="mb-4 flex items-center">
                <Sparkles className="mr-2 text-novel-gold-400" size={20} />
                <h2 className="text-xl font-semibold text-primary">Destaques</h2>
              </div>
              <Carousel className="w-full">
                <CarouselContent>
                  {(hasActiveFilters ? filteredFeatured : featuredNovels).map((novel) => (
                    <CarouselItem key={novel.id} className="md:basis-1/2 lg:basis-1/3">
                      <Card className="overflow-hidden cursor-pointer" onClick={() => openNovelDetails(novel)}>
                        <CardContent className="p-0">
                          <div className="relative aspect-[2/3] overflow-hidden">
                            <img
                              src={novel.cover}
                              alt={novel.title}
                              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full z-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(novel.id);
                              }}
                            >
                              <Heart className={`h-5 w-5 ${favorites.includes(novel.id) ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                              <h3 className="font-semibold">{novel.title}</h3>
                              <p className="text-xs text-white/80 mt-1">Por {novel.author}</p>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {novel.tags.map((tag) => (
                                  <span key={tag} className="inline-block text-xs bg-novel-gold-400/80 rounded-full px-2 py-0.5">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </section>
          )}

          {(!hasActiveFilters || filteredTrending.length > 0) && (
            <section className="mb-10">
              <div className="mb-4 flex items-center">
                <TrendingUp className="mr-2 text-novel-gold-400" size={20} />
                <h2 className="text-xl font-semibold text-primary">Em Alta</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {(hasActiveFilters ? filteredTrending : trendingNovels).map((novel) => (
                  <Card key={novel.id} className="overflow-hidden transition-transform hover:scale-105 duration-300 cursor-pointer" onClick={() => openNovelDetails(novel)}>
                    <CardContent className="p-0">
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <img
                          src={novel.cover}
                          alt={novel.title}
                          className="h-full w-full object-cover"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(novel.id);
                          }}
                        >
                          <Heart className={`h-5 w-5 ${favorites.includes(novel.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                          <h3 className="font-semibold">{novel.title}</h3>
                          <p className="text-xs text-white/80 mt-1">Por {novel.author}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {novel.tags.map((tag) => (
                              <span key={tag} className="inline-block text-xs bg-novel-gold-400/80 rounded-full px-2 py-0.5">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {!hasActiveFilters && (
            <section>
              <div className="mb-4 flex items-center">
                <Award className="mr-2 text-novel-gold-400" size={20} />
                <h2 className="text-xl font-semibold text-primary">Categorias</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {categories.slice(0, 8).map((category, index) => (
                  <Card key={category} className={`overflow-hidden ${index < 4 ? 'novel-gradient' : 'novel-gold-gradient'} cursor-pointer`} onClick={() => {
                    setSelectedCategories([category]);
                    setActiveFilters([`Categorias: ${category}`]);
                  }}>
                    <CardContent className="flex items-center justify-center p-6 text-white">
                      <h3 className="text-center font-medium">{category}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <Dialog open={!!selectedNovel} onOpenChange={(open) => {
        if (!open) closeNovelDetails();
      }}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          {selectedNovel && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedNovel.title}</DialogTitle>
                <DialogDescription className="flex gap-2 mt-1">
                  {selectedNovel.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="bg-novel-gold-400/20 border-novel-gold-400/40">
                      {tag}
                    </Badge>
                  ))}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative sm:w-1/3">
                  <img 
                    src={selectedNovel.cover} 
                    alt={selectedNovel.title}
                    className="w-full rounded-lg object-cover"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-black rounded-full"
                    onClick={() => toggleFavorite(selectedNovel.id)}
                  >
                    <Heart className={`h-5 w-5 ${favorites.includes(selectedNovel.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
                
                <div className="sm:w-2/3">
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Sinopse</h4>
                    <p className="text-sm">{selectedNovel.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Autor:</span> {selectedNovel.author}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span> {selectedNovel.status}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tamanho:</span> {selectedNovel.length}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Idioma:</span> {selectedNovel.language}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avaliação:</span> ⭐ {selectedNovel.rating}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reviews:</span> {selectedNovel.reviews}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-bold text-primary text-lg">{selectedNovel.price}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end mt-4">
                <Button variant="outline">Ver todos os detalhes</Button>
                <Button>Comprar agora</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Discover;
