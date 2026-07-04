import { prisma } from "@/lib/prisma";
import { payment } from "@/lib/mercadopago";

export function mapMercadoPagoStatus(
  mpStatus: string | undefined,
  currentOrderStatus: string
): { paymentStatus: string; orderStatus: string } {
  switch (mpStatus) {
    case "approved":
      return { paymentStatus: "aprovado", orderStatus: "confirmado" };
    case "pending":
    case "in_process":
      return { paymentStatus: "pendente", orderStatus: currentOrderStatus };
    case "rejected":
    case "cancelled":
      return { paymentStatus: "rejeitado", orderStatus: "cancelado" };
    case "refunded":
      return { paymentStatus: "reembolsado", orderStatus: "cancelado" };
    default:
      return { paymentStatus: "pendente", orderStatus: currentOrderStatus };
  }
}

export type SyncResult =
  | { ok: true; order: NonNullable<Awaited<ReturnType<typeof prisma.order.update>>> }
  | { ok: false; reason: "order_not_found" | "no_payment_found" | "missing_external_reference" };

async function applyPaymentToOrder(
  orderId: string,
  mpPaymentId: string | number,
  mpStatus: string | undefined,
  currentOrderStatus: string
) {
  const { paymentStatus, orderStatus } = mapMercadoPagoStatus(mpStatus, currentOrderStatus);
  return prisma.order.update({
    where: { id: orderId },
    data: { paymentId: String(mpPaymentId), paymentStatus, status: orderStatus },
    include: { items: true },
  });
}

/**
 * Usada quando só temos o id do pedido (botão manual, sincronização em massa).
 * Busca o pagamento mais recente associado ao pedido via external_reference.
 */
export async function syncOrderById(orderId: string): Promise<SyncResult> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return { ok: false, reason: "order_not_found" };
  }

  const searchResult = await payment.search({
    options: {
      criteria: "desc",
      sort: "date_created",
      external_reference: orderId,
    },
  });

  const latestPayment = searchResult.results?.[0];
  if (!latestPayment) {
    return { ok: false, reason: "no_payment_found" };
  }

  const updated = await applyPaymentToOrder(orderId, latestPayment.id!, latestPayment.status, order.status);
  return { ok: true, order: updated };
}

/**
 * Usada quando o Mercado Pago já entrega o id do pagamento diretamente (webhook).
 */
export async function syncOrderByPaymentId(mpPaymentId: string | number): Promise<SyncResult> {
  const paymentData = await payment.get({ id: mpPaymentId });

  const orderId = paymentData.external_reference;
  if (!orderId) {
    return { ok: false, reason: "missing_external_reference" };
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return { ok: false, reason: "order_not_found" };
  }

  const updated = await applyPaymentToOrder(orderId, mpPaymentId, paymentData.status, order.status);
  return { ok: true, order: updated };
}
