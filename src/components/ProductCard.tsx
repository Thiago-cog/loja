"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export function ProductCard({ id, name, price, imageUrl }: Props) {
  return (
    <Link
      href={`/produto/${id}`}
      className="group block"
    >
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden rounded-sm">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>
      <div className="mt-3 px-1">
        <h3 className="text-sm text-gray-800 font-medium leading-snug line-clamp-2">
          {name}
        </h3>
        <p className="text-base font-bold text-black mt-1">
          R$ {price.toFixed(2)}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          à vista no PIX
        </p>
      </div>
    </Link>
  );
}
