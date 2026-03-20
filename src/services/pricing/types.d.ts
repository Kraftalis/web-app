// ─── Shared API types ───────────────────────────────────────

/**
 * Category reference (embedded in Package).
 */
export interface CategoryRef {
  id: string;
  name: string;
}

/**
 * Full category with subcategories.
 */
export interface Category {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  subcategories: Subcategory[];
}

/**
 * Subcategory within a category.
 */
export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * A price variation within a package.
 * e.g. "2 Orang – 1 Jam" at 200,000 IDR
 * Generic for any vendor type (photography, MUA, decoration, WO, etc.)
 */
export interface PackageVariation {
  id: string;
  label: string; // Short name: "2 Orang – 1 Jam", "Pengantin", "100 Pax"
  description: string | null; // Optional detail text / inclusions
  price: string; // Decimal as string
  sortOrder: number;
}

/**
 * Vendor package.
 * items[] = price variations. If empty, package.price is the flat price.
 */
export interface Package {
  id: string;
  vendorId: string;
  name: string;
  description: string | null;
  price: string; // Base/fallback price (Decimal as string). 0 when variations exist.
  currency: string;
  isActive: boolean;
  sortOrder: number;
  inclusions: string[];
  category: CategoryRef | null;
  subcategory: CategoryRef | null;
  createdAt: string;
  updatedAt: string;
  items: PackageVariation[]; // Price variations (empty = single flat price)
}

/**
 * Vendor add-on.
 */
export interface AddOn {
  id: string;
  vendorId: string;
  name: string;
  description: string | null;
  price: string; // Decimal as string
  currency: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response shape from GET /api/pricing.
 */
export interface PricingData {
  packages: Package[];
  addOns: AddOn[];
}

/**
 * Pagination metadata from the API.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

/**
 * Query params for fetching packages.
 */
export interface PricingQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  categoryId?: string;
  subcategoryId?: string;
  isActive?: "true" | "false" | "all";
}

/**
 * Query params for fetching add-ons (separate from packages).
 */
export interface AddOnQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortDir?: "asc" | "desc";
  isActive?: "true" | "false" | "all";
}

// ─── Payloads ───────────────────────────────────────────────

export interface PackageVariationPayload {
  label: string;
  description?: string | null;
  price: number;
  sortOrder?: number;
}

export interface CreatePackagePayload {
  type: "package";
  name: string;
  description?: string | null;
  price?: number; // 0 when all pricing is handled by variations
  currency?: string;
  categoryId?: string | null;
  subcategoryId?: string | null;
  inclusions?: string[];
  variations?: PackageVariationPayload[];
  sortOrder?: number;
}

export interface UpdatePackagePayload {
  name?: string;
  description?: string | null;
  price?: number;
  currency?: string;
  isActive?: boolean;
  categoryId?: string | null;
  subcategoryId?: string | null;
  inclusions?: string[];
  variations?: PackageVariationPayload[];
  sortOrder?: number;
}

export interface CreateAddOnPayload {
  type: "addon";
  name: string;
  description?: string | null;
  price: number;
  currency?: string;
  sortOrder?: number;
}

export interface UpdateAddOnPayload {
  name?: string;
  description?: string | null;
  price?: number;
  currency?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string | null;
  sortOrder?: number;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateSubcategoryPayload {
  categoryId: string;
  name: string;
  description?: string | null;
  sortOrder?: number;
}

export interface UpdateSubcategoryPayload {
  name?: string;
  description?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}
