"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { NavbarAdm } from "@/components/navbar_adm"
import { useAuth } from "@/app/context/authcontext"
import { functions } from "@/lib/firebase"
import { httpsCallable } from "firebase/functions"
import { toast } from "sonner"
import { AlertTriangle, CreditCard, Loader2 } from "lucide-react"

export default function PagamentoPendentePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redireciona se o usuário não estiver com pagamento pendente
  if (user && user.statusAssinatura !== 'pagamento_atrasado') {
    router.replace('/dashboard');
    return null; // Renderiza nada enquanto redireciona
  }

  const handleManageSubscription = async () => {
    setIsRedirecting(true);
    try {
      const createPortalSession = httpsCallable(functions, 'createCustomerPortalSession');
      const response = await createPortalSession();
      const { url } = response.data as { url: string };
      window.location.href = url;
    } catch (error) {
      toast.error("Não foi possível acessar o portal de gerenciamento. Contate o suporte.");
      setIsRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50 flex flex-col">
      <NavbarAdm />
      <main className="w-full flex-grow flex justify-center items-center p-4">
        <Card className="w-full max-w-lg bg-white/80 backdrop-blur-xl border-amber-200/50 shadow-2xl rounded-2xl">
          <CardHeader className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
            <CardTitle className="text-2xl mt-4 text-amber-900">Pagamento Pendente</CardTitle>
            <CardDescription className="text-amber-800 text-base">
              Sua assinatura está com o pagamento atrasado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-gray-700">
              Para continuar utilizando todos os recursos do JurisZap, por favor, atualize suas informações de pagamento.
            </p>
            <Button
              size="lg"
              className="w-full text-base font-semibold bg-amber-500 hover:bg-amber-600 text-white"
              onClick={handleManageSubscription}
              disabled={isRedirecting}
            >
              {isRedirecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />}
              Atualizar Pagamento
            </Button>
            <p className="text-xs text-center text-gray-500">
              Você será redirecionado para nosso portal de pagamentos seguro para atualizar seus dados.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
             <Link href="/dashboard" className="text-sm text-gray-600 hover:underline">
                Voltar ao Dashboard
             </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}