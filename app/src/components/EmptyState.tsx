// Пустое состояние «пока ничего нет» — пунктирная карточка с текстом и подсказкой.
export default function EmptyState({
  title,
  hint,
  className = "mt-8",
}: {
  title: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={
        "rounded-2xl border border-dashed border-sand bg-card/60 p-10 text-center " +
        className
      }
    >
      <p className="text-espresso">{title}</p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  );
}
