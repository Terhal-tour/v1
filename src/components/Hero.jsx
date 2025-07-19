import React from "react";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section
      className="relative h-[90vh] parallax"
      style={{
    backgroundImage:
      'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url("/assets/images/heroImage.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter">
          {t('hero_title')}
        </h1>
        <p className="text-lg md:text-xl max-w-2xl">
          {t('hero_subtitle')}
        </p>
        <a
          className="mt-4 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-[var(--color-gold)] text-[var(--color-text-dark)] text-base font-bold tracking-wide hover:scale-105 transform transition-transform duration-300"
          href="#topRated"
        >
          <span className="truncate">{t('hero_button')}</span>
        </a>
      </div>
    </section>
  );
}
