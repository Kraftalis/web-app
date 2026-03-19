"use client";

import { useState } from "react";
import { Modal, Button, Input } from "@/components/ui";
import AddOnSelector from "./AddOnSelector";
import type { BookingLinkConfig } from "../types";
import type { VendorPackage, VendorAddOn } from "@/templates/booking/types";

interface CustomAddOn {
  name: string;
  description: string;
  price: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  packages: VendorPackage[];
  addOns: VendorAddOn[];
  token: string | null;
  isGenerating: boolean;
  onGenerate: (config: BookingLinkConfig) => void;
  onCopyLink: () => void;
  onShareWhatsApp: () => void;
  linkCopied: boolean;
  labels: Record<string, string>;
  cancelLabel: string;
}

export default function BookingLinkModal({
  open,
  onClose,
  packages,
  addOns,
  token,
  isGenerating,
  onGenerate,
  onCopyLink,
  onShareWhatsApp,
  linkCopied,
  labels,
  cancelLabel,
}: Props) {
  // Form fields according to requested flow:
  // 1. clientName (optional)
  // 2. venue
  // 3. package (select or custom with flat price)
  // 4. add-ons (select or custom)

  const [clientName, setClientName] = useState("");
  const [venue, setVenue] = useState("");

  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(
    null,
  );
  const [useCustom, setUseCustom] = useState(false);
  const [customPackageName, setCustomPackageName] = useState("");
  const [customFlatPrice, setCustomFlatPrice] = useState("");

  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [customAddOns, setCustomAddOns] = useState<CustomAddOn[]>([]);

  // Fallback sample data (derived from pricing template shapes) when none provided
  const samplePackages: VendorPackage[] = [
    {
      id: "pkg-portrait",
      name: "Portrait Session",
      description: "1-hour portrait session with 10 edited photos",
      price: "500000",
      currency: "IDR",
      items: [],
    },
    {
      id: "pkg-wedding",
      name: "Wedding Basic",
      description: "Ceremony coverage + highlights",
      price: "3000000",
      currency: "IDR",
      items: [
        { id: "v-basic", label: "Basic", description: null, price: "3000000" },
        {
          id: "v-premium",
          label: "Premium",
          description: null,
          price: "5000000",
        },
      ],
    },
  ];

  const sampleAddOns: VendorAddOn[] = [
    {
      id: "ao-hour",
      name: "Extra Hour",
      description: "Add 1 extra hour",
      price: "150000",
      currency: "IDR",
    },
    {
      id: "ao-album",
      name: "Photo Album",
      description: "Printed album 20 pages",
      price: "250000",
      currency: "IDR",
    },
  ];

  const packagesToUse =
    packages && packages.length > 0 ? packages : samplePackages;
  const addOnsToUse = addOns && addOns.length > 0 ? addOns : sampleAddOns;

  const selectedPkg = packagesToUse.find((p) => p.id === selectedPkgId) ?? null;
  const [pkgOpen, setPkgOpen] = useState(false);
  const [variationOpen, setVariationOpen] = useState(false);

  const step: "config" | "result" = token ? "result" : "config";

  function toggleAddOn(id: string) {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function addCustomAddOn() {
    setCustomAddOns((prev) => [
      ...prev,
      { name: "", description: "", price: "" },
    ]);
  }

  function removeCustomAddOn(i: number) {
    setCustomAddOns((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateCustomAddOn(
    i: number,
    field: keyof CustomAddOn,
    value: string,
  ) {
    setCustomAddOns((prev) =>
      prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)),
    );
  }

  function handleClose() {
    setClientName("");
    setVenue("");
    setSelectedPkgId(null);
    setUseCustom(false);
    setCustomPackageName("");
    setCustomFlatPrice("");
    setSelectedAddOnIds([]);
    setCustomAddOns([]);
    onClose();
  }

  function handleGenerate() {
    // If selecting an existing package that has variations, we don't enforce variation selection here
    // because the booking link may accept a package id only.

    onGenerate({
      clientName,
      location: venue,
      packageId: useCustom ? null : selectedPkgId,
      variationId: useCustom ? null : selectedVariationId,
      selectedAddOnIds,
      customPackage: useCustom
        ? {
            name: customPackageName,
            flatPrice: customFlatPrice,
            variations: [],
          }
        : null,
      customAddOns,
    });
  }

  if (step === "result") {
    return (
      <Modal open={open} onClose={handleClose} title={labels.modalTitle}>
        <div className="space-y-4">
          <p className="text-sm text-slate-500">{labels.modalDesc}</p>
          {token && (
            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="break-all text-xs text-slate-600">
                {typeof window !== "undefined"
                  ? `${window.location.origin}/booking/${token}`
                  : `/booking/${token}`}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={onCopyLink}
              className="flex-1"
            >
              {linkCopied ? labels.copied : labels.copyLink}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={onShareWhatsApp}
              className="flex-1"
            >
              {labels.shareWhatsApp}
            </Button>
          </div>

          <p className="text-center text-xs text-slate-400">
            {labels.linkExpiry}
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={labels.configTitle}
      footer={
        <>
          <Button variant="ghost" size="md" type="button" onClick={handleClose}>
            {cancelLabel}
          </Button>
          <Button
            size="md"
            type="button"
            isLoading={isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? labels.generating : labels.generateButton}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <p className="text-sm text-slate-500">{labels.configDesc}</p>

        {/* 1. Client name (optional) */}
        <Input
          label={labels.clientNameLabel}
          placeholder={labels.clientNamePlaceholder}
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />

        {/* 2. Venue */}
        <Input
          label={labels.venueLabel ?? "Venue"}
          placeholder={labels.venuePlaceholder ?? "cth. Studio A, Jakarta"}
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
        />

        {/* 3. Package selection or custom */}
        <div className="space-y-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {labels.selectPackageLabel}
          </label>
          {!useCustom ? (
            <div
              className="relative"
              tabIndex={0}
              onBlur={() => setPkgOpen(false)}
            >
              <button
                type="button"
                onClick={() => setPkgOpen((s) => !s)}
                className="w-full flex items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              >
                <div className="text-left">
                  <div className="text-sm font-medium">
                    {selectedPkg
                      ? selectedPkg.name
                      : (labels.noPackageOption ?? "Pilih paket")}
                  </div>
                  {selectedPkg?.description && (
                    <div className="text-xs text-slate-500">
                      {selectedPkg.description}
                    </div>
                  )}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`ml-2 transition-transform ${pkgOpen ? "-rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {pkgOpen && (
                <div className="absolute z-20 mt-1 w-full rounded-md border bg-white shadow-lg max-h-60 overflow-auto">
                  <ul className="divide-y">
                    {packagesToUse.map((pkg) => (
                      <li key={pkg.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPkgId(pkg.id);
                            setSelectedVariationId(null);
                            setPkgOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {pkg.name}
                              </div>
                              {pkg.description && (
                                <div className="text-xs text-slate-500">
                                  {pkg.description}
                                </div>
                              )}
                            </div>
                            <div className="text-sm font-semibold text-slate-700">
                              {pkg.items.length === 0
                                ? pkg.price
                                : "Starting " + pkg.price}
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                label={labels.customPackageName ?? "Nama Paket"}
                placeholder={
                  labels.customPackageNamePlaceholder ?? "Nama Paket"
                }
                value={customPackageName}
                onChange={(e) => setCustomPackageName(e.target.value)}
              />
              <Input
                label={labels.customFlatPrice ?? "Harga (flat)"}
                placeholder={labels.customFlatPricePlaceholder ?? "0"}
                value={customFlatPrice}
                onChange={(e) => setCustomFlatPrice(e.target.value)}
              />
            </div>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useCustom}
              onChange={(e) => setUseCustom(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600"
            />
            {labels.customPackageLabel ?? "Buat paket khusus"}
          </label>
        </div>

        {/* When a package has variations, show a variation select */}
        {selectedPkg && selectedPkg.items.length > 0 && (
          <div
            className="mt-2 relative"
            tabIndex={0}
            onBlur={() => setVariationOpen(false)}
          >
            <button
              type="button"
              onClick={() => setVariationOpen((s) => !s)}
              className="w-full flex items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            >
              <div className="text-left">
                <div className="text-sm font-medium">
                  {selectedVariationId
                    ? selectedPkg.items.find(
                        (v) => v.id === selectedVariationId,
                      )?.label
                    : (labels.selectVariationPlaceholder ?? "Pilih variasi")}
                </div>
                {selectedVariationId && (
                  <div className="text-xs text-slate-500">
                    {
                      selectedPkg.items.find(
                        (v) => v.id === selectedVariationId,
                      )?.price
                    }
                  </div>
                )}
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`ml-2 transition-transform ${variationOpen ? "-rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {variationOpen && (
              <div className="absolute z-20 mt-1 w-full rounded-md border bg-white shadow-lg max-h-60 overflow-auto">
                <ul className="divide-y">
                  {selectedPkg.items.map((v) => (
                    <li key={v.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVariationId(v.id);
                          setVariationOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {v.label}
                            </div>
                            {v.description && (
                              <div className="text-xs text-slate-500">
                                {v.description}
                              </div>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-slate-700">
                            {v.price}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* 4. Add-ons */}
        <AddOnSelector
          addOns={addOnsToUse}
          selectedAddOnIds={selectedAddOnIds}
          toggleAddOn={toggleAddOn}
          label={labels.selectAddOnsLabel}
          onAddCustom={addCustomAddOn}
          customAddOns={customAddOns}
          onUpdateCustom={updateCustomAddOn}
          onRemoveCustom={removeCustomAddOn}
          labels={{
            customAddOnLabel: labels.customAddOnLabel ?? "Nama Add-on",
            customAddOnPlaceholder:
              labels.customAddOnPlaceholder ?? "cth. Extra 1 Jam",
            customAddOnPrice: labels.customAddOnPrice ?? "Harga",
            addCustomAddOn: labels.addCustomAddOn ?? "Tambah Add-on Khusus",
          }}
        />
      </div>
    </Modal>
  );
}
