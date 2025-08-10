import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Lock, Database, Share2, Shield, Server, Trash2, UserCheck, Phone, FileClock, Edit } from "lucide-react"

export default function PrivacidadePage() {
 return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
    <Navbar />
    <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <Lock className="mx-auto h-16 w-16 text-teal-600 mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Política de Privacidade – JurisZap®</h1>
            <p className="mt-4 text-lg text-gray-600">Data de vigência: 08/2025</p>
        </div>

        <div className="space-y-10 text-gray-700 text-lg leading-relaxed">
            <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center"><Database className="h-6 w-6 mr-3 text-teal-500" />2. Dados coletados</h2>
            <p>Podemos coletar: Dados de identificação (nome, e-mail, WhatsApp), mensagens trocadas, informações de pagamento (para planos pagos) e dados de uso da plataforma.</p>
            </section>

            <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center"><Share2 className="h-6 w-6 mr-3 text-teal-500" />4. Compartilhamento de dados</h2>
            <p>O JurisZap® não vende, aluga ou comercializa dados pessoais. O compartilhamento só ocorrerá com prestadores de serviço essenciais para a operação (sob confidencialidade) ou por exigência legal.</p>
            </section>
            
            <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center"><Server className="h-6 w-6 mr-3 text-teal-500" />5. Armazenamento e segurança</h2>
            <p>Os dados são armazenados em ambientes seguros, com criptografia e controles de acesso para prevenir acessos não autorizados.</p>
            </section>

            <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center"><Trash2 className="h-6 w-6 mr-3 text-teal-500" />6. Retenção de dados</h2>
            <p>Manteremos seus dados apenas pelo tempo necessário. Você pode solicitar a exclusão a qualquer momento.</p>
            </section>

            <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center"><UserCheck className="h-6 w-6 mr-3 text-teal-500" />7. Direitos do titular (LGPD)</h2>
            <p>Você pode solicitar acesso, correção, exclusão ou portabilidade dos seus dados.</p>
            </section>

            <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center"><Phone className="h-6 w-6 mr-3 text-teal-500" />8. Como exercer seus direitos</h2>
            <p>As solicitações podem ser feitas pelo WhatsApp: +55 86 9416-7491 ou pelo e-mail: juriszap.br@gmail.com. Responderemos em até 15 dias úteis.</p>
            </section>

            <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center"><FileClock className="h-6 w-6 mr-3 text-teal-500" />9. Oscilações e funcionamento</h2>
            <p>Nosso serviço depende de tecnologias de terceiros e pode apresentar oscilações. Em caso de falhas, contate nosso suporte.</p>
            </section>

            <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center"><Edit className="h-6 w-6 mr-3 text-teal-500" />11. Alterações nesta Política</h2>
            <p>O JurisZap® pode alterar esta Política a qualquer momento, publicando a versão atualizada no site oficial ou comunicando pelos canais oficiais.</p>
            </section>
        </div>
        </div>
    </main>
    <Footer />
    </div>
 )
}