
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Share2, Send, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Community = () => {
  const handleJoinTelegram = () => {
    window.open("https://t.me/novelbook", "_blank");
    toast.success("Abrindo o Telegram");
  };

  const handleShareNovel = () => {
    // Simulate Telegram share functionality
    const shareText = "Confira esta incrível novela no NovelBook: A Filha do Imperador";
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent("https://novelbook.app")}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, "_blank");
    toast.success("Compartilhando no Telegram");
  };

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
            <Button 
              onClick={handleJoinTelegram} 
              className="bg-[#0088cc] hover:bg-[#0088cc]/90 mb-4 gap-2"
            >
              <MessageCircle size={18} />
              Entrar no Grupo do Telegram
            </Button>
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
              defaultValue="A Filha do Imperador" 
              placeholder="Escolha uma novela para compartilhar"
              readOnly
            />
            <Button onClick={handleShareNovel} size="icon" variant="secondary">
              <Send size={18} />
            </Button>
          </div>
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium mb-2">Novelas Populares para Compartilhar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {["O Príncipe das Sombras", "Renascendo em Outro Mundo", "Segredos da Capital", "A Duquesa Rebelde"].map(novel => (
                <Button 
                  key={novel} 
                  variant="outline" 
                  className="justify-between"
                  onClick={() => {
                    const shareText = `Confira esta incrível novela no NovelBook: ${novel}`;
                    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent("https://novelbook.app")}&text=${encodeURIComponent(shareText)}`;
                    window.open(telegramUrl, "_blank");
                    toast.success(`Compartilhando "${novel}" no Telegram`);
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
            <MessageCircle className="mr-2" size={20} /> 
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
              <Button variant="link" className="h-auto p-0 text-novel-gold-400" onClick={handleJoinTelegram}>
                <ExternalLink size={14} className="mr-1" /> Ver no Telegram
              </Button>
            </div>
            <div className="border rounded-lg p-3">
              <h3 className="font-medium mb-1">Conversa com Autores - Mensal</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Sessões de perguntas e respostas com os autores das novelas.
              </p>
              <Button variant="link" className="h-auto p-0 text-novel-gold-400" onClick={handleJoinTelegram}>
                <ExternalLink size={14} className="mr-1" /> Ver no Telegram
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Community;
