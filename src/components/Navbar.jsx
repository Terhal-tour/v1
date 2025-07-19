import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./../css/navbar.css";
import i18n from "../i18n";
const Navbar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = React.useState(localStorage.getItem("lang") || "EN");

  React.useEffect(() => {
    document.documentElement.dir = lang === "AR" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === "EN" ? "AR" : "EN"));
  };
  const token = sessionStorage.getItem("jwt");
  return (
    <nav className="bg-white sticky top-0 z-50 font-jakarta">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo and Brand */}
        <NavLink
          to="/"
          className="flex items-center gap-2"
          style={{ textDecoration: "none" }}
        >
          {/* Orange logo */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="8" fill="#ed7b2a" />
            <ellipse cx="16" cy="16" rx="7" ry="12" fill="white" />
          </svg>
          <span className="text-2xl font-bold text-black">{t("brand")}</span>
        </NavLink>
        {/* Centered Links */}
        <div className="flex-1 flex justify-center">
          <div className="flex gap-10">
            <NavLink
              to="/places"
              className="text-black font-medium hover:text-[var(--color-gold)] transition"
            >
              {t("destinations")}
            </NavLink>
            <NavLink
              to="/events"
              className="text-black font-medium hover:text-[var(--color-gold)] transition"
            >
              {t("experiences")}
            </NavLink>
            <NavLink
              to="/blog"
              className="text-black font-medium hover:text-[var(--color-gold)] transition"
            >
              {t("blog")}
            </NavLink>
            <NavLink
              to="/about"
              className="text-black font-medium hover:text-[var(--color-gold)] transition"
            >
              {t("about")}
            </NavLink>
          </div>
        </div>
        {/* Right Side: Language Switcher & Auth Buttons */}
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-1 px-4 py-2 rounded bg-gray-100 text-black font-semibold border border-gray-200 hover:bg-gray-200 transition"
            onClick={toggleLang}
          >
            {lang === "EN" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25M12 18.75V21M4.219 4.219l1.591 1.591M18.19 18.19l1.591 1.591M3 12h2.25M18.75 12H21M4.219 19.781l1.591-1.591M18.19 5.81l1.591-1.591M7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0112 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-5.385 4.365-9.75 9.75-9.75 2.183 0 4.198.731 5.824 1.957a.75.75 0 01.082 1.14A7.501 7.501 0 0012 19.5c-1.768 0-3.41-.61-4.7-1.633a.75.75 0 01-.082-1.14A9.718 9.718 0 0112 2.25c5.385 0 9.75 4.365 9.75 9.75 0 2.183-.731 4.198-1.957 5.824a.75.75 0 01-1.14.082z"
                />
              </svg>
            )}
            {t("lang")}
          </button>
          {token ? (
            <>
              <NavLink
                to="/settings"
                className="flex items-center gap-1 px-4 py-2 rounded bg-gray-100 text-black font-semibold border border-gray-200 hover:bg-gray-200 transition"
                title="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7zm7.5-3.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"/>
                </svg>
                Settings
              </NavLink>
               <NavLink to={'/assistant'} className="flex items-center gap-3 bg-[var(--color-gold)] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-opacity-90 transform hover:-translate-y-1 transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5l.375 1.405a1.875 1.875 0 01-2.25 2.25L15 16.5l-1.405.375a1.875 1.875 0 01-2.25-2.25L12 13.5l.375-1.405a1.875 1.875 0 012.25-2.25L15 10.5l1.405-.375a1.875 1.875 0 012.25 2.25L18 13.5z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Plan Visit with AI Assistant</span>
              </NavLink>

            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-2 rounded bg-[var(--color-gold)] text-white font-semibold hover:bg-[var(--color-nile-blue)] hover:text-[var(--color-gold)] transition"
              >
                {t("signup")}
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 rounded bg-gray-100 text-black font-semibold hover:bg-[var(--color-gold)] hover:text-white transition"
              >
                {t("login")}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
