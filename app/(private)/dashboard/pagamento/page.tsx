"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  QrCode,
  CheckCircle,
  RefreshCw,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { NavbarAdm } from "@/components/navbar_adm"

const PLANS = [
  { id: "basic", name: "Básico", price: 29.90 },
  { id: "professional", name: "Profissional", price: 59.90 },
  { id: "enterprise", name: "Empresarial", price: 99.90 }
]

export default function PagamentoPage() {
  const [paymentMethod, setPaymentMethod] = useState("pix")
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("professional")
  
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  const pixData = {
    qrCode: "00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426655440000520400005303986540559.905802BR5913Fulano de Tal6008BRASILIA62070503***6304A1B2",
    code: "00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426655440000520400005303986540559.905802BR5913Fulano de Tal6008BRASILIA62070503***6304A1B2",
    expiration: new Date(Date.now() + 30 * 60 * 1000)
  }

  const handlePaymentSubmit = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      alert(`Pagamento do plano ${PLANS.find(p => p.id === selectedPlan)?.name} via ${paymentMethod === 'pix' ? 'PIX' : 'Cartão'} processado com sucesso!`)
    }, 2000)
  }

  const formatExpiryDate = (value: string) => {
    if (value.length === 2 && !value.includes('/')) {
      return `${value}/`
    }
    return value
  }

  const selectedPlanData = PLANS.find(p => p.id === selectedPlan)

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <NavbarAdm />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-800 transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Dashboard
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Realizar <span className="text-emerald-600">Pagamento</span>
            </h1>
            <p className="text-gray-600">
              Selecione o método de pagamento para continuar com sua assinatura.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-emerald-600" />
                      Método de Pagamento
                    </CardTitle>
                    <CardDescription>
                      Escolha como deseja pagar sua assinatura
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('plan-selector')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Trocar Plano
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup 
                  defaultValue="pix" 
                  className="space-y-4"
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-emerald-50 transition-colors">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex items-center w-full cursor-pointer">
                      <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600 mr-4">
                        <QrCode className="h-6 w-6" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">PIX</h3>
                        <p className="text-sm text-gray-500">Pagamento instantâneo e sem taxas</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-emerald-50 transition-colors">
                    <RadioGroupItem value="credit" id="credit" />
                    <Label htmlFor="credit" className="flex items-center w-full cursor-pointer">
                      <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600 mr-4">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">Cartão de Crédito</h3>
                        <p className="text-sm text-gray-500">Pague com seu cartão</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "pix" ? (
                  <div className="p-6 border rounded-lg bg-emerald-50">
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-4 rounded-lg border border-emerald-200 mb-4">
                        <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                          <QrCode className="h-32 w-32 text-emerald-600" />
                        </div>
                      </div>
                      
                      <div className="w-full space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Código PIX:</span>
                          <span className="font-mono text-sm bg-emerald-100 px-2 py-1 rounded">
                            {pixData.code.substring(0, 20)}...
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Validade:</span>
                          <span className="text-sm font-medium">
                            {pixData.expiration.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          Copiar Código PIX
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border rounded-lg bg-emerald-50 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número do Cartão</Label>
                      <Input
                        id="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Nome no Cartão</Label>
                      <Input
                        id="cardName"
                        placeholder="Nome como está no cartão"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Validade (MM/AA)</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/AA"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                          maxLength={5}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-emerald-600" />
                  Resumo do Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div id="plan-selector" className="space-y-2">
                  <Label>Plano Selecionado</Label>
                  <RadioGroup 
                    value={selectedPlan}
                    onValueChange={setSelectedPlan}
                    className="grid grid-cols-3 gap-2"
                  >
                    {PLANS.map(plan => (
                      <div key={plan.id}>
                        <RadioGroupItem value={plan.id} id={plan.id} className="peer sr-only" />
                        <Label
                          htmlFor={plan.id}
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-emerald-50 hover:border-emerald-300 peer-data-[state=checked]:border-emerald-600 [&:has([data-state=checked])]:border-emerald-600 cursor-pointer"
                        >
                          <span className="font-medium">{plan.name}</span>
                          <span className="text-emerald-600 font-bold">R$ {plan.price.toFixed(2)}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Separator className="my-2" />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plano</span>
                    <span className="font-medium">{selectedPlanData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor</span>
                    <span className="font-bold text-emerald-600">R$ {selectedPlanData?.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vencimento</span>
                    <span className="font-medium">20/07/2025</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total</span>
                    <span className="font-bold text-lg text-emerald-600">R$ {selectedPlanData?.price.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </span>
                  ) : (
                    `Pagar com ${paymentMethod === 'pix' ? 'PIX' : 'Cartão'}`
                  )}
                </Button>

                <p className="text-xs text-gray-500 mt-4">
                  {paymentMethod === "pix" 
                    ? "O pagamento via PIX é processado instantaneamente."
                    : "Seu cartão será cobrado imediatamente."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}