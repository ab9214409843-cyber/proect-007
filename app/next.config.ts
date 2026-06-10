import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Загрузка документов идёт через server action — по умолчанию лимит тела 1 МБ.
    // Поднимаем до 25 МБ (совпадает с лимитом бакета documents, Этап 7).
    serverActions: { bodySizeLimit: "25mb" },
  },
};

export default nextConfig;
