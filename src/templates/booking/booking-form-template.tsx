"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui";
import { useDictionary } from "@/i18n";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import type {
  PortalEvent,
  PortalPayment,
  VendorPackage,
  VendorAddOn,
} from "./types";
import { BookingForm } from "./booking-form";
import type { BookingFormData } from "./booking-form";
import { PortalHeader } from "./portal-header";
import { PortalStatusTracker } from "./portal-status-tracker";
import { PortalEventInfo } from "./portal-event-info";
import {
  PortalPaymentProgress,
  PortalPaymentHistory,
  PortalUploadPayment,
} from "./portal-payment-section";

// ─── Types ──────────────────────────────────────────────────

interface BookingFormTemplateProps {
  token: string;
  vendorName: string;
  vendorImage: string | null;
  status: "valid" | "expired" | "used" | "invalid";
  serverDict: Dictionary;
  serverLocale: Locale;
  packages: VendorPackage[];
  addOns: VendorAddOn[];
}

// ─── Mock portal data builder ───────────────────────────────

function buildMockPortalEvent(
  data: BookingFormData,
  vendorName: string,
  vendorImage: string | null,
  packages: VendorPackage[],
  vendorAddOns: VendorAddOn[],
): PortalEvent {
  const selectedPkg = packages.find((p) => p.id === data.packageId) ?? null;
  const selectedAddOns = vendorAddOns.filter((a) =>
    data.selectedAddOnIds.includes(a.id),
  );

  const pkgPrice = selectedPkg ? parseFloat(selectedPkg.price) : 0;
  const addOnsTotal = selectedAddOns.reduce(
    (s, a) => s + parseFloat(a.price),
    0,
  );
  const totalAmount = pkgPrice + addOnsTotal;
  const dpNum = parseFloat(data.dpAmount) || 0;

  return {
    id: "mock-event-portal",
    vendorName,
    vendorImage,
    clientName: data.clientName,
    clientPhone: data.clientPhone,
    clientEmail: data.clientEmail,
    eventType: data.eventType,
    eventDate: data.eventDate,
    eventTime: data.eventTime,
    eventLocation: data.eventLocation,
    amount: totalAmount.toString(),
    dpAmount: dpNum.toString(),
    eventStatus: "WAITING_PAYMENT",
    paymentStatus: dpNum > 0 ? "DP_PAID" : "UNPAID",
    notes: data.notes,
    package: selectedPkg
      ? {
          id: selectedPkg.id,
          name: selectedPkg.name,
          description: selectedPkg.description,
          price: selectedPkg.price,
          currency: selectedPkg.currency,
          items: selectedPkg.items.map((item) => ({
            id: item.id,
            label: item.label,
            description: item.description,
            price: item.price,
          })),
        }
      : null,
    addOns: selectedAddOns.map((ao) => ({
      id: "eao-" + ao.id,
      quantity: 1,
      unitPrice: ao.price,
      addOn: { id: ao.id, name: ao.name, description: ao.description },
    })),
    payments:
      dpNum > 0
        ? [
            {
              id: "pay-001",
              amount: dpNum.toString(),
              paymentType: "DOWN_PAYMENT",
              receiptUrl: data.receiptFile
                ? URL.createObjectURL(data.receiptFile)
                : null,
              note: "Initial DP",
              isVerified: false,
              createdAt: new Date().toISOString(),
            },
          ]
        : [],
  };
}

// ─── Component ──────────────────────────────────────────────

