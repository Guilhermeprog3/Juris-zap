"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  DollarSign,
  Zap,
  Phone,
  Edit,
  X,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const [userPlan] = useState({
    name: "Profissional",
    price: "R$ 59,90",
    nextPaymentDate: "20/07/2025",
    whatsappNumber: "+55 (11) 98765-4321",
  })

  const [userPhoneNumber, setUserPhoneNumber] = useState("+55 (21) 91234-5678")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newPhoneNumber, setNewPhoneNumber] = useState("")

  const [paymentHistory] = useState([
    { id: 1, date: "17/06/2025", amount: "R$ 59,90", status: "Concluído" },
    { id: 2, date: "17/05/2025", amount: "R$ 59,90", status: "Concluído" },
    { id: 3, date: "17/04/2025", amount: "R$ 59,90", status: "Concluído" },
  ])

  const calculateDaysRemaining = (paymentDate: string) => {
    const [day, month, year] = paymentDate.split('/').map(Number)
    const nextPayment = new Date(year, month - 1, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const diffTime = nextPayment.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilNextPayment = calculateDaysRemaining(userPlan.nextPaymentDate)
  const isPaymentOverdue = daysUntilNextPayment < 0
  const isServiceActive = !isPaymentOverdue

  const handleSavePhoneNumber = () => {
    if (newPhoneNumber.trim()) {
      setUserPhoneNumber(newPhoneNumber)
      setIsModalOpen(false)
      setNewPhoneNumber("")
    } else {
      alert("Por favor, insira um número válido.")
    }
  }

  const handlePaymentClick = () => {
    router.push('/dashboard/pagamento')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard <span className="text-emerald-600">Jurídico</span>
          </h1>
          <p className="text-gray-600 mt-2">Bem-vindo de volta! Aqui estão as informações da sua conta.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Card Meu Plano */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-emerald-600" />
                  Meu Plano
                </CardTitle>
                <CardDescription>Visualize os detalhes do seu plano atual.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-emerald-50">
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold text-emerald-800">Plano {userPlan.name}</p>
                    <p className="text-sm text-emerald-700">Próximo Pagamento: {userPlan.nextPaymentDate}</p>
                  </div>
                  <div className="text-xl font-bold text-emerald-900">{userPlan.price}/mês</div>
                </div>
                <Link href="/dashboard/planos">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                    Gerenciar Assinatura
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Card Número de Contato */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-emerald-600" />
                  Seu Número de Contato
                </CardTitle>
                <CardDescription>Este é o número que você usa para interagir com a IA e acessar sua conta.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-emerald-50">
                  <p className="text-lg font-semibold text-emerald-800">{userPhoneNumber}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsModalOpen(true)} 
                    className="flex items-center gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    <Edit className="h-4 w-4" />
                    Trocar Número
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Qualquer alteração aqui afeta o número usado para login e interação com a IA via WhatsApp.
                </p>
              </CardContent>
            </Card>

            {/* Card Histórico de Pagamentos */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
              <CardHeader>
                <CardTitle>Histórico de Pagamentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-emerald-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <div>
                        <p className="text-sm font-medium">Pagamento - {payment.amount}</p>
                        <p className="text-xs text-gray-500">Data: {payment.date}</p>
                      </div>
                    </div>
                    <span className="text-sm text-emerald-700 font-medium">{payment.status}</span>
                  </div>
                ))}
                {paymentHistory.length === 0 && (
                  <p className="text-sm text-gray-500 text-center">Nenhum pagamento registrado ainda.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Card Prazos Próximos */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className={`h-5 w-5 mr-2 ${isPaymentOverdue ? 'text-red-500' : 'text-emerald-500'}`} />
                  Prazos Próximos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex items-center justify-between p-3 rounded-lg ${isPaymentOverdue ? 'bg-red-50' : 'bg-emerald-50'}`}>
                  <div>
                    <p className={`text-sm font-medium ${isPaymentOverdue ? 'text-red-800' : 'text-emerald-800'}`}>
                      Pagamento do Plano {userPlan.name}
                    </p>
                    <p className={`text-xs ${isPaymentOverdue ? 'text-red-600' : 'text-emerald-600'}`}>
                      {isPaymentOverdue
                        ? `Pagamento vencido há ${Math.abs(daysUntilNextPayment)} dia(s)`
                        : `Vence em ${daysUntilNextPayment} dia(s) (${userPlan.nextPaymentDate})`}
                    </p>
                  </div>
                  <DollarSign className={`h-4 w-4 ${isPaymentOverdue ? 'text-red-500' : 'text-emerald-500'}`} />
                </div>
                
                {/* Botão de Pagamento */}
                <Button 
                  className={`w-full ${isPaymentOverdue 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-emerald-600 hover:bg-emerald-700'}`}
                  onClick={handlePaymentClick}
                >
                  {isPaymentOverdue ? 'Regularizar Pagamento Agora' : 'Antecipar Pagamento'}
                </Button>
              </CardContent>
            </Card>

            {/* Card Atendimento WhatsApp */}
            <Card className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <MessageSquare className="h-5 w-5 mr-2 text-emerald-300" />
                  Atendimento via WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isServiceActive ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'}`}></div>
                    <span className={`text-sm font-semibold ${isServiceActive ? 'text-white' : 'text-red-200'}`}>
                      {isServiceActive ? "Conectado" : "Desativado"}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100">
                    {isServiceActive
                      ? "Interaja com nossa IA para obter resumos, responder questões e gerar modelos de petições."
                      : "Serviço pausado. Regularize seu pagamento para reativar o acesso à IA via WhatsApp."}
                  </p>
                  <p className="text-sm font-semibold mt-2 text-emerald-50">
                    Número para contato da IA: {userPlan.whatsappNumber}
                  </p>
                  <p className={`text-xs ${isServiceActive ? 'text-emerald-200' : 'text-yellow-200 font-bold'}`}>
                    <strong>Importante:</strong> {isServiceActive ? "Utilize o seu número de telefone cadastrado na conta" : "O seu acesso está bloqueado até a confirmação do pagamento. Use o seu número"} ({userPhoneNumber}) para interagir com a IA.
                  </p>
                  <Link href="/dashboard/planos">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`w-full mt-3 ${isPaymentOverdue 
                        ? 'bg-red-500/10 border-red-300 text-red-100 hover:bg-red-500/20 hover:text-white' 
                        : 'bg-emerald-500/10 border-emerald-300 text-emerald-100 hover:bg-emerald-500/20 hover:text-white'}`}
                    >
                      {isPaymentOverdue ? "Regularizar Pagamento" : "Gerenciar Plano"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal para Trocar Número */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4 border-0 shadow-xl">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Alterar Número de Telefone</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Digite o novo número que você usará para o login e para interagir com a IA.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Novo Número com DDD</label>
                <Input
                  id="phone"
                  placeholder="+55 (XX) XXXXX-XXXX"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button 
                onClick={handleSavePhoneNumber}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Salvar Alterações
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}