"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Scale, MessageCircle } from "lucide-react"
import logo from "/public/juris-logo.png"
export function NavbarGov() {
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
            <a href="/governamental#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Vantagens
            </a>
            <a href="/governamental#orcamento">
              <Button>Solicitar Orçamento</Button>
            </a>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                <a href="/governamental#features" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                  Vantagens
                </a>
                <div className="pt-4">
                  <a href="/governamental#orcamento" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Solicitar Orçamento</Button>
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}