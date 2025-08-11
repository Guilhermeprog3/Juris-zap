"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import logo from "/public/juris-logo.png"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
                <img src={logo.src} alt="Juris Logo" className="w-8"/>
            </div>
            <span className="text-xl font-bold text-gray-900">JurisZap</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Funcionalidades
            </Link>
            <Link href="/planos" className="text-gray-600 hover:text-gray-900 transition-colors">
              Planos
            </Link>
            <Link href="/sobre" className="text-gray-600 hover:text-gray-900 transition-colors">
              Sobre
            </Link>
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/cadastro">
              <Button>Começar</Button>
            </Link>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/#features" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                  Funcionalidades
                </Link>
                <Link href="/planos" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                  Planos
                </Link>
                <Link href="/sobre" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                  Sobre
                </Link>
                <div className="pt-4 space-y-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/cadastro" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Começar</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}