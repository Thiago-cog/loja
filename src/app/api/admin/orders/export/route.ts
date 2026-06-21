import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status");

  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const BOM = "﻿";
  const header = "Pedido;Data;Cliente;Telefone;Produto;Tamanho;Quantidade;Preço Unit.;Subtotal;Total Pedido;Status;Pagamento";
  const rows = orders.flatMap((order) =>
    order.items.map((item) =>
      [
        order.id,
        new Date(order.createdAt).toLocaleDateString("pt-BR"),
        `"${order.customerName}"`,
        order.customerPhone,
        `"${item.name}"`,
        item.size,
        item.quantity,
        item.price.toFixed(2).replace(".", ","),
        (item.price * item.quantity).toFixed(2).replace(".", ","),
        order.total.toFixed(2).replace(".", ","),
        order.status,
        order.paymentStatus,
      ].join(";")
    )
  );

  const csv = BOM + header + "\n" + rows.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pedidos-pibam-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
