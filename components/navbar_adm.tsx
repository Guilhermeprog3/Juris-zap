"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Scale, MessageCircle, LogOut } from "lucide-react"

export function NavbarAdm() {
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    console.log("Usuário deslogado")
  }

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-600" />
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-xl font-bold text-gray-900">JurisZap</span>
          </div>

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
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}