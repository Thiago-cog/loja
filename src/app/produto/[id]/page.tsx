import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductDetails } from "./ProductDetails";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id, active: true },
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
        sizes={product.sizes.split(",").map((s) => s.trim())}
      />
    </div>
  );
}
