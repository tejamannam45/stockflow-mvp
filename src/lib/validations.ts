import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  organizationName: z.string().min(1, "Organization name is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional(),
  quantityOnHand: z.coerce.number().int().min(0, "Quantity must be 0 or more"),
  costPrice: z.coerce.number().min(0).optional().nullable(),
  sellingPrice: z.coerce.number().min(0).optional().nullable(),
  lowStockThreshold: z.coerce.number().int().min(0).optional().nullable(),
});

export const settingsSchema = z.object({
  defaultLowStockThreshold: z.coerce.number().int().min(0),
});
