"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, UserX, Search, MoreHorizontal, Settings, ChevronDown, Clock, Loader2, Phone
} from "lucide-react"
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
import { db } from "@/lib/firebase"
import { collection, getDocs, query, doc, updateDoc, Timestamp } from "firebase/firestore"
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

// Definição das colunas da tabela
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
    { accessorKey: "telefone", header: "Telefone" },
    {
      accessorKey: "plano",
      header: "Plano",
      cell: ({ row }) => <Badge variant="secondary">{row.getValue("plano")}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const atrasado = row.original.pagamentoAtrasado;
        if (atrasado) {
          return <Badge variant="destructive"><Clock className="h-3 w-3 mr-1" />Atrasado</Badge>
        }
        return <Badge variant={status === "ativo" ? "default" : "outline"}>{status}</Badge>
      },
    },
    { accessorKey: "cadastro", header: "Cadastro" },
    { id: "actions", cell: () => <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>},
];

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

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  
  const [statusFilter, setStatusFilter] = useState('todos');
  const [planFilter, setPlanFilter] = useState('todos');

  useEffect(() => {
    if (user?.role === 'admin') {
      const fetchData = async () => {
        setIsLoadingData(true);
        try {
          const usersCollectionRef = collection(db, "users");
          const usersSnapshot = await getDocs(query(usersCollectionRef));
          const allUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as UserDocument) }));
          
          const userRoleOnly = allUsers.filter(u => u.role === 'user' || !u.role);
          
          const usersList: Usuario[] = userRoleOnly.map(data => ({
            id: data.id,
            nome: data.nome,
            email: data.email,
            telefone: data.telefone || 'N/A',
            plano: data.planoId,
            status: data.statusAssinatura,
            cadastro: data.dataCadastro?.toDate().toLocaleDateString('pt-BR') || 'N/A',
            pagamentoAtrasado: data.statusAssinatura === 'pagamento_atrasado',
          }));
          
          setUsuarios(usersList);
          
          setStats({
            totalUsuarios: userRoleOnly.length,
            usuariosAtivos: userRoleOnly.filter(u => u.statusAssinatura === 'ativo').length,
            usuariosInativos: userRoleOnly.filter(u => u.statusAssinatura === 'inativo').length,
            usuariosAtrasados: userRoleOnly.filter(u => u.statusAssinatura === 'pagamento_atrasado').length,
          });

          const plansCollectionRef = collection(db, "planos");
          const plansSnapshot = await getDocs(query(plansCollectionRef));
          const plansList = plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Plan[];
          setPlans(plansList);

        } catch (error) {
            toast.error("Erro ao buscar dados do sistema.");
            console.error("Fetch Data Error:", error);
        } finally {
            setIsLoadingData(false);
        }
      };
      fetchData();
    }
  }, [user]);

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
        filteredUsers = filteredUsers.filter(user => user.plano === planFilter);
    }
    return filteredUsers;
  }, [usuarios, statusFilter, planFilter]);

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
        </Tabs>
      </div>
    </div>
  );
}