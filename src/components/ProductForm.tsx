"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type ProductFormValues = {
  name: string;
  sku: string;
  description?: string;
  quantityOnHand: number;
  costPrice?: number | null;
  sellingPrice?: number | null;
  lowStockThreshold?: number | null;
};

type ProductFormProps = {
  initial?: ProductFormValues;
  productId?: string;
};

export function ProductForm({ initial, productId }: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name")),
      sku: String(form.get("sku")),
      description: String(form.get("description") || ""),
      quantityOnHand: Number(form.get("quantityOnHand")),
      costPrice: form.get("costPrice")
        ? Number(form.get("costPrice"))
        : null,
      sellingPrice: form.get("sellingPrice")
        ? Number(form.get("sellingPrice"))
        : null,
      lowStockThreshold: form.get("lowStockThreshold")
        ? Number(form.get("lowStockThreshold"))
        : null,
    };

    const url = productId ? `/api/products/${productId}` : "/api/products";
    const method = productId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Could not save product. Check your input."
        );
        return;
      }

      router.push("/products");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Name *</label>
        <input
          name="name"
          required
          defaultValue={initial?.name}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">SKU *</label>
        <input
          name="sku"
          required
          defaultValue={initial?.sku}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ""}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Quantity on hand *
          </label>
          <input
            name="quantityOnHand"
            type="number"
            min={0}
            required
            defaultValue={initial?.quantityOnHand ?? 0}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Low stock threshold
          </label>
          <input
            name="lowStockThreshold"
            type="number"
            min={0}
            defaultValue={initial?.lowStockThreshold ?? ""}
            placeholder="Uses org default if empty"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Cost price</label>
          <input
            name="costPrice"
            type="number"
            min={0}
            step="0.01"
            defaultValue={initial?.costPrice ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Selling price</label>
          <input
            name="sellingPrice"
            type="number"
            min={0}
            step="0.01"
            defaultValue={initial?.sellingPrice ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Saving…" : productId ? "Update product" : "Create product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
