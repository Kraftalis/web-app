"use client";

import { Button, Input, Textarea, Modal } from "@/components/ui";
import type { Subcategory } from "@/services/pricing";

interface Props {
  open: boolean;
  editingSub: Subcategory | null;
  onClose: () => void;
  onSave: (formData: FormData) => void;
  isSaving: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: Record<string, any>;
}

export default function SubcategoryModal({
  open,
  editingSub,
  onClose,
  onSave,
  isSaving,
  dict,
}: Props) {
  const s = dict.settings;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingSub ? s.editSubcategory : s.addSubcategory}
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose}>
            {dict.common.cancel}
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="sub-form"
            disabled={isSaving}
          >
            {dict.common.save}
          </Button>
        </>
      }
    >
      <form id="sub-form" action={onSave} className="space-y-4">
        <Input
          name="name"
          label={s.subcategoryName}
          placeholder={s.subcategoryNamePlaceholder}
          defaultValue={editingSub?.name ?? ""}
          required
        />
        <Textarea
          name="description"
          label={s.subcategoryDescription}
          placeholder={s.subcategoryDescPlaceholder}
          defaultValue={editingSub?.description ?? ""}
          rows={3}
        />
      </form>
    </Modal>
  );
}
