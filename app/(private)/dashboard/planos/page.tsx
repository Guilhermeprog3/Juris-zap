"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft, Calendar, CheckCircle, AlertTriangle, Scale, Gavel, X, LucideIcon, Zap, Sparkles, Gem, Leaf, Loader2
} from "lucide-react"
import { NavbarAdm } from "@/components/navbar_adm"
import { useRequireAuth } from "@/app/context/authcontext"
import { db, functions } from "@/lib/firebase"
import { httpsCallable } from "firebase/functions"
import { collection, getDocs } from "firebase/firestore"
import { toast } from "sonner"

interface Plan {
  id: string;
  nome: string;
  preco: number;
  periodo: string;
  descricao: string;
  popular: boolean;
  recursos: string[];
  icon: LucideIcon;
}

const planIcons: { [key: string]: LucideIcon } = {
  basico: Leaf,
  essencial: Scale,
  ultra: Gavel,
  default: Gem
};

const AuthLoader = () => {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
};

export default function GerenciarPlanosPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [planosDisponiveis, setPlanosDisponiveis] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

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
      const createPortalSession = httpsCallable(functions, 'createCustomerPortalSession');
      const response = await createPortalSession();
      const { url } = response.data as { url: string };
      window.location.href = url;
    } catch (error) {
      toast.error("Não foi possível acessar o portal de gerenciamento.");
      setIsRedirecting(false);
    }
  };

  if (authLoading || isLoadingPlans) {
    return <AuthLoader />;
  }

  const planoAtualDetalhes = planosDisponiveis.find(p => p.id === user?.planoId);
  const proximoPagamentoDate = user?.proximoVencimento?.toDate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <NavbarAdm />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <Link href="/dashboard" className="inline-flex items-center text-emerald-600 hover:text-emerald-800 transition-colors mb-6 group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Dashboard
          </Link>
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Gerenciar <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Plano</span></h1>
            <p className="text-gray-600 max-w-2xl">Para alterar seu plano, atualizar método de pagamento, ou cancelar sua assinatura, utilize nosso portal seguro.</p>
          </div>
        </div>
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden max-w-md mx-auto">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
            <CardHeader>
                <CardTitle className="flex items-center text-lg"><Gem className="h-5 w-5 text-emerald-600 mr-3" />Seu Plano Atual: {planoAtualDetalhes?.nome || 'N/A'}</CardTitle>
                <CardDescription>
                  Status: <Badge variant={user?.statusAssinatura === 'ativo' ? 'default' : 'destructive'}>{user?.statusAssinatura || 'N/A'}</Badge>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center"><Calendar className="h-4 w-4 mr-2 text-emerald-500" /> Próxima cobrança</span>
                  <span className="font-semibold">{proximoPagamentoDate?.toLocaleDateString("pt-BR", {timeZone: 'UTC'}) || 'N/A'}</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleManageSubscription} disabled={isRedirecting} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                    {isRedirecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Gerenciar Assinatura no Portal"}
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  )
}