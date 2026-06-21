import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
            quantity: number;
            price: number;
          }) => ({
            productId: item.id,
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
          })
        ),
      },
    },
    include: { items: true },
  });

  return NextResponse.json(order, { status: 201 });
}
