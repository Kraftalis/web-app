"use client";

import { useState } from "react";
import { Modal, Button, Input, Select } from "@/components/ui";
import AddOnSelector from "./AddOnSelector";
import type { BookingLinkConfig } from "../types";
import type { VendorPackage, VendorAddOn } from "@/templates/booking/types";

interface CustomVariation {
  label: string;
  description: string;
  price: string;
}

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
  const [clientName, setClientName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(
    null,
  );
  const [useCustom, setUseCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customFlatPrice, setCustomFlatPrice] = useState("");
  const [customVariations, setCustomVariations] = useState<CustomVariation[]>(
    [],
  );
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [customAddOns, setCustomAddOns] = useState<CustomAddOn[]>([]);

  const selectedPkg = packages.find((p) => p.id === selectedPkgId) ?? null;
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

  function updateCustomAddOn(i: number, field: string, value: string) {
    setCustomAddOns((prev) =>
      prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)),
    );
  }

  function handleClose() {
    setClientName("");
    setLocation("");
    setSelectedPkgId(null);
    setSelectedVariationId(null);
    setUseCustom(false);
    setCustomName("");
    setCustomFlatPrice("");
    setCustomVariations([]);
    setSelectedAddOnIds([]);
    setCustomAddOns([]);
    onClose();
  }

  function handleGenerate() {
    if (
      !useCustom &&
      selectedPkg &&
      selectedPkg.items.length > 0 &&
      !selectedVariationId
    ) {
      alert("Silakan pilih variasi paket terlebih dahulu.");
      return;
    }

    onGenerate({
      clientName,
      location,
      packageId: useCustom ? null : selectedPkgId,
      variationId: useCustom ? null : selectedVariationId,
      selectedAddOnIds,
      customPackage: useCustom
        ? {
            name: customName,
            flatPrice: customFlatPrice,
            variations: customVariations,
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

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={labels.clientNameLabel}
            placeholder={labels.clientNamePlaceholder}
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <Input
            label="Lokasi Acara (opsional)"
            placeholder="cth. Studio A, Jakarta"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {!useCustom && packages.length > 0 && (
          <div className="space-y-3">
            <div>
              <Select
                label={labels.selectPackageLabel}
                value={selectedPkgId ?? ""}
                onChange={(e) => {
                  setSelectedPkgId(e.target.value || null);
                  setSelectedVariationId(null);
                }}
                placeholder={labels.noPackageOption}
                options={packages.map((pkg) => ({
                  value: pkg.id,
                  label: pkg.name,
                }))}
                searchable
              />

              {selectedPkg && selectedPkg.items.length > 0 && (
                <div className="mt-3">
                  <Select
                    label={labels.selectVariationLabel}
                    value={selectedVariationId ?? ""}
                    onChange={(e) =>
                      setSelectedVariationId(e.target.value || null)
                    }
                    placeholder="Pilih variasi paket"
                    options={selectedPkg.items.map((v) => ({
                      value: v.id,
                      label: `${v.label} \u2014 ${v.price}`,
                    }))}
                  />
                </div>
              )}
            </div>

            <AddOnSelector
              addOns={addOns}
              selectedAddOnIds={selectedAddOnIds}
              toggleAddOn={toggleAddOn}
              label={labels.selectAddOnsLabel}
              onAddCustom={addCustomAddOn}
              customAddOns={customAddOns}
              onUpdateCustom={updateCustomAddOn}
              onRemoveCustom={removeCustomAddOn}
              labels={{
                customAddOnLabel: "Nama Add-on",
                customAddOnPlaceholder: "cth. Extra 1 Jam",
                customAddOnPrice: "Harga",
                addCustomAddOn: "Tambah Add-on Khusus",
              }}
            />
          </div>
        )}

        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={useCustom}
            onChange={(e) => {
              setUseCustom(e.target.checked);
              setSelectedPkgId(null);
              setSelectedVariationId(null);
            }}
            className="h-4 w-4 rounded border-slate-300 text-blue-600"
          />
          {labels.customPackageLabel}
        </label>

        {useCustom && (
          <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
            <Input
              label={labels.customPackageName}
              placeholder={labels.customPackageNamePlaceholder}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />

            <div>
              <p className="mb-1.5 text-sm font-medium text-slate-700">
                Harga Paket
              </p>
              <Input
                label={labels.customFlatPrice}
                placeholder="0"
                value={customFlatPrice}
                onChange={(e) => setCustomFlatPrice(e.target.value)}
              />
            </div>

            <AddOnSelector
              addOns={addOns}
              selectedAddOnIds={selectedAddOnIds}
              toggleAddOn={toggleAddOn}
              label={labels.selectAddOnsLabel}
              onAddCustom={addCustomAddOn}
              customAddOns={customAddOns}
              onUpdateCustom={updateCustomAddOn}
              onRemoveCustom={removeCustomAddOn}
              labels={{
                customAddOnLabel: "Nama Add-on",
                customAddOnPlaceholder: "cth. Extra 1 Jam",
                customAddOnPrice: "Harga",
                addCustomAddOn: "Tambah Add-on Khusus",
              }}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
