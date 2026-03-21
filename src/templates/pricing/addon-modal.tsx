"use client";

import { Button, Input, Textarea, Modal } from "@/components/ui";
import type { AddOn } from "./types";

interface Props {
  open: boolean;
  editingAddon: AddOn | null;
  onClose: () => void;
  onSave: (payload: AddOnFormPayload) => void;
  isSaving: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: Record<string, any>;
}

export interface AddOnFormPayload {
  name: string;
  description: string | null;
  price: number;
  currency: string;
  isActive: boolean;
}

export default function AddOnModal({
  open,
  editingAddon,
  onClose,
  onSave,
  isSaving,
  dict,
}: Props) {
  const pricing = dict.pricing;

  const handleSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || null;
    const price = parseFloat(formData.get("price") as string) || 0;
    const currency = (formData.get("currency") as string) || "IDR";
    const isActive = formData.get("isActive") === "true";

    onSave({ name, description, price, currency, isActive });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingAddon ? pricing.editAddOn : pricing.addAddOn}
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose}>
            {dict.common.cancel}
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="addon-form"
            disabled={isSaving}
          >
            {dict.common.save}
          </Button>
        </>
      }
    >
      <form id="addon-form" action={handleSubmit} className="space-y-4">
        <Input
          name="name"
          label={pricing.addOnName}
          placeholder={pricing.addOnNamePlaceholder}
          defaultValue={editingAddon?.name ?? ""}
          required
        />
        <Textarea
          name="description"
          label={pricing.addOnDescription}
          placeholder={pricing.addOnDescPlaceholder}
          defaultValue={editingAddon?.description ?? ""}
          rows={2}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="price"
            label={pricing.addOnPrice}
            type="number"
            min="0"
            defaultValue={editingAddon?.price ?? ""}
            required
          />
          <Input
            name="currency"
            label={pricing.currency}
            defaultValue={editingAddon?.currency ?? "IDR"}
          />
        </div>

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
      </form>
    </Modal>
  );
}
