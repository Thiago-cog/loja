"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  available?: boolean;
};

export function ProductCard({ slug, name, price, imageUrl, available = true }: Props) {
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
          className={`object-contain p-2 group-hover:scale-110 transition-transform duration-500 ease-out ${
            available ? "" : "opacity-40"
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {!available && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-black/80 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm">
              Indisponível
            </span>
          </div>
        )}
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
