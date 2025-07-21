import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ChildPlace from "./ChildPlace";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function NearbyPlaces() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      try {
        const token = sessionStorage.getItem("jwt");

        const res = await fetch("https://backend-mu-ten-26.vercel.app/places/nearby?radius=10", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setPlaces(data.places || []);
      } catch (err) {
        console.error("Error fetching nearby places:", err);
        setError("Failed to load nearby places");
      }
    };

    fetchNearbyPlaces();
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-[var(--color-desert-sand)]" id="nearby">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center text-[var(--color-nile-blue)] mb-12">
          {t("near_by_title")}
        </h2>

        {error && <p className="text-red-600 text-center mb-6">{error}</p>}

        <div className="flex flex-wrap justify-center gap-8 w-full">
          {places.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              dir={isRTL ? "rtl" : "ltr"}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {places.map((place) => (
                <SwiperSlide key={place._id}>
                  <ChildPlace place={place} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-center text-gray-600 w-full">{t("no_places_found")}</p>
          )}
        </div>
      </div>
    </section>
  );
}
