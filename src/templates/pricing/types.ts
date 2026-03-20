export interface PackageVariation {
  id: string;
  label: string;
  description: string | null;
  price: string;
}

export interface CategoryRef {
  id: string;
  name: string;
}

export interface Package {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  isActive: boolean;
  items: PackageVariation[];
  // Inclusions / what's included in the package
  inclusions: string[];
  // Category metadata
  category: CategoryRef | null;
  subcategory: CategoryRef | null;
}

export interface AddOn {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
}
