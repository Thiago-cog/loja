import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { syncOrderByPaymentId } from "@/lib/paymentSync";

function isValidSignature(request: NextRequest, dataId: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("[mp-webhook] MERCADOPAGO_WEBHOOK_SECRET não definido — pulando verificação de assinatura");
    return true;
  }

  const sigHeader = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");
  if (!sigHeader || !requestId) return false;

  const parts = Object.fromEntries(
    sigHeader.split(",").map((p) => {
      const [key, value] = p.trim().split("=");
      return [key, value];
    })
  );
  const { ts, v1 } = parts;
  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

  const expectedBuf = Buffer.from(expected);
  const receivedBuf = Buffer.from(v1);
  if (expectedBuf.length !== receivedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      return NextResponse.json({ received: true });
    }

    const dataId = request.nextUrl.searchParams.get("data.id") || String(paymentId);
    if (!isValidSignature(request, dataId)) {
      console.error("[mp-webhook] assinatura inválida, notificação ignorada");
      return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
    }

    await syncOrderByPaymentId(paymentId);
  } catch (error) {
    console.error("[mp-webhook] erro ao processar notificação:", error);
  }

  return NextResponse.json({ received: true });
}
