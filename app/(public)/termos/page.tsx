import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Shield, FileText, Users, CreditCard, XCircle, MessageSquare, Wrench, Info } from "lucide-react"

export default function TermosPage() {
 return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
    <Navbar />
    <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <FileText className="mx-auto h-16 w-16 text-emerald-600 mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Termos de Uso – JurisZap®</h1>
            <p className="mt-4 text-lg text-gray-600">Data de vigência: 08/2025</p>
        </div>

        <div className="space-y-10 text-gray-700 text-lg leading-relaxed">
            <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center"><Info className="h-6 w-6 mr-3 text-emerald-500" />1. Sobre o JurisZap®</h2>
            <p>O JurisZap® é um assistente virtual de estudos voltado para universitários de Direito, que oferece explicações, orientações e dicas de estudo. O JurisZap® não presta consultoria jurídica, advocacia ou serviços que exijam inscrição na OAB. Todo o conteúdo é de caráter educativo.</p>
            </section>

            <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center"><Shield className="h-6 w-6 mr-3 text-emerald-500" />2. Aceitação dos Termos</h2>
            <p>Ao utilizar o JurisZap®, você confirma que leu, entendeu e concorda com este Termo de Uso. Caso não concorde, não utilize o serviço.</p>
            </section>

            <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center"><Users className="h-6 w-6 mr-3 text-emerald-500" />3. Quem pode usar</h2>
            <p>Qualquer pessoa com acesso a um número de WhatsApp válido e ativo.</p>
            </section>

            <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center"><MessageSquare className="h-6 w-6 mr-3 text-emerald-500" />4. Como funciona</h2>
            <p>O JurisZap® funciona por meio de mensagens no WhatsApp. Você envia perguntas e recebe respostas com base em conteúdos acadêmicos de Direito. O serviço pode incluir dicas de estudo, explicações de matérias, exemplos práticos e orientações para organização de estudos.</p>
            </section>
            
            <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center"><XCircle className="h-6 w-6 mr-3 text-red-500" />5. Limitações de uso</h2>
            <p>Você não pode: Usar o JurisZap® para solicitar consultoria jurídica real; Repassar as respostas como se fossem orientação profissional em processos reais; Utilizar o serviço de forma abusiva, ofensiva ou contrária à lei.</p>
            </section>

            <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center"><CreditCard className="h-6 w-6 mr-3 text-emerald-500" />6. Planos e Pagamentos</h2>
            <p>O JurisZap® pode ser gratuito ou pago, conforme o plano contratado. Planos pagos são cobrados conforme informado no momento da contratação. Pagamentos não confirmados podem resultar na suspensão do acesso.</p>
            </section>
            
            <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center"><Wrench className="h-6 w-6 mr-3 text-emerald-500" />12. Termos Técnicos</h2>
            <p>A JurisZap® se compromete a combater quaisquer falhas no serviço, mas devido a necessidade de utilização de tecnologias de outras empresas, em alguns casos o serviço pode demonstrar oscilações e falhas no pleno funcionamento, podendo ser algo momentâneo, portanto em caso de ocorrência como tais descritas acima, o usuário se compromete a recorrer ao suporte para informar qualquer mal funcionamento dos serviços prestados pela JurisZap®.</p>
            </section>
        </div>
        </div>
    </main>
    <Footer />
    </div>
 )
}