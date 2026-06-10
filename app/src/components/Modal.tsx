"use client";

import { useEffect, type ReactNode } from "react";

// Примитив модального окна: затемнённый фон + центрированная белая карточка.
// Закрытие — по клику на фон или по Esc. Управляется снаружи (open/onClose).
export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  // Закрытие по Esc, пока окно открыто.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
