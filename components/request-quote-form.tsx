"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { Loader2, Send } from "lucide-react";

const quoteSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Por favor, insira um email válido."),
  organization: z.string().min(3, "O nome do órgão é obrigatório."),
  message: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

export function RequestQuoteForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });

  const onSubmit = async (data: QuoteFormData) => {
    setIsLoading(true);
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Dados do Orçamento:", data);
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
        <Card className="bg-white/80 backdrop-blur-xl border-emerald-200/50 shadow-lg rounded-2xl text-center">
            <CardHeader>
                <CardTitle className="text-2xl text-emerald-700">Obrigado!</CardTitle>
                <CardDescription>Sua solicitação de orçamento foi enviada com sucesso. Entraremos em contato em breve.</CardDescription>
            </CardHeader>
        </Card>
    )
  }

  return (
    <Card className="bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-lg rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Solicite um Orçamento</CardTitle>
        <CardDescription>
          Preencha o formulário abaixo e nossa equipe entrará em contato.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" {...register("name")} className={errors.name ? "border-red-500" : ""} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail Corporativo</Label>
            <Input id="email" type="email" {...register("email")} className={errors.email ? "border-red-500" : ""} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization">Órgão / Instituição</Label>
            <Input id="organization" {...register("organization")} className={errors.organization ? "border-red-500" : ""} />
            {errors.organization && <p className="text-sm text-red-500">{errors.organization.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem (Opcional)</Label>
            <Textarea id="message" {...register("message")} placeholder="Descreva suas necessidades..." />
          </div>
          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 font-semibold text-base" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Enviando..." : "Enviar Solicitação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}