import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { CartProvider } from "@/contexts/CartContext";
import { UserProvider } from "@/contexts/UserContext";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alive Store",
  description: "As melhores blusas você encontra aqui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        <UserProvider>
          <CartProvider>
            <Header />
            <CartDrawer />
            <main className="flex-1">{children}</main>
            <footer className="bg-black text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div>
                    <Image
                      src="/ALIVE STORE.png"
                      alt="Alive Store"
                      width={180}
                      height={60}
                      className="h-20 w-auto brightness-0 invert mb-4"
                    />
                    <p className="text-sm text-gray-400 leading-relaxed">
                      As melhores blusas com designs exclusivos feitos para você.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Links</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li><Link href="/" className="hover:text-white transition-colors">Início</Link></li>
                      <li><Link href="/#produtos" className="hover:text-white transition-colors">Produtos</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Contato</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li><a href="https://www.youtube.com/@pibammarica">YouTube</a></li>
                      <li><a href="https://www.instagram.com/alive_juventude/">Instagram</a></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
                  Alive Store &copy; {new Date().getFullYear()} — Todos os direitos reservados
                </div>
              </div>
            </footer>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
