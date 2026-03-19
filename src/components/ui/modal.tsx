"use client";

import { type ReactNode, useEffect, useRef, useCallback } from "react";
import { IconX } from "@/components/icons";

/**
 * Modal — overlay dialog with backdrop, close button, and content area.
 */

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className = "",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleEscape);
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, handleEscape]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-8 sm:items-center">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative z-10 my-auto w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-150 ${className}`}
      >
        {/* Header — sticky so title stays visible while body scrolls */}
        {title && (
          <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-white px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <IconX size={18} />
            </button>
          </div>
        )}

        {/* Body — scrollable when content exceeds viewport */}
        <div className="max-h-[calc(100dvh-12rem)] overflow-y-auto px-6 py-4">
          {children}
        </div>

        {/* Footer — sticky action bar, always visible */}
        {footer && (
          <div className="sticky bottom-0 flex justify-end gap-3 rounded-b-lg border-t border-gray-200 bg-white px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export type { ModalProps };
