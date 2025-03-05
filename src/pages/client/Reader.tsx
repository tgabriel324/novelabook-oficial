
import { useState } from "react";
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
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const Reader = () => {
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState("light");
  const [showSettings, setShowSettings] = useState(false);
  
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
  
  const increaseFont = () => {
    if (fontSize < 24) setFontSize(fontSize + 1);
  };
  
  const decreaseFont = () => {
    if (fontSize > 12) setFontSize(fontSize - 1);
  };
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <header className="sticky top-0 z-10 bg-card p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/biblioteca">
            <Button variant="ghost" size="icon">
              <ChevronLeft size={24} />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold ml-2">A Filha do Imperador</h1>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
            <Settings size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Bookmark className="text-novel-gold-400" size={20} />
          </Button>
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
      </main>
      
      <footer className="sticky bottom-0 bg-card p-4 shadow-sm flex items-center justify-between">
        <Button variant="outline">
          <ChevronLeft size={20} className="mr-2" />
          Anterior
        </Button>
        <div className="text-sm text-center">
          <span className="text-muted-foreground">Capítulo 1</span>
          <div className="text-novel-gold-400 text-xs mt-1">Página 1 de 5</div>
        </div>
        <Button variant="secondary">
          Próximo
          <ChevronRight size={20} className="ml-2" />
        </Button>
      </footer>
    </div>
  );
};

export default Reader;
