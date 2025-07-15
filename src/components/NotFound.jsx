import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./../css/navbar.css";

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="flex flex-col min-h-screen justify-between bg-[#23282d]">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white/90 rounded-2xl shadow-2xl px-8 py-8 flex flex-col items-center max-w-md w-full">
          <div className="text-6xl font-extrabold text-[var(--color-gold)] mb-1 drop-shadow-lg">404</div>
          <div className="text-xl font-bold text-[var(--color-nile-blue)] mb-1">{t('notfound_title')}</div>
          <div className="text-sm text-gray-500 mb-4 text-center">{t('notfound_desc')}</div>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-[var(--color-gold)] text-white text-base font-bold rounded-lg shadow hover:bg-[var(--color-nile-blue)] hover:text-[var(--color-gold)] transition-all duration-200"
          >
            {t('notfound_home')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 