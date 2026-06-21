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
  images: string[];
  sizes: string[];
};

export function ProductDetails({ id, name, description, price, imageUrl, images, sizes }: Props) {
  const allImages = [imageUrl, ...images];
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [isZooming, setIsZooming] = useState(false);
  const { addItem } = useCart();

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  }

  function handleAddToCart() {
    if (sizes.length > 0 && !selectedSize) {
      setError("Selecione um tamanho");
      return;
    }
    setError("");
    addItem({ id, name, price, imageUrl, size: selectedSize || "Único", quantity });
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
        <div>
          <div
            className="relative aspect-square bg-white overflow-hidden rounded-sm border border-gray-100 cursor-zoom-in"
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => { setIsZooming(false); setZoomStyle({}); }}
            onMouseMove={handleMouseMove}
          >
            <Image
              src={allImages[selectedImage]}
              alt={name}
              fill
              className="object-contain p-4 transition-transform duration-150 ease-out"
              style={isZooming ? zoomStyle : {}}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-sm overflow-hidden border-2 cursor-pointer transition-colors ${
                    selectedImage === i ? "border-black" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${name} - foto ${i + 1}`}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">
            Alive Store
          </p>
          <h1 className="text-3xl font-bold text-black tracking-tight">{name}</h1>

          <div className="mt-4">
            <p className="text-3xl font-black text-black">
              R$ {price.toFixed(2).replace(".", ",")}
            </p>
          </div>

          <p className="text-sm text-gray-500 mt-6 leading-relaxed">{description}</p>

          {sizes.length > 0 && (
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
          )}

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
