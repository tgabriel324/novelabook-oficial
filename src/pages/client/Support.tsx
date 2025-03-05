
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mail, Phone, FileQuestion, AlertCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import TelegramShareButton from "@/components/sharing/TelegramShareButton";

const Support = () => {
  const handleContactTelegram = () => {
    window.open("https://t.me/novelbooksuporte", "_blank");
    toast.success("Abrindo canal de suporte no Telegram");
  };

  const faqs = [
    { 
      question: "Como faço para comprar uma novela?", 
      answer: "Na tela da loja, navegue pelas novelas disponíveis e clique no botão 'Comprar' da novela desejada. Siga as instruções para concluir a compra." 
    },
    { 
      question: "Onde encontro minhas novelas compradas?", 
      answer: "Todas as suas novelas compradas aparecem automaticamente na sua Biblioteca. Você pode acessar sua biblioteca através do menu inferior." 
    },
    { 
      question: "Como continuar uma leitura?", 
      answer: "Na sua Biblioteca, toque na novela que deseja continuar lendo. O aplicativo abrirá a novela exatamente na página onde você parou." 
    },
    { 
      question: "Posso ler offline?", 
      answer: "Sim! Após comprar uma novela, ela ficará disponível para leitura offline. Certifique-se de abrir a novela pelo menos uma vez enquanto estiver online para que o conteúdo seja baixado." 
    },
    { 
      question: "Como compartilhar uma novela com amigos?", 
      answer: "Você pode compartilhar novelas diretamente pelo Telegram. Acesse a página da Comunidade e use a função 'Compartilhar Novelas'." 
    }
  ];

  return (
    <div className="container py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <HelpCircle className="mr-2" size={20} /> 
            Central de Suporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Estamos aqui para ajudar! Entre em contato conosco por qualquer um dos canais abaixo ou consulte nossas perguntas frequentes.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <TelegramShareButton 
              text="Preciso de ajuda com o NovelBook. Alguém pode me ajudar?"
              url="https://novelbook.app/suporte"
              onClick={handleContactTelegram}
            >
              Suporte via Telegram
            </TelegramShareButton>
            <Button variant="outline" className="gap-2">
              <Mail size={18} />
              suporte@novelbook.com
            </Button>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Horário de atendimento: Segunda a Sexta, 9h às 18h</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <FileQuestion className="mr-2" size={20} /> 
            Perguntas Frequentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-6 flex justify-end">
            <TelegramShareButton
              text="Confira as perguntas frequentes do NovelBook"
              url="https://novelbook.app/suporte"
              variant="outline"
              size="sm"
            >
              Compartilhar FAQs
            </TelegramShareButton>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <AlertCircle className="mr-2" size={20} /> 
            Reportar um Problema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Encontrou um bug ou está enfrentando algum problema técnico? Nosso time de suporte técnico está pronto para ajudar.
          </p>
          <TelegramShareButton
            text="Encontrei um problema no NovelBook que precisa ser resolvido."
            url="https://novelbook.app/suporte"
            onClick={handleContactTelegram}
            className="w-full"
            variant="secondary"
          >
            Reportar no Telegram
          </TelegramShareButton>
          <div className="mt-4 p-3 border rounded-lg bg-muted/50">
            <h3 className="font-medium mb-1 flex items-center">
              <Phone size={16} className="mr-2" />
              Suporte Técnico
            </h3>
            <p className="text-sm text-muted-foreground">
              Para problemas urgentes, entre em contato pelo número: (11) 1234-5678
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
