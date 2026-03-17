"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout";
import {
  Card,
  CardBody,
  Badge,
  Button,
  Input,
  Textarea,
  Modal,
} from "@/components/ui";
import { IconPlus, IconEdit, IconPricing, IconCheck } from "@/components/icons";
import { useDictionary } from "@/i18n";

// ─── Types ──────────────────────────────────────────────────

interface PackageVariation {
  id: string;
  label: string;
  description: string | null;
  price: string; // Decimal as string
}

interface Package {
  id: string;
  name: string;
  description: string | null;
  price: string; // Fallback price when no variations
  currency: string;
  isActive: boolean;
  items: PackageVariation[]; // price variations
}

interface AddOn {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  isActive: boolean;
}

interface PricingTemplateProps {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  packages: Package[];
  addOns: AddOn[];
}

// ─── Helpers ────────────────────────────────────────────────

function formatCurrency(amount: string | number, currency = "IDR") {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

function getDisplayPrice(pkg: Package): { label: string; isRange: boolean } {
  if (pkg.items.length === 0) {
    return { label: formatCurrency(pkg.price, pkg.currency), isRange: false };
  }
  const prices = pkg.items
    .map((v) => parseFloat(v.price))
    .filter((n) => !isNaN(n));
  if (prices.length === 0) return { label: "-", isRange: false };
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max)
    return { label: formatCurrency(min, pkg.currency), isRange: false };
  return {
    label: `${formatCurrency(min, pkg.currency)} – ${formatCurrency(max, pkg.currency)}`,
    isRange: true,
  };
}

// ─── Variation Form Row ──────────────────────────────────────

interface VariationRowProps {
  variation: { label: string; description: string; price: string };
  index: number;
  onChange: (
    index: number,
    field: "label" | "description" | "price",
    value: string,
  ) => void;
  onRemove: (index: number) => void;
  labelPlaceholder: string;
  descPlaceholder: string;
}

