"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, DollarSign, TrendingUp, MessageCircle, Search, Filter, MoreHorizontal } from "lucide-react"

export default function AdminPage() {
  const [stats] = useState({
    totalUsuarios: 1247,
    usuariosAtivos: 892,
    receitaMensal: 28450,
    consultasHoje: 3421,
    crescimentoMensal: 12.5,
  })

  const usuarios = [
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
    { id: 3, nome: "Ana Costa", email: "ana@email.com", plano: "Básico", status: "Ativo", cadastro: "2024-01-05" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-gray-600 mt-2">Gerencie usuários, assinaturas e monitore métricas da plataforma.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsuarios.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{stats.crescimentoMensal}% este mês</p>
            </CardContent>
          </Card>

          <Card>
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.receitaMensal.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">MRR (Receita Recorrente)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.consultasHoje.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Via WhatsApp e Web</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+{stats.crescimentoMensal}%</div>
              <p className="text-xs text-muted-foreground">Comparado ao mês anterior</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="usuarios" className="space-y-4">
          <TabsList>
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="assinaturas">Assinaturas</TabsTrigger>
            <TabsTrigger value="metricas">Métricas</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>Visualize e gerencie todos os usuários da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar usuários..." className="pl-8" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nome}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              usuario.plano === "Profissional"
                                ? "default"
                                : usuario.plano === "Estudante"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {usuario.plano}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={usuario.status === "Ativo" ? "default" : "secondary"}>{usuario.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(usuario.cadastro).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assinaturas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Plano Básico</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">234</div>
                  <p className="text-sm text-muted-foreground">usuários ativos</p>
                  <p className="text-xs text-gray-500">R$ 19,90/mês</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plano Estudante</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">456</div>
                  <p className="text-sm text-muted-foreground">usuários ativos</p>
                  <p className="text-xs text-gray-500">R$ 29,90/mês</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plano Profissional</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">202</div>
                  <p className="text-sm text-muted-foreground">usuários ativos</p>
                  <p className="text-xs text-gray-500">R$ 59,90/mês</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
