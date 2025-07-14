import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 w-full h-full animate-gradient-x bg-gradient-to-r from-[#003366] via-[#004080] to-[#003366] opacity-90 z-0" />
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
          <div>
            <h2 className="text-2xl font-extrabold text-white">{t('brand')}</h2>
            <p className="text-sm font-semibold text-gray-200 mt-2">{t('footer_tagline')}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a className="text-gray-100 font-bold hover:text-white transition-transform duration-200 transform hover:scale-105" href="#">{t('footer_contact')}</a>
            <a className="text-gray-100 font-bold hover:text-white transition-transform duration-200 transform hover:scale-105" href="#">{t('footer_privacy')}</a>
            <a className="text-gray-100 font-bold hover:text-white transition-transform duration-200 transform hover:scale-105" href="#">{t('footer_terms')}</a>
          </div>
          <div className="flex justify-center gap-4">
            <a className="text-gray-100 hover:text-white transition-transform duration-200 transform hover:scale-125" href="#">
              <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                <path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z"></path>
              </svg>
            </a>
            <a className="text-gray-100 hover:text-white transition-transform duration-200 transform hover:scale-125" href="#">
              <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
              </svg>
            </a>
            <a className="text-gray-100 hover:text-white transition-transform duration-200 transform hover:scale-125" href="#">
              <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"></path>
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-100 font-bold">
          <p>© 2024 {t('brand')}. {t('footer_copyright')}</p>
        </div>
      </div>
      {/* Keyframes for animated gradient */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer; 