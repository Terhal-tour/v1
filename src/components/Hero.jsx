import React from "react";

export default function Hero() {
  return (
    <>
      <section
        className="relative h-[90vh] parallax"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBwHewz0gmdlpLx7Kf5oWcdKdF55iWduA7cFNrw_O5MdD83k9Z4IcTgdphtyA89zZW63Rg5km08pgHVfNMYHgPXmIVwoJYYQOTQP5EpDV8GtQvDRZNRcIuGfkVttTrfUjL6qlMSEt9-jCFxi1UZ3gLfju_a-lpLTO9NemJjmzXLJsWCmMj9Ukn9JUG_WzFmrINeVAUqPJLzljFYblO9OpNST7m78luKHU0iZZztRuAdYAGbaME_tgZubVITYGxKpBqi55wUmYinPgw")',
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter">
            Discover the Wonders of Egypt
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Explore ancient ruins, vibrant cities, and breathtaking landscapes
            with Terhal.
          </p>
          <a
            className="mt-4 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-[var(--color-gold)] text-[var(--color-text-dark)] text-base font-bold tracking-wide hover:scale-105 transform transition-transform duration-300"
            href="#topRated"
          >
            <span className="truncate">Explore Destinations</span>
          </a>
        </div>
      </section>
    </>
  );
}
