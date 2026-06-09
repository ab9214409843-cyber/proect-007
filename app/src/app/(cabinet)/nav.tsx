"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Обзор" },
  { href: "/events", label: "Мероприятия" },
  { href: "/tasks", label: "Задачи" },
  { href: "/documents", label: "Документы" },
  { href: "/experience", label: "База опыта" },
];

// Боковое меню кабинета с подсветкой активного раздела.
export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              "rounded-md px-3 py-2 text-sm font-medium transition " +
              (active
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100")
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