export default function BookingFormTemplate({
  token,
  vendorName,
  vendorImage,
  status,
  serverDict,
  packages,
  addOns,
}: BookingFormTemplateProps) {
  const i18n = useDictionary();
  const dict = i18n?.dict ?? serverDict;
  const b = dict.booking;

  // Portal state: null = show form, PortalEvent = show portal
  const [portalEvent, setPortalEvent] = useState<PortalEvent | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // ─── Invalid states ─────────────────────────────────────
  if (status !== "valid") {
    const messages: Record<string, string> = {
      expired: b.linkExpired,
      used: b.linkUsed,
      invalid: b.linkInvalid,
    };
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center">
          <CardBody className="space-y-4 py-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {messages[status] ?? b.linkInvalid}
            </p>
            <Link
              href="/"
              className="inline-block text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              {b.goHome}
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  // ─── Event types ────────────────────────────────────────
  const eventTypes = [
    { value: "Wedding", label: b.typeWedding },
    { value: "Engagement", label: b.typeEngagement },
    { value: "Birthday", label: b.typeBirthday },
    { value: "Graduation", label: b.typeGraduation },
    { value: "Corporate", label: b.typeCorporate },
    { value: "Other", label: b.typeOther },
  ];

  // ─── Form submission → transition to portal ─────────────
  async function handleFormSubmit(data: BookingFormData) {
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, ...data, receiptFile: undefined }),
    });

    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error || "Something went wrong");
    }

    const ev = buildMockPortalEvent(
      data,
      vendorName,
      vendorImage,
      packages,
      addOns,
    );
    setPortalEvent(ev);
  }

  // ─── Show booking form if not yet submitted ─────────────
  if (!portalEvent) {
    return (
      <BookingForm
        vendorName={vendorName}
        vendorImage={vendorImage}
        onSubmit={handleFormSubmit}
        packages={packages}
        addOns={addOns}
        labels={{
          pageTitle: b.pageTitle,
          pageSubtitle: b.pageSubtitle,
          clientInfoTitle: b.clientInfoTitle,
          fullName: b.fullName,
          fullNamePlaceholder: b.fullNamePlaceholder,
          phone: b.phone,
          phonePlaceholder: b.phonePlaceholder,
          email: b.email,
          emailPlaceholder: b.emailPlaceholder,
          eventInfoTitle: b.eventInfoTitle,
          eventType: b.eventType,
          selectEventType: b.selectEventType,
          eventDate: b.eventDate,
          eventTime: b.eventTime,
          eventLocation: b.eventLocation,
          eventLocationPlaceholder: b.eventLocationPlaceholder,
          notesTitle: b.notesTitle,
          notesPlaceholder: b.notesPlaceholder,
          submitting: b.submitting,
          submitBooking: b.submitBooking,
          selectPackageTitle: b.selectPackageTitle,
          selectPackageDesc: b.selectPackageDesc,
          packageIncludes: b.packageIncludes,
          selectedLabel: b.selectedLabel,
          selectLabel: b.selectLabel,
          selectVariation: b.selectVariation,
          variationRequired: b.variationRequired,
          addOnsOptional: b.addOnsOptional,
          addOnsOptionalDesc: b.addOnsOptionalDesc,
          perItem: b.perItem,
          added: b.added,
          add: b.add,
          dpPaymentTitle: b.dpPaymentTitle,
          dpPaymentDesc: b.dpPaymentDesc,
          dpAmountLabel: b.dpAmountLabel,
          dpAmountPlaceholder: b.dpAmountPlaceholder,
          minimumDp: b.minimumDp,
          receiptUploadTitle: b.receiptUploadTitle,
          receiptUploadDesc: b.receiptUploadDesc,
          receiptLabel: b.receiptLabel,
          dragOrClick: b.dragOrClick,
          acceptedFormats: b.acceptedFormats,
          changeFile: b.changeFile,
          orderSummary: b.orderSummary,
          packageLabel: b.packageLabel,
          addOnsLabel: b.addOnsLabel,
          dpLabel: b.dpLabel,
          grandTotal: b.grandTotal,
          free: b.free,
          stepClientInfo: b.stepClientInfo,
          stepPackage: b.stepPackage,
          stepEvent: b.stepEvent,
          stepPayment: b.stepPayment,
        }}
        eventTypes={eventTypes}
      />
    );
  }

  // ─── Show portal ────────────────────────────────────────
  return (
    <BookingPortal
      event={portalEvent}
      setEvent={setPortalEvent}
      message={message}
      setMessage={setMessage}
      isSubmittingPayment={isSubmittingPayment}
      setIsSubmittingPayment={setIsSubmittingPayment}
      dict={dict}
    />
  );
}

// ─── Portal sub-component ───────────────────────────────────

