import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Linkedin, Github, Briefcase, Bot } from "lucide-react"
import Image from "next/image"

export default function SobrePage() {
 return (
  <div className="min-h-screen bg-white flex flex-col">
   <Navbar />

   <main className="flex-grow">
    <section className="py-24 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
     <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
       <div className="order-2 lg:order-1 text-left">
        <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-600">
         Nossa Plataforma
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
         O que é a <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">JurisZap?</span>
        </h1>
        <div className="text-lg text-gray-700 space-y-5">
         <p>
          A JurisZap é uma plataforma inovadora de Inteligência Artificial desenhada especificamente para o universo jurídico. Nossa missão é transformar a maneira como <strong>estudantes e profissionais do Direito</strong> interagem com o conhecimento.
         </p>
         <p>
          Através de uma poderosa IA integrada diretamente ao seu <strong>WhatsApp</strong>, oferecemos uma assistente virtual capaz de realizar tarefas complexas em segundos, desde resumir textos e imagens até auxiliar na resolução de exercícios.
         </p>
         <p>
          Criamos a JurisZap para ser <strong>um aliado inteligente na sua jornada</strong>, otimizando seu tempo e impulsionando seus estudos e sua carreira.
         </p>
        </div>
       </div>
       <div className="order-1 lg:order-2 flex justify-center items-center">
        <div className="relative w-64 h-64 flex items-center justify-center">
         <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full blur-2xl opacity-60"></div>
         <div className="relative bg-white/80 backdrop-blur-lg p-12 rounded-full shadow-lg border">
          <Bot className="h-32 w-32 text-emerald-600" />
         </div>
        </div>
       </div>
      </div>
     </div>
    </section>
   </main>

   <Footer />
  </div>
 )
}