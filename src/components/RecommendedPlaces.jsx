// components/RecommendedPlaces.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link, NavLink } from "react-router-dom";
import ChildPlace from "./ChildPlace";

export default function RecommendedPlaces({ recommended = [] }) {
  return (
    <section className="py-16 bg-orange-50" id="recommended-places">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-amber-900 mb-10">
          Recommended Places for You
        </h2>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {recommended.map((place) => (
            <SwiperSlide key={place._id}>
              <div className="bg-white shadow-md rounded-xl overflow-hidden border border-amber-100 hover:shadow-xl transition-all h-full">
                <ChildPlace place={place}/>
                </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
