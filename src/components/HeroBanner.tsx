"use client";

import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto block"
      >
        <source src="/banner-santaprecensa.mp4" type="video/mp4" />
      </video>
      <Link
        href="#produtos"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 text-black px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors"
      >
        Comprar agora
      </Link>
    </section>
  );
}
