"use client"
import { useState, useEffect, Suspense } from "react"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Bot, Loader2, AlertTriangle, Gift, Rocket, Phone } from "lucide-react"
import { cadastroSemSenhaSchema, type CadastroSemSenhaFormData } from "@/lib/validations"
import { httpsCallable } from "firebase/functions"
import { functions } from "@/lib/firebase"
import { loadStripe } from '@stripe/stripe-js'
import { toast } from "sonner"


const planosDisponiveis = {
  basico: "Basico - R$ 9,90/mês",
  essencial: "Essencial - R$ 19,90/mês",
  ultra: "Ultra - R$ 49,90/mês",
};

const planosStripe = {
  basico: "price_1RgChRKr3wtpRgdkn0YDJ7b1",
  essencial: "price_1RgCq1Kr3wtpRgdkCLC4Y7tk",
  ultra: "price_1RrOYxKr3wtpRgdkBap8B42k",
};

type PlanoKey = keyof typeof planosDisponiveis;

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CadastroPageComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const planoInicial = searchParams.get("plano")

  const isPlanoValido = (plano: string | null): plano is PlanoKey => {
    return plano !== null && Object.keys(planosDisponiveis).includes(plano);
  }
  
  const planoValido: PlanoKey = isPlanoValido(planoInicial) ? planoInicial : "essencial";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CadastroSemSenhaFormData>({
    resolver: zodResolver(cadastroSemSenhaSchema),
    defaultValues: {
      plano: planoValido,
      nome: "",
      email: "",
      telefone: "",
    },
  })

  useEffect(() => {
    setValue("plano", planoValido)
  }, [planoValido, setValue])

  const watchedPlano = watch("plano")

  const formatTelefone = (value: string) => {
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.startsWith("55")) {
      cleaned = cleaned.substring(2);
    }
    if (cleaned.length > 10) {
      cleaned = cleaned.substring(0, 10);
    }
    let formatted = "+55";
    if (cleaned.length > 0) {
      formatted += ` ${cleaned.slice(0, 2)}`;
    }
    if (cleaned.length > 2) {
      formatted += ` ${cleaned.slice(2)}`;
    }
    return formatted;
  };
  
  const onSubmit: SubmitHandler<CadastroSemSenhaFormData> = async (data) => {
    setIsLoading(true);
    const telefoneNumerico = `+${data.telefone.replace(/\D/g, "")}`;

    try {
        const functionUrl = "https://getuserstatusbyphone-q6s4qc63ta-uc.a.run.app";
        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: data.email, telefone: telefoneNumerico }),
        });
        const resultData = await response.json();
        if (!response.ok) {
            throw new Error(resultData.error?.message || 'Erro ao verificar os seus dados.');
        }

        if (resultData.exists) {
            toast.error(resultData.message || "Você já possui uma conta. Por favor, faça login.");
            setIsLoading(false);
            return;
        }
    } catch (error: any) {
        toast.error(error.message || "Erro de comunicação ao verificar seus dados. Tente novamente.");
        setIsLoading(false);
        return;
    }

    const priceId = planosStripe[data.plano];

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
            telefone: telefoneNumerico,
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
            <div className="mt-4 p-4 bg-sky-100/60 border-l-4 border-sky-500 text-sky-900 rounded-r-lg">
                <div className="flex">
                    <div className="py-1">
                        <Phone className="h-6 w-6 text-sky-500 mr-3 flex-shrink-0" />
                    </div>
                    <div>
                        <p className="font-bold">Formato do WhatsApp</p>
                        <p className="text-sm">Utilize o formato +55 com DDD, seguido do seu número. Ex: +55 99 12345678</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center p-8 bg-white/50 lg:bg-transparent">
          <div className="w-full max-w-md">
            <Card className="bg-white/70 backdrop-blur-xl border-gray-200/50 shadow-lg rounded-2xl overflow-hidden">
              <div className="w-full p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center">
                  <div className="flex items-center justify-center">
                      <Gift className="h-6 w-6 mr-3" />
                      <p className="font-bold text-lg">Comece seu Teste Gratuito de 7 Dias no plano Essencial!</p>
                  </div>
              </div>
              <CardHeader className="text-center pt-6">
                <CardTitle className="text-2xl">Crie sua Conta</CardTitle>
                <CardDescription>Sem compromisso. Cancele a qualquer momento.</CardDescription>
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
                    <Controller name="telefone" control={control} render={({ field }) => ( <Input {...field} id="telefone" type="tel" placeholder="+55 99 99999999" onChange={(e) => field.onChange(formatTelefone(e.target.value))} className={errors.telefone ? "border-red-500" : ""} /> )} />
                    {errors.telefone && <p className="text-sm text-red-500">{errors.telefone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plano">Plano</Label>
                    <Select value={watchedPlano} onValueChange={(value) => setValue("plano", value as PlanoKey)}>
                      <SelectTrigger className={errors.plano ? "border-red-500" : ""}><SelectValue placeholder="Selecione um plano" /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(planosDisponiveis).map(([value, label]) => ( <SelectItem key={value} value={value}>{label}</SelectItem> ))}
                      </SelectContent>
                    </Select>
                    {errors.plano && <p className="text-sm text-red-500">{errors.plano.message}</p>}
                  </div>                  <Button type="submit" className="w-full text-lg h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-bold text-white shadow-lg hover:shadow-xl transition-shadow" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Rocket className="mr-2 h-5 w-5" />}
                    {isLoading ? "Aguarde..." : watchedPlano === 'essencial' ? "Ativar meus 7 Dias Grátis!" : "Assinar Agora"}
                  </Button>
                </form>
                <div className="mt-4 text-center text-xs text-gray-500 p-2 bg-gray-100 rounded-md">
                  <p>
                    {watchedPlano === 'essencial'
                      ? "Você não será cobrado hoje. O cadastro do cartão é apenas para garantir a continuidade do serviço após o teste. A assinatura de " + planosDisponiveis[watchedPlano].split('-')[1].trim() + " iniciará automaticamente em 7 dias, a menos que seja cancelada."
                      : "A cobrança do plano selecionado será realizada no momento da assinatura."
                    }
                  </p>
                </div>
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

export default function CadastroPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CadastroPageComponent />
    </Suspense>
  )
}