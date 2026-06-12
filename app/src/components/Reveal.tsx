"use client";

import { useEffect, useRef, useState } from "react";

// Лёгкое появление блока при прокрутке (дизайн v2).
// Оборачивает содержимое: пока блок ниже экрана — он чуть прозрачный и сдвинут;
// когда попадает в зону видимости, плавно «проявляется» (классы .reveal в globals.css).
// Уважает системную настройку «уменьшить движение»: тогда показывает сразу, без анимации.

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Задержка появления в мс — для каскада карточек. */
  delay?: number;
  /** HTML-тег обёртки (по умолчанию div). */
  as?: "div" | "li" | "section";
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Если пользователь просил меньше движения — показываем сразу.
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`reveal${visible ? " is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
