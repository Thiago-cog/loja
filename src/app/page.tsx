import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { HeroBanner } from "@/components/HeroBanner";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

export default async function Home() {
  let products: Product[] = [];
  try {
    products = await prisma.product.findMany({
      where: { active: true },
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    // banco não configurado ainda
  }

  return (
    <>
      <HeroBanner />

      <section id="produtos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">
            Confira
          </p>
          <h2 className="text-3xl font-bold tracking-tight">Nossos Produtos</h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Nenhum produto disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
              />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Link href="/produto/sorteio" className="block">
          <Image
            src="/SORTEIO.png"
            alt="Participe do nosso sorteio"
            width={1920}
            height={400}
            className="w-full h-auto rounded-sm hover:opacity-95 transition-opacity"
          />
        </Link>
      </section>
    </>
  );
}
