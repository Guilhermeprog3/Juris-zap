"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  CreditCard,
  CheckCircle,
  X,
} from "lucide-react"

export default function TrocarCartaoPage() {
  const router = useRouter()
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Cartão atual do usuário (simulado)
  const currentCard = {
    number: "•••• •••• •••• 1234",
    name: "FULANO DA SILVA",
    expiry: "12/25"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulando uma requisição assíncrona
    setTimeout(() => {
      console.log("Cartão atualizado:", { cardNumber, cardName, expiryDate })
      setIsLoading(false)
      router.push("/dashboard/planos?success=true")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/dashboard/planos"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-800 transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar para Gerenciar Plano
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Alterar <span className="text-emerald-600">Método de Pagamento</span>
            </h1>
            <p className="text-gray-600">
              Atualize os dados do seu cartão de crédito para continuar com o serviço sem interrupções.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de atualização */}
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-emerald-600" />
                Novo Cartão de Crédito
              </CardTitle>
              <CardDescription>
                Preencha os dados do seu novo cartão. Seus dados são criptografados e protegidos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">
                    Número do Cartão
                  </label>
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="cardName" className="text-sm font-medium text-gray-700">
                    Nome no Cartão
                  </label>
                  <Input
                    id="cardName"
                    placeholder="Nome como está no cartão"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="expiryDate" className="text-sm font-medium text-gray-700">
                      Validade (MM/AA)
                    </label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/AA"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="cvv" className="text-sm font-medium text-gray-700">
                      Código de Segurança (CVV)
                    </label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Atualizando..." : "Salvar Alterações"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Cartão atual */}
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-emerald-600" />
                Cartão Atual
              </CardTitle>
              <CardDescription>
                Este é o método de pagamento ativo na sua assinatura.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-gray-800 to-black rounded-xl p-6 text-white shadow-lg">
                <div className="flex justify-between items-start">
                  <CreditCard className="h-8 w-8 text-gray-300" />
                  <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded">VISA</span>
                </div>

                <div className="mt-8 mb-4">
                  <p className="text-xl font-mono tracking-widest">{currentCard.number}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-300">Titular do Cartão</p>
                    <p className="text-sm font-medium">{currentCard.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-300">Validade</p>
                    <p className="text-sm font-medium">{currentCard.expiry}</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                <strong>Observação:</strong> Seu novo cartão só será cobrado no próximo ciclo de pagamento.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}