import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { payment } from "@/lib/mercadopago";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  const searchResult = await payment.search({
    options: {
      criteria: "desc",
      sort: "date_created",
      external_reference: id,
    },
  });

  const results = searchResult.results;
  if (!results || results.length === 0) {
    return NextResponse.json({ error: "Nenhum pagamento encontrado no Mercado Pago" }, { status: 404 });
  }

  const latestPayment = results[0];

  let paymentStatus = "pendente";
  let orderStatus = order.status;

  switch (latestPayment.status) {
    case "approved":
      paymentStatus = "aprovado";
      orderStatus = "confirmado";
      break;
    case "pending":
    case "in_process":
      paymentStatus = "pendente";
      break;
    case "rejected":
    case "cancelled":
      paymentStatus = "rejeitado";
      orderStatus = "cancelado";
      break;
    case "refunded":
      paymentStatus = "reembolsado";
      orderStatus = "cancelado";
      break;
  }

  const updated = await prisma.order.update({
    where: { id },
    data: {
      paymentId: String(latestPayment.id),
      paymentStatus,
      status: orderStatus,
    },
    include: { items: true },
  });

  return NextResponse.json(updated);
}
