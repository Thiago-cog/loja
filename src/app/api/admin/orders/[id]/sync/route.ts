import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { syncOrderById } from "@/lib/paymentSync";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  const result = await syncOrderById(id);

  if (!result.ok) {
    const message =
      result.reason === "order_not_found"
        ? "Pedido não encontrado"
        : "Nenhum pagamento encontrado no Mercado Pago";
    return NextResponse.json({ error: message }, { status: 404 });
  }

  return NextResponse.json(result.order);
}
