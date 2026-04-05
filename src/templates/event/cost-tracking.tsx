import { useState } from "react";
import { format } from "date-fns";
import {
  IconPlus,
  IconReceipt,
  IconCalendar,
  IconCash,
  IconFileText,
  IconTag,
  IconPhoto,
  IconTrash,
} from "@tabler/icons-react";
import Button from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatCurrency } from "./types";
import type { FinanceTransactionSerialized } from "./types";
import { UploadButton } from "@/components/form/upload-button";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CostTrackingProps {
  transactions: FinanceTransactionSerialized[];
  eventId: string;
  labels: {
    addCost: string;
    costRecords: string;
    noCostRecords: string;
    noCostRecordsDesc: string;
    costCategory: string;
    costCategoryPlaceholder: string;
    costDescription: string;
    costDescriptionPlaceholder: string;
    costAmount: string;
    costAmountPlaceholder: string;
    costDate: string;
    costReceipt: string;
    saveCost: string;
    cancel: string;
    deleting: string;
    deleteConfirm: string;
  };
  onAddCost: () => void;
  onEditCost?: (transaction: FinanceTransactionSerialized) => void;
  onDeleteCost?: (id: string) => void;
  onViewReceipt: (receipt: { name: string; url: string; type: string }) => void;
}

export function CostTracking({
  transactions,
  labels,
  onAddCost,
  onDeleteCost,
  onViewReceipt,
}: CostTrackingProps) {
  const costs = transactions.filter((t) => t.type === "EXPENSE");
  const totalCost = costs.reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-5 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
            <IconCash size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">
              {labels.costRecords}
            </h3>
            <p className="text-xs text-slate-500">
              Total:{" "}
              {formatCurrency(
                totalCost.toString(),
                costs[0]?.currency || "IDR",
              )}
            </p>
          </div>
        </div>
        <Button onClick={onAddCost} size="sm">
          <IconPlus size={16} />
          {labels.addCost}
        </Button>
      </div>

      <div className="p-5">
        {costs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-100 bg-slate-50 py-12 text-center">
            <div className="mb-3 rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-100">
              <IconTag size={24} className="text-slate-400" />
            </div>
            <h4 className="font-medium text-slate-700">
              {labels.noCostRecords}
            </h4>
            <p className="mt-1 text-sm text-slate-500 max-w-sm">
              {labels.noCostRecordsDesc}
            </p>
            <Button
              onClick={onAddCost}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <IconPlus size={14} className="mr-1" />
              {labels.addCost}
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Label</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Receipt</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {costs.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="group border-b border-slate-50 transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-800">
                        {transaction.description || "Event Cost"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-bold text-slate-900">
                        {formatCurrency(
                          transaction.amount,
                          transaction.currency,
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <IconCalendar size={14} />
                        {format(
                          new Date(transaction.transactionDate),
                          "d MMM yyyy",
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {transaction.receiptUrl && (
                        <button
                          onClick={() =>
                            onViewReceipt({
                              name: transaction.receiptName || "Receipt",
                              url: transaction.receiptUrl!,
                              type: transaction.receiptUrl?.endsWith(".pdf")
                                ? "application/pdf"
                                : "image/jpeg",
                            })
                          }
                          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          <IconReceipt size={14} />
                          Receipt
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {onDeleteCost && (
                        <button
                          onClick={() => {
                            if (window.confirm(labels.deleteConfirm)) {
                              onDeleteCost(transaction.id);
                            }
                          }}
                          className="opacity-0 transition-opacity group-hover:opacity-100 text-slate-400 hover:text-red-500"
                          title="Delete cost"
                        >
                          <IconTrash size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

interface CostFormProps {
  onSubmit: (data: {
    label: string;
    amount: string;
    transactionDate: string;
    receiptFile: File | null;
  }) => void;
  isSubmitting: boolean;
  labels: {
    costCategory: string;
    costCategoryPlaceholder: string;
    costDescription: string;
    costDescriptionPlaceholder: string;
    costAmount: string;
    costAmountPlaceholder: string;
    costDate: string;
    costReceipt: string;
    saveCost: string;
    cancel: string;
  };
  onCancel: () => void;
}

export function CostForm({
  onSubmit,
  isSubmitting,
  labels,
  onCancel,
}: CostFormProps) {
  const [formData, setFormData] = useState({
    label: "",
    amount: "",
    transactionDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      receiptFile,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label>Label</Label>
          <Input
            value={formData.label}
            onChange={(e) =>
              setFormData({ ...formData, label: e.target.value })
            }
            placeholder="Cost label (e.g. Transport, Food, etc.)"
            required
          />
        </div>

        <div className="space-y-2 col-span-2 sm:col-span-1">
          <Label>{labels.costAmount}</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              IDR
            </span>
            <Input
              required
              type="number"
              min="0"
              step="1"
              placeholder={labels.costAmountPlaceholder}
              value={formData.amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
              }
              className="pl-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{labels.costDate}</Label>
          <Input
            required
            type="date"
            value={formData.transactionDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData((prev) => ({
                ...prev,
                transactionDate: e.target.value,
              }))
            }
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label>{labels.costReceipt}</Label>
          <div className="rounded-lg border-2 border-dashed border-slate-200 p-4 text-center hover:bg-slate-50/50 flex flex-col items-center justify-center">
            {receiptFile ? (
              <div className="flex items-center gap-2 text-sm text-slate-700 w-full justify-between">
                <div className="flex items-center gap-2 truncate max-w-50">
                  <IconPhoto size={16} className="text-slate-400 shrink-0" />
                  <span className="truncate">{receiptFile.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 h-6 px-2"
                  onClick={() => setReceiptFile(null)}
                >
                  Clear
                </Button>
              </div>
            ) : (
              <UploadButton
                accept="image/*,application/pdf"
                onFileSelect={(file: File) => setReceiptFile(file ?? null)}
                buttonNode={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <IconFileText size={16} className="mr-2" />
                    Select File
                  </Button>
                }
                uploadButtonLabel="Select File"
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {labels.cancel}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
          {labels.saveCost}
        </Button>
      </div>
    </form>
  );
}
