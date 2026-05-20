import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, isLowStock } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: session.organizationId },
  });

  const products = await prisma.product.findMany({
    where: { organizationId: session.organizationId },
  });

  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantityOnHand, 0);

  const lowStockItems = products
    .filter((p) =>
      isLowStock(p.quantityOnHand, p.lowStockThreshold, org.defaultLowStockThreshold)
    )
    .map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      quantityOnHand: p.quantityOnHand,
      lowStockThreshold:
        p.lowStockThreshold ?? org.defaultLowStockThreshold,
    }))
    .sort((a, b) => a.quantityOnHand - b.quantityOnHand);

  return NextResponse.json({
    summary: {
      totalProducts,
      totalQuantity,
      organizationName: org.name,
    },
    lowStockItems,
  });
}
