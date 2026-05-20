import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { settingsSchema } from "@/lib/validations";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: session.organizationId },
    select: {
      id: true,
      name: true,
      defaultLowStockThreshold: true,
    },
  });

  return NextResponse.json({ settings: org });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const org = await prisma.organization.update({
      where: { id: session.organizationId },
      data: {
        defaultLowStockThreshold: parsed.data.defaultLowStockThreshold,
      },
      select: {
        id: true,
        name: true,
        defaultLowStockThreshold: true,
      },
    });

    return NextResponse.json({ settings: org });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
