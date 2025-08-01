// src/components/request-quote-form.tsx

"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function RequestQuoteForm() {
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.organization || !formData.message) {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 3000);
      return;
    }

    setFormStatus("submitting");

    const emailBody = `
      ====================================
      SOLICITAÇÃO DE ORÇAMENTO - SETOR PÚBLICO
      ====================================
      
      📅 Data: ${new Date().toLocaleDateString("pt-BR")}
      ⏰ Hora: ${new Date().toLocaleTimeString("pt-BR")}
      
      👤 Solicitante:
      Nome: ${formData.name}
      Email: ${formData.email}
      
      🏢 Órgão/Entidade:
      ${formData.organization}
      
      ✉️ Mensagem:
      ====================================
      ${formData.message}
      ====================================
    `
      .replace(/\n/g, "%0D%0A")
      .trim();
    
    const subject = `[Orçamento Governamental] Solicitação de ${formData.organization}`;

    setTimeout(() => {
      window.location.href = `mailto:juriszap.br@gmail.com?subject=${encodeURIComponent(subject)}&body=${emailBody}`;
      
      setFormStatus("success");

      setTimeout(() => {
        setFormStatus("idle");
        setFormData({
          name: "",
          email: "",
          organization: "",
          message: "",
        });
      }, 3000);
    }, 800);
  };

  return (
    <Card className="border-gray-200 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-gray-900">Solicite um Orçamento</CardTitle>
        <CardDescription className="text-lg text-gray-600">
          Preencha o formulário e nossa equipe especializada entrará em contato.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Seu nome completo" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Corporativo</label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="seu.email@orgao.gov.br" required />
          </div>
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">Nome do Órgão/Entidade</label>
            <Input id="organization" name="organization" value={formData.organization} onChange={handleChange} placeholder="Ex: Prefeitura Municipal, Tribunal de Justiça" required />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
            <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Descreva sua necessidade ou dúvida..." rows={5} required />
          </div>
          <Button
            type="submit"
            size="lg"
            className={`w-full text-lg ${
              formStatus === "success"
                ? "bg-green-600 hover:bg-green-700"
                : formStatus === "error"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
            }`}
            disabled={formStatus === "submitting" || formStatus === "success"}
          >
            {formStatus === "submitting" ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Abrindo e-mail...
              </>
            ) : formStatus === "success" ? (
              <>
                <CheckCircle className="h-5 w-5 mr-2" /> E-mail aberto!
              </>
            ) : formStatus === "error" ? (
              <>
                <AlertCircle className="h-5 w-5 mr-2" /> Preencha todos os campos
              </>
            ) : (
              <>
                Solicitar Orçamento <Send className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}