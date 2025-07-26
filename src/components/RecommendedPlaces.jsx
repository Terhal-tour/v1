import React, { useEffect, useState } from "react";
// import { NavLink } from "react-router-dom";
import ChildPlace from "./ChildPlace";
import { useTranslation } from "react-i18next";
import Spinner from "./Spinner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function RecommendedPlaces() {

  const navigate = useNavigate();
  const handleReview=()=>{
   navigate("/review")
  }
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const totalPages = Math.ceil(recommended.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = recommended.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    document.getElementById("recommended-places")?.scrollIntoView({ 
      behavior: "smooth", 
      block: "start" 
    });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  return (
    <section
      className="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 min-h-screen"
      id="recommended-places"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 bg-clip-text text-transparent mb-4">
            {t("recommended_title")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentItems.map((place, index) => (
            <div 
              key={place._id}
              className="group transform hover:scale-105 transition-all duration-500 ease-out"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden border border-amber-200/50 hover:shadow-2xl hover:border-amber-300 transition-all duration-500 h-full relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 via-transparent to-orange-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <ChildPlace place={place} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-amber-700 hover:bg-amber-100 shadow-lg hover:shadow-xl transform hover:scale-110'
                }`}
              >
                {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>

              <div className="flex items-center space-x-1 rtl:space-x-reverse mx-4">
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNum = index + 1;
                  const isActive = pageNum === currentPage;
                  
                  if (totalPages <= 7) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-12 h-12 rounded-full font-semibold transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg transform scale-110'
                            : 'bg-white text-amber-700 hover:bg-amber-100 shadow-md hover:shadow-lg transform hover:scale-105'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  
                  if (pageNum === 1 || pageNum === totalPages || 
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-12 h-12 rounded-full font-semibold transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg transform scale-110'
                            : 'bg-white text-amber-700 hover:bg-amber-100 shadow-md hover:shadow-lg transform hover:scale-105'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return (
                      <span key={pageNum} className="text-amber-600 font-bold text-lg">
                        ...
                      </span>
                    );
                  }
                  
                  return null;
                })}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-amber-700 hover:bg-amber-100 shadow-lg hover:shadow-xl transform hover:scale-110'
                }`}
              >
                {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
            </div>

            <div className="text-sm text-amber-700 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-amber-200">
              {t("page")} {currentPage} {t("of")} {totalPages} • {recommended.length} {t("total_places")}
            </div>
          </div>
        )}

        <div className="text-center mt-16">
          <button
            onClick={handleReview}
            className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-700 via-orange-700 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 group-hover:text-yellow-100 transition-colors duration-300">
              {t("review_recommendations")}
            </span>
            <div className="ml-2 rtl:ml-0 rtl:mr-2 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300">
              {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </div>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