function VariationRow({
  variation,
  index,
  onChange,
  onRemove,
  labelPlaceholder,
  descPlaceholder,
}: VariationRowProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2">
      <div className="flex items-start gap-2">
        <div className="flex-1 space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              type="text"
              value={variation.label}
              onChange={(e) => onChange(index, "label", e.target.value)}
              placeholder={labelPlaceholder}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="number"
              value={variation.price}
              onChange={(e) => onChange(index, "price", e.target.value)}
              placeholder="0"
              min="0"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <input
            type="text"
            value={variation.description}
            onChange={(e) => onChange(index, "description", e.target.value)}
            placeholder={descPlaceholder}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="mt-1 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          aria-label="Remove variation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────

export default function PricingTemplate({
  user,
  packages: initialPackages,
  addOns: initialAddOns,
}: PricingTemplateProps) {
  const { dict } = useDictionary();
  const pricing = dict.pricing;

  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [addOns, setAddOns] = useState<AddOn[]>(initialAddOns);

  // Package modal state
  const [pkgModalOpen, setPkgModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [deletingPkgId, setDeletingPkgId] = useState<string | null>(null);

  // Variation editor state inside modal
  const [variations, setVariations] = useState<
    { label: string; description: string; price: string }[]
  >([]);

  // AddOn modal state
  const [addonModalOpen, setAddonModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<AddOn | null>(null);
  const [deletingAddonId, setDeletingAddonId] = useState<string | null>(null);

  // ─── Open package modal ──────────────────────────────────

  const openAddPkg = () => {
    setEditingPkg(null);
    setVariations([]);
    setPkgModalOpen(true);
  };

  const openEditPkg = (pkg: Package) => {
    setEditingPkg(pkg);
    setVariations(
      pkg.items.map((v) => ({
        label: v.label,
        description: v.description ?? "",
        price: v.price,
      })),
    );
    setPkgModalOpen(true);
  };

  // ─── Variation helpers ───────────────────────────────────

  const addVariation = () =>
    setVariations((prev) => [
      ...prev,
      { label: "", description: "", price: "" },
    ]);

  const updateVariation = (
    index: number,
    field: "label" | "description" | "price",
    value: string,
  ) =>
    setVariations((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );

  const removeVariation = (index: number) =>
    setVariations((prev) => prev.filter((_, i) => i !== index));

  // ─── Package CRUD ────────────────────────────────────────

  const handleSavePackage = (formData: FormData) => {
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || null;
    const flatPrice = (formData.get("flatPrice") as string) || "0";
    const currency = (formData.get("currency") as string) || "IDR";
    const isActive = formData.get("isActive") === "true";

    const validVariations = variations.filter(
      (v) => v.label.trim() && v.price !== "",
    );

    const minPrice =
      validVariations.length > 0
        ? String(
            Math.min(...validVariations.map((v) => parseFloat(v.price) || 0)),
          )
        : flatPrice;

    const newItems: PackageVariation[] = validVariations.map((v) => ({
      id: crypto.randomUUID(),
      label: v.label.trim(),
      description: v.description.trim() || null,
      price: v.price,
    }));

    if (editingPkg) {
      setPackages((prev) =>
        prev.map((p) =>
          p.id === editingPkg.id
            ? {
                ...p,
                name,
                description,
                price: minPrice,
                currency,
                isActive,
                items: newItems,
              }
            : p,
        ),
      );
    } else {
      setPackages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          name,
          description,
          price: minPrice,
          currency,
          isActive,
          items: newItems,
        },
      ]);
    }

    setPkgModalOpen(false);
    setEditingPkg(null);
    setVariations([]);
  };

  const handleDeletePackage = (id: string) => {
    if (deletingPkgId === id) {
      setPackages((prev) => prev.filter((p) => p.id !== id));
      setDeletingPkgId(null);
    } else {
      setDeletingPkgId(id);
      setTimeout(() => setDeletingPkgId(null), 3000);
    }
  };

  // ─── AddOn CRUD ──────────────────────────────────────────

  const handleSaveAddOn = (formData: FormData) => {
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || null;
    const price = formData.get("price") as string;
    const currency = (formData.get("currency") as string) || "IDR";
    const isActive = formData.get("isActive") === "true";

    if (editingAddon) {
      setAddOns((prev) =>
        prev.map((a) =>
          a.id === editingAddon.id
            ? { ...a, name, description, price, currency, isActive }
            : a,
        ),
      );
    } else {
      setAddOns((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          name,
          description,
          price,
          currency,
          isActive,
        },
      ]);
    }
    setAddonModalOpen(false);
    setEditingAddon(null);
  };

  const handleDeleteAddOn = (id: string) => {
    if (deletingAddonId === id) {
      setAddOns((prev) => prev.filter((a) => a.id !== id));
      setDeletingAddonId(null);
    } else {
      setDeletingAddonId(id);
      setTimeout(() => setDeletingAddonId(null), 3000);
    }
  };

  return (
    <AppLayout user={user}>
      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pricing.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{pricing.subtitle}</p>
        </div>

        {/* ─── Packages Section ─────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {pricing.packagesTitle}
            </h2>
            <Button variant="primary" size="sm" onClick={openAddPkg}>
              <IconPlus size={16} />
              <span className="ml-1">{pricing.addPackage}</span>
            </Button>
          </div>

          {packages.length === 0 ? (
            <Card>
              <CardBody className="py-12 text-center">
                <IconPricing size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">
                  {pricing.noPackages}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {pricing.noPackagesDesc}
                </p>
              </CardBody>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => {
                const display = getDisplayPrice(pkg);
                return (
                  <Card key={pkg.id}>
                    <CardBody className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {pkg.name}
                          </h3>
                          {pkg.description && (
                            <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                              {pkg.description}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={pkg.isActive ? "success" : "default"}
                          className="shrink-0"
                        >
                          {pkg.isActive ? pricing.active : pricing.archived}
                        </Badge>
                      </div>

                      {/* Price */}
                      <div>
                        {display.isRange && (
                          <p className="text-xs text-gray-400 mb-0.5">
                            {pricing.startingFrom}
                          </p>
                        )}
                        <p className="text-lg font-bold text-gray-900">
                          {display.label}
                        </p>
                      </div>

                      {/* Variations */}
                      {pkg.items.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {pricing.variationsTitle}
                          </p>
                          <ul className="space-y-1">
                            {pkg.items.map((variation) => (
                              <li
                                key={variation.id}
                                className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2.5 py-1.5"
                              >
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <IconCheck
                                    size={12}
                                    className="shrink-0 text-green-500"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium text-gray-700 truncate">
                                      {variation.label}
                                    </p>
                                    {variation.description && (
                                      <p className="text-xs text-gray-400 truncate">
                                        {variation.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <span className="text-xs font-semibold text-gray-900 shrink-0">
                                  {formatCurrency(
                                    variation.price,
                                    pkg.currency,
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditPkg(pkg)}
                        >
                          <IconEdit size={14} />
                          <span className="ml-1">{dict.common.edit}</span>
                        </Button>
                        <Button
                          variant={
                            deletingPkgId === pkg.id ? "danger" : "outline"
                          }
                          size="sm"
                          onClick={() => handleDeletePackage(pkg.id)}
                        >
                          {deletingPkgId === pkg.id
                            ? pricing.confirmDelete
                            : dict.common.delete}
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* ─── Add-ons Section ──────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {pricing.addOnsTitle}
            </h2>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingAddon(null);
                setAddonModalOpen(true);
              }}
            >
              <IconPlus size={16} />
              <span className="ml-1">{pricing.addAddOn}</span>
            </Button>
          </div>

          {addOns.length === 0 ? (
            <Card>
              <CardBody className="py-12 text-center">
                <IconPricing size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">
                  {pricing.noAddOns}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {pricing.noAddOnsDesc}
                </p>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody className="-mx-1 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500">
                      <th className="px-3 py-2 font-medium">
                        {pricing.colName}
                      </th>
                      <th className="px-3 py-2 font-medium">
                        {pricing.colDescription}
                      </th>
                      <th className="px-3 py-2 font-medium">
                        {pricing.colPrice}
                      </th>
                      <th className="px-3 py-2 font-medium">
                        {pricing.colStatus}
                      </th>
                      <th className="px-3 py-2 font-medium">
                        {pricing.colActions}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {addOns.map((addon) => (
                      <tr
                        key={addon.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="px-3 py-2 font-medium text-gray-900">
                          {addon.name}
                        </td>
                        <td className="px-3 py-2 text-gray-500">
                          {addon.description || "-"}
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          {formatCurrency(addon.price, addon.currency)}
                        </td>
                        <td className="px-3 py-2">
                          <Badge
                            variant={addon.isActive ? "success" : "default"}
                          >
                            {addon.isActive ? pricing.active : pricing.archived}
                          </Badge>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingAddon(addon);
                                setAddonModalOpen(true);
                              }}
                            >
                              <IconEdit size={14} />
                            </Button>
                            <Button
                              variant={
                                deletingAddonId === addon.id
                                  ? "danger"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => handleDeleteAddOn(addon.id)}
                            >
                              {deletingAddonId === addon.id
                                ? pricing.confirmDelete
                                : dict.common.delete}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          )}
        </section>
      </div>

      {/* ─── Package Modal ───────────────────────────────── */}
      <Modal
        open={pkgModalOpen}
        onClose={() => {
          setPkgModalOpen(false);
          setEditingPkg(null);
          setVariations([]);
        }}
        title={editingPkg ? pricing.editPackage : pricing.addPackage}
        footer={
          <>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setPkgModalOpen(false);
                setEditingPkg(null);
                setVariations([]);
              }}
            >
              {dict.common.cancel}
            </Button>
            <Button variant="primary" type="submit" form="pkg-form">
              {dict.common.save}
            </Button>
          </>
        }
      >
        <form id="pkg-form" action={handleSavePackage} className="space-y-5">
          {/* Name */}
          <Input
            name="name"
            label={pricing.packageName}
            placeholder={pricing.packageNamePlaceholder}
            defaultValue={editingPkg?.name ?? ""}
            required
          />

          {/* Description */}
          <Textarea
            name="description"
            label={pricing.packageDescription}
            placeholder={pricing.packageDescPlaceholder}
            defaultValue={editingPkg?.description ?? ""}
            rows={2}
          />

          {/* Currency */}
          <Input
            name="currency"
            label={pricing.currency}
            defaultValue={editingPkg?.currency ?? "IDR"}
            className="w-28"
          />

          {/* ─── Variations ─────────────────────────────── */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">
                {pricing.variationsTitle}
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
                {pricing.variationsHint}
              </p>
            </div>

            {variations.length > 0 && (
              <div className="space-y-2">
                {/* Column headers */}
                <div className="grid grid-cols-2 gap-2 px-3">
                  <p className="text-xs font-medium text-gray-500">
                    {pricing.variationLabel}
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    {pricing.variationPrice}
                  </p>
                </div>
                {variations.map((v, i) => (
                  <VariationRow
                    key={i}
                    variation={v}
                    index={i}
                    onChange={updateVariation}
                    onRemove={removeVariation}
                    labelPlaceholder={pricing.variationLabelPlaceholder}
                    descPlaceholder={pricing.variationDescPlaceholder}
                  />
                ))}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addVariation}
            >
              <IconPlus size={14} />
              <span className="ml-1">{pricing.addVariation}</span>
            </Button>
          </div>

          {/* Flat price — shown when no variations OR as fallback label */}
          {variations.length === 0 && (
            <div>
              <Input
                name="flatPrice"
                label={pricing.flatPrice}
                type="number"
                min="0"
                defaultValue={editingPkg?.price ?? "0"}
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                {pricing.flatPriceHint}
              </p>
            </div>
          )}
          {variations.length > 0 && (
            <input type="hidden" name="flatPrice" value="0" />
          )}

          {/* isActive */}
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={editingPkg?.isActive ?? true}
              onChange={(e) => {
                const hidden = e.target
                  .closest("form")
                  ?.querySelector<HTMLInputElement>('input[name="isActive"]');
                if (hidden) hidden.value = String(e.target.checked);
              }}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <input
              type="hidden"
              name="isActive"
              defaultValue={String(editingPkg?.isActive ?? true)}
            />
            {pricing.activePackage}
          </label>
        </form>
      </Modal>

      {/* ─── AddOn Modal ─────────────────────────────────── */}
      <Modal
        open={addonModalOpen}
        onClose={() => {
          setAddonModalOpen(false);
          setEditingAddon(null);
        }}
        title={editingAddon ? pricing.editAddOn : pricing.addAddOn}
        footer={
          <>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setAddonModalOpen(false);
                setEditingAddon(null);
              }}
            >
              {dict.common.cancel}
            </Button>
            <Button variant="primary" type="submit" form="addon-form">
              {dict.common.save}
            </Button>
          </>
        }
      >
        <form id="addon-form" action={handleSaveAddOn} className="space-y-4">
          <Input
            name="name"
            label={pricing.addOnName}
            placeholder={pricing.addOnNamePlaceholder}
            defaultValue={editingAddon?.name ?? ""}
            required
          />
          <Textarea
            name="description"
            label={pricing.addOnDescription}
            placeholder={pricing.addOnDescPlaceholder}
            defaultValue={editingAddon?.description ?? ""}
            rows={2}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="price"
              label={pricing.addOnPrice}
              type="number"
              min="0"
              defaultValue={editingAddon?.price ?? ""}
              required
            />
            <Input
              name="currency"
              label={pricing.currency}
              defaultValue={editingAddon?.currency ?? "IDR"}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={editingAddon?.isActive ?? true}
              onChange={(e) => {
                const hidden = e.target
                  .closest("form")
                  ?.querySelector<HTMLInputElement>('input[name="isActive"]');
                if (hidden) hidden.value = String(e.target.checked);
              }}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <input
              type="hidden"
              name="isActive"
              defaultValue={String(editingAddon?.isActive ?? true)}
            />
            {pricing.activeAddOn}
          </label>
        </form>
      </Modal>
    </AppLayout>
  );
}
