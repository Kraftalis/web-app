"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Input,
  Select,
} from "@/components/ui";
import {
  IconDollar,
  IconUpload,
  IconImage,
  IconCheck,
} from "@/components/icons";
import type { PortalPayment } from "./types";
import { formatCurrency } from "./types";

// ─── Payment Progress ───────────────────────────────────────

interface PortalPaymentProgressProps {
  totalAmount: number;
  totalPaid: number;
  remaining: number;
  labels: {
    totalAmount: string;
    totalPaid: string;
    remaining: string;
  };
}

export function PortalPaymentProgress({
  totalAmount,
  totalPaid,
  remaining,
  labels,
}: PortalPaymentProgressProps) {
  const pct =
    totalAmount > 0 ? Math.min((totalPaid / totalAmount) * 100, 100) : 0;

  return (
    <Card>
      <CardBody className="p-5">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
            <span>
              {formatCurrency(totalPaid.toString())} /{" "}
              {formatCurrency(totalAmount.toString())}
            </span>
            <span className="font-semibold text-gray-700">
              {Math.round(pct)}%
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                pct >= 100
                  ? "bg-green-500"
                  : pct >= 50
                    ? "bg-blue-500"
                    : pct > 0
                      ? "bg-amber-500"
                      : "bg-gray-200"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">
              {labels.totalAmount}
            </p>
            <p className="mt-0.5 text-sm font-bold text-gray-900">
              {formatCurrency(totalAmount.toString())}
            </p>
          </div>
          <div className="rounded-xl bg-green-50 p-3">
            <p className="text-[10px] font-medium uppercase tracking-wide text-green-600">
              {labels.totalPaid}
            </p>
            <p className="mt-0.5 text-sm font-bold text-green-700">
              {formatCurrency(totalPaid.toString())}
            </p>
          </div>
          <div className="rounded-xl bg-red-50 p-3">
            <p className="text-[10px] font-medium uppercase tracking-wide text-red-600">
              {labels.remaining}
            </p>
            <p className="mt-0.5 text-sm font-bold text-red-700">
              {formatCurrency(remaining.toString())}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// ─── Payment History ────────────────────────────────────────

interface PortalPaymentHistoryProps {
  payments: PortalPayment[];
  paymentTypeMap: Record<string, string>;
  labels: {
    paymentHistory: string;
    noPayments: string;
    viewReceipt: string;
    verified: string;
    pending: string;
  };
  formatDate: (dateStr: string) => string;
}

export function PortalPaymentHistory({
  payments,
  paymentTypeMap,
  labels,
  formatDate,
}: PortalPaymentHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <IconDollar size={16} className="text-blue-500" />
            {labels.paymentHistory}
          </h2>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {payments.length}
          </span>
        </div>
      </CardHeader>
      <CardBody>
        {payments.length === 0 ? (
          <div className="py-8 text-center">
            <IconDollar size={32} className="mx-auto mb-2 text-gray-200" />
            <p className="text-sm text-gray-400">{labels.noPayments}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3"
              >
                {/* Icon */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    p.isVerified ? "bg-green-100" : "bg-amber-100"
                  }`}
                >
                  {p.isVerified ? (
                    <IconCheck size={16} className="text-green-600" />
                  ) : (
                    <IconDollar size={16} className="text-amber-600" />
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(p.amount)}
                    </p>
                    <Badge variant={p.isVerified ? "success" : "warning"}>
                      {p.isVerified ? labels.verified : labels.pending}
                    </Badge>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                    <span>
                      {paymentTypeMap[p.paymentType] ?? p.paymentType}
                    </span>
                    <span>·</span>
                    <span>{formatDate(p.createdAt)}</span>
                  </div>
                  {p.note && (
                    <p className="mt-0.5 text-xs text-gray-400">{p.note}</p>
                  )}
                </div>

                {/* Receipt link */}
                {p.receiptUrl && (
                  <a
                    href={p.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                  >
                    <IconImage size={12} />
                    {labels.viewReceipt}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

// ─── Upload Payment Form ────────────────────────────────────

interface PortalUploadPaymentProps {
  onSubmit: (data: {
    amount: string;
    paymentType: string;
    note: string;
    receiptFile: File | null;
  }) => void;
  isSubmitting: boolean;
  labels: {
    uploadReceipt: string;
    uploadReceiptDesc: string;
    paymentAmount: string;
    paymentType: string;
    paymentNote: string;
    paymentNotePlaceholder: string;
    selectFile: string;
    noFileSelected: string;
    dpPayment: string;
    fullPayment: string;
    installment: string;
    submitPayment: string;
    uploading: string;
  };
}

export function PortalUploadPayment({
  onSubmit,
  isSubmitting,
  labels,
}: PortalUploadPaymentProps) {
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("INSTALLMENT");
  const [note, setNote] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ amount, paymentType, note, receiptFile });
    // Reset form
    setAmount("");
    setNote("");
    setReceiptFile(null);
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            {labels.uploadReceipt}
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            {labels.uploadReceiptDesc}
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={labels.paymentAmount}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="0"
          />

          <Select
            label={labels.paymentType}
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            options={[
              { value: "DOWN_PAYMENT", label: labels.dpPayment },
              { value: "INSTALLMENT", label: labels.installment },
              { value: "FULL_PAYMENT", label: labels.fullPayment },
            ]}
          />

          <Input
            label={labels.paymentNote}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={labels.paymentNotePlaceholder}
          />

          {/* File upload */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {labels.selectFile}
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 p-4 transition-colors hover:border-blue-400 hover:bg-blue-50/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <IconUpload size={20} className="text-blue-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700">
                  {receiptFile ? receiptFile.name : labels.noFileSelected}
                </p>
                {receiptFile && (
                  <p className="text-xs text-gray-400">
                    {(receiptFile.size / 1024).toFixed(0)} KB
                  </p>
                )}
              </div>
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            {isSubmitting ? labels.uploading : labels.submitPayment}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
