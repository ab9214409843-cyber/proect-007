// Глобальный индикатор загрузки между переходами на верхнем уровне.
export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper-2 p-4">
      <p className="animate-pulse text-sm text-muted">Загрузка…</p>
    </main>
  );
}
