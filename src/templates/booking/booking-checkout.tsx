"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Card, CardHeader, CardBody, Button, Input } from "@/components/ui";
import {
  IconUser,
  IconPhone,
  IconMail,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconEdit,
  IconCheck,
  IconUpload,
  IconDollar,
  IconX,
} from "@/components/icons";
import type {
  BookingLinkFullData,
  PackageSnapshotData,
  AddOnSnapshotData,
} from "./types";
import { formatCurrency } from "./types";

// ─── Types ──────────────────────────────────────────────────

export interface CheckoutSubmitData {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  dpAmount: string;
  receiptFile: File | null;
}

export interface BookingCheckoutProps {
  bookingData: BookingLinkFullData;
  onSubmit: (data: CheckoutSubmitData) => Promise<void>;
  labels: {
    // Header
    pageTitle: string;
    checkoutSubtitle: string;
    // Vendor
    vendorLabel: string;
    // Client info
    clientInfoTitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    editInfo: string;
    cancelEdit: string;
    // Event summary
    eventSummaryTitle: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    // Package
    packageLabel: string;
    noPackage: string;
    variationLabel: string;
    includes: string;
    // Add-ons
    addOnsLabel: string;
    noAddOns: string;
    perItem: string;
    qty: string;
    // Totals
    subtotalLabel: string;
    addOnsTotalLabel: string;
    grandTotal: string;
    // Payment
    dpPaymentTitle: string;
    dpPaymentDesc: string;
    dpAmountLabel: string;
    dpAmountPlaceholder: string;
    receiptLabel: string;
    receiptDesc: string;
    dragOrClick: string;
    acceptedFormats: string;
    changeFile: string;
    // Submit
    confirmAndPay: string;
    processing: string;
  };
}

// ─── Component ──────────────────────────────────────────────

