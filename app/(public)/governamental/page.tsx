import { NavbarGov } from "@/components/navbar-gov";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, MessageCircle, Bot, ScanLine, Zap, Sparkles, Mail, Phone } from "lucide-react";
import { RequestQuoteForm } from "@/components/request-quote-form";

export default function GovernamentalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <NavbarGov />

      <section className="relative bg-gradient-to-br from-teal-100 to-emerald-100 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-[length:100px_100px]"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-6 bg-teal-600 hover:bg-teal-700 text-white">
            <Sparkles className="h-4 w-4 mr-2" />
            Soluções de IA para o Setor Público
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Modernize a Gestão Pública com <br />
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Inteligência Artificial</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Otimize processos, analise documentos complexos e aumente a eficiência do seu órgão com nossa IA jurídica especializada.
          </p>
          <div className="flex justify-center">
            <a href="#orcamento">
              <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg">
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
            <Badge variant="outline" className="mb-4 border-teal-300 text-teal-600">
              Vantagens
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Eficiência e Precisão para o Setor Público</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nossa IA foi treinada para entender as nuances do ambiente jurídico governamental.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 h-2 w-full"></div>
                <CardHeader>
                    <div className="bg-teal-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-8 w-8 text-teal-600" />
                    </div>
                    <CardTitle className="text-gray-900">Análise de Documentos</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-gray-600">
                        Análise e resumo de licitações, contratos, portarias e outros documentos oficiais em segundos.
                    </CardDescription>
                </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 h-2 w-full"></div>
                <CardHeader>
                    <div className="bg-teal-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="h-8 w-8 text-teal-600" />
                    </div>
                    <CardTitle className="text-gray-900">Comunicação via WhatsApp</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-gray-600">
                        Acesse a IA diretamente pelo WhatsApp para consultas rápidas e seguras, garantindo a confidencialidade.
                    </CardDescription>
                </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                 <div className="bg-gradient-to-r from-teal-600 to-emerald-600 h-2 w-full"></div>
                <CardHeader>
                    <div className="bg-teal-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Bot className="h-8 w-8 text-teal-600" />
                    </div>
                    <CardTitle className="text-gray-900">Auxílio Jurídico</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-gray-600">
                        Suporte na elaboração de pareceres, ofícios e outras peças, otimizando o tempo da sua equipe.
                    </CardDescription>
                </CardContent>
            </Card>

             <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                 <div className="bg-gradient-to-r from-teal-600 to-emerald-600 h-2 w-full"></div>
                <CardHeader>
                    <div className="bg-teal-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <ScanLine className="h-8 w-8 text-teal-600" />
                    </div>
                    <CardTitle className="text-gray-900">Análise de Imagens</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-gray-600">
                        Envie imagens ou documentos digitalizados e nossa IA extrai informações cruciais para análise.
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