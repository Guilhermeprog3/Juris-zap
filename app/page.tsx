import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building, User, School } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-teal-50 flex flex-col">
      <Navbar />
      <main className="w-full flex-grow flex flex-col justify-center items-center p-4 text-center">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-4 tracking-tight">
            Bem-vindo ao JurisZap
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Selecione seu perfil para começar a usar nossa plataforma de IA jurídica.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Link href="/estudante" className="group">
              <Card className="bg-white/70 backdrop-blur-xl border-gray-200/50 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="mx-auto bg-emerald-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                    <User className="h-10 w-10 text-emerald-600" />
                  </div>
                  <CardTitle className="text-2xl">Sou Estudante</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Acesse ferramentas de IA para revolucionar seus estudos, com resumos, auxílio em exercícios e mais.
                  </CardDescription>
                </CardHeader>
                <div className="p-6 pt-0">
                    <div className="text-emerald-600 font-semibold flex items-center justify-center group-hover:gap-3 transition-all">
                        Acessar portal do estudante <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                </div>
              </Card>
            </Link>

            <Link href="/institucional" className="group">
              <Card className="bg-white/70 backdrop-blur-xl border-gray-200/50 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col">
                <CardHeader className="flex-grow">
                    <div className="mx-auto bg-sky-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                        <School className="h-10 w-10 text-emerald-600" />
                    </div>
                  <CardTitle className="text-2xl">Sou Instituição de Ensino</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Inove o ensino jurídico e prepare seus alunos com ferramentas de IA para simulação de casos e pesquisa avançada.
                  </CardDescription>
                </CardHeader>
                 <div className="p-6 pt-0">
                    <div className="text-emerald-600 font-semibold flex items-center justify-center group-hover:gap-3 transition-all">
                        Conhecer soluções <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                </div>
              </Card>
            </Link>

            <Link href="/governamental" className="group">
              <Card className="bg-white/70 backdrop-blur-xl border-gray-200/50 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col">
                <CardHeader className="flex-grow">
                    <div className="mx-auto bg-teal-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                        <Building className="h-10 w-10 text-teal-600" />
                    </div>
                  <CardTitle className="text-2xl">Sou do Governo</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Descubra como nossa IA pode otimizar processos, analisar documentos e trazer mais eficiência para o setor público.
                  </CardDescription>
                </CardHeader>
                 <div className="p-6 pt-0">
                    <div className="text-teal-600 font-semibold flex items-center justify-center group-hover:gap-3 transition-all">
                        Ver soluções para o governo <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}