"use client";

import { useState } from "react";
import { Button, Input, Modal } from "@/components/ui";
import {
  IconCopy,
  IconWhatsApp,
  IconPlus,
  IconTrash,
} from "@/components/icons";
import type { VendorPackage, VendorAddOn } from "@/templates/booking/types";

export interface BookingLinkConfig {
  clientName: string;
  packageId: string | null;
  variationId: string | null;
  selectedAddOnIds: string[];
  customPackage: {
    name: string;
    flatPrice: string;
    variations: { label: string; description: string; price: string }[];
  } | null;
}

// ─── Create Event Modal ─────────────────────────────────────

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isCreating: boolean;
  createError: string | null;
  eventTypes: { value: string; label: string }[];
  labels: {
    title: string;
    clientName: string;
    clientNamePlaceholder: string;
    clientPhone: string;
    clientPhonePlaceholder: string;
    clientEmail: string;
    clientEmailPlaceholder: string;
    eventType: string;
    selectEventType: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    eventLocationPlaceholder: string;
    notes: string;
    notesPlaceholder: string;
    create: string;
  };
  cancelLabel: string;
}

export function CreateEventModal({
  open,
  onClose,
  onSubmit,
  isCreating,
  createError,
  eventTypes,
  labels,
  cancelLabel,
}: CreateEventModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={labels.title}>
      <form action={onSubmit} className="space-y-4">
        {createError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {createError}
          </div>
        )}

        <Input
          id="clientName"
          name="clientName"
          label={labels.clientName}
          placeholder={labels.clientNamePlaceholder}
          required
        />
        <Input
          id="clientPhone"
          name="clientPhone"
          label={labels.clientPhone}
          placeholder={labels.clientPhonePlaceholder}
          required
        />
        <Input
          id="clientEmail"
          name="clientEmail"
          type="email"
          label={labels.clientEmail}
          placeholder={labels.clientEmailPlaceholder}
        />

        <div>
          <label
            htmlFor="eventType"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            {labels.eventType}
          </label>
          <select
            id="eventType"
            name="eventType"
            required
            defaultValue=""
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="" disabled>
              {labels.selectEventType}
            </option>
            {eventTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="eventDate"
            name="eventDate"
            type="date"
            label={labels.eventDate}
            required
          />
          <Input
            id="eventTime"
            name="eventTime"
            type="time"
            label={labels.eventTime}
          />
        </div>

        <Input
          id="eventLocation"
          name="eventLocation"
          label={labels.eventLocation}
          placeholder={labels.eventLocationPlaceholder}
        />

        <div>
          <label
            htmlFor="notes"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            {labels.notes}
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder={labels.notesPlaceholder}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" size="md" type="button" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button size="md" type="submit" isLoading={isCreating}>
            {labels.create}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Booking Link Modal ─────────────────────────────────────

interface BookingLinkModalLabels {
  configTitle: string;
  configDesc: string;
  clientNameLabel: string;
  clientNamePlaceholder: string;
  selectPackageLabel: string;
  noPackageOption: string;
  selectVariationLabel: string;
  customPackageLabel: string;
  customPackageName: string;
  customPackageNamePlaceholder: string;
  customVariationsTitle: string;
  customVariationHint: string;
  customFlatPrice: string;
  addCustomVariation: string;
  selectAddOnsLabel: string;
  generateButton: string;
  generating: string;
  modalTitle: string;
  modalDesc: string;
  copyLink: string;
  copied: string;
  shareWhatsApp: string;
  linkExpiry: string;
}

interface BookingLinkModalProps {
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
  labels: BookingLinkModalLabels;
  cancelLabel: string;
}

export function BookingLinkModal({
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
}: BookingLinkModalProps) {
  const [clientName, setClientName] = useState("");
  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(
    null,
  );
  const [useCustom, setUseCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customFlatPrice, setCustomFlatPrice] = useState("");
  const [customVariations, setCustomVariations] = useState<
    { label: string; description: string; price: string }[]
  >([]);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  const selectedPkg = packages.find((p) => p.id === selectedPkgId) ?? null;

  // When token exists we're on step 2 (result)
  const step: "config" | "result" = token ? "result" : "config";

  function toggleAddOn(id: string) {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function addCustomVariation() {
    setCustomVariations((prev) => [
      ...prev,
      { label: "", description: "", price: "" },
    ]);
  }

  function removeCustomVariation(i: number) {
    setCustomVariations((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateCustomVariation(
    i: number,
    field: "label" | "description" | "price",
    value: string,
  ) {
    setCustomVariations((prev) =>
      prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)),
    );
  }

  function handleClose() {
    // reset state on close
    setClientName("");
    setSelectedPkgId(null);
    setSelectedVariationId(null);
    setUseCustom(false);
    setCustomName("");
    setCustomFlatPrice("");
    setCustomVariations([]);
    setSelectedAddOnIds([]);
    onClose();
  }

  function handleGenerate() {
    onGenerate({
      clientName,
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
    });
  }

  // ── Step 2: result ─────────────────────────────────────────
  if (step === "result") {
    return (
      <Modal open={open} onClose={handleClose} title={labels.modalTitle}>
        <div className="space-y-4">
          <p className="text-sm text-slate-500">{labels.modalDesc}</p>

          {token && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
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
              <IconCopy size={16} />
              {linkCopied ? labels.copied : labels.copyLink}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={onShareWhatsApp}
              className="flex-1"
            >
              <IconWhatsApp size={16} />
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

  // ── Step 1: config ─────────────────────────────────────────
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

        {/* Optional client name */}
        <Input
          label={labels.clientNameLabel}
          placeholder={labels.clientNamePlaceholder}
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />

        {/* Package selection */}
        {!useCustom && packages.length > 0 && (
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {labels.selectPackageLabel}
              </label>
              <select
                value={selectedPkgId ?? ""}
                onChange={(e) => {
                  setSelectedPkgId(e.target.value || null);
                  setSelectedVariationId(null);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">{labels.noPackageOption}</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>

              {/* Variation selector when package has variations */}
              {selectedPkg && selectedPkg.items.length > 0 && (
                <div className="mt-3">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {labels.selectVariationLabel}
                  </label>
                  <select
                    value={selectedVariationId ?? ""}
                    onChange={(e) =>
                      setSelectedVariationId(e.target.value || null)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">{labels.noPackageOption}</option>
                    {selectedPkg.items.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Add-ons for regular package */}
            {addOns.length > 0 && (
              <AddOnSelector
                addOns={addOns}
                selectedAddOnIds={selectedAddOnIds}
                toggleAddOn={toggleAddOn}
                label={labels.selectAddOnsLabel}
              />
            )}
          </div>
        )}

        {/* Custom package toggle */}
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

        {/* Custom package editor */}
        {useCustom && (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <Input
              label={labels.customPackageName}
              placeholder={labels.customPackageNamePlaceholder}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />

            <div>
              <p className="mb-1.5 text-sm font-medium text-slate-700">
                {labels.customVariationsTitle}
              </p>
              <p className="mb-2 text-xs text-slate-500">
                {labels.customVariationHint}
              </p>

              {customVariations.length === 0 && (
                <Input
                  label={labels.customFlatPrice}
                  placeholder="0"
                  value={customFlatPrice}
                  onChange={(e) => setCustomFlatPrice(e.target.value)}
                />
              )}

              {customVariations.map((v, i) => (
                <div
                  key={i}
                  className="mb-2 rounded-lg border border-slate-200 bg-white p-3"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Label"
                      placeholder="e.g. 2 Orang – 1 Jam"
                      value={v.label}
                      onChange={(e) =>
                        updateCustomVariation(i, "label", e.target.value)
                      }
                    />
                    <Input
                      label="Price"
                      placeholder="0"
                      value={v.price}
                      onChange={(e) =>
                        updateCustomVariation(i, "price", e.target.value)
                      }
                    />
                  </div>
                  <div className="mt-2 flex items-end gap-2">
                    <div className="flex-1">
                      <Input
                        label="Description (optional)"
                        placeholder=""
                        value={v.description}
                        onChange={(e) =>
                          updateCustomVariation(
                            i,
                            "description",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCustomVariation(i)}
                      className="mb-0.5 rounded-lg p-2 text-red-500 hover:bg-red-50"
                    >
                      <IconTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addCustomVariation}
                className="mt-1 flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                <IconPlus size={12} />
                {labels.addCustomVariation}
              </button>
            </div>

            {/* Add-ons for custom package */}
            {addOns.length > 0 && (
              <AddOnSelector
                addOns={addOns}
                selectedAddOnIds={selectedAddOnIds}
                toggleAddOn={toggleAddOn}
                label={labels.selectAddOnsLabel}
              />
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── AddOnSelector ──────────────────────────────────────────

function AddOnSelector({
  addOns,
  selectedAddOnIds,
  toggleAddOn,
  label,
}: {
  addOns: VendorAddOn[];
  selectedAddOnIds: string[];
  toggleAddOn: (id: string) => void;
  label: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700">{label}</p>
      <div className="space-y-2">
        {addOns.map((ao) => {
          const isAdded = selectedAddOnIds.includes(ao.id);
          return (
            <label
              key={ao.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                isAdded
                  ? "border-blue-300 bg-blue-50/50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="checkbox"
                checked={isAdded}
                onChange={() => toggleAddOn(ao.id)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">{ao.name}</p>
                {ao.description && (
                  <p className="text-xs text-slate-500">{ao.description}</p>
                )}
              </div>
              <p className="shrink-0 text-sm font-semibold text-slate-700">
                +{ao.price}
              </p>
            </label>
          );
        })}
      </div>
    </div>
  );
}
