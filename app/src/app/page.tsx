import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Мини-шапка */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-sm font-semibold tracking-widest text-gray-900">
          PROECT_007
        </span>
        <Link
          href="/login"
          className="text-sm font-medium text-gray-700 transition hover:text-gray-900"
        >
          Войти →
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-12 sm:pt-20">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-500">
          Платформа для организаторов мероприятий
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl">
          Всё для подготовки мероприятия — в одном месте
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Создайте мероприятие, получите готовый план подготовки по датам,
          ведите задачи и документы, фиксируйте опыт. Чтобы каждое следующее
          мероприятие проходило спокойнее предыдущего.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/register"
            className="rounded-md bg-gray-900 px-7 py-3 text-base font-medium text-white transition hover:bg-gray-700"
          >
            Начать
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-gray-300 bg-white px-7 py-3 text-base font-medium text-gray-900 transition hover:bg-gray-100"
          >
            Войти
          </Link>
        </div>
      </section>

      {/* Проблема организаторов */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Подготовка мероприятия — это десятки дел и сжатые сроки
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            Задачи держатся в голове и в разных чатах, документы разбросаны по
            папкам, сроки подходят неожиданно, а ценный опыт прошлых мероприятий
            теряется и каждый раз приходится начинать с нуля.
          </p>
          <p className="mt-4 max-w-3xl text-lg font-medium text-gray-900">
            Эта платформа собирает подготовку в единую и предсказуемую систему.
          </p>
        </div>
      </section>

      {/* Как это работает */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Как это работает
        </h2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              n: "1",
              title: "Создаёте мероприятие",
              text: "Название, тип, дата и место — всего за минуту.",
            },
            {
              n: "2",
              title: "Получаете план подготовки",
              text: "Система сама расставляет задачи по датам — по проверенной методике.",
            },
            {
              n: "3",
              title: "Ведёте задачи и документы",
              text: "Видите, что и когда нужно сделать, и храните все файлы рядом.",
            },
            {
              n: "4",
              title: "Фиксируете опыт",
              text: "После мероприятия записываете выводы — они пригодятся в следующий раз.",
            },
          ].map((step) => (
            <li
              key={step.n}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                {step.n}
              </span>
              <h3 className="mt-4 font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Возможности */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Возможности
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Мероприятия",
                text: "Все мероприятия в одном списке: статус, даты, место.",
              },
              {
                title: "Автоматический план",
                text: "Задачи создаются сами от даты мероприятия — ничего не забыто.",
              },
              {
                title: "Задачи",
                text: "Сроки, статусы и приоритеты. Видно, что в работе прямо сейчас.",
              },
              {
                title: "Документы",
                text: "Положение, смета, приказ, сценарий — всё рядом с мероприятием.",
              },
              {
                title: "База опыта",
                text: "Что прошло хорошо, где ошиблись, что улучшить в следующий раз.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Для кого */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Для кого
        </h2>
        <p className="mt-4 max-w-3xl text-lg text-gray-600">
          Для специалистов, которые отвечают за организацию мероприятий:
          спортивных, познавательных и других. Первая версия создаётся под
          организаторов спортивных мероприятий и опирается на реальный процесс
          подготовки.
        </p>
      </section>

      {/* Финальный призыв */}
      <section className="border-t border-gray-100 bg-gray-900">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Готовы навести порядок в подготовке?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-300">
            Заведите первое мероприятие — план подготовки появится автоматически.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-md bg-white px-7 py-3 text-base font-medium text-gray-900 transition hover:bg-gray-100"
          >
            Начать
          </Link>
        </div>
      </section>

      {/* Подвал */}
      <footer className="mx-auto max-w-5xl px-6 py-8 text-sm text-gray-500">
        Proect_007 — сервис для организаторов мероприятий.
      </footer>
    </div>
  );
}
