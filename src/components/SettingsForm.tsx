"use client";

import { useState } from "react";

type SettingsFormProps = {
  initialThreshold: number;
};

export function SettingsForm({ initialThreshold }: SettingsFormProps) {
  const [threshold, setThreshold] = useState(initialThreshold);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ defaultLowStockThreshold: threshold }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError("Could not save settings.");
      return;
    }

    setThreshold(data.settings.defaultLowStockThreshold);
    setMessage("Settings saved.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Default low stock threshold
        </label>
        <p className="mb-2 text-xs text-slate-500">
          Used when a product has no individual threshold set.
        </p>
        <input
          type="number"
          min={0}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {message && (
        <p className="text-sm text-green-600">{message}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
