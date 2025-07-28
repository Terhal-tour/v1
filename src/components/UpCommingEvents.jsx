import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Spinner from "./Spinner";

export default function UpCommingEvents() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch("https://backend-mu-ten-26.vercel.app/events/eventsinHome")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setEvents(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) setLoading(false);
        console.error("Error fetching events:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <Spinner />;

  const eventCount = events?.length || 0;

  return (
    <section
      className="py-20 sm:py-28 bg-gradient-to-br from-amber-50 to-orange-50"
      id="events"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center text-amber-900 mb-12">
          {t("events_title")}
        </h2>

        {eventCount === 0 ? (
          <div className="text-center py-12">
            <p className="text-amber-700 text-lg">{t("no_events")}</p>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            navigation
            pagination={{ clickable: true }}
            slidesPerView={1}
            dir={isRTL ? "rtl" : "ltr"}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="h-[550px]"
          >
            {events.map((event) => (
              <SwiperSlide key={event.id}>
                <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl border border-amber-200 flex flex-col ">
                  <div className="w-full h-56 relative">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      className="rounded-t-xl"
                      src={`https://www.google.com/maps?q=${event.coordinates}&output=embed`}
                      allowFullScreen
                      title={`Map for ${event.name}`}
                    ></iframe>
                  </div>

                  <div className="p-6 flex flex-col">
                    <div className="">
                      <h2 className="text-xl font-bold text-amber-900 mb-3 line-clamp-2">
                        {event.name}
                      </h2>
                      <p className="text-amber-700 leading-relaxed mb-4 flex-grow">
                        {event.description?.length > 100
                          ? `${event.description.substring(0, 100)}...`
                          : event.description || t("no_description")}
                      </p>
                    </div>

                    <div className="space-y-3 mt-auto">
                      {event.location && (
                        <div className="flex items-center text-amber-800">
                          <svg
                            className="w-4 h-4 mr-2 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm font-medium truncate">
                            {event.location}
                          </span>
                        </div>
                      )}

                      {(event.startTime || event.endTime) && (
                        <div className="flex items-center text-amber-700">
                          <svg
                            className="w-4 h-4 mr-2 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">
                            {event.startTime}
                            {event.endTime && <span> - {event.endTime}</span>}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {event.category && (
                          <div className="inline-block bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                            {event.category}
                          </div>
                        )}

                        {event.status && (
                          <div
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              event.status.toLowerCase() === "active"
                                ? "bg-green-200 text-green-800"
                                : "bg-blue-200 text-blue-800"
                            }`}
                          >
                            {event.status}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

        )}
      </div>
    </section>
  );
}

