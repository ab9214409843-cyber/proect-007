"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-items";

// Боковое меню кабинета с подсветкой активного раздела (сайдбар на ≥sm).
export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
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
