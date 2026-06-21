import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { payment } from "@/lib/mercadopago";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.type === "payment") {
    const paymentId = body.data?.id;
    if (!paymentId) {
      return NextResponse.json({ received: true });
    }

    const paymentData = await payment.get({ id: paymentId });

    const orderId = paymentData.external_reference;
    if (!orderId) {
      return NextResponse.json({ received: true });
    }

    let paymentStatus = "pendente";
    let orderStatus = "pendente";

    switch (paymentData.status) {
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

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentId: String(paymentId),
        paymentStatus,
        status: orderStatus,
      },
    });
  }

  return NextResponse.json({ received: true });
}
