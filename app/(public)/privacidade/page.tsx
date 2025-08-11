import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Lock } from "lucide-react";

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <header className="text-center pb-8 mb-10">
              <Lock className="mx-auto h-12 w-12 text-teal-600 mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Política de Privacidade – JurisZap®️
              </h1>
              <p className="mt-3 text-md text-gray-500">
                Última atualização: 08/2025
              </p>
            </header>

            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  1. Sobre esta Política
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed space-y-4">
                  <p>Esta Política de Privacidade explica como o JurisZap®️ coleta, usa, armazena e protege os dados pessoais de seus usuários. Nosso compromisso é garantir transparência, segurança e conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD).</p>
                  <p>Esta política se aplica a todos os usuários que utilizam o JurisZap®️, independentemente de sua localização geográfica.</p>
                  <div className="mt-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">1.1. Definições</h3>
                      <ul className="list-disc list-inside space-y-2">
                          <li><strong>Dados Pessoais:</strong> qualquer informação que identifique ou possa identificar uma pessoa natural.</li>
                          <li><strong>Titular de Dados:</strong> pessoa física a quem se referem os dados pessoais tratados.</li>
                          <li><strong>Controlador:</strong> pessoa física ou jurídica responsável pelas decisões referentes ao tratamento de dados pessoais (no caso, JurisZap®️).</li>
                          <li><strong>Operador:</strong> pessoa física ou jurídica que realiza o tratamento de dados pessoais em nome do Controlador.</li>
                      </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  2. Dados coletados
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed">
                  <p>Podemos coletar: Dados de identificação (nome, e-mail e número de WhatsApp), mensagens trocadas com o JurisZap®️ (para fins de atendimento e melhoria do serviço), informações de pagamento (apenas quando houver contratação de plano pago) e dados de uso (registros de acesso, data/hora de interações e estatísticas de uso).</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  3. Uso das informações
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed space-y-4">
                    <p>Os dados coletados podem ser utilizados para: Prestar e manter o serviço do JurisZap®️, melhorar a qualidade das respostas e do atendimento, garantir a segurança da plataforma, cumprir obrigações legais e regulatórias e enviar comunicações informativas ou promocionais (mediante consentimento).</p>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">3.1. Base legal para o tratamento</h3>
                        <p>O tratamento de dados pessoais pelo JurisZap®️ se fundamenta nas seguintes hipóteses da LGPD: Execução de contrato (Art. 7º, V), Cumprimento de obrigação legal/regulatória (Art. 7º, II), Legítimo interesse (Art. 7º, IX) e Consentimento (Art. 7º, I).</p>
                    </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  4. Compartilhamento de dados
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed space-y-4">
                    <p>O JurisZap®️ não vende, aluga ou comercializa dados pessoais. O compartilhamento só ocorrerá com prestadores de serviço necessários para a operação (sob cláusulas de confidencialidade) ou por exigência legal.</p>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1. Transferência internacional de dados</h3>
                        <p>Caso utilizemos provedores de tecnologia localizados fora do Brasil, poderá haver transferência internacional de dados. Nessas situações, garantimos que os países envolvidos possuem nível de proteção de dados compatível com a LGPD ou que haja garantias contratuais adequadas.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2. Dados sensíveis</h3>
                        <p>O JurisZap®️ não coleta dados pessoais sensíveis, salvo quando estritamente necessário e mediante consentimento explícito do titular.</p>
                    </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  5. Armazenamento e segurança
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed">
                  <p>Os dados são armazenados em ambientes seguros, com medidas técnicas e administrativas para prevenir acessos não autorizados. Utilizamos criptografia, backups e controles de acesso restritos.</p>
                </AccordionContent>
              </AccordionItem>

               <AccordionItem value="item-6">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  6. Retenção de dados
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed">
                   <p>Manteremos os dados apenas pelo tempo necessário para cumprir as finalidades descritas nesta política ou conforme exigência legal. O usuário pode solicitar a exclusão dos dados a qualquer momento, conforme item 8.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  7. Direitos do titular (LGPD)
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed">
                   <p>O usuário pode, a qualquer momento: Confirmar a existência de tratamento de dados, solicitar acesso às informações, corrigir dados incompletos, inexatos ou desatualizados, solicitar a exclusão dos dados, quando aplicável, e solicitar portabilidade para outro fornecedor de serviço.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  8. Como exercer seus direitos
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed">
                   <p>As solicitações podem ser feitas pelo WhatsApp oficial: +55 86 9416-7491 ou pelo e-mail: juriszap.br@gmail.com. Responderemos em até 15 dias úteis.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  9. Oscilações e funcionamento do serviço
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed">
                   <p>O JurisZap®️ se compromete a combater quaisquer falhas no serviço. Contudo, por utilizar tecnologias de terceiros, podem ocorrer oscilações ou falhas momentâneas. Nesses casos, o usuário deve entrar em contato com o suporte.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  10. Cookies e tecnologias de rastreamento
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed">
                   <p>O JurisZap®️ pode utilizar cookies ou tecnologias semelhantes para melhorar a experiência do usuário e coletar dados estatísticos. O usuário pode desativar os cookies no navegador, mas isso pode afetar o funcionamento do serviço.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-11">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  11. Alterações nesta Política
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed">
                   <p>O JurisZap®️ pode alterar esta Política a qualquer momento, publicando a versão atualizada no site oficial ou comunicando pelos canais oficiais. O uso contínuo do serviço após alterações será considerado como concordância com a nova versão.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-12">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  12. Encarregado de Dados (DPO)
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed">
                   <p>O responsável pelo tratamento de dados no JurisZap®️ é: Paulo César Coutinho dos Santos – E-mail: juriszap.br@gmail.com</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-13">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  13. Consentimento e retirada
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed">
                   <p>Ao utilizar o JurisZap®️, o usuário declara estar ciente e concordar com esta Política de Privacidade. O consentimento pode ser retirado a qualquer momento, mediante solicitação pelos canais indicados no item 8.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-14">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  14. Menores de idade
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed">
                   <p>O serviço do JurisZap®️ não é destinado a menores de 18 anos. Caso identifiquemos o uso indevido, poderemos excluir a conta e apagar os dados, salvo obrigação legal de retenção.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}