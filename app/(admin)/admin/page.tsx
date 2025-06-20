"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  UserX, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Settings,
  ChevronDown,
  ChevronUp,
  Clock
} from "lucide-react"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { NavbarAdm } from "@/components/navbar_adm"

type Usuario = {
  id: number
  nome: string
  email: string
  plano: string
  status: string
  cadastro: string
  pagamentoAtrasado?: boolean
}

export default function AdminPage() {
  const [stats] = useState({
    totalUsuarios: 1247,
    usuariosAtivos: 892,
    usuariosInativos: 355,
    usuariosAtrasados: 102,
    receitaMensal: 28450,
    crescimentoMensal: 12.5,
  })

  const [planos, setPlanos] = useState([
    { nome: "Básico", valor: 19.90, descricao: "Ideal para quem está começando" },
    { nome: "Estudante", valor: 29.90, descricao: "Perfeito para estudantes de direito" },
    { nome: "Profissional", valor: 59.90, descricao: "Para advogados e concurseiros" }
  ])

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [statusFilter, setStatusFilter] = useState<string>("todos")

  const usuarios: Usuario[] = [
    {
      id: 1,
      nome: "Maria Silva",
      email: "maria@email.com",
      plano: "Estudante",
      status: "Ativo",
      cadastro: "2024-01-15",
    },
    {
      id: 2,
      nome: "João Santos",
      email: "joao@email.com",
      plano: "Profissional",
      status: "Ativo",
      cadastro: "2024-01-10",
    },
    { 
      id: 3, 
      nome: "Ana Costa", 
      email: "ana@email.com", 
      plano: "Básico", 
      status: "Inativo", 
      cadastro: "2024-01-05" 
    },
    { 
      id: 4, 
      nome: "Carlos Oliveira", 
      email: "carlos@email.com", 
      plano: "Profissional", 
      status: "Ativo", 
      cadastro: "2024-01-20",
      pagamentoAtrasado: true
    },
    { 
      id: 5, 
      nome: "Patricia Souza", 
      email: "patricia@email.com", 
      plano: "Estudante", 
      status: "Ativo", 
      cadastro: "2024-01-18" 
    },
  ]

  const filteredUsuarios = usuarios.filter(usuario => {
    if (statusFilter === "todos") return true
    if (statusFilter === "atrasados") return usuario.pagamentoAtrasado
    return usuario.status.toLowerCase() === statusFilter.toLowerCase()
  })

  const columns: ColumnDef<Usuario>[] = [
    {
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("nome")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "plano",
      header: "Plano",
      cell: ({ row }) => {
        const plano = row.getValue("plano") as string
        return (
          <Badge
            variant={
              plano === "Profissional"
                ? "default"
                : plano === "Estudante"
                  ? "secondary"
                  : "outline"
            }
            className={
              plano === "Profissional" 
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0" 
                : plano === "Estudante"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : "border-gray-200"
            }
          >
            {plano}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const atrasado = row.original.pagamentoAtrasado
        
        if (atrasado) {
          return (
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">
              <Clock className="h-3 w-3 mr-1" />
              Atrasado
            </Badge>
          )
        }
        
        return (
          <Badge 
            variant={status === "Ativo" ? "default" : "secondary"}
            className={status === "Ativo" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0" : "bg-gray-100 text-gray-800 border-gray-200"}
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "cadastro",
      header: "Cadastro",
      cell: ({ row }) => (
        <div>{new Date(row.getValue("cadastro")).toLocaleDateString("pt-BR")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Button variant="ghost" size="icon" className="hover:bg-emerald-50">
            <MoreHorizontal className="h-4 w-4 text-emerald-600" />
          </Button>
        )
      },
    },
  ]

  const table = useReactTable({
    data: filteredUsuarios,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleValorChange = (index: number, novoValor: string) => {
    const novosPlanos = [...planos]
    const valorNumerico = parseFloat(novoValor.replace(',', '.')) || 0
    novosPlanos[index].valor = valorNumerico
    setPlanos(novosPlanos)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <NavbarAdm />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Painel <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Administrativo</span>
          </h1>
          <p className="text-gray-600 mt-2">Gerencie usuários, assinaturas e monitore métricas da plataforma.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full rounded-t-lg"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsuarios.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{stats.crescimentoMensal}% este mês</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full rounded-t-lg"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.usuariosAtivos.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.usuariosAtivos / stats.totalUsuarios) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full rounded-t-lg"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Inativos</CardTitle>
              <UserX className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.usuariosInativos.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.usuariosInativos / stats.totalUsuarios) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full rounded-t-lg"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagamentos Atrasados</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.usuariosAtrasados.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.usuariosAtrasados / stats.totalUsuarios) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="usuarios" className="space-y-4">
          <TabsList className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
            <TabsTrigger 
              value="usuarios" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white"
            >
              Usuários
            </TabsTrigger>
            <TabsTrigger 
              value="assinaturas" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white"
            >
              Assinaturas
            </TabsTrigger>
            <TabsTrigger 
              value="configuracoes" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white"
            >
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios" className="space-y-4">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full rounded-t-lg"></div>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>Visualize e gerencie todos os usuários da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar usuários..."
                      className="pl-8"
                      value={(table.getColumn("nome")?.getFilterValue() as string) ?? ""}
                      onChange={(event) =>
                        table.getColumn("nome")?.setFilterValue(event.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={statusFilter === "todos" ? "default" : "outline"}
                      size="sm" 
                      className="border-emerald-200 hover:bg-emerald-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white"
                      onClick={() => setStatusFilter("todos")}
                    >
                      Todos
                    </Button>
                    <Button 
                      variant={statusFilter === "ativo" ? "default" : "outline"}
                      size="sm" 
                      className="border-emerald-200 hover:bg-emerald-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white"
                      onClick={() => setStatusFilter("ativo")}
                    >
                      Ativos
                    </Button>
                    <Button 
                      variant={statusFilter === "inativo" ? "default" : "outline"}
                      size="sm" 
                      className="border-emerald-200 hover:bg-emerald-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white"
                      onClick={() => setStatusFilter("inativo")}
                    >
                      Inativos
                    </Button>
                    <Button 
                      variant={statusFilter === "atrasados" ? "default" : "outline"}
                      size="sm" 
                      className="border-amber-200 hover:bg-amber-50 data-[state=active]:bg-amber-600 data-[state=active]:text-white"
                      onClick={() => setStatusFilter("atrasados")}
                    >
                      Atrasados
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border border-emerald-100">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b [&_tr]:border-emerald-100">
                        {table.getHeaderGroups().map((headerGroup) => (
                          <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                              return (
                                <th key={header.id} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                  {header.isPlaceholder ? null : (
                                    <div
                                      className={`
                                        flex items-center
                                        ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                                      `}
                                      onClick={header.column.getToggleSortingHandler()}
                                    >
                                      {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )}
                                      {{
                                        asc: <ChevronUp className="ml-1 h-4 w-4" />,
                                        desc: <ChevronDown className="ml-1 h-4 w-4" />,
                                      }[header.column.getIsSorted() as string] ?? null}
                                    </div>
                                  )}
                                </th>
                              )
                            })}
                          </tr>
                        ))}
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {table.getRowModel().rows?.length ? (
                          table.getRowModel().rows.map((row) => (
                            <tr
                              key={row.id}
                              className="border-b border-emerald-100 hover:bg-emerald-50/50 transition-colors"
                            >
                              {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="p-4 align-middle">
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={columns.length} className="h-24 text-center">
                              Nenhum resultado encontrado.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} de{" "}
                    {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="border-emerald-200 hover:bg-emerald-50"
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="border-emerald-200 hover:bg-emerald-50"
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assinaturas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {planos.map((plano, index) => (
                <Card key={index} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full rounded-t-lg"></div>
                  <CardHeader>
                    <CardTitle>{plano.nome}</CardTitle>
                    <CardDescription>{plano.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">R$ {plano.valor.toFixed(2).replace('.', ',')}</div>
                    <p className="text-sm text-muted-foreground">por mês</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="configuracoes" className="space-y-4">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 w-full rounded-t-lg"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-emerald-600" />
                  Configuração de Planos
                </CardTitle>
                <CardDescription>Altere os valores dos planos de assinatura</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {planos.map((plano, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-emerald-100 rounded-lg">
                      <div>
                        <h3 className="font-medium">{plano.nome}</h3>
                        <p className="text-sm text-muted-foreground">{plano.descricao}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">R$</span>
                        <Input
                          type="text"
                          value={plano.valor.toFixed(2).replace('.', ',')}
                          onChange={(e) => handleValorChange(index, e.target.value)}
                          className="w-24 text-right"
                        />
                        <span className="text-sm text-muted-foreground">/mês</span>
                      </div>
                    </div>
                  ))}
                  <Button className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}