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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("jwt");

        const res = await fetch("https://backend-mu-ten-26.vercel.app/places/nearby?radius=20", {
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
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyPlaces();
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-[var(--color-desert-sand)]" id="nearby">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center text-[var(--color-nile-blue)] mb-12">
          {t("near_by_title")}
        </h2>

        {error && (
          <div className="text-red-600 text-center mb-8 p-4 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-nile-blue)]"></div>
          </div>
        ) : places.length > 0 ? (
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{ 
                clickable: true,
                dynamicBullets: true
              }}
              dir={isRTL ? "rtl" : "ltr"}
              breakpoints={{
                640: { 
                  slidesPerView: 1,
                  spaceBetween: 20
                },
                768: { 
                  slidesPerView: 2,
                  spaceBetween: 24
                },
                1024: { 
                  slidesPerView: 3,
                  spaceBetween: 24
                },
                1280: { 
                  slidesPerView: 3,
                  spaceBetween: 32
                }
              }}
              className="nearby-places-swiper"
            >
              {places.map((place) => (
                <SwiperSlide key={place._id} className="h-auto">
                  <div className="h-full">
                    <ChildPlace place={place} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <div className="swiper-button-prev !text-[var(--color-nile-blue)] !w-10 !h-10 !mt-0 !top-1/2 !-translate-y-1/2 !left-0 !bg-white !rounded-full !shadow-lg after:!text-lg after:!font-bold hover:!bg-[var(--color-nile-blue)] hover:!text-white transition-all duration-300"></div>
            <div className="swiper-button-next !text-[var(--color-nile-blue)] !w-10 !h-10 !mt-0 !top-1/2 !-translate-y-1/2 !right-0 !bg-white !rounded-full !shadow-lg after:!text-lg after:!font-bold hover:!bg-[var(--color-nile-blue)] hover:!text-white transition-all duration-300"></div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg font-medium">{t("no_places_found")}</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your location or check back later</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .nearby-places-swiper {
          padding: 0 50px 50px 50px;
        }
        
        .nearby-places-swiper .swiper-pagination {
          bottom: 20px;
        }
        
        .nearby-places-swiper .swiper-pagination-bullet {
          background: var(--color-nile-blue);
          opacity: 0.3;
        }
        
        .nearby-places-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .nearby-places-swiper {
            padding: 0 0 50px 0;
          }
          
          .swiper-button-prev,
          .swiper-button-next {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}