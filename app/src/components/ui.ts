// Общие строки-классы интерфейса — единый источник стиля для всего приложения.
// Это обычные строки (не компоненты), поэтому их можно использовать и в серверных
// компонентах без "use client". Хочешь поменять вид приложения — меняй здесь
// (и палитру в globals.css). Дизайн v2: «тёплая редакционная роскошь».

// Кнопки
export const btnPrimary =
  "rounded-full bg-espresso px-5 py-2 text-sm font-medium text-paper transition hover:bg-espresso-7 motion-safe:hover:-translate-y-0.5";
export const btnSecondary =
  "rounded-full border border-sand bg-card px-5 py-2 text-sm font-medium text-espresso transition hover:bg-paper-2 motion-safe:hover:-translate-y-0.5";
export const btnDanger =
  "rounded-full border border-danger/30 bg-card px-5 py-2 text-sm font-medium text-danger transition hover:bg-danger-bg motion-safe:hover:-translate-y-0.5";

// Поля форм (input / select / textarea)
export const inputBase =
  "rounded-lg border border-sand bg-card px-3 py-2 text-espresso focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay";

// Карточки (с деликатным «подъёмом» на hover — отключается при reduce-motion)
export const cardBase =
  "rounded-2xl border border-sand bg-card p-5 shadow-sm shadow-espresso/5 transition motion-safe:hover:-translate-y-0.5 hover:shadow-md hover:shadow-espresso/10";
// Строка-карточка в списках (плотнее по вертикали)
export const rowCard =
  "flex items-center justify-between gap-4 rounded-xl border border-sand bg-card p-4 shadow-sm shadow-espresso/5 transition motion-safe:hover:-translate-y-0.5 hover:shadow-md hover:shadow-espresso/10";

// Бейдж-таблетка (цвет добавляется доменным хелпером сверху)
export const badgeBase = "rounded-full px-2.5 py-1 text-xs font-medium";

// Блок-уведомление под формой/на странице — на тёплой палитре (токены danger/success).
// Внешний отступ (mt-4 / mb-4) задаёт место вызова.
export const alertError = "rounded-md bg-danger-bg p-3 text-sm text-danger";
export const alertSuccess = "rounded-md bg-success-bg p-3 text-sm text-success";

// Чип-фильтр
export const chipBase = "rounded-full px-3 py-1 text-sm font-medium transition";
export const chipActive = "bg-espresso text-paper";
export const chipInactive =
  "bg-card text-espresso border border-sand hover:bg-paper-2";

// Надзаголовок-«eyebrow» — маленькая подпись капсом вразрядку (редакционный акцент)
export const eyebrow =
  "text-xs font-semibold uppercase tracking-[0.18em] text-clay";
