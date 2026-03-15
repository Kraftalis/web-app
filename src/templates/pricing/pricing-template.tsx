"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { Card, CardBody, Badge, Button, Input, Modal } from "@/components/ui";
import { IconPlus, IconEdit, IconPricing, IconCheck } from "@/components/icons";
import { useDictionary } from "@/i18n";

// ─── Types ──────────────────────────────────────────────────

interface PackageItem {
  id: string;
  name: string;
}

interface Package {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  duration: string | null;
  capacity: string | null;
  isActive: boolean;
  items: PackageItem[];
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

function formatCurrency(amount: string, currency = "IDR") {
  const num = parseFloat(amount);
  if (isNaN(num)) return "-";
  return `${currency} ${num.toLocaleString()}`;
}

// ─── Component ──────────────────────────────────────────────

export default function PricingTemplate({
  user,
  packages: initialPackages,
  addOns: initialAddOns,
}: PricingTemplateProps) {
  const { dict } = useDictionary();
  const pricing = dict.pricing;

  // Local state for frontend-only management
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [addOns, setAddOns] = useState<AddOn[]>(initialAddOns);

  // Package modal state
  const [pkgModalOpen, setPkgModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [deletingPkgId, setDeletingPkgId] = useState<string | null>(null);

  // AddOn modal state
  const [addonModalOpen, setAddonModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<AddOn | null>(null);
  const [deletingAddonId, setDeletingAddonId] = useState<string | null>(null);

  // ─── Package CRUD ─────────────────────────────────────────

  const handleSavePackage = (formData: FormData) => {
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || null;
    const price = formData.get("price") as string;
    const currency = (formData.get("currency") as string) || "IDR";
    const duration = (formData.get("duration") as string) || null;
    const capacity = (formData.get("capacity") as string) || null;
    const isActive = formData.get("isActive") === "true";
    const itemsRaw = (formData.get("items") as string) || "";
    const items = itemsRaw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((name) => ({ id: crypto.randomUUID(), name }));

    if (editingPkg) {
      setPackages((prev) =>
        prev.map((p) =>
          p.id === editingPkg.id
            ? {
                ...p,
                name,
                description,
                price,
                currency,
                duration,
                capacity,
                isActive,
                items,
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
          price,
          currency,
          duration,
          capacity,
          isActive,
          items,
        },
      ]);
    }
    setPkgModalOpen(false);
    setEditingPkg(null);
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

  // ─── AddOn CRUD ───────────────────────────────────────────

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

        {/* ─── Packages Section ──────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {pricing.packagesTitle}
            </h2>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingPkg(null);
                setPkgModalOpen(true);
              }}
            >
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
              {packages.map((pkg) => (
                <Card key={pkg.id}>
                  <CardBody className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {pkg.name}
                        </h3>
                        {pkg.description && (
                          <p className="mt-0.5 text-xs text-gray-500">
                            {pkg.description}
                          </p>
                        )}
                      </div>
                      <Badge variant={pkg.isActive ? "success" : "default"}>
                        {pkg.isActive ? pricing.active : pricing.archived}
                      </Badge>
                    </div>

                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(pkg.price, pkg.currency)}
                    </p>

                    {(pkg.duration || pkg.capacity) && (
                      <div className="flex flex-wrap gap-2">
                        {pkg.duration && (
                          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                            {pkg.duration}
                          </span>
                        )}
                        {pkg.capacity && (
                          <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                            {pkg.capacity}
                          </span>
                        )}
                      </div>
                    )}

                    {pkg.items.length > 0 && (
                      <ul className="space-y-1">
                        {pkg.items.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-center gap-1.5 text-xs text-gray-600"
                          >
                            <IconCheck
                              size={12}
                              className="shrink-0 text-green-500"
                            />
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingPkg(pkg);
                          setPkgModalOpen(true);
                        }}
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
              ))}
            </div>
          )}
        </section>

        {/* ─── Add-ons Section ───────────────────────────── */}
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

      {/* ─── Package Modal ─────────────────────────────────── */}
      <Modal
        open={pkgModalOpen}
        onClose={() => {
          setPkgModalOpen(false);
          setEditingPkg(null);
        }}
        title={editingPkg ? pricing.editPackage : pricing.addPackage}
      >
        <form action={handleSavePackage} className="space-y-4">
          <Input
            name="name"
            label={pricing.packageName}
            placeholder={pricing.packageNamePlaceholder}
            defaultValue={editingPkg?.name ?? ""}
            required
          />
          <Input
            name="description"
            label={pricing.packageDescription}
            placeholder={pricing.packageDescPlaceholder}
            defaultValue={editingPkg?.description ?? ""}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="price"
              label={pricing.price}
              type="number"
              defaultValue={editingPkg?.price ?? ""}
              required
            />
            <Input
              name="currency"
              label={pricing.currency}
              defaultValue={editingPkg?.currency ?? "IDR"}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="duration"
              label={pricing.duration}
              placeholder={pricing.durationPlaceholder}
              defaultValue={editingPkg?.duration ?? ""}
            />
            <Input
              name="capacity"
              label={pricing.capacity}
              placeholder={pricing.capacityPlaceholder}
              defaultValue={editingPkg?.capacity ?? ""}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {pricing.packageItems}
            </label>
            <p className="mb-1 text-xs text-gray-400">
              {pricing.packageItemsHint}
            </p>
            <textarea
              name="items"
              rows={4}
              placeholder={pricing.packageItemsPlaceholder}
              defaultValue={
                editingPkg?.items.map((i) => i.name).join("\n") ?? ""
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* isActive checkbox */}
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

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setPkgModalOpen(false);
                setEditingPkg(null);
              }}
            >
              {dict.common.cancel}
            </Button>
            <Button variant="primary" type="submit">
              {dict.common.save}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ─── AddOn Modal ───────────────────────────────────── */}
      <Modal
        open={addonModalOpen}
        onClose={() => {
          setAddonModalOpen(false);
          setEditingAddon(null);
        }}
        title={editingAddon ? pricing.editAddOn : pricing.addAddOn}
      >
        <form action={handleSaveAddOn} className="space-y-4">
          <Input
            name="name"
            label={pricing.addOnName}
            placeholder={pricing.addOnNamePlaceholder}
            defaultValue={editingAddon?.name ?? ""}
            required
          />
          <Input
            name="description"
            label={pricing.addOnDescription}
            placeholder={pricing.addOnDescPlaceholder}
            defaultValue={editingAddon?.description ?? ""}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="price"
              label={pricing.price}
              type="number"
              defaultValue={editingAddon?.price ?? ""}
              required
            />
            <Input
              name="currency"
              label={pricing.currency}
              defaultValue={editingAddon?.currency ?? "IDR"}
            />
          </div>

          {/* isActive checkbox */}
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

          <div className="flex justify-end gap-3 pt-2">
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
            <Button variant="primary" type="submit">
              {dict.common.save}
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
