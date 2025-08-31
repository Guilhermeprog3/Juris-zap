import { NavbarInst } from "@/components/navbar-inst";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, MessageCircle, Bot, ScanLine, Zap, School, Phone } from "lucide-react";
import { RequestQuoteForm } from "@/components/request-quote-form";

export default function InstitucionalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <NavbarInst />

      <section className="relative bg-gradient-to-br from-emerald-100 to-teal-100 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-[length:100px_100px]"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-6 bg-emerald-600 hover:bg-emerald-700 text-white">
            <School className="h-4 w-4 mr-2" />
            IA para Educação Jurídica
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Inove o Ensino do Direito com <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Inteligência Artificial</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Prepare seus alunos para o futuro da advocacia com ferramentas de IA que simulam casos, auxiliam em pesquisas e otimizam o aprendizado. Nossa tecnologia recebe integração de todo o material digital da faculdade e tem como referência, em seu treinamento, a metodologia e a estrutura acadêmica da IES.
          </p>
          <div className="flex justify-center">
            <a href="#orcamento">
              <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg">
                Solicitar um Orçamento
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-600">
              Vantagens
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">A Próxima Geração do Ensino Jurídico</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Capacite alunos e professores com tecnologia de ponta para um aprendizado mais dinâmico e eficaz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
                <CardHeader>
                    <div className="bg-emerald-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-8 w-8 text-emerald-600" />
                    </div>
                    <CardTitle className="text-gray-900">Análise de Conteúdo</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-gray-600">
                        Alunos podem enviar textos e documentos para a IA analisar e extrair as informações mais importantes.
                    </CardDescription>
                </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
                <CardHeader>
                    <div className="bg-emerald-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="h-8 w-8 text-emerald-600" />
                    </div>
                    <CardTitle className="text-gray-900">Canal de Estudos no WhatsApp</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-gray-600">
                        Ofereça um canal direto no WhatsApp para que os alunos possam tirar dúvidas e aprofundar o aprendizado a qualquer momento.
                    </CardDescription>
                </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                 <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
                <CardHeader>
                    <div className="bg-emerald-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Bot className="h-8 w-8 text-emerald-600" />
                    </div>
                    <CardTitle className="text-gray-900">Simulação de Casos</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-gray-600">
                        A IA pode simular cenários jurídicos e atuar como um assistente para ajudar na elaboração de peças e teses.
                    </CardDescription>
                </CardContent>
            </Card>

             <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                 <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
                <CardHeader>
                    <div className="bg-emerald-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <ScanLine className="h-8 w-8 text-emerald-600" />
                    </div>
                    <CardTitle className="text-gray-900">Leitura de Imagens</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-gray-600">
                        Basta enviar uma foto de um livro ou documento pelo WhatsApp para que nossa IA leia e analise o conteúdo.
                    </CardDescription>
                </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="orcamento" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <RequestQuoteForm />
            <div className="text-center mt-8 text-gray-600">
              <p>Ou, se preferir, fale diretamente com nosso time de negócios:</p>
              <div className="flex justify-center mt-4">
                <a href="https://wa.me/558699743464" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    <Phone className="h-5 w-5 mr-2" />
                    Falar no WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}