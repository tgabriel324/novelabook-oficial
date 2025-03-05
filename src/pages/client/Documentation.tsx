
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, HelpCircle, FileText, MessageCircle, Video, ExternalLink } from "lucide-react";

const Documentation = () => {
  return (
    <div className="container py-6 pb-20 md:pb-6">
      <header className="mb-8 text-center">
        <BookOpen className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold">Documentação NovelBook</h1>
        <p className="text-muted-foreground mt-2">Tudo que você precisa saber para aproveitar ao máximo nossa plataforma</p>
      </header>
      
      <Tabs defaultValue="user">
        <TabsList className="w-full grid grid-cols-2 mb-8">
          <TabsTrigger value="user">Para Leitores</TabsTrigger>
          <TabsTrigger value="technical">Documentação Técnica</TabsTrigger>
        </TabsList>
        
        <TabsContent value="user">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  Guia de Leitura
                </CardTitle>
                <CardDescription>Como utilizar o leitor de novelas</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Navegação básica</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">Para navegar entre páginas, utilize os botões de "Anterior" e "Próximo" na parte inferior da tela.</p>
                      <p>Você também pode utilizar as setas do teclado (← →) ou deslizar na tela em dispositivos móveis.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Marcadores</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">Para adicionar um marcador, clique no ícone de marcador (🔖) no topo da página durante a leitura.</p>
                      <p>Seus marcadores ficam salvos e você pode acessá-los a qualquer momento.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Notas de leitura</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">Durante a leitura, você pode adicionar notas clicando no ícone de mensagem (💬).</p>
                      <p>As notas são associadas à página atual e podem ser revisadas posteriormente.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Leitura offline</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">Para ler offline, clique no ícone de download (⬇️) para salvar o capítulo atual.</p>
                      <p>Os capítulos salvos ficam disponíveis na seção "Offline" do seu perfil.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  Perguntas Frequentes
                </CardTitle>
                <CardDescription>Respostas para dúvidas comuns</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="faq-1">
                    <AccordionTrigger>Como comprar novelas?</AccordionTrigger>
                    <AccordionContent>
                      <p>Você pode comprar novelas na página da Loja. Basta selecionar a novela desejada, clicar em "Comprar" e seguir o processo de pagamento.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-2">
                    <AccordionTrigger>Como funciona o sistema de favoritos?</AccordionTrigger>
                    <AccordionContent>
                      <p>Clique no ícone de coração em qualquer novela para adicioná-la aos favoritos. Você pode ver todas as suas novelas favoritas na aba "Favoritos" da sua biblioteca.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-3">
                    <AccordionTrigger>Posso compartilhar minha leitura?</AccordionTrigger>
                    <AccordionContent>
                      <p>Sim! Durante a leitura, há um botão de compartilhamento que permite enviar a indicação da novela para amigos via Telegram.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-4">
                    <AccordionTrigger>Como encontrar novelas semelhantes?</AccordionTrigger>
                    <AccordionContent>
                      <p>O sistema de recomendações personalizado mostra sugestões baseadas nas suas leituras anteriores e preferências. Estas recomendações aparecem na página "Descobrir" e ao final de cada capítulo.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Tutoriais em Vídeo</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Primeiros passos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted h-32 flex items-center justify-center">
                    <Video className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <Button className="w-full mt-4">Assistir tutorial</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recursos avançados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted h-32 flex items-center justify-center">
                    <Video className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <Button className="w-full mt-4">Assistir tutorial</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Dicas de leitura</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted h-32 flex items-center justify-center">
                    <Video className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <Button className="w-full mt-4">Assistir tutorial</Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Precisa de mais ajuda?</h2>
            <p className="text-muted-foreground mb-4">Nossa equipe de suporte está disponível para ajudar</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <Link to="/suporte">
                <Button className="w-full sm:w-auto">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Falar com Suporte
                </Button>
              </Link>
              <Button variant="outline" className="w-full sm:w-auto">
                <FileText className="mr-2 h-4 w-4" />
                Baixar Manual Completo
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="technical">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Documentação Técnica</CardTitle>
              <CardDescription>Informações para desenvolvedores e integrações</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="tech-1">
                  <AccordionTrigger>Requisitos do Sistema</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p><strong>Web:</strong> Navegadores modernos (Chrome, Firefox, Safari, Edge) com JavaScript ativado.</p>
                      <p><strong>Mobile:</strong> iOS 12+ ou Android 8.0+.</p>
                      <p><strong>Armazenamento:</strong> Mínimo de 50MB para o aplicativo, espaço adicional para conteúdo offline.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tech-2">
                  <AccordionTrigger>Arquitetura do Sistema</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>O NovelBook é uma aplicação web moderna construída com:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Frontend: React, TypeScript, Tailwind CSS</li>
                        <li>State Management: React Context, React Query</li>
                        <li>UI Components: Shadcn UI</li>
                        <li>Roteamento: React Router</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tech-3">
                  <AccordionTrigger>Performance e Otimização</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>O NovelBook implementa várias estratégias de otimização:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Lazy loading para imagens e componentes</li>
                        <li>Caching de conteúdo para leitura offline</li>
                        <li>Compressão de dados para transferências rápidas</li>
                        <li>Detecção automática de dispositivos para ajustar a experiência</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tech-4">
                  <AccordionTrigger>Compatibilidade</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>O aplicativo é testado em múltiplas plataformas:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Desktop: Windows, macOS, Linux</li>
                        <li>Mobile: iOS, Android</li>
                        <li>Tablets: iPad, Samsung Galaxy Tab, etc.</li>
                        <li>Navegadores: Chrome, Firefox, Safari, Edge</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tech-5">
                  <AccordionTrigger>Integrações e APIs</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>NovelBook oferece integrações com:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Sistema de Pagamentos</li>
                        <li>Compartilhamento para redes sociais (Telegram)</li>
                        <li>Armazenamento em nuvem para sincronização</li>
                      </ul>
                      <p className="mt-2">Documentação completa da API disponível para desenvolvedores parceiros.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="mt-6 flex justify-center">
                <Button className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Documentação completa da API
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Recursos para Desenvolvedores</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Guia de Contribuição</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Aprenda como contribuir para o desenvolvimento do NovelBook</p>
                  <Button variant="outline" className="w-full">Ver guia</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Exemplos de Integração</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Exemplos práticos de como integrar com a plataforma</p>
                  <Button variant="outline" className="w-full">Acessar exemplos</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Atualizações e Changelog</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Histórico de versões e notas de lançamento</p>
                  <Button variant="outline" className="w-full">Ver histórico</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
