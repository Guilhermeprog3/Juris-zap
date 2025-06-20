"use client"
import { useState, useEffect } from "react"
// Adicionado o Controller
import { useForm, Controller } from "react-hook-form" 
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, CheckCircle, Bot, Loader2 } from "lucide-react"
import { cadastroSchema, type CadastroFormData } from "@/lib/validations"

const planosDisponiveis = {
  basico: "Básico - Gratuito",
  essencial_mensal: "Essencial - R$ 9,90/mês",
  essencial_anual: "Essencial - R$ 99,00/ano",
  aprova: "Aprova - R$ 19,90/mês",
}

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const planoInicial = searchParams.get("plano")
  const planoValido = planoInicial && Object.keys(planosDisponiveis).includes(planoInicial) ? planoInicial : "essencial_mensal"

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    // Extraído o "control" para usar com o Controller
    control, 
    formState: { errors },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      plano: planoValido as any,
      aceitaTermos: false,
    },
  })

  useEffect(() => {
    setValue("plano", planoValido as any)
  }, [planoValido, setValue])

  const watchedPlano = watch("plano")

  const formatTelefone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15)
  }

  const onSubmit = async (data: CadastroFormData) => {
    setIsLoading(true)
    console.log("Enviando dados para a API:", data)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    router.push(`/pagamento?plano=${data.plano}`)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-teal-50 flex flex-col">
      <Navbar />
      <main className="w-full flex-grow grid grid-cols-1 lg:grid-cols-2">
        
        <div className="flex flex-col justify-center items-start text-left p-8 md:p-12 lg:p-24">
          <div className="w-full max-w-md">
            <div className="flex items-center space-x-2 mb-4">
              <Bot className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">JurisZap</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-green-900 mb-6 tracking-tight">
              Sua jornada jurídica começa aqui.
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Ao criar sua conta, você terá acesso a uma poderosa ferramenta de IA para transformar seus estudos e sua prática.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                Resumos de textos, documentos e imagens.
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                Auxílio inteligente na resolução de exercícios.
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                Integração total com o WhatsApp.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center p-8 bg-white/50 lg:bg-transparent">
          <div className="w-full max-w-md">
            <Card className="bg-white/70 backdrop-blur-xl border-gray-200/50 shadow-lg rounded-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Crie sua Conta</CardTitle>
                <CardDescription>É rápido, fácil e seguro.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input id="nome" {...register("nome")} className={errors.nome ? "border-red-500" : ""} />
                    {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" {...register("email")} className={errors.email ? "border-red-500" : ""} />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                  </div>

                  {/* CAMPO DE TELEFONE CORRIGIDO COM CONTROLLER */}
                  <div className="space-y-2">
                    <Label htmlFor="telefone">WhatsApp</Label>
                    <Controller
                      name="telefone"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="telefone"
                          type="tel"
                          placeholder="(XX) XXXXX-XXXX"
                          onChange={(e) => {
                            const formatted = formatTelefone(e.target.value);
                            // Atualiza o valor no campo e no estado do react-hook-form
                            field.onChange(formatted);
                          }}
                          className={errors.telefone ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.telefone && <p className="text-sm text-red-500">{errors.telefone.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha</Label>
                    <div className="relative">
                      <Input id="senha" type={showPassword ? "text" : "password"} {...register("senha")} className={`pr-10 ${errors.senha ? "border-red-500" : ""}`} />
                      <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.senha && <p className="text-sm text-red-500">{errors.senha.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                    <div className="relative">
                       <Input id="confirmarSenha" type={showConfirmPassword ? "text" : "password"} {...register("confirmarSenha")} className={`pr-10 ${errors.confirmarSenha ? "border-red-500" : ""}`} />
                       <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.confirmarSenha && <p className="text-sm text-red-500">{errors.confirmarSenha.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plano">Plano</Label>
                    <Select value={watchedPlano} onValueChange={(value) => setValue("plano", value as any)}>
                      <SelectTrigger className={errors.plano ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecione um plano" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(planosDisponiveis).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-start space-x-3 pt-2">
                    <Checkbox id="termos" onCheckedChange={(checked) => setValue("aceitaTermos", checked as boolean)} />
                    <div className="grid gap-1.5 leading-none">
                       <Label htmlFor="termos" className="text-sm font-normal">
                         Eu li e aceito os{" "}
                         <Link href="/termos" className="text-green-600 hover:underline">Termos de Uso</Link> e a{" "}
                         <Link href="/privacidade" className="text-green-600 hover:underline">Política de Privacidade</Link>.
                       </Label>
                       {errors.aceitaTermos && <p className="text-sm text-red-500">{errors.aceitaTermos.message}</p>}
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 font-semibold text-base" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Criando conta..." : "Criar e ir para Pagamento"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="font-semibold text-green-600 hover:underline">
                      Fazer login
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}