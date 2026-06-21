import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { generateSlug } from "@/lib/slug";

export async function GET() {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, price, imageUrl, images, sizes, models } = body;

  if (!name || !description || price == null || !imageUrl) {
    return NextResponse.json(
      { error: "Todos os campos são obrigatórios" },
      { status: 400 }
    );
  }

  let slug = generateSlug(name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: Number(price),
      imageUrl,
      ...(images !== undefined && { images }),
      ...(sizes && { sizes }),
      ...(models !== undefined && { models }),
    },
  });

  return NextResponse.json(product, { status: 201 });
}
