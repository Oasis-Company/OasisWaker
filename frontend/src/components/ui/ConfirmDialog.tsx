"use client";

import React, { useRef, useEffect, useCallback } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   ConfirmDialog — Swiss Style confirmation modal
   Uses native <dialog> with showModal() for accessibility and focus trapping.
   ────────────────────────────────────────────────────────────────────────── */

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = "confirm-dialog-title";
  const messageId = "confirm-dialog-message";

  // Open/close dialog when isOpen changes
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Handle Escape key
  const handleCancel = useCallback(() => {
    if (!isLoading) {
      onCancel();
    }
  }, [isLoading, onCancel]);

  const confirmVariant =
    variant === "danger"
      ? "bg-swiss-red text-swiss-white hover:bg-red-700"
      : "bg-swiss-black text-swiss-white hover:bg-swiss-gray-700";

  return (
    <dialog
      ref={dialogRef}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onClose={handleCancel}
      onClick={(e) => {
        // Close when clicking backdrop (outside the dialog element)
        if (e.target === dialogRef.current && !isLoading) {
          onCancel();
        }
      }}
      className="backdrop:bg-black/40 bg-transparent border-none p-0"
      style={{ maxWidth: "400px", width: "100%" }}
    >
      <div className="bg-swiss-white border border-swiss-black p-xl">
        {/* Red accent bar */}
        <div className="w-8 h-0.5 bg-swiss-red mb-md" />

        {/* Title */}
        <h2
          id={titleId}
          className="text-h2 text-swiss-black mb-sm"
        >
          {title}
        </h2>

        {/* Message */}
        <p
          id={messageId}
          className="text-body text-swiss-gray-500 leading-relaxed mb-xl"
        >
          {message}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-md">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="border border-swiss-black text-swiss-black text-body-bold px-md py-sm hover:bg-swiss-gray-100 transition-colors disabled:opacity-50"
            aria-label={cancelLabel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`text-body-bold px-md py-sm transition-colors disabled:opacity-50 ${confirmVariant}`}
            aria-label={confirmLabel}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}