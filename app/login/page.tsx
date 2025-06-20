"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2, BookCheck } from "lucide-react"
import { loginSchema, type LoginFormData } from "@/lib/validations"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      lembrarMe: false,
    },
  })

  const watchedLembrarMe = watch("lembrarMe")

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Dados do login:", data)
    setIsLoading(false)
    router.push("/dashboard")
  }

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true)
    console.log("Iniciando login com Google...")
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-teal-50 flex flex-col">
      <Navbar />
      <main className="w-full flex-grow grid grid-cols-1 lg:grid-cols-2">
        
        <div className="flex flex-col justify-center items-start text-left p-8 md:p-12 lg:p-24">
          <div className="w-full max-w-md">
             <div className="flex items-center space-x-2 mb-4">
                <BookCheck className="h-8 w-8 text-green-600" />
                <span className="text-xl font-bold text-gray-900">JurisZap</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-green-900 mb-6 tracking-tight">
              Bem-vindo(a) de volta!
            </h1>
            <p className="text-lg text-gray-600">
              Acesse sua conta para continuar transformando seus estudos com o poder da nossa IA.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center p-8 bg-white/50 lg:bg-transparent">
          <div className="w-full max-w-md">
            <Card className="bg-white/70 backdrop-blur-xl border-gray-200/50 shadow-lg rounded-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Acesse sua Conta</CardTitle>
                <CardDescription>Insira seu e-mail e senha para continuar.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" {...register("email")} className={errors.email ? "border-red-500" : ""} />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha</Label>
                    <div className="relative">
                      <Input id="senha" type={showPassword ? "text" : "password"} {...register("senha")} className={`pr-10 ${errors.senha ? "border-red-500" : ""}`} />
                      <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.senha && <p className="text-sm text-red-500">{errors.senha.message}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="lembrar" checked={watchedLembrarMe} onCheckedChange={(checked) => setValue("lembrarMe", checked as boolean)} />
                      <Label htmlFor="lembrar" className="text-sm font-normal">Lembrar-me</Label>
                    </div>
                    <Link href="/recuperar-senha" className="text-sm font-semibold text-green-600 hover:underline">
                      Esqueceu a senha?
                    </Link>
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 font-semibold text-base" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Entrar
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Ou entre com</span>
                  </div>
                </div>

                <div>
                   <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isGoogleLoading}>
                      {isGoogleLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                          <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.7 0 265.4 0 129.2 110.3 20 244 20c69.2 0 125.3 27.9 171.7 73.2L376.8 146C342.3 112.3 298.3 96 244 96c-88.6 0-160.2 71.6-160.2 160.2s71.6 160.2 160.2 160.2c94.9 0 145.6-63.4 149.7-101.7H244V261.8h244z"></path>
                        </svg>
                      )}
                      Google
                    </Button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Não tem uma conta?{" "}
                    <Link href="/cadastro" className="font-semibold text-green-600 hover:underline">
                      Criar conta
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}