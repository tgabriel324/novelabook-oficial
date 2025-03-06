
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="container py-6 pb-20 md:pb-6">
      <div className="mb-6 flex items-center">
        <Link to="/perfil" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Termos de Serviço</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Termos de Serviço do NovelBook</CardTitle>
          <p className="text-muted-foreground text-sm">Última atualização: 15 de Março de 2023</p>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            Bem-vindo ao NovelBook. Estes Termos de Serviço ("Termos") regem seu acesso e uso do site, serviços, aplicativos e produtos do NovelBook (coletivamente, os "Serviços").
          </p>
          
          <h3>1. Aceitação dos Termos</h3>
          <p>
            Ao criar uma conta no NovelBook ou usar nossos Serviços, você concorda com estes Termos. Se você não concordar com qualquer parte destes Termos, você não pode usar nossos Serviços.
          </p>
          
          <h3>2. Mudanças nos Termos</h3>
          <p>
            Podemos modificar estes Termos a qualquer momento. Se fizermos alterações, publicaremos os Termos revisados e atualizaremos a data da "Última atualização" acima. É sua responsabilidade revisar os Termos periodicamente. Seu uso contínuo dos Serviços após a publicação de Termos revisados significa que você aceita e concorda com as alterações.
          </p>
          
          <h3>3. Privacidade</h3>
          <p>
            Nossa Política de Privacidade descreve como coletamos, usamos e compartilhamos suas informações pessoais. Ao usar nossos Serviços, você concorda que podemos usar essas informações de acordo com nossa Política de Privacidade.
          </p>
          
          <h3>4. Conteúdo e Direitos Autorais</h3>
          <p>
            O NovelBook contém uma ampla variedade de conteúdo, incluindo novelas, histórias, imagens e outros materiais ("Conteúdo"). Todo o Conteúdo disponível através de nossos Serviços é protegido por direitos autorais, marcas registradas e outras leis de propriedade intelectual.
          </p>
          <p>
            O NovelBook respeita os direitos de propriedade intelectual de outros. Reservamo-nos o direito de remover qualquer Conteúdo que viole direitos autorais ou outros direitos de propriedade intelectual.
          </p>
          
          <h3>5. Uso Aceitável</h3>
          <p>
            Você concorda em não:
          </p>
          <ul>
            <li>Usar os Serviços de qualquer maneira que viole leis ou regulamentos aplicáveis</li>
            <li>Vender, licenciar, alugar ou de outra forma explorar comercialmente os Serviços ou Conteúdo</li>
            <li>Interferir ou tentar interferir no funcionamento adequado dos Serviços</li>
            <li>Tentar contornar medidas que usamos para impedir ou restringir o acesso aos Serviços</li>
            <li>Compartilhar sua conta ou credenciais de login com terceiros</li>
          </ul>
          
          <h3>6. Contas</h3>
          <p>
            Para acessar determinados recursos dos Serviços, você precisará criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorrem sob sua conta.
          </p>
          
          <h3>7. Compras e Assinaturas</h3>
          <p>
            Alguns de nossos Serviços permitem que você compre novelas individuais ou assine um plano premium. Todos os preços são listados em reais brasileiros (R$) e incluem impostos aplicáveis.
          </p>
          <p>
            Para compras únicas, você receberá acesso permanente ao conteúdo comprado, sujeito a estes Termos. Para assinaturas, você será cobrado no início de cada período de assinatura, a menos que você cancele sua assinatura antes do próximo ciclo de cobrança.
          </p>
          
          <h3>8. Rescisão</h3>
          <p>
            Podemos encerrar ou suspender seu acesso aos Serviços imediatamente, sem aviso prévio ou responsabilidade, por qualquer motivo, incluindo, sem limitação, se você violar estes Termos.
          </p>
          
          <h3>9. Isenção de Garantias</h3>
          <p>
            OS SERVIÇOS SÃO FORNECIDOS "COMO ESTÃO" E "CONFORME DISPONÍVEIS", SEM GARANTIAS DE QUALQUER TIPO, EXPRESSAS OU IMPLÍCITAS.
          </p>
          
          <h3>10. Limitação de Responsabilidade</h3>
          <p>
            EM NENHUM CASO O NOVELBOOK, SEUS DIRETORES, FUNCIONÁRIOS OU AGENTES SERÃO RESPONSÁVEIS POR QUAISQUER DANOS INDIRETOS, PUNITIVOS, INCIDENTAIS, ESPECIAIS, CONSEQUENCIAIS OU EXEMPLARES.
          </p>
          
          <h3>11. Lei Aplicável</h3>
          <p>
            Estes Termos são regidos e interpretados de acordo com as leis do Brasil, sem considerar seus princípios de conflitos de leis.
          </p>
          
          <h3>12. Contato</h3>
          <p>
            Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco em suporte@novelbook.com.br.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfService;
