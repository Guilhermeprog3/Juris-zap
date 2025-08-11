import Link from "next/link"
import { Mail, Phone, Facebook, Instagram, FileText, Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">JurisZap</h3>
            <p className="text-sm text-gray-400">Sua assistente jurídica com IA, disponível a qualquer hora no seu WhatsApp.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#features" className="hover:text-green-400 transition-colors">Funcionalidades</Link></li>
              <li><Link href="/planos" className="hover:text-green-400 transition-colors">Planos</Link></li>
              <li><Link href="/sobre" className="hover:text-green-400 transition-colors">Sobre</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/termos" className="flex items-center justify-center md:justify-start gap-2 hover:text-green-400 transition-colors">
                  <FileText className="h-4 w-4" />
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="flex items-center justify-center md:justify-start gap-2 hover:text-green-400 transition-colors">
                  <Shield className="h-4 w-4" />
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-sm text-gray-400 text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} JurisZap. Todos os direitos reservados.</p>
          </div>
          <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-3">
            <a href="mailto:juriszap.br@gmail.com" className="flex items-center space-x-2 text-sm hover:text-green-400 transition-colors">
              <Mail className="h-5 w-5" />
              <span>juriszap.br@gmail.com</span>
            </a>
            <a
              href="https://wa.me/558694167491"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm hover:text-green-400 transition-colors"
            >
              <Phone className="h-5 w-5" />
              <span>+55 86 9416-7491</span>
            </a>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/profile.php?id=61575631396883" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="https://instagram.com/juriszap" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}