import { AppShell } from "@/components/AppShell";
import { SettingsForm } from "@/components/SettingsForm";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: session.organizationId },
  });

  return (
    <AppShell organizationName={session.organizationName}>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Settings</h1>
      <SettingsForm initialThreshold={org.defaultLowStockThreshold} />
    </AppShell>
  );
}
