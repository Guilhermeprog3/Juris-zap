import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText } from "lucide-react";

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <header className="text-center pb-8 border-b border-gray-200 mb-10">
              <FileText className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Termos de Uso – JurisZap®
              </h1>
              <p className="mt-3 text-md text-gray-500">
                Data de vigência: 08/2025
              </p>
            </header>

            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  1. Sobre o JurisZap®
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed">
                  <p>
                    O JurisZap® é um assistente virtual de estudos voltado para
                    universitários de Direito, que oferece explicações,
                    orientações e dicas de estudo. O JurisZap® não presta
                    consultoria jurídica, advocacia ou serviços que exijam
                    inscrição na OAB. Todo o conteúdo é de caráter
                    educativo.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  2. Aceitação dos Termos
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed">
                  <p>
                    Ao utilizar o JurisZap®, você confirma que leu, entendeu e
                    concorda com este Termo de Uso. Caso não concorde, não
                    utilize o serviço.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  3. Quem pode usar
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed">
                  <p>
                    Qualquer pessoa com acesso a um número de WhatsApp válido e
                    ativo.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  4. Como funciona
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed">
                  <p>
                    O JurisZap® funciona por meio de mensagens no WhatsApp. Você
                    envia perguntas e recebe respostas com base em conteúdos
                    acadêmicos de Direito. O serviço pode incluir dicas de
                    estudo, explicações de matérias, exemplos práticos e
                    orientações para organização de estudos.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  5. Limitações de uso
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed">
                  <p>
                    Você não pode: Usar o JurisZap® para solicitar consultoria
                    jurídica real; Repassar as respostas como se fossem
                    orientação profissional em processos reais; Utilizar o
                    serviço de forma abusiva, ofensiva ou contrária à lei.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  6. Planos e Pagamentos
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed">
                  <p>
                    O JurisZap® pode ser gratuito ou pago, conforme o plano
                    contratado. Planos pagos são cobrados conforme informado no
                    momento da contratação. Pagamentos não confirmados podem
                    resultar na suspensão do acesso.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-12">
                <AccordionTrigger className="text-emerald-700 border border-emerald-200 rounded-md px-6 hover:bg-emerald-50 text-left font-semibold uppercase">
                  12. Termos Técnicos
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6 text-gray-600 leading-relaxed">
                  <p>
                    A JurisZap® se compromete a combater quaisquer falhas no
                    serviço, mas devido a necessidade de utilização de
                    tecnologias de outras empresas, em alguns casos o serviço
                    pode demonstrar oscilações e falhas no pleno
                    funcionamento, podendo ser algo momentâneo, portanto em
                    caso de ocorrência como tais descritas acima, o usuário se
                    compromete a recorrer ao suporte para informar qualquer mal
                    funcionamento dos serviços prestados pela JurisZap®.
                  </p>
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