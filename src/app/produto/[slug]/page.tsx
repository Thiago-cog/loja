import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductDetails } from "./ProductDetails";

type Props = {
  params: Promise<{ slug: string }>;
};

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
      />
    </div>
  );
}
