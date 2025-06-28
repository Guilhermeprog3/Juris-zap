"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { NavbarAdm } from "@/components/navbar_adm"
import { useAuth } from "@/app/context/authcontext"
import { db, app } from "@/lib/firebase" 
import { getFunctions, httpsCallable } from "firebase/functions"
import { collection, getDocs } from "firebase/firestore"
import { toast } from "sonner"
import { ArrowLeft, Gem, Loader2, AlertTriangle, LucideIcon, Scale, Gavel, Leaf, Zap } from "lucide-react"
import { AuthLoader } from "@/components/auth-provider"
import { loadStripe } from "@stripe/stripe-js"

interface Plan {
  id: string;
  nome: string;
  preco: number;
  periodo: string;
  recursos: string[];
  icon: LucideIcon;
}

const planIcons: { [key: string]: LucideIcon } = {
  essencial_mensal: Scale,
  aprova_mensal: Gavel,
  default: Gem
};

export default function GerenciarPlanosPage() {
  const { user, loading: authLoading } = useAuth();
  const [planosDisponiveis, setPlanosDisponiveis] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isToppingUp, setIsToppingUp] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansCollectionRef = collection(db, "planos");
        const snapshot = await getDocs(plansCollectionRef);
        const plansList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          icon: planIcons[doc.id] || planIcons.default,
        })) as Plan[];
        setPlanosDisponiveis(plansList);
      } catch (error) {
        toast.error("Erro ao carregar os planos.");
      } finally {
        setIsLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const handleManageSubscription = async () => {
    setIsRedirecting(true);
    try {
      const functions = getFunctions(app);
      const createPortalSession = httpsCallable(functions, 'createCustomerPortalSession');
      const response = await createPortalSession();
      const { url } = response.data as { url: string };
      window.location.href = url;
    } catch (error) {
      toast.error("Não foi possível acessar o portal de gerenciamento.");
      setIsRedirecting(false);
    }
  };

  const handleTopUp = async () => {
    setIsToppingUp(true);
    try {
      const functions = getFunctions(app);
      const createTopUp = httpsCallable(functions, 'createTopUpSession');
      const amountInCents = 5000; // R$ 50,00
      const result = await createTopUp({ amount: amountInCents });
      const { sessionId } = result.data as { sessionId: string };
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (stripe) await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      toast.error("Não foi possível adicionar créditos.");
    } finally {
      setIsToppingUp(false);
    }
  };
 
  if (authLoading || isLoadingPlans || !user) {
    return <AuthLoader />;
  }

  const planoAtualDetalhes = planosDisponiveis.find(p => p.id === user.planoId);
 
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <NavbarAdm />
      <div className="container mx-auto px-4 py-8">
        
        {user.statusAssinatura === 'pagamento_atrasado' && (
            <div className="p-4 mb-8 text-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-lg shadow-md">
                <div className="flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 mr-3" />
                    <div>
                        <p className="font-bold">Atenção: Pagamento Pendente</p>
                        <p className="text-sm">Atualize seus dados de pagamento para reativar o acesso completo.</p>
                    </div>
                </div>
            </div>
        )}

        <div className="mb-12">
          <Link href="/dashboard" className="inline-flex items-center text-emerald-600 hover:text-emerald-800 transition-colors mb-6 group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Dashboard
          </Link>
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Gerenciar <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Plano</span></h1>
            <p className="text-gray-600 max-w-2xl">Explore opções que se adaptam ao seu crescimento na carreira jurídica. Atualize seu plano a qualquer momento.</p>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
              <CardHeader>
                  <CardTitle className="flex items-center text-lg"><Gem className="h-5 w-5 text-emerald-600 mr-3" />Seu Plano Atual: {planoAtualDetalhes?.nome || 'N/A'}</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-gray-600">Para alterar seu plano, atualizar método de pagamento, ou cancelar sua assinatura, utilize nosso portal seguro.</p>
              </CardContent>
              <CardFooter>
                  <Button onClick={handleManageSubscription} disabled={isRedirecting} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                      {isRedirecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Gerenciar Assinatura"}
                  </Button>
              </CardFooter>
            </Card>
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 w-full"></div>
                <CardHeader>
                    <CardTitle className="flex items-center text-lg"><Zap className="h-5 w-5 text-cyan-600 mr-3" />Adiantar Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">Adicione créditos à sua conta para serem usados no pagamento automático das suas próximas faturas.</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleTopUp} disabled={isToppingUp} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                        {isToppingUp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Adicionar R$ 50,00'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  )
}
