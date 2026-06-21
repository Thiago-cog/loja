"use client";

import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="relative bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">
            Nova coleção
          </p>
          <h1 className="text-4xl sm:text-6xl font-black leading-tight tracking-tight">
            Vista-se com estilo
          </h1>
          <p className="mt-4 text-gray-400 text-lg leading-relaxed">
            Descubra nossas blusas com designs exclusivos feitos para você.
          </p>
          <Link
            href="#produtos"
            className="inline-block mt-8 bg-white text-black px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors"
          >
            Comprar agora
          </Link>
        </div>
      </div>
    </section>
  );
}
