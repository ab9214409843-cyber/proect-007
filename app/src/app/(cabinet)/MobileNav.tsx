"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "./nav-items";

// Мобильное меню (только на узком экране): кнопка-гамбургер + выпадающая панель со ссылками.
// На ≥sm скрыто — там работает сайдбар (Nav).
export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label="Меню"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg border border-sand bg-card p-2 text-espresso transition hover:bg-paper-2"
      >
        {/* Иконка-гамбургер / крестик */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          {open ? (
            <path d="M5 5l10 10M15 5L5 15" />
          ) : (
            <path d="M3 6h14M3 10h14M3 14h14" />
          )}
        </svg>
      </button>

      {open && (
        <>
          {/* Прозрачный фон — закрывает меню по клику мимо */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
            role="presentation"
          />
          <nav className="absolute left-4 right-4 z-40 mt-2 flex flex-col gap-1 rounded-xl border border-sand bg-card p-2 shadow-xl shadow-espresso/10">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={
                    "rounded-lg px-3 py-2 text-sm font-medium transition " +
                    (active
                      ? "bg-espresso text-paper"
                      : "text-espresso hover:bg-paper-2")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </div>
  );
}
