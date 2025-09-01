"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { auth } from "@/lib/firebase"
import { sendPasswordResetEmail, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, KeyRound, Mail, CheckCircle } from "lucide-react"

const emailSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
});
type EmailFormData = z.infer<typeof emailSchema>;

const passwordSchema = z.object({
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});
type PasswordFormData = z.infer<typeof passwordSchema>;

function RecuperarSenhaPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");

  const emailForm = useForm<EmailFormData>({ resolver: zodResolver(emailSchema) });
  const passwordForm = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    const mode = searchParams.get('mode');
    const code = searchParams.get('oobCode');
    if (mode === 'resetPassword' && code) {
      setIsLoading(true);
      verifyPasswordResetCode(auth, code)
        .then(() => {
          setOobCode(code);
          setStep(3);
        })
        .catch(() => {
          toast.error("Link de redefinição inválido ou expirado. Por favor, solicite um novo.");
          router.push('/recuperar-senha');
        })
        .finally(() => setIsLoading(false));
    }
  }, [searchParams, router]);

  const handleSendResetEmail: SubmitHandler<EmailFormData> = async (data) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success(`Email de redefinição enviado para ${data.email}.`);
      setUserEmail(data.email);
      setStep(2);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        toast.error("O e-mail fornecido não está cadastrado em nosso sistema.");
      } else {
        toast.error("Ocorreu uma falha ao enviar o email. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword: SubmitHandler<PasswordFormData> = async (data) => {
    if (!oobCode) return;
    setIsLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, data.password);
      setStep(4);
      setTimeout(() => router.push('/login'), 3000);
    } catch (error) {
      toast.error("Erro ao redefinir a senha. O link pode ter expirado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-teal-50 flex flex-col">
      <Navbar />
      <main className="w-full flex-grow flex justify-center items-center p-4">
        <div className="w-full max-w-md">
          {step === 1 && (
            <Card className="bg-white/70 backdrop-blur-xl border-gray-200/50 shadow-lg rounded-2xl">
              <CardHeader className="text-center">
                <KeyRound className="mx-auto h-12 w-12 text-green-600" />
                <CardTitle className="text-2xl mt-4">Recuperar Senha</CardTitle>
                <CardDescription>Insira seu e-mail para enviarmos um link de recuperação.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={emailForm.handleSubmit(handleSendResetEmail)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" {...emailForm.register("email")} className={emailForm.formState.errors.email ? "border-red-500" : ""} />
                    {emailForm.formState.errors.email && <p className="text-sm text-red-500">{emailForm.formState.errors.email.message}</p>}
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enviar Link
                  </Button>
                </form>
                <div className="mt-6 text-center text-sm">
                  <Link href="/login" className="font-semibold text-green-600 hover:underline">
                    Voltar para o Login
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="bg-white/70 backdrop-blur-xl border-gray-200/50 shadow-lg rounded-2xl">
                <CardHeader className="text-center">
                    <Mail className="mx-auto h-12 w-12 text-green-600" />
                    <CardTitle className="text-2xl mt-4">Verifique seu E-mail</CardTitle>
                    <CardDescription>
                      Enviamos um link para <span className="font-semibold text-gray-800">{userEmail}</span>.
                      Verifique sua caixa de entrada e spam.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-green-50 text-green-800 p-4 rounded-lg text-sm border border-green-200 text-left">
                      <p className="font-medium">Já redefiniu sua senha?</p>
                      <p className="mt-1">
                        Se sim, você já pode <Link href="/login" className="font-semibold underline">fazer login</Link>.
                      </p>
                    </div>
                    <Button onClick={() => handleSendResetEmail({ email: userEmail })} className="w-full" variant="secondary" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Reenviar E-mail
                    </Button>
                    <Button onClick={() => setStep(1)} className="w-full" variant="outline">
                      Usar outro E-mail
                    </Button>
                </CardContent>
            </Card>
          )}

          {/* Etapa 3: Formulário para criar nova senha */}
          {step === 3 && (
            <Card className="bg-white/70 backdrop-blur-xl border-gray-200/50 shadow-lg rounded-2xl">
              <CardHeader className="text-center">
                <KeyRound className="mx-auto h-12 w-12 text-green-600" />
                <CardTitle className="text-2xl mt-4">Crie uma Nova Senha</CardTitle>
                <CardDescription>Sua nova senha deve ter no mínimo 8 caracteres.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(handleResetPassword)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Nova Senha</Label>
                    <Input id="password" type="password" {...passwordForm.register("password")} className={passwordForm.formState.errors.password ? "border-red-500" : ""} />
                    {passwordForm.formState.errors.password && <p className="text-sm text-red-500">{passwordForm.formState.errors.password.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirme a Nova Senha</Label>
                    <Input id="confirmPassword" type="password" {...passwordForm.register("confirmPassword")} className={passwordForm.formState.errors.confirmPassword ? "border-red-500" : ""} />
                    {passwordForm.formState.errors.confirmPassword && <p className="text-sm text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>}
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Redefinir Senha
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
          
          {step === 4 && (
             <Card className="bg-white/70 backdrop-blur-xl border-gray-200/50 shadow-lg rounded-2xl">
                <CardHeader className="text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                    <CardTitle className="text-2xl mt-4">Senha Redefinida!</CardTitle>
                    <CardDescription>Sua senha foi alterada com sucesso. Estamos te redirecionando para o login.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-green-600"/>
                </CardContent>
             </Card>
          )}
        </div>
      </main>
    </div>
  )
}

// Componente exportado que envolve a página com o Suspense
export default function RecuperarSenhaPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RecuperarSenhaPageComponent />
    </Suspense>
  )
}