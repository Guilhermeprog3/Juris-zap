"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle, AlertCircle, MessageSquare, DollarSign, Zap, Phone, Edit, X, Loader2, AlertTriangle } from "lucide-react"
import { NavbarAdm } from "@/components/navbar_adm"
import { useAuth, AuthLoader } from "@/app/context/authcontext"
import { auth, db, functions } from "@/lib/firebase" 
import { doc, updateDoc, collection, query, getDocs, orderBy, limit } from "firebase/firestore"
import { httpsCallable } from "firebase/functions" 
import { toast } from "sonner"
import { Label } from "@/components/ui/label"

type Payment = {
  id: string;
  date: string;
  amount: string;
  status: string;
}

interface Plan { 
  id: string;
  nome: string;
}

interface UpdatePhoneNumberCallableResult {
  data: {
    success: boolean;
    message?: string;
  };
}


const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};

const unformatPhoneNumber = (formattedPhoneNumber: string) => {
  const cleaned = ('' + formattedPhoneNumber).replace(/\D/g, '');
  if (cleaned.length === 11) {
      return `+55${cleaned}`;
  }
  return cleaned;
};


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]); 

  useEffect(() => {
    if (user) {
      setUserPhoneNumber(formatPhoneNumber(user.telefone || ""));
      setNewPhoneNumber(user.telefone || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (user) {
        setLoadingHistory(true);
        try {
          const historyCol = collection(db, 'users', user.uid, 'pagamentos');
          const q = query(historyCol, orderBy('dataPagamento', 'desc'), limit(5));
          const snapshot = await getDocs(q);
          const history = snapshot.docs.map(doc => ({
            id: doc.id,
            amount: `R$ ${doc.data().valor.toFixed(2)}`,
            date: doc.data().dataPagamento.toDate().toLocaleDateString('pt-BR'),
            status: doc.data().status
          })) as Payment[];
          setPaymentHistory(history);
        } catch (error) {
          toast.error("Erro ao carregar histórico de pagamentos.");
          console.error("Fetch Payment History Error:", error);
        } finally {
          setLoadingHistory(false);
        }
      }

      try {
        const plansCollectionRef = collection(db, "planos");
        const plansSnapshot = await getDocs(plansCollectionRef);
        const plansList = plansSnapshot.docs.map(doc => ({
          id: doc.id,
          nome: doc.data().nome 
        })) as Plan[];
        setAvailablePlans(plansList);
      } catch (error) {
        toast.error("Erro ao carregar os planos disponíveis.");
        console.error("Fetch Available Plans Error:", error);
      }
    };

    fetchInitialData();
  }, [user]); 

  const handleSavePhoneNumber = async () => {
    if (!newPhoneNumber.trim()) {
      toast.error("Por favor, insira um número válido.");
      return;
    }
    if (!user) return;

    setIsUpdating(true);
    try {
      const updatePhoneNumberCallable = httpsCallable<
        { uid: string; newPhoneNumber: string }, 
        UpdatePhoneNumberCallableResult['data']
      >(functions, 'updatePhoneNumber');

      const result = await updatePhoneNumberCallable({ 
        uid: user.uid, 
        newPhoneNumber: newPhoneNumber 
      });

      if (result.data.success) { 
        setUserPhoneNumber(formatPhoneNumber(newPhoneNumber)); 
        toast.success(result.data.message || "Número de telefone atualizado!");
        setIsModalOpen(false);
      } else {
        toast.error(result.data.message || "Não foi possível atualizar o número.");
      }

    } catch (error: any) {
      toast.error(error.message || "Não foi possível atualizar o número. Verifique o console para mais detalhes.");
      console.error("Erro ao chamar updatePhoneNumber:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateDaysRemaining = (paymentDate: Date | null) => {
    if (!paymentDate) return 0;
    const nextPayment = new Date(paymentDate); 
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const diffTime = nextPayment.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  if (loading || !user) {
    return <AuthLoader />;
  }

  const isSubscriptionActive = user.statusAssinatura === 'ativo';

  if (!isSubscriptionActive) {
    return (
        <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center">
            <NavbarAdm />
            <div className="flex-grow flex items-center justify-center w-full">
                <Card className="w-full max-w-md mx-4 text-center p-8 bg-white border-red-200 shadow-lg">
                    <CardHeader>
                        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                        <CardTitle className="mt-4 text-2xl text-red-800">Assinatura Pendente</CardTitle>
                        <CardDescription className="mt-2 text-gray-600">
                            {user.statusAssinatura === 'pagamento_atrasado'
                                ? "Seu último pagamento falhou. Por favor, gerencie seus planos para reativar sua conta."
                                : "Sua assinatura está inativa. Renove seu plano para continuar acessando todos os recursos."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/dashboard/planos">
                            <Button className="w-full bg-red-600 hover:bg-red-700">
                                Gerenciar Assinatura
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
  }

  const proximoPagamentoDate = user.proximoVencimento?.toDate() ?? null;
  const daysUntilNextPayment = calculateDaysRemaining(proximoPagamentoDate);
  const isPaymentOverdue = daysUntilNextPayment < 0;
  const isServiceActive = !isPaymentOverdue;

  const currentPlanName = availablePlans.find(plan => plan.id === user.planoId)?.nome || user.planoId || 'N/A';

  const numeroIaWhatsapp = "11 5286-5386";
  const linkWhatsapp = `https://wa.me/55${numeroIaWhatsapp.replace(/\D/g, '')}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <NavbarAdm />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard <span className="text-emerald-600">Jurídico</span>
          </h1>
          <p className="text-gray-600 mt-2">Bem-vindo(a) de volta, {user.nome || 'Usuário'}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
                <CardHeader>
                    <CardTitle className="flex items-center"><Zap className="h-5 w-5 mr-2 text-emerald-600" />Meu Plano</CardTitle>
                    <CardDescription>Visualize os detalhes do seu plano atual.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-emerald-50">
                    <div className="flex flex-col">
                        <p className="text-lg font-semibold text-emerald-800">Plano {currentPlanName}</p> {/* Use currentPlanName here */}
                        <p className="text-sm text-emerald-700">Próximo Pagamento: {proximoPagamentoDate?.toLocaleDateString("pt-BR") || 'N/A'}</p>
                    </div>
                    </div>
                    <Link href="/dashboard/planos">
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                        Gerenciar Assinatura
                    </Button>
                    </Link>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
                <CardHeader>
                    <CardTitle className="flex items-center"><Phone className="h-5 w-5 mr-2 text-emerald-600" />Seu Número de Contato</CardTitle>
                    <CardDescription>Este é o número que você usa para interagir com a IA e acessar sua conta.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-emerald-50">
                    <p className="text-lg font-semibold text-emerald-800">{userPhoneNumber}</p>
                    <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                        <Edit className="h-4 w-4" />Trocar Número
                    </Button>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
                <CardHeader><CardTitle>Histórico de Pagamentos</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    {loadingHistory ? <Loader2 className="mx-auto h-6 w-6 animate-spin" /> : 
                    paymentHistory.length > 0 ? paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-emerald-50 transition-colors">
                        <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <div>
                            <p className="text-sm font-medium">Pagamento - {payment.amount}</p>
                            <p className="text-xs text-gray-500">Data: {payment.date}</p>
                        </div>
                        </div>
                        <span className="text-sm text-emerald-700 font-medium">{payment.status}</span>
                    </div>
                    )) : <p className="text-sm text-gray-500 text-center">Nenhum pagamento registrado ainda.</p>}
                </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
                <CardHeader>
                    <CardTitle className="flex items-center"><AlertCircle className={`h-5 w-5 mr-2 ${isPaymentOverdue ? 'text-red-500' : 'text-emerald-500'}`} />Prazos Próximos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className={`flex items-center justify-between p-3 rounded-lg ${isPaymentOverdue ? 'bg-red-50' : 'bg-emerald-50'}`}>
                    <div>
                        <p className={`text-sm font-medium ${isPaymentOverdue ? 'text-red-800' : 'text-emerald-800'}`}>Pagamento do Plano {currentPlanName}</p> {/* Use currentPlanName here */}
                        <p className={`text-xs ${isPaymentOverdue ? 'text-red-600' : 'text-emerald-600'}`}>
                        {isPaymentOverdue ? `Pagamento vencido há ${Math.abs(daysUntilNextPayment)} dia(s)` : `Vence em ${daysUntilNextPayment} dia(s) (${proximoPagamentoDate?.toLocaleDateString('pt-BR')})`}
                        </p>
                    </div>
                    <DollarSign className={`h-4 w-4 ${isPaymentOverdue ? 'text-red-500' : 'text-emerald-500'}`} />
                    </div>
                    <Button className={`w-full ${isPaymentOverdue ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`} onClick={() => router.push(`/dashboard/planos`)}>
                        {isPaymentOverdue ? 'Regularizar Pagamento Agora' : 'Gerenciar Assinatura'}
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white shadow-xl">
              <CardHeader><CardTitle className="flex items-center text-white"><MessageSquare className="h-5 w-5 mr-2 text-emerald-300" />Atendimento via WhatsApp</CardTitle></CardHeader>
              <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${isServiceActive ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'}`}></div>
                        <span className={`text-sm font-semibold ${isServiceActive ? 'text-white' : 'text-red-200'}`}>{isServiceActive ? "Conectado" : "Desativado"}</span>
                    </div>
                    <p className="text-xs text-emerald-100">{isServiceActive ? "Interaja com nossa IA para obter resumos, responder questões e gerar modelos de petições." : "Serviço pausado. Regularize seu pagamento para reativar o acesso à IA via WhatsApp."}</p>
                    
                    <p className="text-sm font-semibold mt-2 text-emerald-50">
                      Número para contato da IA: {numeroIaWhatsapp}
                    </p>
                    
                    <a href={linkWhatsapp} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="w-full bg-emerald-500/10 border-emerald-300 text-emerald-100 hover:bg-emerald-500/20 hover:text-white">
                            <MessageSquare className="h-4 w-4 mr-2"/>
                            Conversar com a IA
                        </Button>
                    </a>
                  </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4 border-0 shadow-xl">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full"></div>
            <CardHeader>
              <div className="flex justify-between items-center"><CardTitle>Alterar Número de Telefone</CardTitle><Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}><X className="h-4 w-4" /></Button></div>
              <CardDescription>Digite o novo número que você usará para o login e para interagir com a IA.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Novo Número com DDD</Label>
                <Input id="phone" placeholder="(XX) XXXXX-XXXX" value={newPhoneNumber} onChange={(e) => setNewPhoneNumber(formatPhoneNumber(e.target.value))} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSavePhoneNumber} disabled={isUpdating} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}