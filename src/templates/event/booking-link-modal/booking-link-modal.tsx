"use client";

import { Modal } from "@/components/ui";
import { BookingLinkForm } from "@/templates/event/booking-link-form";

interface Props {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labels: Record<string, any>;
}

export default function BookingLinkModal({ open, onClose, labels }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={labels.configTitle ?? "Create Booking Link"}
      className="max-w-2xl"
    >
      <BookingLinkForm onClose={onClose} labels={labels} />
    </Modal>
  );
}
