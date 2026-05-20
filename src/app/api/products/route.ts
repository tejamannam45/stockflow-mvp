import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, isLowStock } from "@/lib/auth";
import { productSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim().toLowerCase();

  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: session.organizationId },
  });

  const products = await prisma.product.findMany({
    where: {
      organizationId: session.organizationId,
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { sku: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  const enriched = products.map((p) => ({
    ...p,
    isLowStock: isLowStock(
      p.quantityOnHand,
      p.lowStockThreshold,
      org.defaultLowStockThreshold
    ),
    effectiveThreshold:
      p.lowStockThreshold ?? org.defaultLowStockThreshold,
  }));

  return NextResponse.json({ products: enriched });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const existing = await prisma.product.findUnique({
      where: {
        organizationId_sku: {
          organizationId: session.organizationId,
          sku: data.sku,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "SKU already exists for this organization" },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        organizationId: session.organizationId,
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

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
