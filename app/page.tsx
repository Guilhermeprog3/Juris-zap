import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookOpen, MessageCircle, Award, ScanLine } from "lucide-react" 

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="bg-gradient-to-br from-green-50 to-teal-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4" variant="secondary">
            🚀 Nova IA Jurídica Disponível
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            A resposta rápida para sua dúvida
            <span className="text-green-700"> Jurídica.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Aprenda Direito de forma mais eficiente com resumos automáticos, auxilio em exercícios e modelos
            jurídicos. Tudo integrado ao WhatsApp para estudar onde estiver.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cadastro">
              <Button size="lg" className="text-lg px-8 bg-green-600 hover:bg-green-700">
                Começar Agora
              </Button>
            </Link>
            <Link href="/planos">
              <Button size="lg" variant="outline" className="text-lg px-8 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700">
                Conheça os Planos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Funcionalidades Poderosas</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para acelerar seus estudos jurídicos em uma única plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <CardTitle>Resumos Automáticos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Resumos inteligentes de leis, jurisprudências, doutrinas, imagens e documentos
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>WhatsApp Integrado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Acesse sua IA jurídica diretamente pelo WhatsApp. Estude em qualquer lugar, a qualquer hora
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Auxílio em Exercícios</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Receba ajuda na resolução de exercícios e na pesquisa de questões de concursos e da OAB
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <ScanLine className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Leitura de Imagens</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Como Funciona</h2>
            <p className="text-xl text-gray-600">Simples, rápido e eficiente</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Cadastre-se</h3>
              <p className="text-gray-600">Crie sua conta em menos de 2 minutos e conecte seu WhatsApp</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Faça Perguntas</h3>
              <p className="text-gray-600">Envie suas dúvidas via WhatsApp</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Receba Respostas</h3>
              <p className="text-gray-600">Obtenha respostas precisas e personalizadas instantaneamente</p>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-green-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pronto para acelerar seus estudos?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Junte-se a JurisZap a ia propria para estudos jurídicos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cadastro">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Começar Agora
              </Button>
            </Link>
            <Link href="/planos">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 text-white border-white hover:bg-white hover:text-green-700"
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