import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle, X } from "lucide-react"

export default function PlanosPage() {
  const planos = [
    {
      nome: "Básico",
      preco: "R$ 0,00",
      periodo: "/mês",
      descricao: "Para quem quer começar a explorar",
      popular: false,
      cta: "Quero o Básico no Zap!",
      href: "/cadastro?plano=basico",
      recursos: [
        "Acesso ao dicionário jurídico",
        "Consulta de doutrinas básicas",
        "Modelos jurídicos simples",
      ],
      limitacoes: ["Consultas limitadas", "Sem banco de questões OAB", "Sem suporte prioritário"],
    },
    {
      nome: "Essencial",
      preco: "R$ 9,90",
      periodo: "/mês",
      precoAnual: "R$ 99,00",
      periodoAnual: "/anual",
      descricao: "A melhor escolha para estudantes",
      popular: true,
      cta: "Assinar Plano Mensal",
      ctaAnual: "Assinar Plano Anual",
      href: "/cadastro?plano=essencial_mensal",
      hrefAnual: "/cadastro?plano=essencial_anual",
      recursos: [
        "Tudo do plano Básico",
        "Conteúdo do gabarito da OAB",
        "Organogramas e modelos prontos",
        "Atendimento e suporte via WhatsApp",
      ],
      limitacoes: ["Sem simulados de concursos"],
    },
    {
      nome: "Aprova",
      preco: "R$ 19,90",
      periodo: "/mês",
      descricao: "Foco total na sua aprovação",
      popular: false,
      cta: "Assinar Plano Aprova",
      href: "/cadastro?plano=aprova",
      recursos: [
        "Foco total na OAB e concursos",
        "Simulados e cronogramas",
        "Questões de provas comentadas",
        "Tudo que sua aprovação precisa",
        "Suporte prioritário 24/7",
      ],
      limitacoes: [],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Escolha seu Plano</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Planos flexíveis para cada etapa da sua jornada jurídica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            {planos.map((plano) => (
              <Card key={plano.nome} className={`relative flex flex-col ${plano.popular ? "border-2 border-green-600 shadow-xl scale-105" : "border"}`}>
                {plano.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600">
                    Mais Popular
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plano.nome}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plano.preco}</span>
                    <span className="text-gray-500">{plano.periodo}</span>
                  </div>
                  <CardDescription className="mt-2 h-10">{plano.descricao}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 flex-grow flex flex-col">
                  <div className="space-y-3 flex-grow">
                    {plano.recursos.map((recurso, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{recurso}</span>
                      </div>
                    ))}

                    {plano.limitacoes.map((limitacao, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <X className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-500">{limitacao}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 mt-auto">
                    <Link href={plano.href}>
                      <Button
                        className={`w-full ${plano.popular ? "bg-green-600 hover:bg-green-700" : "bg-gray-800 hover:bg-gray-900"}`}
                      >
                        {plano.cta}
                      </Button>
                    </Link>
                    {plano.precoAnual && (
                       <div className="mt-4 text-center">
                         <div className="relative my-2">
                           <div className="absolute inset-0 flex items-center" aria-hidden="true">
                             <div className="w-full border-t border-gray-300" />
                           </div>
                           <div className="relative flex justify-center text-xs">
                             <span className="bg-white px-2 text-gray-500">ou</span>
                           </div>
                         </div>
                         <p className="font-bold">{plano.precoAnual} <span className="font-normal text-gray-500">{plano.periodoAnual}</span></p>
                         <Link href={plano.hrefAnual!}>
                           <Button variant="outline" className="w-full mt-2">
                             {plano.ctaAnual}
                           </Button>
                         </Link>
                       </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Garantia de 7 dias</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experimente qualquer plano pago por 7 dias. Se não ficar satisfeito, devolvemos 100% do seu dinheiro, sem
              perguntas.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}