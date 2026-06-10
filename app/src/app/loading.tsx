// Глобальный индикатор загрузки между переходами на верхнем уровне.
export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <p className="animate-pulse text-sm text-gray-500">Загрузка…</p>
    </main>
  );
}
