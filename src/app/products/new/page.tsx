import { AppShell } from "@/components/AppShell";
import { ProductForm } from "@/components/ProductForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <AppShell organizationName={session.organizationName}>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Add product</h1>
      <ProductForm />
    </AppShell>
  );
}
