"use client"
import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form" 
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Bot, Loader2, AlertTriangle } from "lucide-react"
import { cadastroSemSenhaSchema, type CadastroSemSenhaFormData } from "@/lib/validations" 
import { httpsCallable } from "firebase/functions"
import { functions } from "@/lib/firebase" 
import { loadStripe } from '@stripe/stripe-js'
import { toast } from "sonner"

const planosStripe = {
  basico: "price_1RgCq1Kr3wtpRgdkCLC4Y7tk",
  essencial_mensal: "price_1RgChRKr3wtpRgdkn0YDJ7b1",
  aprova_mensal: "price_1RgBxqKr3wtpRgdko5aJtiis",
};
const planosDisponiveis = {
  basico: "Básico - R$ 19,90/mês",
  essencial_mensal: "Essencial - R$ 9,90/mês",
  aprova_mensal: "Aprova+ - R$ 39,90/mês",
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CadastroPage() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const planoInicial = searchParams.get("plano")
  const planoValido = planoInicial && Object.keys(planosDisponiveis).includes(planoInicial) ? planoInicial : "essencial_mensal"

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control, 
    formState: { errors },
  } = useForm<CadastroSemSenhaFormData>({
    resolver: zodResolver(cadastroSemSenhaSchema),
    defaultValues: { plano: planoValido },
  })

  useEffect(() => {
    setValue("plano", planoValido)
  }, [planoValido, setValue])

  const watchedPlano = watch("plano")

  const formatTelefone = (value: string) => {
    return value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").substring(0, 15)
  }

  const onSubmit = async (data: CadastroSemSenhaFormData) => {
    setIsLoading(true);

    try {
        const checkUser = httpsCallable(functions, 'checkUserExists');
        const userCheckResult = await checkUser({ email: data.email, telefone: data.telefone });
        const resultData = userCheckResult.data as { exists: boolean, message?: string };

        if (resultData.exists) {
            toast.error(resultData.message || "Já existe uma conta com este e-mail ou telefone.");
            setIsLoading(false);
            return;
        }
    } catch (error: any) {
        toast.error(error.message || "Erro ao verificar os seus dados. Tente novamente.");
        setIsLoading(false);
        return;
    }

    const priceId = planosStripe[data.plano as keyof typeof planosStripe];

    if (!priceId) {
        toast.error("Plano selecionado inválido. Por favor, escolha outro plano.");
        setIsLoading(false);
        return;
    }
    
    try {
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe.js não foi carregado.");

        const createStripeCheckoutSession = httpsCallable(functions, 'createStripeCheckoutSession');
        
        const checkoutResponse = await createStripeCheckoutSession({ 
            priceId,
            email: data.email,
            nome: data.nome,
            telefone: data.telefone,
        });
        
        const { sessionId } = checkoutResponse.data as { sessionId: string };
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
            toast.error(error.message || "Erro ao redirecionar para o pagamento.");
        }
    } catch (error: any) {
        toast.error(error.message || "Não foi possível iniciar o pagamento. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-4xl lg:text-5xl font-extrabold text-green-900 mb-6 tracking-tight">Sua jornada jurídica começa aqui.</h1>
            <p className="text-lg text-gray-600 mb-8">Ao criar sua conta, você terá acesso a uma poderosa ferramenta de IA para transformar seus estudos e sua prática.</p>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-700"><CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />Resumos de textos, documentos e imagens.</li>
              <li className="flex items-center text-gray-700"><CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />Auxílio inteligente na resolução de exercícios.</li>
              <li className="flex items-center text-gray-700"><CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />Integração total com o WhatsApp.</li>
            </ul>
            <div className="mt-8 p-4 bg-amber-100/60 border-l-4 border-amber-500 text-amber-900 rounded-r-lg">
                <div className="flex">
                    <div className="py-1">
                        <AlertTriangle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0" />
                    </div>
                    <div>
                        <p className="font-bold">Atenção</p>
                        <p className="text-sm">Use um e-mail que você tenha acesso. Ele será seu principal meio de login e recuperação de conta.</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center p-8 bg-white/50 lg:bg-transparent">
          <div className="w-full max-w-md">
            <Card className="bg-white/70 backdrop-blur-xl border-gray-200/50 shadow-lg rounded-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Crie sua Conta</CardTitle>
                <CardDescription>É rápido e seguro. O pagamento é o próximo passo.</CardDescription>
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
                  <div className="space-y-2">
                    <Label htmlFor="telefone">WhatsApp</Label>
                    <Controller name="telefone" control={control} render={({ field }) => ( <Input {...field} id="telefone" type="tel" placeholder="(XX) XXXXX-XXXX" onChange={(e) => field.onChange(formatTelefone(e.target.value))} className={errors.telefone ? "border-red-500" : ""} /> )} />
                    {errors.telefone && <p className="text-sm text-red-500">{errors.telefone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plano">Plano</Label>
                    <Select value={watchedPlano} onValueChange={(value) => setValue("plano", value)}>
                      <SelectTrigger className={errors.plano ? "border-red-500" : ""}><SelectValue placeholder="Selecione um plano" /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(planosDisponiveis).map(([value, label]) => ( <SelectItem key={value} value={value}>{label}</SelectItem> ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 font-semibold text-base" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Aguarde..." : "Continuar para o Pagamento"}
                  </Button>
                </form>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">Já tem uma conta? <Link href="/login" className="font-semibold text-green-600 hover:underline">Fazer login</Link></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
