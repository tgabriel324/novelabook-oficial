
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Share2, Send, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import TelegramShareButton from "@/components/sharing/TelegramShareButton";
import { useState } from "react";

const Community = () => {
  const [selectedNovel, setSelectedNovel] = useState("A Filha do Imperador");
  
  const handleJoinTelegram = () => {
    window.open("https://t.me/novelbook", "_blank");
    toast.success("Abrindo o Telegram");
  };

  const popularNovels = [
    "O Príncipe das Sombras", 
    "Renascendo em Outro Mundo", 
    "Segredos da Capital", 
    "A Duquesa Rebelde"
  ];

  return (
    <div className="container py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Users className="mr-2" size={20} /> 
            Comunidade NovelBook
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Junte-se à nossa comunidade de leitores e escritores no Telegram. Discuta suas novelas favoritas, receba recomendações e conheça outros entusiastas de novelas.
          </p>
          <div className="flex justify-center">
            <TelegramShareButton 
              text="Olá! Acabei de me juntar à comunidade NovelBook. Vamos discutir nossas novelas favoritas!"
              onClick={handleJoinTelegram}
              className="mb-4"
            >
              Entrar no Grupo do Telegram
            </TelegramShareButton>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Já temos mais de 1.200 membros ativos na comunidade!</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Share2 className="mr-2" size={20} /> 
            Compartilhar Novelas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Encontrou uma novela incrível? Compartilhe com seus amigos no Telegram diretamente do NovelBook.
          </p>
          <div className="flex items-center gap-2 mb-4">
            <Input 
              value={selectedNovel}
              onChange={(e) => setSelectedNovel(e.target.value)}
              placeholder="Escolha uma novela para compartilhar"
            />
            <TelegramShareButton
              text={`Confira esta incrível novela no NovelBook: ${selectedNovel}`}
              size="icon"
              variant="secondary"
            >
              <Send size={18} />
            </TelegramShareButton>
          </div>
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium mb-2">Novelas Populares para Compartilhar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {popularNovels.map(novel => (
                <Button 
                  key={novel} 
                  variant="outline" 
                  className="justify-between"
                  onClick={() => {
                    setSelectedNovel(novel);
                    toast.success(`"${novel}" selecionado para compartilhar`);
                  }}
                >
                  {novel}
                  <Share2 size={14} />
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <ExternalLink className="mr-2" size={20} /> 
            Eventos da Comunidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-3">
              <h3 className="font-medium mb-1">Clube do Livro - Toda Segunda</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Discussões semanais sobre novelas selecionadas pela comunidade.
              </p>
              <div className="flex gap-2">
                <Button variant="link" className="h-auto p-0 text-novel-gold-400" onClick={handleJoinTelegram}>
                  <ExternalLink size={14} className="mr-1" /> Ver no Telegram
                </Button>
                <TelegramShareButton
                  text="Junte-se ao Clube do Livro do NovelBook - toda segunda-feira!"
                  variant="link"
                  className="h-auto p-0 text-primary"
                  size="sm"
                >
                  Compartilhar
                </TelegramShareButton>
              </div>
            </div>
            <div className="border rounded-lg p-3">
              <h3 className="font-medium mb-1">Conversa com Autores - Mensal</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Sessões de perguntas e respostas com os autores das novelas.
              </p>
              <div className="flex gap-2">
                <Button variant="link" className="h-auto p-0 text-novel-gold-400" onClick={handleJoinTelegram}>
                  <ExternalLink size={14} className="mr-1" /> Ver no Telegram
                </Button>
                <TelegramShareButton
                  text="Participe das sessões de Q&A com autores do NovelBook - evento mensal imperdível!"
                  variant="link"
                  className="h-auto p-0 text-primary"
                  size="sm"
                >
                  Compartilhar
                </TelegramShareButton>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Community;
