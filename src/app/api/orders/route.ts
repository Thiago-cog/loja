import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { preference } from "@/lib/mercadopago";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { customerName, customerPhone, items } = body;

  if (!customerName || !customerPhone || !items?.length) {
    return NextResponse.json(
      { error: "Nome, telefone e itens são obrigatórios" },
      { status: 400 }
    );
  }

  const total = items.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      customerName,
      customerPhone,
      total,
      items: {
        create: items.map(
          (item: {
            id: string;
            name: string;
            size: string;
            model?: string;
            quantity: number;
            price: number;
          }) => ({
            productId: item.id,
            name: item.name,
            size: item.size,
            model: item.model || "",
            quantity: item.quantity,
            price: item.price,
          })
        ),
      },
    },
    include: { items: true },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const pref = await preference.create({
    body: {
      items: order.items.map((item) => ({
        id: item.id,
        title: `${item.name}${item.model ? ` - ${item.model}` : ""} - Tam: ${item.size}`,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: "BRL",
      })),
      payer: {
        name: customerName,
        phone: { number: customerPhone },
      },
      external_reference: order.id,
      back_urls: {
        success: `${appUrl}/pedido/sucesso?order=${order.id}`,
        failure: `${appUrl}/pedido/falha?order=${order.id}`,
        pending: `${appUrl}/pedido/pendente?order=${order.id}`,
      },
      auto_return: "approved",
      notification_url: `${appUrl}/api/webhooks/mercadopago`,
    },
  });

  const checkoutUrl = pref.init_point!;

  await prisma.order.update({
    where: { id: order.id },
    data: { checkoutUrl },
  });

  return NextResponse.json({
    orderId: order.id,
    checkoutUrl,
  }, { status: 201 });
}
