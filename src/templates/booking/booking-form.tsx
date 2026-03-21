"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Button, Input, Select, Card, CardBody } from "@/components/ui";
import { IconCheck, IconUpload, IconImage } from "@/components/icons";
import type { VendorPackage, VendorAddOn } from "./types";
import { formatCurrency } from "./types";

// ─── Types ──────────────────────────────────────────────────

interface BookingFormLabels {
  pageTitle: string;
  pageSubtitle: string;
  clientInfoTitle: string;
  fullName: string;
  fullNamePlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  eventInfoTitle: string;
  eventType: string;
  selectEventType: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventLocationPlaceholder: string;
  notesTitle: string;
  notesPlaceholder: string;
  submitting: string;
  submitBooking: string;
  // Package step
  selectPackageTitle: string;
  selectPackageDesc: string;
  packageIncludes: string;
  selectedLabel: string;
  selectLabel: string;
  selectVariation: string;
  variationRequired: string;
  addOnsOptional: string;
  addOnsOptionalDesc: string;
  perItem: string;
  added: string;
  add: string;
  // Payment step
  dpPaymentTitle: string;
  dpPaymentDesc: string;
  dpAmountLabel: string;
  dpAmountPlaceholder: string;
  minimumDp: string;
  receiptUploadTitle: string;
  receiptUploadDesc: string;
  receiptLabel: string;
  dragOrClick: string;
  acceptedFormats: string;
  changeFile: string;
  // Summary
  orderSummary: string;
  packageLabel: string;
  addOnsLabel: string;
  dpLabel: string;
  grandTotal: string;
  free: string;
  // Steps
  stepClientInfo: string;
  stepPackage: string;
  stepEvent: string;
  stepPayment: string;
}

interface BookingFormProps {
  vendorName: string;
  vendorImage: string | null;
  onSubmit: (data: BookingFormData) => Promise<void>;
  labels: BookingFormLabels;
  eventTypes: { value: string; label: string }[];
  packages: VendorPackage[];
  addOns: VendorAddOn[];
  prefill?: {
    clientName?: string;
    clientPhone?: string;
    eventDate?: string;
    eventTime?: string;
    eventLocation?: string;
  };
}

export interface BookingFormData {
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  eventType: string;
  eventDate: string;
  eventTime: string | null;
  eventLocation: string | null;
  notes: string | null;
  packageId: string | null;
  selectedVariationId: string | null; // selected variation within package
  selectedAddOnIds: string[];
  dpAmount: string;
  receiptFile: File | null;
}

// ─── Constants ──────────────────────────────────────────────

const FORM_STEPS = ["client", "event", "package", "payment"] as const;
type FormStep = (typeof FORM_STEPS)[number];

// ─── Component ──────────────────────────────────────────────

