import React from "react";
import ChildPlace from "./ChildPlace";
import { useTranslation } from "react-i18next";

export default function TopRatedPlacesHome({ places }) {
  const { t } = useTranslation();
  
  return (
    <section
      className="py-12 sm:py-16 relative overflow-hidden"
      id="topRated"
      style={{
        background: '#bfe1f010',
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-pink-400 to-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-gradient-to-br from-green-400 to-teal-500 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-16 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-32 right-24 w-2 h-2 bg-blue-500 rounded-full animate-pulse opacity-50" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-32 w-4 h-4 bg-pink-500 rounded-full animate-bounce opacity-40" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-48 right-16 w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse opacity-60" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-8 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
              <span className="text-3xl animate-pulse">⭐</span>
              <div className="w-8 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 mb-3">
              {t('top_rated_title')}
            </h2>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 font-medium">
              { 'Discover the most beloved destinations, handpicked by travelers who have experienced their magic firsthand'}
            </p>
            <div className="flex items-center justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-xl text-yellow-500 animate-pulse" style={{animationDelay: `${i * 0.2}s`}}>
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Grid Container */}
        <div className="relative">
          {/* Grid Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-3xl blur-xl"></div>
          
          {/* Places Grid */}
          <div className="relative bg-white/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/60 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {places.map((p, index) => (
                <div
                  key={p.id}
                  className="transform transition-all duration-500 hover:scale-105"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.8s ease-out forwards',
                    opacity: 0
                  }}
                >
                  <ChildPlace place={p} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Decorative Element */}
        <div className="flex justify-center mt-8 sm:mt-10">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full"></div>
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse"></div>
              <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full"></div>
          </div>
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
