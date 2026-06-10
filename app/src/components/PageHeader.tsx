import type { ReactNode } from "react";
import { eyebrow as eyebrowClass } from "./ui";

// Шапка раздела: необязательный надзаголовок-eyebrow + засечный заголовок +
// необязательное описание + необязательное действие справа.
export default function PageHeader({
  title,
  description,
  action,
  eyebrow,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && <p className={eyebrowClass + " mb-2"}>{eyebrow}</p>}
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-espresso">
            {title}
          </h1>
        </div>
        {action}
      </div>
      {description && <p className="mt-2 text-muted">{description}</p>}
    </div>
  );
}
