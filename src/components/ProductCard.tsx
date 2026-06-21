"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
};

export function ProductCard({ slug, name, price, imageUrl }: Props) {
  return (
    <Link
      href={`/produto/${slug}`}
      className="group block"
    >
      <div className="relative aspect-square bg-white overflow-hidden rounded-sm border border-gray-100">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-contain p-2 group-hover:scale-110 transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="mt-3 px-1">
        <h3 className="text-sm text-gray-800 font-medium leading-snug line-clamp-2">
          {name}
        </h3>
        <p className="text-lg font-bold text-black mt-1">
          R$ {price.toFixed(2).replace(".", ",")}
        </p>
      </div>
    </Link>
  );
}
