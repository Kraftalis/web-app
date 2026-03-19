"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout";
import {
  Card,
  CardBody,
  Badge,
  Button,
  Input,
  Select,
  Textarea,
  Modal,
} from "@/components/ui";
import {
  IconPlus,
  IconEdit,
  IconPricing,
  IconCheck,
  IconChevronDown,
  IconList,
  IconGrid,
  IconSearch,
} from "@/components/icons";
import PricingControls from "@/templates/pricing/pricing-controls";
import VariationRow from "@/templates/pricing/variation-row";
import { useDictionary } from "@/i18n";
import type { Package, PackageVariation } from "./types";

// ─── Types ──────────────────────────────────────────────────

// reusing shared types from ./types
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
  // List controls
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "status">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  // View mode
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  // Category filters
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const toggleExpanded = (id: string) =>
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));

  // Package modal state
  const [pkgModalOpen, setPkgModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [deletingPkgId, setDeletingPkgId] = useState<string | null>(null);

  // Variation editor state inside modal
  const [variations, setVariations] = useState<
    { label: string; description: string; price: string }[]
  >([]);
  // Inclusions stored as newline-separated text in the modal textarea
  const [inclusionDraft, setInclusionDraft] = useState("");

  // AddOn modal state
  const [addonModalOpen, setAddonModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<AddOn | null>(null);
  const [deletingAddonId, setDeletingAddonId] = useState<string | null>(null);

  // ─── Open package modal ──────────────────────────────────

  const openAddPkg = () => {
    setEditingPkg(null);
    setVariations([]);
    setInclusionDraft("");
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
    setInclusionDraft((pkg.inclusions ?? []).join("\n"));
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
    const category = (formData.get("category") as string) || "";
    const subcategory = (formData.get("subcategory") as string) || "";
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
                inclusions: inclusionDraft
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
                category,
                subcategory,
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
          inclusions: inclusionDraft
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          category,
          subcategory,
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

  // Filtering / sorting / pagination (previously inside an IIFE)
  const q = query.trim().toLowerCase();
  const filtered = packages.filter((p) => {
    const matchQuery =
      q === ""
        ? true
        : `${p.name} ${p.description ?? ""}`.toLowerCase().includes(q);
    // simple category/subcategory matching stored in package.description or name for now
    const matchCategory =
      category === ""
        ? true
        : (p.description ?? "").includes(category) || p.name.includes(category);
    const matchSub =
      subcategory === ""
        ? true
        : (p.description ?? "").includes(subcategory) ||
          p.name.includes(subcategory);
    return matchQuery && matchCategory && matchSub;
  });

  filtered.sort((a, b) => {
    if (sortBy === "name") {
      const cmp = a.name.localeCompare(b.name);
      return sortDir === "asc" ? cmp : -cmp;
    }
    if (sortBy === "price") {
      const pa =
        parseFloat(getDisplayPrice(a).label.replace(/[^0-9.-]+/g, "")) || 0;
      const pb =
        parseFloat(getDisplayPrice(b).label.replace(/[^0-9.-]+/g, "")) || 0;
      return sortDir === "asc" ? pa - pb : pb - pa;
    }
    if (sortBy === "status") {
      return Number(b.isActive) - Number(a.isActive);
    }
    return 0;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  return (
    <AppLayout user={user}>
      <div className="space-y-8">
        {/* ── Page Header ────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {pricing.packagesTitle}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your packages and add-ons
            </p>
          </div>
          <Button size="md" onClick={openAddPkg}>
            <IconPlus size={16} />
            {pricing.addPackage}
          </Button>
        </div>

        {/* ── Packages Section ───────────────────────────── */}
        <section className="space-y-4">
          {/* Filters + Search + View Toggle — single row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <IconSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
              />
              <Input
                type="text"
                placeholder="Search packages..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 w-full"
              />
            </div>

            {/* Inline filter selects */}
            <PricingControls
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDir={sortDir}
              setSortDir={setSortDir}
              pageSize={pageSize}
              setPageSize={setPageSize}
              category={category}
              setCategory={setCategory}
              subcategory={subcategory}
              setSubcategory={setSubcategory}
            />

            {/* View toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                title="Grid view"
              >
                <IconGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                title="List view"
              >
                <IconList size={16} />
              </button>
            </div>
          </div>

          {/* ── Grid View ──────────────────────────────── */}
          {viewMode === "grid" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((pkg) => {
                const display = getDisplayPrice(pkg);
                return (
                  <Card key={pkg.id} className="flex flex-col">
                    <CardBody className="flex flex-1 flex-col space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {pkg.name}
                        </h3>
                        <Badge
                          variant={pkg.isActive ? "success" : "default"}
                          className="shrink-0"
                        >
                          {pkg.isActive ? pricing.active : pricing.archived}
                        </Badge>
                      </div>

                      {/* Description */}
                      {pkg.description && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {pkg.description}
                        </p>
                      )}

                      {/* Price */}
                      <div>
                        {display.isRange && (
                          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                            {pricing.startingFrom}
                          </p>
                        )}
                        <p className="text-xl font-bold text-gray-900">
                          {display.label}
                        </p>
                      </div>

                      {/* Variations (compact) */}
                      {pkg.items.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                            {pricing.variationsTitle}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {pkg.items.map((v) => (
                              <span
                                key={v.id}
                                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700"
                              >
                                {v.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Inclusions (compact) */}
                      {pkg.inclusions && pkg.inclusions.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                            {pricing.inclusionsTitle || "Includes"}
                          </p>
                          <ul className="space-y-0.5">
                            {pkg.inclusions.slice(0, 3).map((inc, i) => (
                              <li
                                key={i}
                                className="flex items-center gap-1.5 text-xs text-gray-600"
                              >
                                <IconCheck
                                  size={12}
                                  className="shrink-0 text-green-500"
                                />
                                <span className="truncate">{inc}</span>
                              </li>
                            ))}
                            {pkg.inclusions.length > 3 && (
                              <li className="text-xs text-gray-400">
                                +{pkg.inclusions.length - 3} more
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Spacer to push actions to bottom */}
                      <div className="flex-1" />

                      {/* Actions */}
                      <div className="flex gap-2 border-t border-gray-100 pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
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

          {/* ── List View ──────────────────────────────── */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {pageItems.map((pkg) => {
                const display = getDisplayPrice(pkg);
                const open = !!expandedIds[pkg.id];
                return (
                  <Card key={pkg.id}>
                    <CardBody className="space-y-3">
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
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {display.label}
                            </p>
                          </div>
                          <Badge
                            variant={pkg.isActive ? "success" : "default"}
                            className="shrink-0"
                          >
                            {pkg.isActive ? pricing.active : pricing.archived}
                          </Badge>
                          <button
                            type="button"
                            aria-expanded={open}
                            onClick={() => toggleExpanded(pkg.id)}
                            className={`p-2 rounded hover:bg-gray-100 transition-transform ${open ? "-rotate-180" : ""}`}
                          >
                            <IconChevronDown size={16} />
                          </button>
                        </div>
                      </div>

                      {open && (
                        <div className="space-y-2">
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

                          {pkg.inclusions && pkg.inclusions.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                {pricing.inclusionsTitle || "Includes"}
                              </p>
                              <ul className="mt-1 space-y-1">
                                {pkg.inclusions.map((inc, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2"
                                  >
                                    <IconCheck
                                      size={14}
                                      className="text-green-500 shrink-0 mt-0.5"
                                    />
                                    <span className="text-sm text-gray-700">
                                      {inc}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

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

          {/* Pagination */}
          <div className="flex items-center justify-between py-3">
            <div className="text-sm text-gray-600">{`Showing ${start + 1}–${Math.min(start + pageSize, total)} of ${total}`}</div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              <div className="text-sm">
                {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
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
          {/* Category / Subcategory */}
          <div className="grid gap-2 sm:grid-cols-2">
            <Select
              label="Category"
              name="category"
              defaultValue={editingPkg?.category ?? ""}
              placeholder="Select category"
              options={[{ value: "Photography", label: "Photography" }]}
            />
            <Select
              label="Subcategory"
              name="subcategory"
              defaultValue={editingPkg?.subcategory ?? ""}
              placeholder="Select subcategory"
              options={[
                { value: "Wedding", label: "Wedding" },
                { value: "Pre-wedding", label: "Pre-wedding" },
                { value: "Graduation", label: "Graduation" },
                { value: "Family", label: "Family" },
                { value: "Community", label: "Community" },
                { value: "Maternity", label: "Maternity" },
              ]}
            />
          </div>

          {/* Inclusions: single textarea with newline-separated items */}
          <div>
            <p className="text-sm font-medium text-gray-700">
              {pricing.inclusionsTitle || "Includes"}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              Enter each inclusion on a new line.
            </p>
            <Textarea
              name="inclusions"
              value={inclusionDraft}
              onChange={(e) => setInclusionDraft(e.target.value)}
              placeholder={
                "e.g. 2 photographers\n3 hours coverage\nSoft files via Drive"
              }
              rows={4}
            />
          </div>

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