function BookingPortal({
  event,
  setEvent,
  message,
  setMessage,
  isSubmittingPayment,
  setIsSubmittingPayment,
  dict,
}: {
  event: PortalEvent;
  setEvent: React.Dispatch<React.SetStateAction<PortalEvent | null>>;
  message: string | null;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  isSubmittingPayment: boolean;
  setIsSubmittingPayment: React.Dispatch<React.SetStateAction<boolean>>;
  dict: Dictionary;
}) {
  const b = dict.booking;
  const ev = dict.event;

  const eventStatusLabel: Record<string, string> = {
    INQUIRY: ev.statusInquiry,
    WAITING_PAYMENT: ev.statusWaitingPayment,
    CONFIRMED: ev.statusConfirmed,
    ONGOING: ev.statusOngoing,
    COMPLETED: ev.statusCompleted,
  };

  const paymentStatusLabel: Record<string, string> = {
    UNPAID: ev.paymentUnpaid,
    DP_PAID: ev.paymentDpPaid,
    PAID: ev.paymentPaid,
  };

  const paymentTypeMap: Record<string, string> = {
    DOWN_PAYMENT: b.dpPayment,
    INSTALLMENT: b.installment,
    FULL_PAYMENT: b.fullPayment,
  };

  const totalPaid = useMemo(
    () =>
      event.payments
        .filter((p) => p.isVerified)
        .reduce((sum, p) => sum + parseFloat(p.amount), 0),
    [event.payments],
  );

  const totalAmount = useMemo(
    () => (event.amount ? parseFloat(event.amount) : 0),
    [event.amount],
  );

  const remaining = useMemo(
    () => Math.max(totalAmount - totalPaid, 0),
    [totalAmount, totalPaid],
  );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  function handleAddPayment(data: {
    amount: string;
    paymentType: string;
    note: string;
    receiptFile: File | null;
  }) {
    setIsSubmittingPayment(true);
    const newPayment: PortalPayment = {
      id: "pay-" + Date.now(),
      amount: data.amount,
      paymentType: data.paymentType,
      receiptUrl: data.receiptFile
        ? URL.createObjectURL(data.receiptFile)
        : null,
      note: data.note || null,
      isVerified: false,
      createdAt: new Date().toISOString(),
    };
    setEvent((prev) =>
      prev ? { ...prev, payments: [...prev.payments, newPayment] } : prev,
    );
    setIsSubmittingPayment(false);
    setMessage(b.portalPaymentSent);
    setTimeout(() => setMessage(null), 4000);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {message && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <PortalHeader
          event={event}
          eventStatusLabel={eventStatusLabel}
          paymentStatusLabel={paymentStatusLabel}
          labels={{
            portalWelcome: b.portalWelcome,
            portalWelcomeDesc: b.portalWelcomeDesc,
            portalContactVendor: b.portalContactVendor,
          }}
        />

        <div className="mt-6">
          <PortalStatusTracker
            currentStatus={event.eventStatus}
            statusLabel={eventStatusLabel}
            title={b.statusTracker}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <PortalEventInfo
              event={event}
              labels={{
                portalEventDetails: b.portalEventDetails,
                portalEventType: b.portalEventType,
                portalEventDate: b.portalEventDate,
                portalEventTime: b.portalEventTime,
                portalEventLocation: b.portalEventLocation,
                portalYourPackage: b.portalYourPackage,
                portalNoPackage: b.portalNoPackage,
                portalYourAddOns: b.portalYourAddOns,
                portalNoAddOns: b.portalNoAddOns,
                portalIncluded: b.portalIncluded,
              }}
              addOnLabels={{ qty: b.qty, perUnit: b.perUnit }}
              formatDate={formatDate}
            />
          </div>

          <div className="space-y-4 lg:col-span-2">
            <PortalPaymentProgress
              totalAmount={totalAmount}
              totalPaid={totalPaid}
              remaining={remaining}
              labels={{
                totalAmount: b.totalAmount,
                totalPaid: b.totalPaid,
                remaining: b.remaining,
              }}
            />

            <PortalPaymentHistory
              payments={event.payments}
              paymentTypeMap={paymentTypeMap}
              labels={{
                paymentHistory: b.paymentHistory,
                noPayments: b.noPayments,
                viewReceipt: b.portalViewReceipt,
                verified: b.verified,
                pending: b.pending,
              }}
              formatDate={formatDate}
            />

            <PortalUploadPayment
              onSubmit={handleAddPayment}
              isSubmitting={isSubmittingPayment}
              labels={{
                uploadReceipt: b.uploadReceipt,
                uploadReceiptDesc: b.uploadReceiptDesc,
                paymentAmount: b.paymentAmount,
                paymentType: b.paymentType,
                paymentNote: b.paymentNote,
                paymentNotePlaceholder: b.paymentNotePlaceholder,
                selectFile: b.selectFile,
                noFileSelected: b.noFileSelected,
                dpPayment: b.dpPayment,
                fullPayment: b.fullPayment,
                installment: b.installment,
                submitPayment: b.submitPayment,
                uploading: b.uploading,
              }}
            />
          </div>
        </div>

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
