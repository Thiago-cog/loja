"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

export function Header() {
  const { totalItems, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-black text-white text-center text-xs py-2 tracking-wider uppercase">
        Alive CONF 2026
      </div>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden text-gray-700 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            <Link href="/" className="text-2xl font-black tracking-tight text-black uppercase">
              Pibam
            </Link>

            <nav className="hidden sm:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium text-gray-700 hover:text-black transition-colors uppercase tracking-wide">
                Novidades
              </Link>
              <Link href="/" className="text-sm font-medium text-gray-700 hover:text-black transition-colors uppercase tracking-wide">
                Blusas
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link
                href="/admin/login"
                className="text-gray-500 hover:text-black transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </Link>
              <button
                onClick={() => setIsOpen(true)}
                className="relative text-gray-500 hover:text-black transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white animate-fade-in">
            <nav className="flex flex-col px-4 py-3 gap-3">
              <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                Novidades
              </Link>
              <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                Blusas
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