export function BookingCheckout({
  bookingData,
  onSubmit,
  labels,
}: BookingCheckoutProps) {
  // ─── Client info state ──────────────────────────────────
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [clientName, setClientName] = useState(bookingData.clientName ?? "");
  const [clientPhone, setClientPhone] = useState(bookingData.clientPhone ?? "");
  const [clientEmail, setClientEmail] = useState("");

  // ─── Payment state ─────────────────────────────────────
  const [dpAmount, setDpAmount] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // ─── Snapshot data from booking link ────────────────────
  const pkg: PackageSnapshotData | null = bookingData.packageSnapshot ?? null;
  const addOns: AddOnSnapshotData[] = useMemo(
    () => bookingData.addOnsSnapshot ?? [],
    [bookingData.addOnsSnapshot],
  );

  // ─── Compute totals ────────────────────────────────────
  const packageTotal = pkg?.price ?? 0;
  const addOnsTotal = useMemo(
    () => addOns.reduce((sum, a) => sum + a.price * a.quantity, 0),
    [addOns],
  );
  const grandTotal = useMemo(() => {
    if (bookingData.totalAmount) return parseFloat(bookingData.totalAmount);
    return packageTotal + addOnsTotal;
  }, [bookingData.totalAmount, packageTotal, addOnsTotal]);

  const currency = pkg?.currency ?? "IDR";

  // ─── Vendor info ────────────────────────────────────────
  const vendorName = bookingData.vendor.name ?? "Vendor";
  const vendorImage = bookingData.vendor.image;

  // ─── Handle file drop ──────────────────────────────────
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setReceiptFile(file);
  };

  // ─── Handle submit ─────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim(),
        dpAmount,
        receiptFile,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Format date helper ────────────────────────────────
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* ─── Header ─────────────────────────────────────── */}
        <div className="mb-8 text-center">
          {vendorImage && (
            <div className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-white shadow-lg">
              <Image
                src={vendorImage}
                alt={vendorName}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">
            {labels.pageTitle} {vendorName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {labels.checkoutSubtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ─── Client Info ──────────────────────────────── */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <IconUser size={16} className="text-blue-500" />
                  {labels.clientInfoTitle}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditingInfo(!isEditingInfo)}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
                >
                  {isEditingInfo ? (
                    <>
                      <IconX size={12} />
                      {labels.cancelEdit}
                    </>
                  ) : (
                    <>
                      <IconEdit size={12} />
                      {labels.editInfo}
                    </>
                  )}
                </button>
              </div>
            </CardHeader>
            <CardBody>
              {isEditingInfo ? (
                <div className="space-y-3">
                  <Input
                    label={labels.fullName}
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder={labels.fullNamePlaceholder}
                    required
                  />
                  <Input
                    label={labels.phone}
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder={labels.phonePlaceholder}
                    required
                  />
                  <Input
                    label={labels.email}
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder={labels.emailPlaceholder}
                  />
                </div>
              ) : (
                <div className="space-y-2.5">
                  <InfoRow
                    icon={<IconUser size={14} className="text-gray-400" />}
                    label={labels.fullName}
                    value={clientName || "—"}
                  />
                  <InfoRow
                    icon={<IconPhone size={14} className="text-gray-400" />}
                    label={labels.phone}
                    value={clientPhone || "—"}
                  />
                  {clientEmail && (
                    <InfoRow
                      icon={<IconMail size={14} className="text-gray-400" />}
                      label={labels.email}
                      value={clientEmail}
                    />
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          {/* ─── Event Summary ────────────────────────────── */}
          <Card>
            <CardHeader>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <IconCalendar size={16} className="text-blue-500" />
                {labels.eventSummaryTitle}
              </h2>
            </CardHeader>
            <CardBody>
              <div className="grid gap-3 sm:grid-cols-2">
                {bookingData.eventDate && (
                  <InfoRow
                    icon={<IconCalendar size={14} className="text-gray-400" />}
                    label={labels.eventDate}
                    value={formatDate(bookingData.eventDate)}
                  />
                )}
                {bookingData.eventTime && (
                  <InfoRow
                    icon={<IconClock size={14} className="text-gray-400" />}
                    label={labels.eventTime}
                    value={bookingData.eventTime}
                  />
                )}
                {bookingData.eventLocation && (
                  <InfoRow
                    icon={<IconMapPin size={14} className="text-gray-400" />}
                    label={labels.eventLocation}
                    value={bookingData.eventLocation}
                    className="sm:col-span-2"
                  />
                )}
              </div>
            </CardBody>
          </Card>

          {/* ─── Receipt / Order Summary ──────────────────── */}
          <Card>
            <CardBody className="p-0">
              {/* Package */}
              {pkg ? (
                <div className="border-b border-gray-100 p-5">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    {labels.packageLabel}
                  </p>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">{pkg.name}</p>
                      {pkg.variationLabel && (
                        <p className="mt-0.5 text-xs text-blue-600">
                          {labels.variationLabel}: {pkg.variationLabel}
                        </p>
                      )}
                      {pkg.description && (
                        <p className="mt-0.5 text-xs text-gray-500">
                          {pkg.description}
                        </p>
                      )}
                      {pkg.inclusions.length > 0 && (
                        <div className="mt-2">
                          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            {labels.includes}
                          </p>
                          <ul className="space-y-0.5">
                            {pkg.inclusions.map((inc, i) => (
                              <li
                                key={i}
                                className="flex items-center gap-1.5 text-xs text-gray-600"
                              >
                                <IconCheck
                                  size={10}
                                  className="shrink-0 text-green-500"
                                />
                                {inc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <p className="shrink-0 text-sm font-bold text-gray-900">
                      {formatCurrency(pkg.price, currency)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-b border-gray-100 p-5">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    {labels.packageLabel}
                  </p>
                  <p className="text-sm text-gray-400">{labels.noPackage}</p>
                </div>
              )}

              {/* Add-ons */}
              {addOns.length > 0 && (
                <div className="border-b border-gray-100 p-5">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    {labels.addOnsLabel}
                  </p>
                  <div className="space-y-2">
                    {addOns.map((addon, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-700">{addon.name}</p>
                          {addon.quantity > 1 && (
                            <p className="text-xs text-gray-400">
                              {labels.qty}: {addon.quantity} ×{" "}
                              {formatCurrency(addon.price, addon.currency)}{" "}
                              {labels.perItem}
                            </p>
                          )}
                        </div>
                        <p className="shrink-0 text-sm font-medium text-gray-700">
                          {formatCurrency(
                            addon.price * addon.quantity,
                            addon.currency,
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-2 p-5">
                {pkg && addOns.length > 0 && (
                  <>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{labels.subtotalLabel}</span>
                      <span>{formatCurrency(packageTotal, currency)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{labels.addOnsTotalLabel}</span>
                      <span>{formatCurrency(addOnsTotal, currency)}</span>
                    </div>
                    <div className="my-2 border-t border-dashed border-gray-200" />
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">
                    {labels.grandTotal}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(grandTotal, currency)}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* ─── DP Payment + Receipt Upload ──────────────── */}
          <Card>
            <CardHeader>
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <IconDollar size={16} className="text-green-500" />
                  {labels.dpPaymentTitle}
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  {labels.dpPaymentDesc}
                </p>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label={labels.dpAmountLabel}
                type="number"
                value={dpAmount}
                onChange={(e) => setDpAmount(e.target.value)}
                placeholder={labels.dpAmountPlaceholder}
                required
              />

              {/* File upload */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  {labels.receiptLabel}
                </label>
                <p className="mb-2 text-xs text-gray-500">
                  {labels.receiptDesc}
                </p>
                <label
                  className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                    dragActive
                      ? "border-blue-400 bg-blue-50"
                      : receiptFile
                        ? "border-green-300 bg-green-50/50"
                        : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {receiptFile ? (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <IconCheck size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {receiptFile.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {(receiptFile.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                      <span className="text-xs font-medium text-blue-600">
                        {labels.changeFile}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <IconUpload size={20} className="text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">
                        {labels.dragOrClick}
                      </p>
                      <p className="text-xs text-gray-400">
                        {labels.acceptedFormats}
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) =>
                      setReceiptFile(e.target.files?.[0] ?? null)
                    }
                  />
                </label>
              </div>
            </CardBody>
          </Card>

          {/* ─── Submit Button ────────────────────────────── */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isSubmitting}
          >
            {isSubmitting ? labels.processing : labels.confirmAndPay}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Powered by{" "}
            <span className="font-medium text-gray-500">Kraftalis</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Info Row ───────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-2.5 ${className}`}>
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <p className="text-sm text-gray-900">{value}</p>
      </div>
    </div>
  );
}
