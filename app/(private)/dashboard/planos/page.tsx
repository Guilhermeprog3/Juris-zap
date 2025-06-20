"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft, Calendar, CheckCircle, AlertTriangle, Scale, Gavel, X, LucideIcon, Zap, Sparkles, ChevronRight, Gem, Leaf, Loader2
} from "lucide-react"
import { NavbarAdm } from "@/components/navbar_adm"
import { useRequireAuth } from "@/components/auth-provider"
import { AuthLoader } from "@/components/auth-provider"
import { db, auth } from "@/lib/firebase"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"
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

interface InfoBoxProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  color: 'emerald' | 'teal' | 'amber' | 'cyan';
}

const planIcons: { [key: string]: LucideIcon } = {
  basico: Leaf,
  essencial_mensal: Scale,
  aprova_mensal: Gavel,
  default: Gem
};

export default function GerenciarPlanosPage() {
  const { user, userData, loading: authLoading } = useRequireAuth();
  const router = useRouter();

  const [planosDisponiveis, setPlanosDisponiveis] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

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
        console.error(error);
      } finally {
        setIsLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const handleUpdatePlan = async (planoId: string) => {
    if (!user) return;
    setIsUpdating(planoId);
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        planoId: planoId,
        statusAssinatura: "ativo",
        proximoVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      toast.success(`Plano atualizado para ${planoId}!`);
      window.location.reload();
    } catch (error) {
      toast.error("Erro ao atualizar o plano.");
      console.error(error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user) return;
    setIsUpdating('cancel');
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        statusAssinatura: "inativo"
      });
      toast.success("Assinatura cancelada com sucesso.");
      setShowCancelModal(false);
       window.location.reload();
    } catch (error) {
      toast.error("Erro ao cancelar a assinatura.");
      console.error(error);
    } finally {
      setIsUpdating(null);
    }
  };
  
  if (authLoading || isLoadingPlans) {
    return <AuthLoader />;
  }

  const planoAtualDetalhes = planosDisponiveis.find(p => p.id === userData?.planoId);
  const proximoPagamentoDate = userData?.proximoVencimento.toDate();
  const diasRestantes = proximoPagamentoDate ? Math.ceil((proximoPagamentoDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

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
            <p className="text-gray-600 max-w-2xl">Explore opções que se adaptam ao seu crescimento na carreira jurídica. Atualize seu plano a qualquer momento.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <aside className="xl:col-span-1 space-y-8">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center text-lg"><Gem className="h-5 w-5 text-emerald-600 mr-3" />Seu Plano Atual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white relative overflow-hidden shadow-lg">
                  <div className="relative z-10">
                    <Scale className="h-10 w-10 mx-auto mb-3 text-emerald-200" />
                    <h3 className="text-xl font-bold">{planoAtualDetalhes?.nome || 'N/A'}</h3>
                    <p className="text-3xl font-bold mt-2">R$ {planoAtualDetalhes?.preco.toFixed(2) || '0.00'}<span className="text-sm text-emerald-100 font-normal">/mês</span></p>
                    <Badge className="mt-3 bg-white/20 text-white border-0">{userData?.statusAssinatura || 'N/A'}</Badge>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center"><Calendar className="h-4 w-4 mr-2 text-emerald-500" /> Próximo pagamento</span>
                    <div className="text-right">
                      <span className="font-semibold block">{proximoPagamentoDate?.toLocaleDateString("pt-BR", {timeZone: 'UTC'}) || 'N/A'}</span>
                      <span className="text-xs text-gray-500">em {diasRestantes} dias</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-emerald-500" /> Membro desde</span>
                    <span className="font-medium">{userData?.dataCadastro.toDate().toLocaleDateString("pt-BR", {timeZone: 'UTC'}) || 'N/A'}</span>
                  </div>
                </div>

                <Separator />
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700" onClick={() => setShowCancelModal(true)}>Cancelar Assinatura</Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          <main className="xl:col-span-3">
            <div className="mb-10" id="planos-disponiveis">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Escolha o plano ideal para sua <span className="text-emerald-600">carreira jurídica</span></h2>
              <p className="text-gray-600 max-w-3xl">Todos os planos incluem acesso imediato e garantia de satisfação de 7 dias.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {planosDisponiveis.map((plano) => (
                <Card key={plano.id} className={`relative flex flex-col border-0 shadow-lg transition-all duration-300 h-full ${plano.id === userData?.planoId ? "ring-2 ring-emerald-500 bg-emerald-50/30" : "bg-white"}`}>
                  {plano.popular && <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"><Sparkles className="h-3 w-3 mr-1.5" />Mais Popular</Badge>}
                  
                  <CardHeader className="text-center pb-4 pt-9">
                    <div className="flex justify-center mb-4"><PlanIcon icon={plano.icon} /></div>
                    <CardTitle className="text-xl font-bold text-gray-900">{plano.nome}</CardTitle>
                    <div className="mt-2"><span className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">R$ {plano.preco.toFixed(2)}</span><span className="text-gray-500 text-sm">{plano.periodo}</span></div>
                    <CardDescription className="mt-2 text-gray-600">{plano.descricao}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-grow justify-between space-y-6">
                    <div className="space-y-3">
                      {plano.recursos.map((recurso, i) => (
                        <div key={i} className="flex items-start space-x-3"><CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" /><span className="text-sm text-gray-700">{recurso}</span></div>
                      ))}
                    </div>
                    <Button
                      className={`w-full h-12 text-base font-semibold transition-all`}
                      disabled={plano.id === userData?.planoId || !!isUpdating}
                      onClick={() => handleUpdatePlan(plano.id)}
                    >
                      {isUpdating === plano.id ? <Loader2 className="animate-spin" /> : plano.id === userData?.planoId ? "Plano Atual" : "Assinar Agora"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
                <CardHeader><CardTitle>Informações Importantes</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoBox icon={Zap} title="Upgrade Imediato" color="emerald">Ao fazer upgrade, você terá acesso imediato aos novos recursos.</InfoBox>
                    <InfoBox icon={Calendar} title="Downgrade Agendado" color="teal">O downgrade será aplicado no próximo ciclo de cobrança.</InfoBox>
                    <InfoBox icon={AlertTriangle} title="Cancelamento" color="amber">Você pode cancelar quando quiser. Seu acesso permanecerá ativo até o final do período já pago.</InfoBox>
                    <InfoBox icon={Gem} title="Garantia de 7 Dias" color="cyan">Teste qualquer plano pago. Se não gostar, devolvemos seu dinheiro.</InfoBox>
                </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4 border-0 shadow-xl">
            <CardHeader>
                <div className="flex justify-between items-center"><CardTitle>Cancelar Assinatura</CardTitle><Button variant="ghost" size="icon" onClick={() => setShowCancelModal(false)}><X className="h-4 w-4" /></Button></div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600 mt-1">Seu acesso aos serviços será mantido até o final do período já pago ({proximoPagamentoDate?.toLocaleDateString('pt-BR')}). Você poderá reativar sua assinatura a qualquer momento.</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCancelModal(false)}>Manter Assinatura</Button>
              <Button variant="destructive" onClick={handleCancelSubscription} disabled={!!isUpdating}>
                {isUpdating === 'cancel' ? <Loader2 className="animate-spin" /> : "Confirmar Cancelamento"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

function PlanIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
      <Icon className="h-6 w-6 text-white" />
    </div>
  )
}

function InfoBox({ icon: Icon, title, children, color }: InfoBoxProps) {
  const colors = {
    emerald: "from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-800",
    teal: "from-teal-50 to-teal-100 border-teal-200 text-teal-800",
    amber: "from-amber-50 to-amber-100 border-amber-200 text-amber-800",
    cyan: "from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-800",
  } as const;

  const iconColors = {
    emerald: "bg-emerald-100 text-emerald-600",
    teal: "bg-teal-100 text-teal-600",
    amber: "bg-amber-100 text-amber-600",
    cyan: "bg-cyan-100 text-cyan-600",
  } as const;

  return (
    <div className={`p-5 bg-gradient-to-br rounded-xl border ${colors[color]} h-full`}>
      <div className="flex items-center mb-3">
        <div className={`p-2 rounded-lg mr-3 ${iconColors[color]}`}><Icon className="h-5 w-5" /></div>
        <h4 className="font-bold">{title}</h4>
      </div>
      <p className="text-sm leading-relaxed text-gray-700">{children}</p>
    </div>
  )
}