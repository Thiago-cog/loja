import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/user-auth";

export async function GET() {
  const user = await getUserSession();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user });
}
