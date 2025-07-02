import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle, X, ChevronRight, Sparkles, ShieldCheck } from "lucide-react"

export default function PlanosPage() {
  const planos = [
    {
      nome: "Essencial",
      id_mensal: "essencial_mensal",
      preco: "R$ 9,90",
      periodo: "/mês",
      descricao: "A melhor escolha para o inicio da sua jornada",
      popular: false,
      cta: "Assinar Plano Essencial",
      href: "/cadastro?plano=essencial_mensal",
      recursos: [
        "IA para duvidas jurídicas integrada ao whatsapp",
        "Auxilio em exercicios e questões",
        "Respostas rapidas e precisas",
      ],
    limitacoes: ["Sem leitura de imagens","sem leitura de documentos","sem geração de imagens"],
    },
    {
      nome: "Básico",
      id_mensal: "basico",
      preco: "R$ 19,90",
      periodo: "/mês",
      descricao: "Para quem quer começar a explorar",
      popular: true,
      cta: "Quero o Básico no Zap!",
      href: "/cadastro?plano=basico",
      recursos: [
        "Tudo do plano Essencial",
        "IA com inteligência avançada",
        "Respostas mais completas",
        "Leitura de imagens e documentos",
      ],
    limitacoes: ["Sem geração de imagens", "Foco total na OAB e concursos"],
    },
    {
      nome: "Aprova+",
      id_mensal: "aprova_mensal",
      preco: "R$ 39,90",
      periodo: "/mês",
      descricao: "Foco total na sua aprovação",
      popular: false,
      cta: "Assinar Aprova+",
      href: "/cadastro?plano=aprova_mensal",
      recursos: [
        "Tudo do plano Basico",
        "Simulados e cronogramas",
        "Geração de imagens",
        "Tudo que sua aprovação precisa",
        "Ia preparada para OAB e concursos",
      ],
      limitacoes: [],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Navbar />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-600">
              Planos Flexíveis
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Escolha o plano ideal para sua <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">jornada jurídica</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Soluções completas para cada etapa dos seus estudos, do básico à aprovação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {planos.map((plano) => (
              <Card 
                key={plano.nome} 
                className={`relative flex flex-col border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${plano.popular ? "ring-2 ring-emerald-500 scale-[1.02]" : ""}`}
              >
                {plano.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md">
                      <Sparkles className="h-4 w-4 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}

                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>

                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900">{plano.nome}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plano.preco}</span>
                    <span className="text-gray-500">{plano.periodo}</span>
                  </div>
                  <CardDescription className="mt-2 h-10 text-gray-600">{plano.descricao}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 flex-grow flex flex-col">
                  <div className="space-y-3 flex-grow">
                    {plano.recursos.map((recurso, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{recurso}</span>
                      </div>
                    ))}

                    {plano.limitacoes.map((limitacao, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-500">{limitacao}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 mt-auto">
                    <Link href={plano.href}>
                      <Button
                        size="lg"
                        className={`w-full text-lg ${plano.popular 
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white" 
                          : "bg-gray-900 hover:bg-gray-800 text-white"}`}
                      >
                        {plano.cta}
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}