"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  sku: string;
  quantityOnHand: number;
  sellingPrice: number | null;
  isLowStock: boolean;
  effectiveThreshold: number;
};

export function ProductsTable() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProducts = useCallback(async (q?: string) => {
    setLoading(true);
    const params = q ? `?q=${encodeURIComponent(q)}` : "";
    const res = await fetch(`/api/products${params}`);
    const data = await res.json();
    if (res.ok) setProducts(data.products);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(query), 300);
    return () => clearTimeout(timer);
  }, [query, fetchProducts]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeleteId(id);
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    }
    setDeleteId(null);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input
          type="search"
          placeholder="Search by name or SKU…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <Link
          href="/products/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add product
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="px-6 py-8 text-sm text-slate-500">Loading…</p>
        ) : products.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-500">
            No products yet. Create your first product.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">SKU</th>
                <th className="px-6 py-3 font-medium">Quantity</th>
                <th className="px-6 py-3 font-medium">Low stock</th>
                <th className="px-6 py-3 font-medium">Selling price</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-slate-100">
                  <td className="px-6 py-3 font-medium">{p.name}</td>
                  <td className="px-6 py-3 text-slate-600">{p.sku}</td>
                  <td className="px-6 py-3">{p.quantityOnHand}</td>
                  <td className="px-6 py-3">
                    {p.isLowStock ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                        Low
                      </span>
                    ) : (
                      <span className="text-slate-400">OK</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {p.sellingPrice != null
                      ? `$${p.sellingPrice.toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/products/${p.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={deleteId === p.id}
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:underline disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
