import React from "react";
import ChildPlace from "./ChildPlace";

export default function TopRatedPlacesHome({ places }) {
  console.log(places);

  return (
    <>
      <section
        className="py-20 sm:py-28 bg-[var(--color-desert-sand)]"
        id="topRated"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center text-[var(--color-nile-blue)] mb-12">
            Top Rated Places
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* place */}
            {places.map((p) => {
              return <ChildPlace key={p.id} place={p} />;
            })}
          </div>
        </div>
      </section>
    </>
  );
}
