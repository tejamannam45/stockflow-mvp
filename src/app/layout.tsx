import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StockFlow — Inventory MVP",
  description: "Multi-tenant SaaS inventory management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
