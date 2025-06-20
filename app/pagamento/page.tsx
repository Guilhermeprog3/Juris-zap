"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, QrCode, Shield, CheckCircle, Copy, Clock, Star, Crown, Zap } from "lucide-react"
import { pagamentoCartaoSchema, type PagamentoCartaoFormData } from "@/lib/validations"

export default function PagamentoPage() {
  const [metodoPagamento, setMetodoPagamento] = useState<"cartao" | "pix">("cartao")
  const [isLoading, setIsLoading] = useState(false)
  const [pixGerado, setPixGerado] = useState(false)
  const [tempoRestante, setTempoRestante] = useState(900) // 15 minutos
  const searchParams = useSearchParams()
  const planoSelecionado = searchParams.get("plano") || "estudante"

  const planos = {
    basico: {
      nome: "Básico",
      preco: "R$ 19,90",
      icon: Zap,
      color: "from-green-400 to-green-600",
    },
    estudante: {
      nome: "Estudante",
      preco: "R$ 29,90",
      icon: Star,
      color: "from-blue-400 to-blue-600",
    },
    profissional: {
      nome: "Profissional",
      preco: "R$ 59,90",
      icon: Crown,
      color: "from-purple-400 to-purple-600",
    },
  }

  const plano = planos[planoSelecionado as keyof typeof planos] || planos.estudante

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PagamentoCartaoFormData>({
    resolver: zodResolver(pagamentoCartaoSchema),
  })

  // Timer para PIX
  useEffect(() => {
    if (pixGerado && tempoRestante > 0) {
      const timer = setInterval(() => {
        setTempoRestante((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [pixGerado, tempoRestante])

  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60)
    const segs = segundos % 60
    return `${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`
  }

  const formatarCartao = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
  }

  const formatarValidade = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length >= 2) {
      return numbers.replace(/(\d{2})(\d{0,2})/, "$1/$2")
    }
    return numbers
  }

  const formatarCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatarCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{5})(\d{3})/, "$1-$2")
  }

  const onSubmitCartao = async (data: PagamentoCartaoFormData) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      console.log("Pagamento com cartão:", data)
      // Redirecionar para sucesso
    } catch (error) {
      console.error("Erro no pagamento:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const gerarPix = () => {
    setPixGerado(true)
    setTempoRestante(900)
  }

  const copiarCodigoPix = () => {
    const codigo =
      "00020126580014BR.GOV.BCB.PIX013636c4b8e8-7b8a-4c5d-9f2e-1a2b3c4d5e6f520400005303986540529.905802BR5925JURISZAP TECNOLOGIA LTDA6009SAO PAULO62070503***6304ABCD"
    navigator.clipboard.writeText(codigo)
  }

  const IconComponent = plano.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/cadastro"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Voltar ao Cadastro
            </Link>
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Finalizar Pagamento
              </h1>
              <p className="text-gray-600 text-lg">Complete sua assinatura para começar a usar o JurisZap</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Resumo do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                    <div className="relative z-10">
                      <IconComponent className="h-8 w-8 mx-auto mb-3" />
                      <h3 className="text-xl font-bold">Plano {plano.nome}</h3>
                      <p className="text-3xl font-bold mt-2">{plano.preco}</p>
                      <p className="text-sm text-blue-100 mt-1">por mês</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold">{plano.preco}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Desconto:</span>
                      <span className="font-semibold text-green-600">R$ 0,00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-blue-600">{plano.preco}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm font-semibold text-blue-800">Garantia de 7 dias</span>
                    </div>
                    <p className="text-xs text-blue-700">
                      Cancele a qualquer momento nos primeiros 7 dias e receba reembolso integral.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulário de Pagamento */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Método de Pagamento</CardTitle>
                  <CardDescription>Escolha como deseja pagar sua assinatura</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={metodoPagamento} onValueChange={(value) => setMetodoPagamento(value as any)}>
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                      <TabsTrigger value="cartao" className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Cartão de Crédito</span>
                      </TabsTrigger>
                      <TabsTrigger value="pix" className="flex items-center space-x-2">
                        <QrCode className="h-4 w-4" />
                        <span>PIX</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="cartao" className="space-y-6">
                      <form onSubmit={handleSubmit(onSubmitCartao)} className="space-y-6">
                        {/* Dados do Cartão */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Dados do Cartão</h3>

                          <div className="space-y-2">
                            <Label htmlFor="nomeCartao">Nome no Cartão</Label>
                            <Input
                              id="nomeCartao"
                              placeholder="Nome como está no cartão"
                              {...register("nomeCartao")}
                              className={errors.nomeCartao ? "border-red-500" : ""}
                            />
                            {errors.nomeCartao && <p className="text-sm text-red-500">{errors.nomeCartao.message}</p>}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="numeroCartao">Número do Cartão</Label>
                            <Input
                              id="numeroCartao"
                              placeholder="1234 5678 9012 3456"
                              {...register("numeroCartao")}
                              onChange={(e) => {
                                const formatted = formatarCartao(e.target.value)
                                setValue("numeroCartao", formatted)
                              }}
                              className={errors.numeroCartao ? "border-red-500" : ""}
                              maxLength={19}
                            />
                            {errors.numeroCartao && (
                              <p className="text-sm text-red-500">{errors.numeroCartao.message}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="validade">Validade</Label>
                              <Input
                                id="validade"
                                placeholder="MM/AA"
                                {...register("validade")}
                                onChange={(e) => {
                                  const formatted = formatarValidade(e.target.value)
                                  setValue("validade", formatted)
                                }}
                                className={errors.validade ? "border-red-500" : ""}
                                maxLength={5}
                              />
                              {errors.validade && <p className="text-sm text-red-500">{errors.validade.message}</p>}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                {...register("cvv")}
                                className={errors.cvv ? "border-red-500" : ""}
                                maxLength={4}
                              />
                              {errors.cvv && <p className="text-sm text-red-500">{errors.cvv.message}</p>}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                              id="cpf"
                              placeholder="123.456.789-01"
                              {...register("cpf")}
                              onChange={(e) => {
                                const formatted = formatarCPF(e.target.value)
                                setValue("cpf", formatted)
                              }}
                              className={errors.cpf ? "border-red-500" : ""}
                              maxLength={14}
                            />
                            {errors.cpf && <p className="text-sm text-red-500">{errors.cpf.message}</p>}
                          </div>
                        </div>

                        <Separator />

                        {/* Endereço de Cobrança */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Endereço de Cobrança</h3>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="cep">CEP</Label>
                              <Input
                                id="cep"
                                placeholder="12345-678"
                                {...register("endereco.cep")}
                                onChange={(e) => {
                                  const formatted = formatarCEP(e.target.value)
                                  setValue("endereco.cep", formatted)
                                }}
                                className={errors.endereco?.cep ? "border-red-500" : ""}
                                maxLength={9}
                              />
                              {errors.endereco?.cep && (
                                <p className="text-sm text-red-500">{errors.endereco.cep.message}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="estado">Estado</Label>
                              <Input
                                id="estado"
                                placeholder="SP"
                                {...register("endereco.estado")}
                                className={errors.endereco?.estado ? "border-red-500" : ""}
                                maxLength={2}
                              />
                              {errors.endereco?.estado && (
                                <p className="text-sm text-red-500">{errors.endereco.estado.message}</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cidade">Cidade</Label>
                            <Input
                              id="cidade"
                              placeholder="São Paulo"
                              {...register("endereco.cidade")}
                              className={errors.endereco?.cidade ? "border-red-500" : ""}
                            />
                            {errors.endereco?.cidade && (
                              <p className="text-sm text-red-500">{errors.endereco.cidade.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bairro">Bairro</Label>
                            <Input
                              id="bairro"
                              placeholder="Centro"
                              {...register("endereco.bairro")}
                              className={errors.endereco?.bairro ? "border-red-500" : ""}
                            />
                            {errors.endereco?.bairro && (
                              <p className="text-sm text-red-500">{errors.endereco.bairro.message}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 space-y-2">
                              <Label htmlFor="rua">Endereço</Label>
                              <Input
                                id="rua"
                                placeholder="Rua das Flores"
                                {...register("endereco.rua")}
                                className={errors.endereco?.rua ? "border-red-500" : ""}
                              />
                              {errors.endereco?.rua && (
                                <p className="text-sm text-red-500">{errors.endereco.rua.message}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="numero">Número</Label>
                              <Input
                                id="numero"
                                placeholder="123"
                                {...register("endereco.numero")}
                                className={errors.endereco?.numero ? "border-red-500" : ""}
                              />
                              {errors.endereco?.numero && (
                                <p className="text-sm text-red-500">{errors.endereco.numero.message}</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="complemento">Complemento (opcional)</Label>
                            <Input id="complemento" placeholder="Apto 101" {...register("endereco.complemento")} />
                          </div>
                        </div>

                        <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                          {isLoading ? "Processando..." : `Pagar ${plano.preco}`}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="pix" className="space-y-6">
                      {!pixGerado ? (
                        <div className="text-center space-y-6">
                          <div className="p-8">
                            <QrCode className="h-24 w-24 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Pagamento via PIX</h3>
                            <p className="text-gray-600 mb-6">
                              Clique no botão abaixo para gerar o código PIX e finalizar seu pagamento
                            </p>
                            <Button onClick={gerarPix} className="w-full h-12 text-lg">
                              Gerar Código PIX
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="text-center">
                            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full mb-4">
                              <Clock className="h-4 w-4" />
                              <span className="font-semibold">Tempo restante: {formatarTempo(tempoRestante)}</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">PIX Gerado com Sucesso!</h3>
                            <p className="text-gray-600">Escaneie o QR Code ou copie o código para pagar</p>
                          </div>

                          <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-gray-300 text-center">
                            <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                              <QrCode className="h-24 w-24 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500">QR Code PIX</p>
                          </div>

                          <div className="space-y-3">
                            <Label>Código PIX (Copia e Cola)</Label>
                            <div className="flex space-x-2">
                              <Input
                                value="00020126580014BR.GOV.BCB.PIX013636c4b8e8-7b8a-4c5d-9f2e-1a2b3c4d5e6f520400005303986540529.905802BR5925JURISZAP TECNOLOGIA LTDA6009SAO PAULO62070503***6304ABCD"
                                readOnly
                                className="font-mono text-xs"
                              />
                              <Button onClick={copiarCodigoPix} variant="outline" size="icon">
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="bg-blue-50 p-4 rounded-xl">
                            <h4 className="font-semibold text-blue-800 mb-2">Como pagar:</h4>
                            <ol className="text-sm text-blue-700 space-y-1">
                              <li>1. Abra o app do seu banco</li>
                              <li>2. Escolha a opção PIX</li>
                              <li>3. Escaneie o QR Code ou cole o código</li>
                              <li>4. Confirme o pagamento</li>
                            </ol>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
