import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookOpen, MessageCircle, Award, ScanLine, Zap, Check, ChevronRight, Sparkles } from "lucide-react" 

export default function EstudantePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Navbar />

      <section className="relative bg-gradient-to-br from-emerald-100 to-teal-100 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-[length:100px_100px]"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-6 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Sparkles className="h-4 w-4 mr-2" />
            Nova IA Jurídica Disponível
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            A resposta rápida para sua dúvida <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Jurídica</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Aprenda Direito de forma mais eficiente com resumos automáticos, auxílio em exercícios e modelos
            jurídicos. Tudo integrado ao WhatsApp para estudar onde estiver.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cadastro">
              <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg">
                Começar Teste Gratuito
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/planos">
              <Button size="lg" variant="outline" className="text-lg px-8 border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">
                Conheça os Planos
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-600">Teste grátis por 3 dias. Cancele quando quiser.</p>
          
          <div className="mt-16 mx-auto max-w-4xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 h-8 flex items-center px-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="p-6 text-left">
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <Zap className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">JurisZap IA</h3>
                  <p className="text-gray-600 mt-1">Olá! Como posso ajudar com sua dúvida jurídica hoje? Posso resumir leis, explicar conceitos ou ajudar com exercícios.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-600">
              Funcionalidades
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Estudo Jurídico Revolucionado</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para dominar o Direito em uma única plataforma integrada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
              <CardHeader>
                <div className="bg-emerald-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-gray-900">Resumos Automáticos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Resumos inteligentes de leis, jurisprudências, doutrinas, imagens e documentos
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
              <CardHeader>
                <div className="bg-emerald-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-gray-900">WhatsApp Integrado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Acesse sua IA jurídica diretamente pelo WhatsApp. Estude em qualquer lugar, a qualquer hora
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
              <CardHeader>
                <div className="bg-emerald-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-gray-900">Auxílio em Exercícios</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Receba ajuda na resolução de exercícios e na pesquisa de questões de concursos e da OAB
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
                  Envie uma foto de um livro ou documento e nossa IA extrai o texto para você analisar e resumir
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-600">
              Simplicidade
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Como Funciona</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Três passos para revolucionar seus estudos jurídicos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Cadastre-se</h3>
              <p className="text-gray-600">Crie sua conta em menos de 2 minutos e conecte seu WhatsApp</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Faça Perguntas</h3>
              <p className="text-gray-600">Envie suas dúvidas via WhatsApp como se estivesse conversando com um colega</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Receba Respostas</h3>
              <p className="text-gray-600">Obtenha respostas precisas e personalizadas em segundos</p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-br from-emerald-700 to-teal-700 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-white text-emerald-700 hover:bg-white/90">
            <Zap className="h-4 w-4 mr-2" />
            Comece agora
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para revolucionar seus estudos jurídicos?</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Comece seu teste gratuito de 3 dias. Junte-se a milhares de estudantes que já usam JurisZap para dominar o Direito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cadastro">
              <Button size="lg" className="text-lg px-8 bg-white text-emerald-700 hover:bg-white/90 shadow-lg">
                Iniciar Teste Gratuito
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/planos">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 text-white border-white hover:bg-white/10 hover:text-white"
              >
                Ver Planos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}