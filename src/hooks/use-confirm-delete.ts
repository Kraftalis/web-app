import { useState, useCallback, useRef } from "react";

/**
 * Double-click-to-confirm delete pattern.
 * First click arms the id, second click within 3s triggers the action.
 */
export function useConfirmDelete(onDelete: (id: string) => void) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleDelete = useCallback(
    (id: string) => {
      if (pendingId === id) {
        onDelete(id);
        setPendingId(null);
        if (timerRef.current) clearTimeout(timerRef.current);
      } else {
        setPendingId(id);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setPendingId(null), 3000);
      }
    },
    [pendingId, onDelete],
  );

  return { pendingId, handleDelete } as const;
}
