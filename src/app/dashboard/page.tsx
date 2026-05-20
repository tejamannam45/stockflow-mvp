import { AppShell } from "@/components/AppShell";
import { getSession, isLowStock } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

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
    .sort((a, b) => a.quantityOnHand - b.quantityOnHand);

  return (
    <AppShell organizationName={session.organizationName}>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total products</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{totalProducts}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total units in stock</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{totalQuantity}</p>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Low stock items</h2>
          <p className="text-sm text-slate-500">
            Products at or below their low stock threshold
          </p>
        </div>
        {lowStockItems.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-500">
            No low stock items right now.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">SKU</th>
                  <th className="px-6 py-3 font-medium">Qty on hand</th>
                  <th className="px-6 py-3 font-medium">Threshold</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100">
                    <td className="px-6 py-3 font-medium">{p.name}</td>
                    <td className="px-6 py-3 text-slate-600">{p.sku}</td>
                    <td className="px-6 py-3">
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">
                        {p.quantityOnHand}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      {p.lowStockThreshold ?? org.defaultLowStockThreshold}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}
