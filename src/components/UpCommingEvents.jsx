import React from "react";
import { useTranslation } from "react-i18next";

export default function UpCommingEvents({ events }) {
  const { t } = useTranslation();
  const getGridClasses = (eventCount) => {
    if (eventCount === 1) {
      return "grid grid-cols-1 max-w-md mx-auto";
    } else if (eventCount === 2) {
      return "grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto";
    } else {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  // Get appropriate gap classes
  const getGapClasses = (eventCount) => {
    if (eventCount <= 2) {
      return "gap-6 md:gap-8";
    } else {
      return "gap-8";
    }
  };

  const eventCount = events?.length || 0;

  return (
    <section
      className="py-20 sm:py-28 bg-gradient-to-br from-amber-50 to-orange-50"
      id="events"
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center text-amber-900 mb-12">
          {t('events_title')}
        </h2>

        {eventCount === 0 ? (
          <div className="text-center py-12">
            <p className="text-amber-700 text-lg">
              {t('no_events')}
            </p>
          </div>
        ) : (
          <div
            className={`${getGridClasses(eventCount)} ${getGapClasses(
              eventCount
            )}`}
          >
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl border border-amber-200 flex flex-col h-full"
              >
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

                <div className="p-6 h-full flex flex-col">
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold text-amber-900 mb-3 line-clamp-2">
                      {event.name}
                    </h2>
                    <p className="text-amber-700 leading-relaxed mb-4 flex-grow">
                      {event.description?.length > 100
                        ? `${event.description.substring(0, 100)}...`
                        : event.description || t('no_description')}
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
