import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { CartProvider } from "@/contexts/CartContext";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pibam Loja",
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
        <CartProvider>
          <Header />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <footer className="bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight mb-4">Pibam</h3>
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
                    <li>WhatsApp</li>
                    <li>Instagram</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
                Pibam Loja &copy; {new Date().getFullYear()} — Todos os direitos reservados
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
