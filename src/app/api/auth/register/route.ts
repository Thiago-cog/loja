import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createUserSession } from "@/lib/user-auth";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const { name, email, phone, password } = await request.json();

  if (!name || !email || !phone || !password) {
    return NextResponse.json(
      { error: "Todos os campos são obrigatórios" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "A senha deve ter pelo menos 6 caracteres" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Este email já está cadastrado" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, phone: phone.replace(/\D/g, ""), password: hashedPassword },
  });

  await createUserSession({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
