// Индикатор загрузки раздела кабинета (рендерится внутри layout с меню).
export default function CabinetLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="animate-pulse text-sm text-muted">Загрузка…</p>
    </div>
  );
}
