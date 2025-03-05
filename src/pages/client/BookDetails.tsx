
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Star, 
  Heart, 
  BookOpen, 
  Share, 
  Download,
  MessageSquare,
  User,
  Calendar,
  Tag,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Novel } from "@/lib/data/types";
import NovelSeoTags from "@/components/seo/NovelSeoTags";
import TelegramShareButton from "@/components/sharing/TelegramShareButton";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  
  // Mock de dados para demonstração
  useEffect(() => {
    // Simulação de fetch de dados
    setTimeout(() => {
      const mockNovel: Novel = { 
        id: id || "1", 
        title: "A Filha do Imperador", 
        cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+1", 
        price: 19.90,
        author: { id: "a1", name: "Ana Silva" },
        status: "published",
        description: "Uma história épica sobre a filha de um imperador que precisa lutar pelo seu direito ao trono. No coração do império, onde o sol raramente alcançava o solo devido aos imensos palácios que se erguiam como montanhas artificiais, a filha do imperador caminhava pelos jardins privados. Era o único lugar onde podia escapar das formalidades da corte, das expectativas esmagadoras e dos olhares vigilantes de centenas de funcionários.",
        categories: ["Fantasia", "Romance"],
        tags: ["Realeza", "Política", "Intriga"],
        reads: 12500,
        purchases: 2300,
        rating: 4.7,
        reviewCount: 253,
        releaseDate: "2022-05-15",
        totalChapters: 42,
        completedChapters: 38,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setNovel(mockNovel);
      setLoading(false);
    }, 800);
  }, [id]);
  
  const toggleFavorite = () => {
    setFavorite(!favorite);
    toast.success(favorite ? "Removido dos favoritos" : "Adicionado aos favoritos");
  };
  
  const startReading = () => {
    navigate(`/leitor?book=${id}`);
  };
  
  const downloadBook = () => {
    toast.success("Livro baixado para leitura offline");
  };
  
  if (loading) {
    return (
      <div className="container py-12 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-pulse h-6 w-32 bg-muted rounded mb-2 mx-auto"></div>
          <div className="animate-pulse h-40 w-32 bg-muted rounded mb-4 mx-auto"></div>
          <div className="animate-pulse h-4 w-48 bg-muted rounded mb-2 mx-auto"></div>
          <div className="animate-pulse h-4 w-32 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (!novel) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Livro não encontrado</h2>
          <p className="text-muted-foreground mb-4">O livro que você está procurando não foi encontrado.</p>
          <Button onClick={() => navigate("/biblioteca")}>
            Voltar para a Biblioteca
          </Button>
        </div>
      </div>
    );
  }
  
  // Criar estrelas para o rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="fill-novel-gold-400 text-novel-gold-400" size={18} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Star key={i} className="fill-novel-gold-400/50 text-novel-gold-400" size={18} />);
      } else {
        stars.push(<Star key={i} className="text-gray-300" size={18} />);
      }
    }
    
    return stars;
  };
  
  return (
    <>
      {/* SEO Tags */}
      <NovelSeoTags novel={novel} />
      
      <div className="container py-6 pb-20 md:pb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/biblioteca")}
          className="mb-4"
        >
          <ChevronLeft size={20} className="mr-2" />
          Voltar para a Biblioteca
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Capa e ações do livro */}
          <div>
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg mb-4">
              <img 
                src={novel.cover} 
                alt={novel.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex flex-col gap-3">
              <Button 
                className="w-full"
                onClick={startReading}
              >
                <BookOpen size={18} className="mr-2" />
                Começar Leitura
              </Button>
              
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  onClick={toggleFavorite}
                  className={favorite ? "text-red-500" : ""}
                >
                  <Heart className={favorite ? "fill-red-500" : ""} size={18} />
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={downloadBook}
                >
                  <Download size={18} />
                </Button>
                
                <TelegramShareButton 
                  text={`Confira "${novel.title}" no NovelBook!`}
                  url={`https://novelbook.app/livro/${novel.id}`}
                  variant="outline"
                />
              </div>
            </div>
          </div>
          
          {/* Detalhes do livro */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{novel.title}</h1>
            
            <div className="flex items-center mb-4 flex-wrap gap-2">
              <div className="flex items-center mr-4">
                {renderStars(novel.rating || 0)}
                <span className="ml-2 text-sm text-muted-foreground">
                  {novel.rating} ({novel.reviewCount} avaliações)
                </span>
              </div>
              
              <div className="flex gap-1 flex-wrap">
                {novel.categories.map(category => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Tabs defaultValue="sinopse" className="mt-6">
              <TabsList>
                <TabsTrigger value="sinopse">Sinopse</TabsTrigger>
                <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                <TabsTrigger value="capitulos">Capítulos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sinopse" className="mt-4">
                <div className="text-muted-foreground">
                  <p className="mb-4">{novel.description}</p>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex gap-2 flex-wrap">
                    {novel.tags.map(tag => (
                      <Badge key={tag} variant="outline">
                        <Tag size={14} className="mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="detalhes" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <User size={18} className="mr-2 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Autor</div>
                          <div>{novel.author.name}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar size={18} className="mr-2 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Data de Lançamento</div>
                          <div>{new Date(novel.releaseDate || novel.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock size={18} className="mr-2 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Status</div>
                          <div>{novel.completedChapters === novel.totalChapters ? "Completa" : "Em andamento"}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <BookOpen size={18} className="mr-2 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Capítulos</div>
                          <div>{novel.completedChapters} / {novel.totalChapters}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Estatísticas</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-novel-lilac-500">{novel.reads.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Leituras</div>
                        </div>
                        
                        <div>
                          <div className="text-2xl font-bold text-novel-lilac-500">{novel.purchases.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Compras</div>
                        </div>
                        
                        <div>
                          <div className="text-2xl font-bold text-novel-lilac-500">{novel.rating}</div>
                          <div className="text-sm text-muted-foreground">Avaliação</div>
                        </div>
                        
                        <div>
                          <div className="text-2xl font-bold text-novel-lilac-500">{novel.reviewCount}</div>
                          <div className="text-sm text-muted-foreground">Avaliações</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="capitulos" className="mt-4">
                <div className="space-y-3">
                  {Array.from({ length: novel.totalChapters || 0 }).map((_, index) => (
                    <Card key={index} className={index >= (novel.completedChapters || 0) ? "opacity-50" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Capítulo {index + 1}</h4>
                            <p className="text-sm text-muted-foreground">
                              {index >= (novel.completedChapters || 0) ? "Em breve" : "Disponível"}
                            </p>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={index >= (novel.completedChapters || 0)}
                            onClick={() => navigate(`/leitor?book=${novel.id}&chapter=${index + 1}`)}
                          >
                            {index >= (novel.completedChapters || 0) ? "Indisponível" : "Ler"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDetails;
