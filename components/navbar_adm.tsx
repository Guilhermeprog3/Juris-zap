"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Scale, MessageCircle, LogOut } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

export function NavbarAdm() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Você saiu da sua conta.");
      router.push('/'); 
    } catch (error) {
      toast.error("Erro ao fazer logout.");
      console.error("Erro no logout:", error);
    }
  }

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-600" />
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-xl font-bold text-gray-900">JurisZap</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="hidden md:flex gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                    <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                        Sair da Conta
                    </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}