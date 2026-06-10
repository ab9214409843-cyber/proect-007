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
        "rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center " +
        className
      }
    >
      <p className="text-gray-700">{title}</p>
      {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
  );
}
