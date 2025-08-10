import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Linkedin, Github, Briefcase, Bot } from "lucide-react"
import Image from "next/image"

const creators = [
 {
  name: "Guilherme Silva Rios",
  role: "Desenvolvedor Full-Stack",
  isDeveloper: true,
  portfolioUrl: "https://guilhermeriosdev.vercel.app/",
  imageUrl: "https://github.com/Guilhermeprog3.png",
  contact: {
    email: "guilhermeriosprog@email.com",
   linkedin: "https://www.linkedin.com/in/guilherme-s-rios-dev/",
   github: "https://github.com/Guilhermeprog3",
  },
 },
 {
  name: "Nome do Sócio 1",
  role: "CEO & Especialista em SEO",
  isDeveloper: false,
  imageUrl: "/placeholder-user.jpg",
  contact: {
   email: "socio1@email.com",
   linkedin: "https://linkedin.com/in/usuario",
  },
 },
 {
  name: "Nome do Sócio 2",
  role: "CEO & Estrategista de Conteúdo",
  isDeveloper: false,
  imageUrl: "/placeholder-user.jpg",
  contact: {
   email: "socio2@email.com",
   linkedin: "https://linkedin.com/in/usuario",
  },
 },
]

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
         O que é o <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">JurisZap?</span>
        </h1>
        <div className="text-lg text-gray-700 space-y-5">
         <p>
          O JurisZap é uma plataforma inovadora de Inteligência Artificial desenhada especificamente para o universo jurídico. Nossa missão é transformar a maneira como <strong>estudantes e profissionais do Direito</strong> interagem com o conhecimento.
         </p>
         <p>
          Através de uma poderosa IA integrada diretamente ao seu <strong>WhatsApp</strong>, oferecemos uma assistente virtual capaz de realizar tarefas complexas em segundos, desde resumir textos e imagens até auxiliar na resolução de exercícios.
         </p>
         <p>
          Criamos o JurisZap para ser <strong>um aliado inteligente na sua jornada</strong>, otimizando seu tempo e impulsionando seus estudos e sua carreira.
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

    <section className="py-24 bg-gray-50">
     <div className="container mx-auto px-4">
      <div className="text-center mb-16 max-w-2xl mx-auto">
       <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Nossos Criadores
       </h2>
       <p className="text-lg text-gray-600">
        A equipe apaixonada por tecnologia e direito que deu vida ao JurisZap.
       </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
       {creators.map((creator) => (
        <Card 
         key={creator.name} 
         className="flex flex-col border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white rounded-xl overflow-hidden"
        >
         <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-1.5 w-full"></div>
         <CardHeader className="items-center text-center pt-8">
          <div className="relative w-32 h-32 mb-4">
           <Image
            src={creator.imageUrl}
            alt={`Foto de ${creator.name}`}
            fill={true}
            style={{objectFit: "cover"}}
            className="rounded-full ring-4 ring-white"
           />
          </div>
          <CardTitle className="text-xl text-gray-900">{creator.name}</CardTitle>
          <CardDescription>
           <Badge variant="secondary" className="mt-1">{creator.role}</Badge>
          </CardDescription>
         </CardHeader>

         <CardContent className="flex-grow flex flex-col justify-end text-center px-6 pb-6">
          <div className="flex justify-center items-center space-x-4 text-gray-500 my-6">
           {creator.contact.email && (
            <a 
              href={`mailto:${creator.contact.email}`} 
              className="hover:text-emerald-600 transition-colors" 
              aria-label="Email"
            >
             <Mail className="h-6 w-6" />
            </a>
           )}
           <a href={creator.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors" aria-label="LinkedIn">
            <Linkedin className="h-6 w-6" />
           </a>
           {creator.contact.github && (
            <a href={creator.contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors" aria-label="GitHub">
             <Github className="h-6 w-6" />
            </a>
           )}
          </div>
          
          {creator.isDeveloper && (
           <a href={creator.portfolioUrl} target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white">
             <Briefcase className="mr-2 h-4 w-4" />
             Ver Portfólio
            </Button>
           </a>
          )}
         </CardContent>
        </Card>
       ))}
      </div>
     </div>
    </section>
   </main>

   <Footer />
  </div>
 )
}