import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

// Публичная главная — «тёплая редакционная роскошь» (дизайн v2).
// Серверный компонент: без интерактива, только разметка.

const steps = [
  {
    n: "01",
    title: "Создаёте мероприятие",
    text: "Название, тип, дата и место — всего за минуту.",
  },
  {
    n: "02",
    title: "Получаете план подготовки",
    text: "Система сама расставляет задачи по датам — по проверенной методике.",
  },
  {
    n: "03",
    title: "Ведёте задачи и документы",
    text: "Видите, что и когда нужно сделать, и храните все файлы рядом.",
  },
  {
    n: "04",
    title: "Фиксируете опыт",
    text: "После мероприятия записываете выводы — они пригодятся в следующий раз.",
  },
];

const features = [
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
  {
    title: "Спокойные сроки",
    text: "Понятная картина подготовки — без авралов и забытых дел.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-paper text-espresso">
      {/* Полоса-анонс */}
      <div className="bg-espresso px-6 py-2 text-center text-xs tracking-wide text-paper/80">
        EventOS — спокойная и предсказуемая подготовка мероприятий
      </div>

      {/* Шапка */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-serif text-2xl font-semibold tracking-tight">
          Event<span className="text-clay">OS</span>
        </span>
        <Link
          href="/login"
          className="text-sm font-medium text-espresso transition hover:text-clay"
        >
          Войти →
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-10 text-center sm:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">
          Платформа для организаторов мероприятий
        </p>
        <h1 className="mx-auto mt-5 max-w-4xl font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-espresso sm:text-7xl">
          Всё для подготовки мероприятия — в одном месте
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          Создайте мероприятие, получите готовый план подготовки по датам, ведите
          задачи и документы, фиксируйте опыт. Чтобы каждое следующее мероприятие
          проходило спокойнее предыдущего.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/register"
            className="rounded-full bg-espresso px-8 py-3 text-base font-medium text-paper transition hover:bg-espresso-7 motion-safe:hover:-translate-y-0.5"
          >
            Начать
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-sand bg-card px-8 py-3 text-base font-medium text-espresso transition hover:bg-paper-2 motion-safe:hover:-translate-y-0.5"
          >
            Войти
          </Link>
        </div>

        {/* Большое фото */}
        <div className="group relative mt-14 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-sand shadow-xl shadow-espresso/10">
          <Image
            src="/images/hero-event.jpg"
            alt="Массовое спортивное мероприятие: участники забега и зрители"
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
          />
        </div>
      </section>

      {/* Проблема организаторов */}
      <section className="mt-24 bg-paper-2">
        <Reveal className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">
            Знакомо?
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-3xl font-semibold tracking-tight text-espresso sm:text-4xl">
            Подготовка мероприятия — это десятки дел и сжатые сроки
          </h2>
          <p className="mt-5 max-w-3xl text-lg text-muted">
            Задачи держатся в голове и в разных чатах, документы разбросаны по
            папкам, сроки подходят неожиданно, а ценный опыт прошлых мероприятий
            теряется — и каждый раз приходится начинать с нуля.
          </p>
          <p className="mt-4 max-w-3xl text-lg font-medium text-espresso">
            EventOS собирает подготовку в единую и предсказуемую систему.
          </p>
        </Reveal>
      </section>

      {/* Как это работает */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">
            Как это работает
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-espresso sm:text-4xl">
            Четыре спокойных шага
          </h2>
        </Reveal>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.n}
              delay={i * 90}
              className="rounded-2xl border border-sand bg-card p-6 shadow-sm shadow-espresso/5 transition motion-safe:hover:-translate-y-0.5 hover:shadow-md hover:shadow-espresso/10"
            >
              <span className="font-serif text-3xl font-semibold text-clay">
                {step.n}
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold text-espresso">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Редакционное фото-вставка */}
      <section className="mx-auto max-w-6xl px-6 pb-4">
        <Reveal className="group relative block aspect-[21/9] w-full overflow-hidden rounded-3xl border border-sand shadow-lg shadow-espresso/10">
          <Image
            src="/images/event-action.jpg"
            alt="Участники в активной зоне мероприятия — азарт и эмоции"
            fill
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/50 to-transparent" />
          <p className="absolute bottom-6 left-6 right-6 max-w-xl font-serif text-2xl font-semibold leading-snug text-paper sm:text-3xl">
            Каждая деталь продумана заранее — и день мероприятия проходит спокойно.
          </p>
        </Reveal>
      </section>

      {/* Возможности */}
      <section className="mt-20 bg-paper-2">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">
              Возможности
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-espresso sm:text-4xl">
              Всё, что нужно организатору
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal
                key={f.title}
                delay={i * 80}
                className="rounded-2xl border border-sand bg-card p-6 shadow-sm shadow-espresso/5 transition motion-safe:hover:-translate-y-0.5 hover:shadow-md hover:shadow-espresso/10"
              >
                <h3 className="font-serif text-lg font-semibold text-espresso">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{f.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Для кого */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">
            Для кого
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-espresso sm:text-4xl">
            Для тех, кто отвечает за мероприятие
          </h2>
          <p className="mt-5 max-w-3xl text-lg text-muted">
            Для специалистов, которые отвечают за организацию мероприятий:
            спортивных, познавательных и других. Первая версия создаётся под
            организаторов спортивных мероприятий и опирается на реальный процесс
            подготовки.
          </p>
        </Reveal>
      </section>

      {/* Финальный призыв */}
      <section className="bg-espresso">
        <Reveal className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="mx-auto max-w-2xl font-serif text-3xl font-semibold tracking-tight text-paper sm:text-4xl">
            Готовы навести порядок в подготовке?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-paper/70">
            Заведите первое мероприятие — план подготовки появится автоматически.
          </p>
          <Link
            href="/register"
            className="mt-9 inline-block rounded-full bg-paper px-8 py-3 text-base font-medium text-espresso transition hover:bg-paper-2 motion-safe:hover:-translate-y-0.5"
          >
            Начать бесплатно
          </Link>
        </Reveal>
      </section>

      {/* Подвал */}
      <footer className="bg-espresso">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-paper/10 px-6 py-10 text-sm text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-serif text-lg font-semibold text-paper">
            Event<span className="text-clay">OS</span>
          </span>
          <span>Сервис для организаторов мероприятий.</span>
        </div>
      </footer>
    </div>
  );
}
