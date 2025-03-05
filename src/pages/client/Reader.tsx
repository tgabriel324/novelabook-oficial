
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Settings, 
  Bookmark, 
  ChevronRight, 
  Sun, 
  Moon,
  Type,
  Minus,
  Plus,
  Download,
  MessageSquare,
  BookmarkCheck
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import TelegramShareButton from "@/components/sharing/TelegramShareButton";
import ReaderRecommendations from "@/components/recommendation/ReaderRecommendations";
import { Novel } from "@/lib/data/types";
import NovelSeoTags from "@/components/seo/NovelSeoTags";

const Reader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState("light");
  const [showSettings, setShowSettings] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [note, setNote] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false);
  const [notes, setNotes] = useState<{id: string, title: string, content: string}[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // Mock data
  
  // Obter id do livro da URL se disponível
  const params = new URLSearchParams(location.search);
  const bookId = params.get('book') || "1";
  
  // Mock de dados para testes
  const novelId = bookId;
  const chapterTitle = "Capítulo 1: O Início";
  const novelTitle = "A Filha do Imperador";
  
  // Mock da novela para SEO
  const mockNovel: Novel = { 
    id: novelId, 
    title: novelTitle, 
    cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+1", 
    price: 19.90,
    author: { id: "a1", name: "Ana Silva" },
    status: "published",
    description: "Uma história épica sobre a filha de um imperador que precisa lutar pelo seu direito ao trono.",
    categories: ["Fantasia", "Romance"],
    tags: ["Realeza", "Política", "Intriga"],
    reads: 12500,
    purchases: 2300,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Mock de novels para recomendações
  const mockNovels: Novel[] = [
    { 
      id: "1", 
      title: "A Filha do Imperador", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+1", 
      price: 19.90,
      author: { id: "a1", name: "Ana Silva" },
      status: "published",
      description: "Uma história épica sobre a filha de um imperador que precisa lutar pelo seu direito ao trono.",
      categories: ["Fantasia", "Romance"],
      tags: ["Realeza", "Política", "Intriga"],
      reads: 12500,
      purchases: 2300,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: "2", 
      title: "O Príncipe das Sombras", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+2", 
      price: 15.90,
      author: { id: "a2", name: "Carlos Mendes" },
      status: "published",
      description: "Um príncipe exilado retorna para reclamar seu trono, mas descobre que sua família guarda segredos sombrios.",
      categories: ["Fantasia", "Aventura"],
      tags: ["Magia", "Realeza", "Mistério"],
      reads: 9800,
      purchases: 1800,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: "3", 
      title: "Renascendo em Outro Mundo", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+3", 
      price: 22.90,
      author: { id: "a3", name: "Luciana Fraga" },
      status: "published",
      description: "Após um acidente fatal, um programador renasce em um mundo de fantasia com seus conhecimentos intactos.",
      categories: ["Isekai", "Aventura"],
      tags: ["Reencarnação", "Magia", "Aventura"],
      reads: 15700,
      purchases: 3200,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: "4", 
      title: "O Cavaleiro da Torre", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+4", 
      price: 12.90,
      author: { id: "a4", name: "Paulo Cavalcanti" },
      status: "published",
      description: "A história de um jovem escudeiro que sonha em se tornar cavaleiro da lendária Torre de Cristal.",
      categories: ["Fantasia Medieval", "Aventura"],
      tags: ["Cavaleiros", "Fantasia", "Aventura"],
      reads: 7800,
      purchases: 1200,
      rating: 4.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: "5", 
      title: "Alquimista Noturno", 
      cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+5", 
      price: 17.90,
      author: { id: "a5", name: "João Oliveira" },
      status: "published",
      description: "Um alquimista noturno que busca a chave para a liberdade e a paz.",
      categories: ["Fantasia", "Mistério"],
      tags: ["Magia", "Intriga", "Política"],
      reads: 10500,
      purchases: 1500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
  ];
  
  const chapterContent = `
    <h1>Capítulo 1: O Início</h1>
    <p>No coração do império, onde o sol raramente alcançava o solo devido aos imensos palácios que se erguiam como montanhas artificiais, a filha do imperador caminhava pelos jardins privados. Era o único lugar onde podia escapar das formalidades da corte, das expectativas esmagadoras e dos olhares vigilantes de centenas de funcionários.</p>
    <p>Liying suspirou, sentindo o peso da coroa que nem mesmo usava ainda. Aos dezessete anos, ela já conhecia cada regra, cada protocolo, cada estratégia política que um dia precisaria dominar. O que ninguém sabia – o que ninguém poderia jamais descobrir – era que a princesa imperial tinha um segredo.</p>
    <p>Um segredo que, se revelado, poderia abalar os alicerces do império.</p>
    <p>A magia que fluía em suas veias era proibida. Há séculos, seu próprio tataravô havia banido os mágicos do império, temendo uma rebelião. A ironia não escapava a Liying – a magia havia retornado à linhagem imperial como uma cobra que morde o próprio rabo.</p>
    <h2>A Descoberta</h2>
    <p>Foi aos doze anos que descobriu seu dom, quando, em um acesso de raiva, fez com que todas as lâmpadas do palácio explodissem simultaneamente. O incidente foi atribuído a uma falha no sistema elétrico, mas Liying sabia a verdade. Podia sentir a energia fluindo por seus dedos, respondendo às suas emoções.</p>
    <p>Nos anos seguintes, aprendeu a controlar esse poder em segredo. Estudou textos antigos e proibidos, escondidos nas profundezas da biblioteca imperial, acessíveis apenas à família real. Descobriu que sua magia era do tipo mais raro – a capacidade de manipular a própria energia vital.</p>
    <p>Agora, enquanto caminhava pelo jardim de pedras meticulosamente arranjado, permitiu-se um pequeno indulto. Olhando ao redor para ter certeza de que estava sozinha, estendeu a mão em direção a uma flor murcha. Concentrou-se, sentindo o calor familiar percorrer seu braço até a ponta dos dedos.</p>
    <p>A flor tremeu, e lentamente suas pétalas se ergueram, o caule se endireitou, e a cor voltou vibrante. Liying sorriu, mas seu momento de satisfação durou pouco. Um ruído atrás dela fez com que se virasse rapidamente.</p>
    <p>Seu irmão mais novo, o príncipe Jian, a observava com os olhos arregalados.</p>
    <p>"O que você acabou de fazer?" ele perguntou em um sussurro.</p>
  `;
  
  // Funções para o leitor
  const increaseFont = () => {
    if (fontSize < 24) setFontSize(fontSize + 1);
  };
  
  const decreaseFont = () => {
    if (fontSize > 12) setFontSize(fontSize - 1);
  };
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? "Marcador removido" : "Página marcada com sucesso!");
  };

  const saveNote = () => {
    if (noteTitle.trim() === "") {
      toast.error("Por favor, adicione um título para sua nota");
      return;
    }

    const newNote = {
      id: Date.now().toString(),
      title: noteTitle,
      content: note
    };

    setNotes([...notes, newNote]);
    setNote("");
    setNoteTitle("");
    setShowNotesDialog(false);
    toast.success("Nota salva com sucesso!");
  };

  const toggleOfflineMode = () => {
    if (isOfflineAvailable) {
      setIsOfflineAvailable(false);
      toast.success("Capítulo removido da leitura offline");
    } else {
      setIsOfflineAvailable(true);
      toast.success("Capítulo salvo para leitura offline");
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
      toast.success(`Navegando para a página ${currentPage + 1}`);
    } else {
      toast.info("Você alcançou o final deste capítulo");
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
      toast.success(`Navegando para a página ${currentPage - 1}`);
    } else {
      toast.info("Você já está na primeira página");
    }
  };

  // Efeito para monitorar teclas de navegação
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goToNextPage();
      } else if (e.key === "ArrowLeft") {
        goToPreviousPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPage]);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* SEO Tags */}
      <NovelSeoTags novel={mockNovel} />
      
      <header className="sticky top-0 z-10 bg-card p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/biblioteca">
            <Button variant="ghost" size="icon">
              <ChevronLeft size={24} />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold ml-2">{novelTitle}</h1>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleOfflineMode}
            className={isOfflineAvailable ? "text-novel-gold-400" : ""}
          >
            <Download size={20} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowNotesDialog(true)}
          >
            <MessageSquare size={20} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleBookmark}
          >
            {bookmarked ? 
              <BookmarkCheck className="text-novel-gold-400" size={20} /> : 
              <Bookmark size={20} />
            }
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings size={20} />
          </Button>
          <TelegramShareButton 
            text={`Estou lendo "${novelTitle} - ${chapterTitle}" no NovelBook!`}
            url="https://novelbook.app/leitor"
            size="icon" 
            variant="ghost"
          />
        </div>
      </header>
      
      {showSettings && (
        <Card className={`mx-4 my-2 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Type size={18} className="mr-2" />
                <span>Tamanho da fonte</span>
              </div>
              <div className="flex items-center">
                <Button variant="outline" size="icon" onClick={decreaseFont}>
                  <Minus size={14} />
                </Button>
                <span className="mx-2">{fontSize}px</span>
                <Button variant="outline" size="icon" onClick={increaseFont}>
                  <Plus size={14} />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {theme === "light" ? (
                  <Sun size={18} className="mr-2 text-novel-gold-400" />
                ) : (
                  <Moon size={18} className="mr-2 text-novel-gold-400" />
                )}
                <span>Tema</span>
              </div>
              <Button
                variant={theme === "light" ? "secondary" : "outline"}
                onClick={toggleTheme}
                className="w-24"
              >
                {theme === "light" ? "Claro" : "Escuro"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <main className="container mx-auto px-4 py-6 max-w-prose">
        <div 
          className="prose prose-gray mx-auto"
          style={{ 
            fontSize: `${fontSize}px`,
            lineHeight: 1.6,
            fontFamily: "'Georgia', serif"
          }}
          dangerouslySetInnerHTML={{ __html: chapterContent }}
        />
        
        {/* Recomendações personalizadas */}
        <div className="mt-10 border-t pt-6">
          <ReaderRecommendations 
            currentNovelId={novelId} 
            novels={mockNovels} 
          />
        </div>
      </main>
      
      <footer className="sticky bottom-0 bg-card p-4 shadow-sm flex items-center justify-between">
        <Button 
          variant="outline"
          onClick={goToPreviousPage}
          disabled={currentPage <= 1}
        >
          <ChevronLeft size={20} className="mr-2" />
          Anterior
        </Button>
        <div className="text-sm text-center">
          <span className="text-muted-foreground">Capítulo 1</span>
          <div className="text-novel-gold-400 text-xs mt-1">Página {currentPage} de {totalPages}</div>
        </div>
        <Button 
          variant="secondary"
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
        >
          Próximo
          <ChevronRight size={20} className="ml-2" />
        </Button>
      </footer>

      {/* Modal de notas */}
      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nota</DialogTitle>
            <DialogDescription>
              Adicione notas para ajudar em seus estudos ou para marcar momentos importantes da história.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da nota</Label>
              <Input 
                id="title" 
                placeholder="Um título descritivo" 
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Conteúdo da nota</Label>
              <Textarea 
                id="note" 
                placeholder="Escreva sua nota aqui..."
                rows={5}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotesDialog(false)}>Cancelar</Button>
            <Button onClick={saveNote}>Salvar Nota</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reader;
