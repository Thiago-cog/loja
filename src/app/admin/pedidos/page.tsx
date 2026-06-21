"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type OrderItem = {
  id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  status: string;
  paymentStatus: string;
  paymentId: string | null;
  checkoutUrl: string | null;
  total: number;
  createdAt: string;
  items: OrderItem[];
};

const STATUS_OPTIONS = [
  { value: "pendente", label: "Pendente", color: "bg-yellow-100 text-yellow-700" },
  { value: "confirmado", label: "Confirmado", color: "bg-blue-100 text-blue-700" },
  { value: "enviado", label: "Enviado", color: "bg-purple-100 text-purple-700" },
  { value: "entregue", label: "Entregue", color: "bg-green-100 text-green-700" },
  { value: "cancelado", label: "Cancelado", color: "bg-red-100 text-red-700" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/orders").then(async (res) => {
      if (cancelled) return;
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      setOrders(await res.json());
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [router]);

  async function handleStatusChange(orderId: string, status: string) {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  }

  function getStatusStyle(status: string) {
    return STATUS_OPTIONS.find((s) => s.value === status)?.color ?? "bg-gray-100 text-gray-700";
  }

  const filtered = filterStatus
    ? orders.filter((o) => o.status === filterStatus)
    : orders;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-black transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 7.5 12l8.25-7.5" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold">Pedidos</h1>
        </div>
        <a
          href={`/api/admin/orders/export${filterStatus ? `?status=${filterStatus}` : ""}`}
          className="bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors"
        >
          Exportar CSV
        </a>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilterStatus("")}
          className={`px-3 py-1.5 text-xs font-medium rounded-sm cursor-pointer ${
            !filterStatus ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Todos ({orders.length})
        </button>
        {STATUS_OPTIONS.map((s) => {
          const count = orders.filter((o) => o.status === s.value).length;
          return (
            <button
              key={s.value}
              onClick={() => setFilterStatus(s.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm cursor-pointer ${
                filterStatus === s.value ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-sm p-12 text-center text-gray-500">
          Nenhum pedido encontrado.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-sm">
              <button
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{order.customerName}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")} — {order.customerPhone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-sm font-medium ${
                    order.paymentStatus === "aprovado" ? "bg-green-100 text-green-700"
                      : order.paymentStatus === "rejeitado" ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    Pag: {order.paymentStatus}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-sm font-medium ${getStatusStyle(order.status)}`}>
                    {STATUS_OPTIONS.find((s) => s.value === order.status)?.label ?? order.status}
                  </span>
                  <span className="text-sm font-bold">R$ {order.total.toFixed(2)}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 text-gray-400 transition-transform ${expandedId === order.id ? "rotate-180" : ""}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </button>

              {expandedId === order.id && (
                <div className="border-t border-gray-100 px-5 py-4">
                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.quantity}x {item.name} — Tam: {item.size}
                        </span>
                        <span className="font-medium">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {order.checkoutUrl && order.paymentStatus === "pendente" && (
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mb-3">
                      <span className="text-xs text-gray-500 mr-1">Link de pagamento:</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(order.checkoutUrl!);
                          alert("Link copiado!");
                        }}
                        className="text-xs px-3 py-1.5 rounded-sm bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                      >
                        Copiar link
                      </button>
                      <a
                        href={`https://wa.me/55${order.customerPhone}?text=${encodeURIComponent(
                          `Olá ${order.customerName}! Segue o link para pagamento do seu pedido na Alive Store (R$ ${order.total.toFixed(2)}):\n${order.checkoutUrl}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-3 py-1.5 rounded-sm bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        Enviar via WhatsApp
                      </a>
                    </div>
                  )}
                  <div className="flex items-center flex-wrap gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={async () => {
                        const res = await fetch(`/api/admin/orders/${order.id}/sync`, { method: "POST" });
                        if (res.ok) {
                          const updated = await res.json();
                          setOrders((prev) =>
                            prev.map((o) => (o.id === order.id ? updated : o))
                          );
                        } else {
                          const data = await res.json();
                          alert(data.error || "Erro ao sincronizar");
                        }
                      }}
                      className="text-xs px-3 py-1.5 rounded-sm bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                    >
                      Sincronizar pagamento
                    </button>
                    <span className="text-xs text-gray-300">|</span>
                    <span className="text-xs text-gray-500">Status:</span>
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => handleStatusChange(order.id, s.value)}
                        className={`text-xs px-3 py-1.5 rounded-sm cursor-pointer transition-colors ${
                          order.status === s.value
                            ? s.color + " font-bold"
                            : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
