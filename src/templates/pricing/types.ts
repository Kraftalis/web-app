export interface PackageVariation {
  id: string;
  label: string;
  description: string | null;
  price: string;
}

export interface Package {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  isActive: boolean;
  items: PackageVariation[];
  // Optional list of inclusions / what's included in the package
  inclusions?: string[];
  // Category metadata
  category?: string;
  subcategory?: string;
}

export interface AddOn {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  isActive: boolean;
}
