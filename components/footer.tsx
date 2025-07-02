import Link from "next/link"
import { Mail, Phone, Facebook, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          
          <div className="text-sm text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} JurisZap. Todos os direitos reservados.</p>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-3">
            <a href="mailto:juriszap.br@gmail.com" className="flex items-center space-x-2 text-sm hover:text-green-400 transition-colors">
              <Mail className="h-5 w-5" />
              <span>juriszap.br@gmail.com</span>
            </a>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-5 w-5" />
              <span>+55 (XX) XXXXX-XXXX</span>
            </div>
            <div className="flex space-x-4">
              <Link href="https://facebook.com/juriszap" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
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