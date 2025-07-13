import React from "react";

export default function AboutUs() {
  return (
    <>
      <section
        className="py-20 sm:py-28 bg-[var(--color-warm-white)]"
        id="about"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-nile-blue)] mb-6">
            About Terhal
          </h2>
          <p className="text-lg text-[var(--color-text-light)] max-w-3xl mx-auto leading-relaxed">
            Terhal is your premier guide to exploring the rich history and
            diverse culture of Egypt. We offer curated travel experiences,
            insightful content, and personalized recommendations to help you
            create unforgettable memories.
          </p>
        </div>
      </section>
    </>
  );
}
