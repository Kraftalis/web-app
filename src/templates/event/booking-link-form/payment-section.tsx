"use client";

import { useRef } from "react";
import { Input, Select } from "@/components/ui";

interface Props {
  paymentType: "DOWN_PAYMENT" | "FULL_PAYMENT" | "";
  setPaymentType: (v: "DOWN_PAYMENT" | "FULL_PAYMENT" | "") => void;
  paymentAmount: string;
  setPaymentAmount: (v: string) => void;
  paymentReceipt: File | null;
  setPaymentReceipt: (v: File | null) => void;
  paymentNote: string;
  setPaymentNote: (v: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labels: Record<string, any>;
}

export default function PaymentSection({
  paymentType,
  setPaymentType,
  paymentAmount,
  setPaymentAmount,
  paymentReceipt,
  setPaymentReceipt,
  paymentNote,
  setPaymentNote,
  labels,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-700">
          {labels.paymentSectionTitle ?? "Payment (optional)"}
        </h3>
        <p className="text-xs text-gray-500">
          {labels.paymentSectionDesc ??
            "Record a payment to automatically mark the event as booked."}
        </p>
      </div>

      {/* Payment type selector */}
      <Select
        label={labels.paymentTypeLabel ?? "Payment Type"}
        value={paymentType}
        options={[
          { value: "", label: labels.noPayment ?? "No payment" },
          {
            value: "DOWN_PAYMENT",
            label: labels.dpOption ?? "Down Payment (DP)",
          },
          {
            value: "FULL_PAYMENT",
            label: labels.fullPaymentOption ?? "Full Payment",
          },
        ]}
        onChange={(e) =>
          setPaymentType(e.target.value as "DOWN_PAYMENT" | "FULL_PAYMENT" | "")
        }
      />

      {/* Show amount + receipt + note when a payment type is selected */}
      {paymentType && (
        <div className="space-y-3">
          <Input
            label={labels.paymentAmountLabel ?? "Payment Amount"}
            type="number"
            placeholder="0"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            min="0"
          />

          {/* Receipt upload */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {labels.receiptLabel ?? "Transfer Receipt (optional)"}
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setPaymentReceipt(f);
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-sm text-gray-600 transition hover:border-gray-400 hover:bg-gray-50"
            >
              {paymentReceipt ? (
                <span className="max-w-50 truncate text-gray-900">
                  {paymentReceipt.name}
                </span>
              ) : (
                <span>{labels.selectReceipt ?? "Select file"}</span>
              )}
            </button>
            {paymentReceipt && (
              <button
                type="button"
                onClick={() => {
                  setPaymentReceipt(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="ml-2 text-xs text-red-500 hover:underline"
              >
                {labels.removeFile ?? "Remove"}
              </button>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {labels.acceptedFormats ?? "JPG, PNG, or PDF (max 5 MB)"}
            </p>
          </div>

          {/* Note */}
          <Input
            label={labels.paymentNoteLabel ?? "Note (optional)"}
            placeholder={
              labels.paymentNotePlaceholder ?? "e.g. DP transfer via BCA"
            }
            value={paymentNote}
            onChange={(e) => setPaymentNote(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
