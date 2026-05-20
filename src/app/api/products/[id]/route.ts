import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { productSchema } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const product = await prisma.product.findFirst({
    where: { id, organizationId: session.organizationId },
  });

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const existing = await prisma.product.findFirst({
      where: { id, organizationId: session.organizationId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (data.sku !== existing.sku) {
      const skuConflict = await prisma.product.findUnique({
        where: {
          organizationId_sku: {
            organizationId: session.organizationId,
            sku: data.sku,
          },
        },
      });
      if (skuConflict) {
        return NextResponse.json(
          { error: "SKU already exists for this organization" },
          { status: 409 }
        );
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        sku: data.sku,
        description: data.description || null,
        quantityOnHand: data.quantityOnHand,
        costPrice: data.costPrice ?? null,
        sellingPrice: data.sellingPrice ?? null,
        lowStockThreshold: data.lowStockThreshold ?? null,
        lastUpdatedBy: session.email,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const existing = await prisma.product.findFirst({
    where: { id, organizationId: session.organizationId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
