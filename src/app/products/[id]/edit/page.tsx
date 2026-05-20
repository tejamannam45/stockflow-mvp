import { AppShell } from "@/components/AppShell";
import { ProductForm } from "@/components/ProductForm";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { id, organizationId: session.organizationId },
  });

  if (!product) notFound();

  return (
    <AppShell organizationName={session.organizationName}>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit product</h1>
      <ProductForm
        productId={product.id}
        initial={{
          name: product.name,
          sku: product.sku,
          description: product.description ?? undefined,
          quantityOnHand: product.quantityOnHand,
          costPrice: product.costPrice,
          sellingPrice: product.sellingPrice,
          lowStockThreshold: product.lowStockThreshold,
        }}
      />
    </AppShell>
  );
}
