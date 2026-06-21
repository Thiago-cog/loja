"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

type Props = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  sizes: string[];
};

export function ProductDetails({ id, name, description, price, imageUrl, sizes }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  function handleAddToCart() {
    if (!selectedSize) {
      setError("Selecione um tamanho");
      return;
    }
    setError("");
    addItem({ id, name, price, imageUrl, size: selectedSize, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setQuantity(1);
  }

  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 hover:text-black transition-colors mb-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 7.5 12l8.25-7.5" />
        </svg>
        Voltar para a loja
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        <div className="relative aspect-square bg-white overflow-hidden rounded-sm border border-gray-100">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">
            Pibam Loja
          </p>
          <h1 className="text-3xl font-bold text-black tracking-tight">{name}</h1>

          <div className="mt-4">
            <p className="text-2xl font-black text-black">
              R$ {price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-1">à vista no PIX</p>
          </div>

          <p className="text-sm text-gray-500 mt-6 leading-relaxed">{description}</p>

          <div className="mt-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Tamanho
            </h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setError("");
                  }}
                  className={`min-w-[48px] h-11 px-3 border text-sm font-medium transition-all cursor-pointer ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-gray-700 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>

          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Quantidade
            </h3>
            <div className="inline-flex items-center border border-gray-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-sm hover:bg-gray-50 cursor-pointer"
              >
                -
              </button>
              <span className="w-12 h-10 flex items-center justify-center text-sm font-medium border-x border-gray-200">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-sm hover:bg-gray-50 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`mt-8 w-full py-4 text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              added
                ? "bg-green-600 text-white"
                : "bg-black text-white hover:bg-gray-900"
            }`}
          >
            {added ? "Adicionado ao carrinho!" : "Adicionar ao carrinho"}
          </button>
        </div>
      </div>
    </>
  );
}
