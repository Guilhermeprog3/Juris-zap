"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  Users, UserX, Search, MoreHorizontal, Settings, ChevronDown, Clock, Loader2, UserCheck, Send
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { NavbarAdm } from "@/components/navbar_adm"
import { useRequireAuth, AuthLoader } from "@/app/context/authcontext"
import { db, functions } from "@/lib/firebase"
import { httpsCallable } from "firebase/functions"
import { collection, getDocs, query, Timestamp } from "firebase/firestore"
import { toast } from "sonner"

type StatusAssinatura = "ativo" | "inativo" | "pagamento_atrasado";

type Usuario = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  plano: string;
  status: StatusAssinatura;
  cadastro: string;
  pagamentoAtrasado?: boolean;
  authDisabled: boolean;
}

type Plan = {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
}

type UserDocument = {
    nome: string;
    email: string;
    telefone: string;
    planoId: string;
    statusAssinatura: StatusAssinatura;
    dataCadastro: Timestamp;
    role: string;
}

const toggleUserStatus = httpsCallable(functions, 'toggleUserStatus');
const sendAnnouncementEmail = httpsCallable(functions, 'sendAnnouncementEmail');
const getAllUsersData = httpsCallable(functions, 'getAllUsersData');

export default function AdminPage() {
  const { user, loading: authLoading } = useRequireAuth('admin');
  
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    usuariosAtivos: 0,
    usuariosInativos: 0,
    usuariosAtrasados: 0,
  });

  const [announcement, setAnnouncement] = useState({ subject: '', body: '' });
  const [isSending, setIsSending] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  
  const [statusFilter, setStatusFilter] = useState('todos');
  const [planFilter, setPlanFilter] = useState('todos');

  const fetchData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const plansCollectionRef = collection(db, "planos");
      const plansSnapshot = await getDocs(query(plansCollectionRef));
      const plansList = plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Plan[];
      setPlans(plansList);
      const plansMap = new Map(plansList.map(p => [p.id, p.nome]));

      const usersCollectionRef = collection(db, "users");
      const usersSnapshot = await getDocs(query(usersCollectionRef));
      const allUsers = usersSnapshot.docs
        .map(doc => ({ id: doc.id, ...(doc.data() as UserDocument) }))
        .filter(u => u.role === 'user' || !u.role);
      
      const usersList: Usuario[] = allUsers.map(data => ({
        id: data.id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone || 'N/A',
        plano: plansMap.get(data.planoId) || data.planoId,
        status: data.statusAssinatura,
        cadastro: data.dataCadastro?.toDate().toLocaleDateString('pt-BR') || 'N/A',
        pagamentoAtrasado: data.statusAssinatura === 'pagamento_atrasado',
        authDisabled: false,
      }));
      
      setUsuarios(usersList);
      
      setStats({
        totalUsuarios: allUsers.length,
        usuariosAtivos: allUsers.filter(u => u.statusAssinatura === 'ativo').length,
        usuariosInativos: allUsers.filter(u => u.statusAssinatura === 'inativo').length,
        usuariosAtrasados: allUsers.filter(u => u.statusAssinatura === 'pagamento_atrasado').length,
      });

    } catch (error) {
        toast.error("Erro ao buscar dados do sistema.");
        console.error("Fetch Data Error:", error);
    } finally {
        setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user, fetchData]);

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleUserStatus({ uid: userId, disabled: !currentStatus });
      toast.success(`Usuário ${!currentStatus ? 'desativado' : 'ativado'} com sucesso.`);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Falha ao alterar o status do usuário.");
    }
  };

  const handleSendAnnouncement = async () => {
      if (!announcement.subject || !announcement.body) {
          toast.error("O assunto e o corpo do e-mail não podem estar vazios.");
          return;
      }
      setIsSending(true);
      try {
          const result: any = await sendAnnouncementEmail({
              subject: announcement.subject,
              body: announcement.body,
          });
          toast.success(result.data.message);
          setAnnouncement({ subject: '', body: '' });
      } catch (error: any) {
          toast.error(error.message || "Ocorreu um erro ao enviar o anúncio.");
      } finally {
          setIsSending(false);
      }
  };

  const columns: ColumnDef<Usuario>[] = [
    {
      accessorKey: "nome",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Nome <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("nome")}</div>,
    },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "plano",
      header: "Plano",
      cell: ({ row }) => <Badge variant="secondary">{row.getValue("plano")}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status Assinatura",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const atrasado = row.original.pagamentoAtrasado;
        if (atrasado) {
          return <Badge variant="destructive"><Clock className="h-3 w-3 mr-1" />Atrasado</Badge>
        }
        return <Badge variant={status === "ativo" ? "default" : "outline"}>{status}</Badge>
      },
    },
    {
      accessorKey: "authDisabled",
      header: "Status Auth",
      cell: ({ row }) => {
        const isDisabled = row.getValue("authDisabled");
        return isDisabled ? (
          <Badge variant="destructive">Desativado</Badge>
        ) : (
          <Badge className="bg-green-600">Ativo</Badge>
        );
      },
    },
    { accessorKey: "cadastro", header: "Cadastro" },
    { 
      id: "actions",
      header: () => <div className="text-right">Ações</div>,
      cell: ({ row }) => {
        const usuario = row.original;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleToggleUserStatus(usuario.id, usuario.authDisabled)}>
                  {usuario.authDisabled ? <UserCheck className="mr-2 h-4 w-4" /> : <UserX className="mr-2 h-4 w-4" />}
                  {usuario.authDisabled ? 'Ativar Usuário' : 'Desativar Usuário'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      }
    },
  ];

  const filteredData = useMemo(() => {
    let filteredUsers = [...usuarios];
    if (statusFilter !== 'todos') {
        filteredUsers = filteredUsers.filter(user => {
            if (statusFilter === 'atrasados') return user.pagamentoAtrasado;
            if (statusFilter === 'ativos') return user.status === 'ativo' && !user.pagamentoAtrasado;
            if (statusFilter === 'inativos') return user.status === 'inativo';
            return true;
        });
    }
    if (planFilter !== 'todos') {
        filteredUsers = filteredUsers.filter(user => user.plano === plans.find(p => p.id === planFilter)?.nome);
    }
    return filteredUsers;
  }, [usuarios, statusFilter, planFilter, plans]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (authLoading || (user?.role === 'admin' && isLoadingData)) {
    return <AuthLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <NavbarAdm />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Administrativo</span></h1>
          <p className="text-gray-600 mt-2">Gerencie usuários, assinaturas e monitore métricas da plataforma.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total de Usuários</CardTitle><Users className="h-4 w-4 text-emerald-600" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalUsuarios}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle><Users className="h-4 w-4 text-green-600" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.usuariosAtivos}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Usuários Inativos</CardTitle><UserX className="h-4 w-4 text-amber-600" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.usuariosInativos}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pagamentos Atrasados</CardTitle><Clock className="h-4 w-4 text-red-600" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.usuariosAtrasados}</div></CardContent></Card>
        </div>

        <Tabs defaultValue="usuarios" className="space-y-4">
          <TabsList>
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="assinaturas">Assinaturas</TabsTrigger>
            <TabsTrigger value="anuncios">Anúncios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="usuarios" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Gerenciamento de Usuários</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 py-4">
                  <Input placeholder="Filtrar por nome..." value={(table.getColumn("nome")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("nome")?.setFilterValue(event.target.value)} className="max-w-sm"/>
                  <Select value={planFilter} onValueChange={setPlanFilter}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filtrar por plano..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Planos</SelectItem>
                      {plans.map(plan => (<SelectItem key={plan.id} value={plan.id}>{plan.nome}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2 flex-wrap">
                      <Button variant={statusFilter === 'todos' ? 'default' : 'outline'} onClick={() => setStatusFilter('todos')}>Todos</Button>
                      <Button variant={statusFilter === 'ativos' ? 'default' : 'outline'} onClick={() => setStatusFilter('ativos')}>Ativos</Button>
                      <Button variant={statusFilter === 'inativos' ? 'default' : 'outline'} onClick={() => setStatusFilter('inativos')}>Inativos</Button>
                      <Button variant={statusFilter === 'atrasados' ? 'default' : 'outline'} onClick={() => setStatusFilter('atrasados')}>Atrasados</Button>
                  </div>
                </div>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      {table.getHeaderGroups().map((headerGroup) => (<tr key={headerGroup.id}>{headerGroup.headers.map((header) => (<th key={header.id} className="h-12 px-4 text-left align-middle font-medium">{flexRender(header.column.columnDef.header, header.getContext())}</th>))}</tr>))}
                    </thead>
                    <tbody>
                      {table.getRowModel().rows?.length ? (table.getRowModel().rows.map((row) => (<tr key={row.id} className="border-b hover:bg-muted/50">{row.getVisibleCells().map((cell) => (<td key={cell.id} className="p-4 align-middle">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>))}</tr>))) : (<tr><td colSpan={columns.length} className="h-24 text-center">Nenhum resultado encontrado.</td></tr>)}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Anterior</Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Próxima</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assinaturas" className="space-y-4">
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-emerald-600" />
                  Visualização de Planos
                </CardTitle>
                <CardDescription>
                  Abaixo estão os planos de assinatura atuais.
                  <br />
                  <span className="font-semibold text-amber-700">
                    Importante: A edição de nomes e preços deve ser feita diretamente no seu painel do Stripe para garantir consistência.
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {plans.map((plan) => (
                    <div key={plan.id} className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg gap-4 bg-gray-50">
                        <div className="w-full space-y-2">
                            <Label htmlFor={`name-${plan.id}`}>Nome do Plano</Label>
                            <Input id={`name-${plan.id}`} type="text" value={plan.nome} readOnly className="w-full bg-white cursor-not-allowed"/>
                        </div>
                        <div className="w-full md:w-auto space-y-2">
                            <Label htmlFor={`price-${plan.id}`}>Preço (R$)</Label>
                            <Input id={`price-${plan.id}`} type="number" value={plan.preco} readOnly className="w-full md:w-32 bg-white cursor-not-allowed"/>
                        </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="anuncios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-emerald-600" />
                  Enviar Anúncio por E-mail
                </CardTitle>
                <CardDescription>
                  Envie uma mensagem para todos os usuários cadastrados na plataforma. Use com moderação.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input 
                    id="subject" 
                    placeholder="Ex: Nova funcionalidade disponível!"
                    value={announcement.subject}
                    onChange={(e) => setAnnouncement({...announcement, subject: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Corpo do E-mail</Label>
                  <Textarea 
                    id="body"
                    placeholder="Escreva sua mensagem aqui. Você pode usar HTML para formatação."
                    rows={8}
                    value={announcement.body}
                    onChange={(e) => setAnnouncement({...announcement, body: e.target.value})}
                  />
                </div>
                <Button onClick={handleSendAnnouncement} disabled={isSending}>
                  {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enviar para todos os usuários
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}