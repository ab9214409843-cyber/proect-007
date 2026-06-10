import type { ReactNode } from "react";

// Шапка раздела: заголовок + необязательное описание + необязательное действие справа.
// Используется на всех списках и в шапках карточек.
export default function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {action}
      </div>
      {description && <p className="mt-2 text-gray-600">{description}</p>}
    </div>
  );
}
