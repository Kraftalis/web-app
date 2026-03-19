"use client";

import CreateEventForm, {
  Labels as CreateEventLabels,
} from "./CreateEventForm";
import { Modal, Button } from "@/components/ui";

interface EventType {
  value: string;
  label: string;
}

interface Labels {
  title: string;
  create: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (fd: FormData) => void;
  isCreating: boolean;
  createError: string | null;
  eventTypes: EventType[];
  // Accept full CreateEvent labels plus modal-specific ones
  labels: CreateEventLabels & Labels & Record<string, string>;
  cancelLabel: string;
}

export default function CreateEventModal({
  open,
  onClose,
  onSubmit,
  isCreating,
  createError,
  eventTypes,
  labels,
  cancelLabel,
}: Props) {
  return (
    <Modal open={open} onClose={onClose} title={labels.title}>
      <div className="space-y-4">
        {createError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {createError}
          </div>
        )}

        <CreateEventForm
          eventTypes={eventTypes}
          labels={labels}
          onSubmit={onSubmit}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" size="md" type="button" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            size="md"
            type="button"
            isLoading={isCreating}
            onClick={() => {
              // submit the inner form by finding it in the modal
              const form = document.querySelector("form");
              if (form)
                form.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true }),
                );
            }}
          >
            {labels.create}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
