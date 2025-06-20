"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Scale,
  Gavel,
  X,
  LucideIcon,
  Zap,
  Sparkles,
  ChevronRight,
  Gem,
  Leaf,
} from "lucide-react"
import { NavbarAdm } from "@/components/navbar_adm"

interface PlanIconProps {
  icon: LucideIcon
}

function PlanIcon({ icon: Icon }: PlanIconProps) {
  return (
    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
      <Icon className="h-6 w-6 text-white" />
    </div>
  )
}

interface InfoBoxProps {
  icon: LucideIcon
  title: string
  children: React.ReactNode
  color: 'emerald' | 'teal' | 'amber' | 'cyan'
}

export default function GerenciarPlanosPage() {
  const router = useRouter()
  const [planoAtual] = useState({
    nome: "Estudante",
    preco: "R$ 29,90",
    status: "Ativo",
    proximoPagamento: "2024-02-15",
    dataInicio: "2024-01-15",
    diasRestantes: 12,
  })

  const [showCancelModal, setShowCancelModal] = useState(false)

  const planosDisponiveis = [
    {
      nome: "Básico",
      preco: "R$ 19,90",
      periodo: "/mês",
      descricao: "Ideal para quem está começando",
      atual: false,
      icon: Leaf,
      popular: false,
      recursos: [
        "50 consultas por dia",
        "Resumos básicos de leis",
        "Acesso via WhatsApp",
        "Resumo de imagens e documentos",
        "Suporte por email",
      ],
    },
    {
      nome: "Estudante",
      preco: "R$ 29,90",
      periodo: "/mês",
      descricao: "Perfeito para estudantes de direito",
      atual: true,
      icon: Scale,
      popular: true,
      recursos: [
        "Consultas ilimitadas",
        "Resumos avançados de leis e jurisprudências",
        "Banco de questões OAB",
        "Modelos básicos de petições",
        "Resumo de imagens e documentos",
        "Lembretes de prazos processuais",
        "Acesso via WhatsApp e Web",
        "Suporte prioritário",
      ],
    },
    {
      nome: "Profissional",
      preco: "R$ 59,90",
      periodo: "/mês",
      descricao: "Para advogados e concurseiros",
      atual: false,
      icon: Gavel,
      popular: false,
      recursos: [
        "Tudo do plano Estudante",
        "Modelos premium de petições",
        "Análise avançada de jurisprudências",
        "Resumo de documentos complexos",
        "Simulados personalizados",
        "API para integração",
        "Relatórios de progresso",
        "Suporte 24/7 com especialistas",
      ],
    },
  ]

  const handleCancelSubscription = () => {
    console.log("Assinatura cancelada")
    setShowCancelModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <NavbarAdm />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-800 transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Dashboard
          </Link>
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Gerenciar <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Plano</span>
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Explore opções que se adaptam ao seu crescimento na carreira jurídica. 
              Atualize seu plano a qualquer momento e tenha acesso a recursos exclusivos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <aside className="xl:col-span-1 space-y-8">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                    <Gem className="h-5 w-5 text-emerald-600" />
                  </div>
                  Seu Plano Atual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white relative overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-[length:100px_100px] opacity-10"></div>
                  <div className="relative z-10">
                    <Scale className="h-10 w-10 mx-auto mb-3 text-emerald-200" />
                    <h3 className="text-xl font-bold">{planoAtual.nome}</h3>
                    <p className="text-3xl font-bold mt-2">
                      {planoAtual.preco}
                      <span className="text-sm text-emerald-100 font-normal">/mês</span>
                    </p>
                    <Badge className="mt-3 bg-white/20 text-white border-0 backdrop-blur-sm hover:bg-white/30">
                      {planoAtual.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center"><Calendar className="h-4 w-4 mr-2 text-emerald-500" /> Próximo pagamento</span>
                    <div className="text-right">
                      <span className="font-semibold block">{new Date(planoAtual.proximoPagamento).toLocaleDateString("pt-BR", {timeZone: 'UTC'})}</span>
                      <span className="text-xs text-gray-500">em {planoAtual.diasRestantes} dias</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-emerald-500" /> Membro desde</span>
                    <span className="font-medium">{new Date(planoAtual.dataInicio).toLocaleDateString("pt-BR", {timeZone: 'UTC'})}</span>
                  </div>
                </div>

                <Separator className="bg-gray-200" />

                <div className="space-y-3">
                  <Button 
                    variant="default" 
                    className="w-full justify-between group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md"
                    onClick={() => router.push('/dashboard/pagamento')}
                  >
                    <span className="flex items-center">
                      <Zap className="h-4 w-4 mr-2" /> 
                      Adiantar Pagamento
                    </span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between group hover:bg-emerald-50 transition-colors"
                    onClick={() => window.scrollTo({top: document.getElementById('planos-disponiveis')?.offsetTop, behavior: 'smooth'})}
                  >
                    <span className="flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-emerald-500" /> 
                      Trocar Assinatura
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          <main className="xl:col-span-3">
            <div className="mb-10" id="planos-disponiveis">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Escolha o plano ideal para sua <span className="text-emerald-600">carreira jurídica</span>
              </h2>
              <p className="text-gray-600 max-w-3xl">
                Todos os planos incluem acesso imediato e garantia de satisfação de 7 dias. 
                Atualize ou downgrade a qualquer momento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {planosDisponiveis.map((plano) => (
                <Card
                  key={plano.nome}
                  className={`relative flex flex-col border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full ${
                    plano.atual ? "ring-2 ring-emerald-500 bg-emerald-50/30" : "bg-white"
                  }`}
                >
                  {(plano.popular || plano.atual) && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className={`border-0 px-4 py-1 text-white shadow-md ${
                        plano.atual
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                          : "bg-gradient-to-r from-amber-500 to-orange-500"
                      }`}>
                        {plano.atual ? (
                          <><CheckCircle className="h-3 w-3 mr-1.5" />Plano Atual</>
                        ) : (
                          <><Sparkles className="h-3 w-3 mr-1.5" />Mais Popular</>
                        )}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4 pt-9">
                    <div className="flex justify-center mb-4">
                      <PlanIcon icon={plano.icon} />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">{plano.nome}</CardTitle>
                    <div className="mt-2">
                      <span className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {plano.preco}
                      </span>
                      <span className="text-gray-500 text-sm">{plano.periodo}</span>
                    </div>
                    <CardDescription className="mt-2 text-gray-600">{plano.descricao}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-grow justify-between space-y-6">
                    <div className="space-y-3">
                      {plano.recursos.map((recurso, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{recurso}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      className={`w-full h-12 text-base font-semibold transition-all ${
                        plano.atual
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg"
                      }`}
                      disabled={plano.atual}
                    >
                      {plano.atual ? "Plano Ativo" : "Assinar Agora"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                  Informações Importantes
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoBox icon={Zap} title="Upgrade Imediato" color="emerald">
                  Ao fazer upgrade, você terá acesso imediato aos novos recursos. O valor será cobrado proporcionalmente ao tempo restante no seu ciclo atual.
                </InfoBox>
                <InfoBox icon={Calendar} title="Downgrade Agendado" color="teal">
                  O downgrade será aplicado no próximo ciclo de cobrança. Você manterá todos os recursos do plano atual até o final do período.
                </InfoBox>
                <InfoBox icon={AlertTriangle} title="Cancelamento Sem Custos" color="amber">
                  Você pode cancelar quando quiser sem taxas. Seu acesso permanecerá ativo até o final do período já pago.
                </InfoBox>
                <InfoBox icon={Gem} title="Garantia de Satisfação" color="cyan">
                  Teste sem riscos por 7 dias. Se não amar a experiência, devolvemos seu dinheiro sem questionamentos.
                </InfoBox>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4 border-0 shadow-xl">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Cancelar Assinatura</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowCancelModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Você tem certeza que deseja cancelar sua assinatura?</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Seu acesso aos serviços será mantido até o final do período já pago ({planoAtual.proximoPagamento}).
                      Você poderá reativar sua assinatura a qualquer momento.
                    </p>
                  </div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Atenção:</strong> Ao cancelar, você perderá acesso aos recursos premium no final do ciclo atual.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCancelModal(false)}>
                Manter Assinatura
              </Button>
              <Button 
                variant="destructive"
                onClick={handleCancelSubscription}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirmar Cancelamento
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

function InfoBox({ icon: Icon, title, children, color }: InfoBoxProps) {
  const colors = {
    emerald: "from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-800",
    teal: "from-teal-50 to-teal-100 border-teal-200 text-teal-800",
    amber: "from-amber-50 to-amber-100 border-amber-200 text-amber-800",
    cyan: "from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-800",
  } as const;

  const iconColors = {
    emerald: "bg-emerald-100 text-emerald-600",
    teal: "bg-teal-100 text-teal-600",
    amber: "bg-amber-100 text-amber-600",
    cyan: "bg-cyan-100 text-cyan-600",
  } as const;

  return (
    <div className={`p-5 bg-gradient-to-br rounded-xl border ${colors[color]} h-full`}>
      <div className="flex items-center mb-3">
        <div className={`p-2 rounded-lg mr-3 ${iconColors[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h4 className="font-bold">{title}</h4>
      </div>
      <p className="text-sm leading-relaxed text-gray-700">
        {children}
      </p>
    </div>
  )
}