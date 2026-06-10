// Общие строки-классы интерфейса — единый источник стиля для всего приложения.
// Это обычные строки (не компоненты), поэтому их можно использовать и в серверных
// компонентах без "use client". Хочешь поменять вид приложения — меняй здесь
// (и палитру в globals.css). Дизайн v2: «тёплая редакционная роскошь».

// Кнопки
export const btnPrimary =
  "rounded-full bg-espresso px-5 py-2 text-sm font-medium text-paper transition hover:bg-espresso-7";
export const btnSecondary =
  "rounded-full border border-sand bg-card px-5 py-2 text-sm font-medium text-espresso transition hover:bg-paper-2";
export const btnDanger =
  "rounded-full border border-red-200 bg-card px-5 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50";

// Поля форм (input / select / textarea)
export const inputBase =
  "rounded-lg border border-sand bg-card px-3 py-2 text-espresso focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay";

// Карточки
export const cardBase =
  "rounded-2xl border border-sand bg-card p-5 shadow-sm shadow-espresso/5";
// Строка-карточка в списках (плотнее по вертикали)
export const rowCard =
  "flex items-center justify-between gap-4 rounded-xl border border-sand bg-card p-4 shadow-sm shadow-espresso/5";

// Бейдж-таблетка (цвет добавляется доменным хелпером сверху)
export const badgeBase = "rounded-full px-2.5 py-1 text-xs font-medium";

// Чип-фильтр
export const chipBase = "rounded-full px-3 py-1 text-sm font-medium transition";
export const chipActive = "bg-espresso text-paper";
export const chipInactive =
  "bg-card text-espresso border border-sand hover:bg-paper-2";

// Надзаголовок-«eyebrow» — маленькая подпись капсом вразрядку (редакционный акцент)
export const eyebrow =
  "text-xs font-semibold uppercase tracking-[0.18em] text-clay";
