import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { password, token } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ success: true });
}