export function BookingForm({
  vendorName,
  vendorImage,
  onSubmit,
  labels,
  eventTypes,
  packages,
  addOns,
  prefill,
}: BookingFormProps) {
  const [step, setStep] = useState<FormStep>("client");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state (with prefill from booking link)
  const [clientName, setClientName] = useState(prefill?.clientName ?? "");
  const [clientPhone, setClientPhone] = useState(prefill?.clientPhone ?? "");
  const [clientEmail, setClientEmail] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState(prefill?.eventDate ?? "");
  const [eventTime, setEventTime] = useState(prefill?.eventTime ?? "");
  const [eventLocation, setEventLocation] = useState(
    prefill?.eventLocation ?? "",
  );
  const [notes, setNotes] = useState("");
  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(
    null,
  );
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [dpAmount, setDpAmount] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const currentStepIdx = FORM_STEPS.indexOf(step);
  const selectedPkg = useMemo(
    () => packages.find((p) => p.id === selectedPkgId) ?? null,
    [packages, selectedPkgId],
  );

  const stepLabels: Record<FormStep, string> = {
    client: labels.stepClientInfo,
    package: labels.stepPackage,
    event: labels.stepEvent,
    payment: labels.stepPayment,
  };

  function canGoNext(): boolean {
    if (step === "client") return !!clientName.trim() && !!clientPhone.trim();
    if (step === "package") {
      if (!selectedPkgId) return false;
      const pkg = packages.find((p) => p.id === selectedPkgId);
      // if package has variations, one must be selected
      if (pkg && pkg.items.length > 0 && !selectedVariationId) return false;
      return true;
    }
    if (step === "event") return !!eventType && !!eventDate;
    return !!dpAmount && !!receiptFile;
  }

  function goNext() {
    const idx = currentStepIdx;
    if (idx < FORM_STEPS.length - 1) setStep(FORM_STEPS[idx + 1]);
  }

  function goBack() {
    const idx = currentStepIdx;
    if (idx > 0) setStep(FORM_STEPS[idx - 1]);
  }

  function toggleAddOn(id: string) {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim() || null,
        eventType,
        eventDate,
        eventTime: eventTime || null,
        eventLocation: eventLocation.trim() || null,
        notes: notes.trim() || null,
        packageId: selectedPkgId,
        selectedVariationId,
        selectedAddOnIds,
        dpAmount,
        receiptFile,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-lg">
        <CardBody className="space-y-6 p-6 sm:p-8">
          {/* Header */}
          <FormHeader
            vendorName={vendorName}
            vendorImage={vendorImage}
            title={labels.pageTitle}
            subtitle={labels.pageSubtitle}
          />

          {/* Step indicator */}
          <StepIndicator
            steps={FORM_STEPS}
            currentStep={step}
            stepLabels={stepLabels}
          />

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Step: Client Info */}
          {step === "client" && (
            <ClientInfoStep
              clientName={clientName}
              setClientName={setClientName}
              clientPhone={clientPhone}
              setClientPhone={setClientPhone}
              clientEmail={clientEmail}
              setClientEmail={setClientEmail}
              labels={labels}
            />
          )}

          {/* Step: Package Selection */}
          {step === "package" && (
            <PackageStep
              packages={packages}
              addOns={addOns}
              selectedPkgId={selectedPkgId}
              setSelectedPkgId={(id) => {
                setSelectedPkgId(id);
                setSelectedVariationId(null); // reset variation when package changes
              }}
              selectedVariationId={selectedVariationId}
              setSelectedVariationId={setSelectedVariationId}
              selectedAddOnIds={selectedAddOnIds}
              toggleAddOn={toggleAddOn}
              labels={labels}
            />
          )}

          {/* Step: Event Info */}
          {step === "event" && (
            <EventInfoStep
              eventType={eventType}
              setEventType={setEventType}
              eventDate={eventDate}
              setEventDate={setEventDate}
              eventTime={eventTime}
              setEventTime={setEventTime}
              eventLocation={eventLocation}
              setEventLocation={setEventLocation}
              notes={notes}
              setNotes={setNotes}
              eventTypes={eventTypes}
              labels={labels}
            />
          )}

          {/* Step: Payment */}
          {step === "payment" && (
            <PaymentStep
              selectedPkg={selectedPkg}
              addOns={addOns}
              selectedAddOnIds={selectedAddOnIds}
              dpAmount={dpAmount}
              setDpAmount={setDpAmount}
              receiptFile={receiptFile}
              setReceiptFile={setReceiptFile}
              labels={labels}
            />
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStepIdx > 0 && (
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={goBack}
              >
                ←
              </Button>
            )}
            {step !== "payment" ? (
              <Button
                type="button"
                variant="primary"
                className="flex-1"
                disabled={!canGoNext()}
                onClick={goNext}
              >
                {stepLabels[FORM_STEPS[currentStepIdx + 1]] ?? "→"} →
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                className="flex-1"
                disabled={!canGoNext() || submitting}
                onClick={handleSubmit}
              >
                {submitting ? labels.submitting : labels.submitBooking}
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────

function FormHeader({
  vendorName,
  vendorImage,
  title,
  subtitle,
}: {
  vendorName: string;
  vendorImage: string | null;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center">
      {vendorImage ? (
        <Image
          src={vendorImage}
          alt={vendorName}
          width={64}
          height={64}
          className="mx-auto mb-3 h-16 w-16 rounded-full object-cover"
        />
      ) : (
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <span className="text-xl font-bold text-blue-600">
            {vendorName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <h1 className="text-xl font-bold text-gray-900">
        {title} {vendorName}
      </h1>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function StepIndicator({
  steps,
  currentStep,
  stepLabels,
}: {
  steps: readonly FormStep[];
  currentStep: FormStep;
  stepLabels: Record<FormStep, string>;
}) {
  const currentIdx = steps.indexOf(currentStep);

  return (
    <div className="flex items-center gap-1">
      {steps.map((s, i) => {
        const isDone = i < currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <div key={s} className="flex flex-1 flex-col items-center">
            <div className="mb-1.5 flex w-full items-center">
              {i > 0 && (
                <div
                  className={`h-0.5 flex-1 ${isDone || isCurrent ? "bg-blue-500" : "bg-gray-200"}`}
                />
              )}
              {i === 0 && <div className="flex-1" />}
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  isDone
                    ? "bg-blue-500 text-white"
                    : isCurrent
                      ? "bg-blue-500 text-white ring-2 ring-blue-200"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {isDone ? <IconCheck size={12} /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${isDone ? "bg-blue-500" : "bg-gray-200"}`}
                />
              )}
              {i === steps.length - 1 && <div className="flex-1" />}
            </div>
            <span
              className={`text-[10px] leading-tight ${isCurrent ? "font-semibold text-blue-600" : isDone ? "text-gray-600" : "text-gray-400"}`}
            >
              {stepLabels[s]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ClientInfoStep({
  clientName,
  setClientName,
  clientPhone,
  setClientPhone,
  clientEmail,
  setClientEmail,
  labels,
}: {
  clientName: string;
  setClientName: (v: string) => void;
  clientPhone: string;
  setClientPhone: (v: string) => void;
  clientEmail: string;
  setClientEmail: (v: string) => void;
  labels: BookingFormLabels;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
        {labels.clientInfoTitle}
      </h3>
      <Input
        label={labels.fullName}
        placeholder={labels.fullNamePlaceholder}
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        required
      />
      <Input
        label={labels.phone}
        placeholder={labels.phonePlaceholder}
        value={clientPhone}
        onChange={(e) => setClientPhone(e.target.value)}
        required
      />
      <Input
        label={labels.email}
        placeholder={labels.emailPlaceholder}
        type="email"
        value={clientEmail}
        onChange={(e) => setClientEmail(e.target.value)}
      />
    </div>
  );
}

function PackageStep({
  packages,
  addOns,
  selectedPkgId,
  setSelectedPkgId,
  selectedVariationId,
  setSelectedVariationId,
  selectedAddOnIds,
  toggleAddOn,
  labels,
}: {
  packages: VendorPackage[];
  addOns: VendorAddOn[];
  selectedPkgId: string | null;
  setSelectedPkgId: (id: string) => void;
  selectedVariationId: string | null;
  setSelectedVariationId: (id: string | null) => void;
  selectedAddOnIds: string[];
  toggleAddOn: (id: string) => void;
  labels: BookingFormLabels;
}) {
  const selectedPkg = packages.find((p) => p.id === selectedPkgId) ?? null;

  return (
    <div className="space-y-5">
      {/* Package selection */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
          {labels.selectPackageTitle}
        </h3>
        <p className="mt-0.5 text-xs text-gray-500">
          {labels.selectPackageDesc}
        </p>
      </div>

      <div className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
        {packages.map((pkg) => {
          const isSelected = pkg.id === selectedPkgId;
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => setSelectedPkgId(pkg.id)}
              className={`w-full rounded-xl border-2 p-4 text-left transition-colors ${
                isSelected
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {pkg.name}
                  </p>
                  {pkg.description && (
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                      {pkg.description}
                    </p>
                  )}
                  {pkg.items.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {pkg.items.slice(0, 3).map((item) => (
                        <span
                          key={item.id}
                          className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600"
                        >
                          <IconCheck size={8} className="text-green-500" />
                          {item.label}
                        </span>
                      ))}
                      {pkg.items.length > 3 && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                          +{pkg.items.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-blue-600">
                    {formatCurrency(pkg.price, pkg.currency)}
                  </p>
                  {isSelected && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-medium text-white">
                      <IconCheck size={8} /> {labels.selectedLabel}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Variation selector — shown when selected package has variations */}
      {selectedPkg && selectedPkg.items.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
            {labels.selectVariation}
          </h3>
          {!selectedVariationId && (
            <p className="mt-0.5 text-xs text-red-500">
              {labels.variationRequired}
            </p>
          )}
          <div className="mt-3 space-y-2">
            {selectedPkg.items.map((variation) => {
              const isChosen = variation.id === selectedVariationId;
              return (
                <button
                  key={variation.id}
                  type="button"
                  onClick={() => setSelectedVariationId(variation.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-colors ${
                    isChosen
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                      isChosen
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {isChosen && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {variation.label}
                    </p>
                    {variation.description && (
                      <p className="text-xs text-gray-500">
                        {variation.description}
                      </p>
                    )}
                  </div>
                  <p className="shrink-0 text-sm font-bold text-blue-600">
                    {formatCurrency(variation.price, selectedPkg.currency)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add-ons */}
      {addOns.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
            {labels.addOnsOptional}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            {labels.addOnsOptionalDesc}
          </p>
          <div className="mt-3 max-h-40 space-y-2 overflow-y-auto pr-1">
            {addOns.map((ao) => {
              const isAdded = selectedAddOnIds.includes(ao.id);
              return (
                <button
                  key={ao.id}
                  type="button"
                  onClick={() => toggleAddOn(ao.id)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                    isAdded
                      ? "border-blue-300 bg-blue-50/50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${
                      isAdded
                        ? "bg-blue-500 text-white"
                        : "border border-gray-300 bg-white"
                    }`}
                  >
                    {isAdded && <IconCheck size={10} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {ao.name}
                    </p>
                    {ao.description && (
                      <p className="text-xs text-gray-500">{ao.description}</p>
                    )}
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-gray-700">
                    +{formatCurrency(ao.price, ao.currency)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function EventInfoStep({
  eventType,
  setEventType,
  eventDate,
  setEventDate,
  eventTime,
  setEventTime,
  eventLocation,
  setEventLocation,
  notes,
  setNotes,
  eventTypes,
  labels,
}: {
  eventType: string;
  setEventType: (v: string) => void;
  eventDate: string;
  setEventDate: (v: string) => void;
  eventTime: string;
  setEventTime: (v: string) => void;
  eventLocation: string;
  setEventLocation: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  eventTypes: { value: string; label: string }[];
  labels: BookingFormLabels;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
        {labels.eventInfoTitle}
      </h3>
      <Select
        label={labels.eventType}
        value={eventType}
        onChange={(e) => setEventType(e.target.value)}
        placeholder={labels.selectEventType}
        options={eventTypes}
      />
      <Input
        label={labels.eventDate}
        type="date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        required
      />
      <Input
        label={labels.eventTime}
        type="time"
        value={eventTime}
        onChange={(e) => setEventTime(e.target.value)}
      />
      <Input
        label={labels.eventLocation}
        placeholder={labels.eventLocationPlaceholder}
        value={eventLocation}
        onChange={(e) => setEventLocation(e.target.value)}
      />
      <div className="space-y-1.5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
          {labels.notesTitle}
        </h3>
        <textarea
          rows={2}
          placeholder={labels.notesPlaceholder}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

function PaymentStep({
  selectedPkg,
  addOns,
  selectedAddOnIds,
  dpAmount,
  setDpAmount,
  receiptFile,
  setReceiptFile,
  labels,
}: {
  selectedPkg: VendorPackage | null;
  addOns: VendorAddOn[];
  selectedAddOnIds: string[];
  dpAmount: string;
  setDpAmount: (v: string) => void;
  receiptFile: File | null;
  setReceiptFile: (f: File | null) => void;
  labels: BookingFormLabels;
}) {
  const chosenAddOns = useMemo(
    () => addOns.filter((a) => selectedAddOnIds.includes(a.id)),
    [addOns, selectedAddOnIds],
  );

  const packagePrice = selectedPkg ? parseFloat(selectedPkg.price) : 0;
  const addOnsTotal = chosenAddOns.reduce((s, a) => s + parseFloat(a.price), 0);
  const grandTotal = packagePrice + addOnsTotal;

  return (
    <div className="space-y-5">
      {/* Order summary */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-semibold text-gray-900">
          {labels.orderSummary}
        </h3>
        <div className="mt-3 space-y-2 text-sm">
          {selectedPkg && (
            <div className="flex justify-between">
              <span className="text-gray-600">
                {labels.packageLabel}: {selectedPkg.name}
              </span>
              <span className="font-medium text-gray-900">
                {formatCurrency(selectedPkg.price, selectedPkg.currency)}
              </span>
            </div>
          )}
          {chosenAddOns.map((ao) => (
            <div key={ao.id} className="flex justify-between">
              <span className="text-gray-500">+ {ao.name}</span>
              <span className="text-gray-700">
                {formatCurrency(ao.price, ao.currency)}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between font-semibold">
              <span className="text-gray-900">{labels.grandTotal}</span>
              <span className="text-blue-600">
                {formatCurrency(grandTotal.toString())}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DP Amount */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
          {labels.dpPaymentTitle}
        </h3>
        <p className="text-xs text-gray-500">{labels.dpPaymentDesc}</p>
        <Input
          label={labels.dpAmountLabel}
          placeholder={labels.dpAmountPlaceholder}
          type="number"
          value={dpAmount}
          onChange={(e) => setDpAmount(e.target.value)}
          required
        />
      </div>

      {/* Receipt upload */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
          {labels.receiptUploadTitle}
        </h3>
        <p className="text-xs text-gray-500">{labels.receiptUploadDesc}</p>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-5 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/50">
          {receiptFile ? (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <IconImage size={20} className="text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">
                {receiptFile.name}
              </p>
              <p className="text-xs text-gray-400">
                {(receiptFile.size / 1024).toFixed(0)} KB —{" "}
                <span className="text-blue-600">{labels.changeFile}</span>
              </p>
            </>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                <IconUpload size={20} className="text-blue-500" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                {labels.dragOrClick}
              </p>
              <p className="text-xs text-gray-400">{labels.acceptedFormats}</p>
            </>
          )}
          <input
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>
    </div>
  );
}
