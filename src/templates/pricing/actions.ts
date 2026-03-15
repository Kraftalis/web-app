"use server";

import { revalidatePath } from "next/cache";

/**
 * Pricing server actions — mock stubs (no DB).
 * TODO: Replace with real Prisma calls when backend is ready.
 */

export async function createPackageAction(
  _formData: FormData,
): Promise<{ success?: boolean; error?: string }> {
  revalidatePath("/pricing");
  return { success: true };
}

export async function updatePackageAction(
  _id: string,
  _formData: FormData,
): Promise<{ success?: boolean; error?: string }> {
  revalidatePath("/pricing");
  return { success: true };
}

export async function deletePackageAction(
  _id: string,
): Promise<{ success?: boolean; error?: string }> {
  revalidatePath("/pricing");
  return { success: true };
}

export async function createAddOnAction(
  _formData: FormData,
): Promise<{ success?: boolean; error?: string }> {
  revalidatePath("/pricing");
  return { success: true };
}

export async function updateAddOnAction(
  _id: string,
  _formData: FormData,
): Promise<{ success?: boolean; error?: string }> {
  revalidatePath("/pricing");
  return { success: true };
}

export async function deleteAddOnAction(
  _id: string,
): Promise<{ success?: boolean; error?: string }> {
  revalidatePath("/pricing");
  return { success: true };
}
