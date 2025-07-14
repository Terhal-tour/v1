import React from "react";
import ChildPlace from "./ChildPlace";
import { useTranslation } from "react-i18next";

export default function TopRatedPlacesHome({ places }) {
  const { t } = useTranslation();
  return (
    <section
      className="py-20 sm:py-28 bg-[var(--color-desert-sand)]"
      id="topRated"
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center text-[var(--color-nile-blue)] mb-12">
          {t('top_rated_title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* place */}
          {places.map((p) => {
            return <ChildPlace key={p.id} place={p} />;
          })}
        </div>
      </div>
    </section>
  );
}
