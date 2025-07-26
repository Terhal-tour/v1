import React from "react";
import { useTranslation } from "react-i18next";

export default function AboutUs() {
  const { t } = useTranslation();
  return (
    <section
      className="py-20 sm:py-28 bg-blue-50"
      id="about"
    >
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-yellow-600 mb-6">
          {t('about_title')}
        </h2>
        <p className="text-lg text-[var(--color-text-light)] max-w-3xl mx-auto leading-relaxed">
          {t('about_desc')}
        </p>
      </div>
    </section>
  );
}
