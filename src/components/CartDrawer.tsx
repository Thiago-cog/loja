"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import Image from "next/image";

type Step = "cart" | "checkout" | "success";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, isOpen, setIsOpen } =
    useCart();
  const { user } = useUser();
  const [step, setStep] = useState<Step>("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  function handleGoToCheckout() {
    if (user) {
      setName((prev) => prev || user.name);
      setPhone((prev) => prev || formatPhone(user.phone));
    }
    setStep("checkout");
  }
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  function handleClose() {
    setIsOpen(false);
    if (step === "success") {
      setStep("cart");
      setName("");
      setPhone("");
    }
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  async function handleSubmitOrder() {
    if (!name.trim()) {
      setError("Informe seu nome");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Informe um telefone válido");
      return;
    }

    setSending(true);
    setError("");

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: name.trim(),
        customerPhone: phone.replace(/\D/g, ""),
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          size: i.size,
          quantity: i.quantity,
          price: i.price,
        })),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      clearCart();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setStep("success");
      }
    } else {
      setError("Erro ao enviar pedido. Tente novamente.");
    }
    setSending(false);
  }

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={handleClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-sm font-bold uppercase tracking-wider">
            {step === "cart" && `Carrinho (${items.length})`}
            {step === "checkout" && "Finalizar pedido"}
            {step === "success" && "Pedido enviado"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-black transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === "success" ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Pedido recebido!</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Entraremos em contato pelo telefone informado para confirmar seu pedido e combinar o pagamento.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors cursor-pointer"
            >
              Continuar comprando
            </button>
          </div>
        ) : step === "checkout" ? (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <p className="text-sm text-gray-500 mb-6">
                Preencha seus dados para enviar o pedido. Entraremos em contato para confirmar.
              </p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="checkout-name" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Nome completo
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-phone" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Telefone / WhatsApp
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-xs mt-3">{error}</p>}

              <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
                  Resumo do pedido
                </h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.id}__${item.size}`} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.quantity}x {item.name}{item.size !== "Único" ? ` (${item.size})` : ""}
                      </span>
                      <span className="font-medium">
                        R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 px-6 py-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total</span>
                <span className="text-xl font-bold">R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
              <button
                onClick={handleSubmitOrder}
                disabled={sending}
                className="w-full py-4 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {sending ? "Enviando..." : "Enviar pedido"}
              </button>
              <button
                onClick={() => setStep("cart")}
                className="w-full py-2 text-sm text-gray-500 hover:text-black transition-colors cursor-pointer"
              >
                Voltar ao carrinho
              </button>
            </div>
          </>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <p className="text-sm">Seu carrinho está vazio</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {items.map((item) => {
                const key = `${item.id}__${item.size}`;
                return (
                  <div key={key} className="flex gap-4">
                    <div className="relative w-20 h-24 rounded-sm overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        {item.size !== "Único" && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            Tam: {item.size}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded-sm">
                          <button
                            onClick={() => updateQuantity(key, item.quantity - 1)}
                            className="w-7 h-7 text-xs flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-7 h-7 text-xs flex items-center justify-center border-x border-gray-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(key, item.quantity + 1)}
                            className="w-7 h-7 text-xs flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold">
                            R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                          </span>
                          <button
                            onClick={() => removeItem(key)}
                            className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-gray-100 px-6 py-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total</span>
                <span className="text-xl font-bold">R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
              <button
                onClick={handleGoToCheckout}
                className="w-full py-4 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors cursor-pointer"
              >
                Fechar pedido
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
