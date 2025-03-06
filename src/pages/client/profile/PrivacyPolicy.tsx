
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="container py-6 pb-20 md:pb-6">
      <div className="mb-6 flex items-center">
        <Link to="/perfil" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Política de Privacidade</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Política de Privacidade do NovelBook</CardTitle>
          <p className="text-muted-foreground text-sm">Última atualização: 15 de Março de 2023</p>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            A NovelBook ("nós", "nosso" ou "empresa") está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você usa nosso aplicativo e serviços ("Serviços").
          </p>
          
          <h3>1. Informações que Coletamos</h3>
          <p>
            <strong>Informações que você nos fornece:</strong> Coletamos informações que você fornece diretamente quando se registra e usa nossos Serviços, incluindo:
          </p>
          <ul>
            <li>Informações de registro: nome, endereço de e-mail, senha</li>
            <li>Informações de perfil: foto, biografia, preferências de leitura</li>
            <li>Informações de pagamento: necessárias para processar compras (armazenadas por nossos processadores de pagamento)</li>
            <li>Conteúdo gerado pelo usuário: avaliações, comentários, listas de leitura</li>
          </ul>
          
          <p>
            <strong>Informações coletadas automaticamente:</strong> Quando você usa nossos Serviços, coletamos automaticamente:
          </p>
          <ul>
            <li>Dados de uso: títulos lidos, tempo de leitura, interações com o aplicativo</li>
            <li>Informações do dispositivo: tipo de dispositivo, sistema operacional, identificadores únicos</li>
            <li>Informações de localização: localização aproximada baseada no endereço IP</li>
            <li>Dados de cookies e tecnologias semelhantes: para melhorar sua experiência</li>
          </ul>
          
          <h3>2. Como Usamos Suas Informações</h3>
          <p>
            Usamos as informações que coletamos para:
          </p>
          <ul>
            <li>Fornecer, manter e melhorar nossos Serviços</li>
            <li>Processar transações e enviar notificações relacionadas</li>
            <li>Personalizar sua experiência e fornecer recomendações de conteúdo</li>
            <li>Comunicar-se com você sobre atualizações, promoções e novos recursos</li>
            <li>Monitorar e analisar tendências, uso e atividades</li>
            <li>Detectar, investigar e prevenir atividades fraudulentas e não autorizadas</li>
            <li>Cumprir obrigações legais</li>
          </ul>
          
          <h3>3. Compartilhamento de Informações</h3>
          <p>
            Podemos compartilhar suas informações com:
          </p>
          <ul>
            <li><strong>Provedores de serviços:</strong> empresas que realizam serviços em nosso nome (pagamentos, análise de dados, entrega de e-mail)</li>
            <li><strong>Parceiros comerciais:</strong> editoras e autores que fornecem conteúdo em nossa plataforma (apenas dados agregados e anônimos)</li>
            <li><strong>Conformidade legal:</strong> quando necessário para cumprir leis, regulamentos ou processos legais</li>
            <li><strong>Proteção de direitos:</strong> quando acreditamos que o compartilhamento é necessário para proteger direitos, propriedade ou segurança</li>
          </ul>
          
          <h3>4. Suas Escolhas</h3>
          <p>
            Você tem várias opções em relação às suas informações:
          </p>
          <ul>
            <li><strong>Informações da conta:</strong> você pode atualizar ou corrigir suas informações através das configurações da conta</li>
            <li><strong>Preferências de comunicação:</strong> você pode optar por não receber comunicações promocionais</li>
            <li><strong>Cookies:</strong> você pode configurar seu navegador para recusar cookies, embora isso possa afetar a funcionalidade</li>
            <li><strong>Dados de uso:</strong> você pode ajustar suas preferências de privacidade para limitar a coleta de dados de uso</li>
          </ul>
          
          <h3>5. Segurança</h3>
          <p>
            Implementamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, perda ou alteração. No entanto, nenhum sistema é completamente seguro. Continuamente aprimoramos nossas práticas de segurança.
          </p>
          
          <h3>6. Retenção de Dados</h3>
          <p>
            Mantemos suas informações pelo tempo necessário para fornecer os Serviços e cumprir nossas obrigações legais. Quando não temos mais um propósito comercial legítimo para processar suas informações, excluímos ou anonimizamos.
          </p>
          
          <h3>7. Transferências Internacionais</h3>
          <p>
            Suas informações podem ser transferidas para—e mantidas em—computadores localizados fora do seu estado, província, país ou jurisdição, onde as leis de proteção de dados podem ser diferentes. Quando transferimos informações para outros países, tomamos medidas para garantir que suas informações permaneçam protegidas.
          </p>
          
          <h3>8. Crianças</h3>
          <p>
            Nossos Serviços não são destinados a crianças menores de 13 anos, e não coletamos intencionalmente informações pessoais de crianças. Se descobrirmos que coletamos informações pessoais de uma criança menor de 13 anos, excluiremos essas informações.
          </p>
          
          <h3>9. Alterações nesta Política</h3>
          <p>
            Podemos atualizar esta Política periodicamente. Notificaremos você sobre alterações significativas publicando a nova Política e atualizando a data "Última atualização". Recomendamos revisar a Política periodicamente.
          </p>
          
          <h3>10. Entre em Contato Conosco</h3>
          <p>
            Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco em privacidade@novelbook.com.br.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
