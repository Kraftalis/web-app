"use client";

import { Button, Input, Textarea, Modal } from "@/components/ui";
import type { Category } from "@/services/pricing";

interface Props {
  open: boolean;
  editingCat: Category | null;
  onClose: () => void;
  onSave: (formData: FormData) => void;
  isSaving: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: Record<string, any>;
}

export default function CategoryModal({
  open,
  editingCat,
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
      title={editingCat ? s.editCategory : s.addCategory}
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose}>
            {dict.common.cancel}
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="cat-form"
            disabled={isSaving}
          >
            {dict.common.save}
          </Button>
        </>
      }
    >
      <form id="cat-form" action={onSave} className="space-y-4">
        <Input
          name="name"
          label={s.categoryName}
          placeholder={s.categoryNamePlaceholder}
          defaultValue={editingCat?.name ?? ""}
          required
        />
        <Textarea
          name="description"
          label={s.categoryDescription}
          placeholder={s.categoryDescPlaceholder}
          defaultValue={editingCat?.description ?? ""}
          rows={3}
        />
      </form>
    </Modal>
  );
}
