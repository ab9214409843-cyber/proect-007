// Общие строки-классы интерфейса — единый источник стиля для всего приложения.
// Это обычные строки (не компоненты), поэтому их можно использовать и в серверных
// компонентах без "use client". Хочешь поменять вид приложения — меняй здесь.

// Кнопки
export const btnPrimary =
  "rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700";
export const btnSecondary =
  "rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100";
export const btnDanger =
  "rounded-md border border-red-200 bg-white px-5 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50";

// Поля форм (input / select / textarea)
export const inputBase =
  "rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none";

// Карточки
export const cardBase =
  "rounded-lg border border-gray-200 bg-white p-5 shadow-sm";
// Строка-карточка в списках (плотнее по вертикали)
export const rowCard =
  "flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm";

// Бейдж-таблетка (цвет добавляется доменным хелпером сверху)
export const badgeBase = "rounded-full px-2.5 py-1 text-xs font-medium";

// Чип-фильтр
export const chipBase = "rounded-full px-3 py-1 text-sm font-medium transition";
export const chipActive = "bg-gray-900 text-white";
export const chipInactive =
  "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100";
