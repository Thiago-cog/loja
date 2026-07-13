import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductDetails } from "./ProductDetails";

type Props = {
  params: Promise<{ slug: string }>;
};

function parseModels(raw: string): { name: string; sizes: string[] }[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((m: { name: string; sizes?: string }) => ({
        name: m.name,
        sizes: m.sizes ? m.sizes.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      }));
    }
  } catch { /* not JSON */ }
  return [];
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, active: true },
  });

  if (!product) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductDetails
        id={product.id}
        name={product.name}
        description={product.description}
        price={product.price}
        imageUrl={product.imageUrl}
        images={product.images ? product.images.split("\n").map((s) => s.trim()).filter(Boolean) : []}
        sizes={product.sizes ? product.sizes.split(",").map((s) => s.trim()).filter(Boolean) : []}
        models={parseModels(product.models)}
        available={product.available}
      />
    </div>
  );
}
