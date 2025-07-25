import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { NavLink } from "react-router-dom";
import ChildPlace from "./ChildPlace";
import { useTranslation } from "react-i18next";
import Spinner from "./Spinner";

export default function RecommendedPlaces() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("https://backend-mu-ten-26.vercel.app/places/suggested", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRecommended(data.places || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recommended places:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner />;
  if (!sessionStorage.getItem("jwt")) return null;
  if (recommended.length === 0) return null;

  return (
    <section
      className="py-16 bg-orange-50"
      id="recommended-places"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-amber-900 mb-10">
          {t("recommended_title")}
        </h2>

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
          {recommended.map((place) => (
            <SwiperSlide key={place._id}>
              <div className="bg-white shadow-md rounded-xl overflow-hidden border border-amber-100 hover:shadow-xl transition-all h-full">
                <ChildPlace place={place} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <NavLink
          to="/review"
          className="inline-flex pt-3 justify-center items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-full shadow-lg hover:from-amber-700 hover:to-orange-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out group"
        >
          {t("review_recommendations")}
        </NavLink>
      </div>
    </section>
  );
}

