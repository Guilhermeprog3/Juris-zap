"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function ContaCriadaPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-teal-50 flex flex-col">
      <Navbar />
      <main className="w-full flex-grow flex justify-center items-center p-4">
        <Card className="w-full max-w-lg bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-2xl rounded-2xl">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
            <CardTitle className="text-2xl mt-4 text-gray-900">Conta Criada com Sucesso!</CardTitle>
            <CardDescription className="text-base text-gray-700">
              Seu pagamento foi processado e sua conta está pronta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-lg text-green-800 mb-2">Próximo Passo: Crie sua Senha</h3>
              <p className="text-gray-700">
                Para sua segurança, nós não definimos uma senha para você. Por favor, clique no botão abaixo para ir à tela de "Recuperar Senha" e criar sua senha de acesso.
              </p>
            </div>
            <Link href="/recuperar-senha" className="w-full">
              <Button size="lg" className="w-full text-base font-semibold bg-green-600 hover:bg-green-700 text-white">
                <Mail className="mr-2 h-5 w-5" />
                Criar Minha Senha
              </Button>
            </Link>
            <p className="text-xs text-center text-gray-500">
              Você receberá um e-mail com um link para definir sua nova senha.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}