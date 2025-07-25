import React, { useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./../css/navbar.css";
import i18n from "../i18n";
import Profile from "./Profile";

const Navbar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = React.useState(localStorage.getItem("lang") || "EN");
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = useRef();

  // Close menu on click outside or ESC
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [menuOpen]);

  React.useEffect(() => {
    document.documentElement.dir = lang === "AR" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === "EN" ? "AR" : "EN"));
  };

  const token = sessionStorage.getItem("jwt");

  const handleNavClick = (sectionId) => {
    if (window.location.pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
    }
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white sticky top-0 z-50 font-jakarta shadow-sm border-b border-gray-100">
      {/* Mobile menu backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo and Brand */}
          <NavLink
            to="/"
            className="flex items-center gap-3 flex-shrink-0 hover:opacity-80 transition-opacity"
            onClick={() => setMenuOpen(false)}
          >
            <img 
              src="/favicon.png" 
              alt="Brand Logo" 
              className="w-10 h-10 lg:w-12 lg:h-12 object-contain" 
            />
            <span className="text-xl lg:text-2xl font-bold text-gray-900">
              {t("brand")}
            </span>
          </NavLink>

          {/* Desktop Navigation Links - Center */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-8">
              <NavLink
                to="/places"
                className={({ isActive }) =>
                  `font-medium transition-colors duration-200 hover:text-[var(--color-gold)] ${
                    isActive ? "text-[var(--color-gold)]" : "text-gray-700"
                  }`
                }
              >
                {t("destinations")}
              </NavLink>
              
              <button
                onClick={() => handleNavClick("topRated")}
                className="font-medium text-gray-700 hover:text-[var(--color-gold)] transition-colors duration-200"
              >
                {t("near_by_title")}
              </button>
              
              <button
                onClick={() => handleNavClick("events")}
                className="font-medium text-gray-700 hover:text-[var(--color-gold)] transition-colors duration-200"
              >
                {t("experiences")}
              </button>
              
              <button
                onClick={() => handleNavClick("about")}
                className="font-medium text-gray-700 hover:text-[var(--color-gold)] transition-colors duration-200"
              >
                {t("about")}
              </button>
            </div>
          </div>

          {/* Desktop Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Language Switcher */}
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-700 font-medium border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
              onClick={toggleLang}
            >
              {lang === "EN" ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636a9 9 0 011.591-1.591" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
              <span className="text-sm">{t("lang")}</span>
            </button>

            {token ? (
              <>
                <NavLink
                  to="/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-700 font-medium border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                  title="Settings"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">{t("settings")}</span>
                </NavLink>

                <NavLink
                  to="/assistant"
                  className="flex items-center gap-2 bg-[var(--color-gold)] text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow-md hover:bg-opacity-90 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  <span className="text-sm">{t("assistant_button")}</span>
                </NavLink>

                <NavLink
                  to="/Profile"
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">Profile</span>
                </NavLink>

                <NavLink
                  to="/smartRecommendation"
                  className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  <span className="text-sm">Smart</span>
                </NavLink>
                <NavLink
                  to="/feedPage"
                  className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  <span className="text-sm">Feed</span>
                </NavLink>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:text-gray-900 transition-colors duration-200"
                >
                  {t("login")}
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 rounded-lg bg-[var(--color-gold)] text-white font-semibold hover:bg-opacity-90 transition-all duration-200 shadow-sm"
                >
                  {t("signup")}
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`lg:hidden fixed left-0 right-0 top-16 bg-white shadow-lg border-t border-gray-100 z-50 transition-all duration-300 ${
            menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="p-4 space-y-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Mobile Navigation Links */}
            <div className="space-y-2 pb-4 border-b border-gray-100">
              <NavLink
                to="/places"
                className="block px-3 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-[var(--color-gold)] transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                {t("destinations")}
              </NavLink>
              
              <button
                onClick={() => handleNavClick("topRated")}
                className="block w-full text-left px-3 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-[var(--color-gold)] transition-colors duration-200"
              >
                {t("near_by_title")}
              </button>
              
              <button
                onClick={() => handleNavClick("events")}
                className="block w-full text-left px-3 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-[var(--color-gold)] transition-colors duration-200"
              >
                {t("experiences")}
              </button>
              
              <button
                onClick={() => handleNavClick("about")}
                className="block w-full text-left px-3 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-[var(--color-gold)] transition-colors duration-200"
              >
                {t("about")}
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="space-y-3 pt-2">
              {/* Language Switcher */}
              <button
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200"
                onClick={toggleLang}
              >
                {lang === "EN" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636a9 9 0 011.591-1.591" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                )}
                {t("lang")}
              </button>

              {token ? (
                <>
                  <NavLink
                    to="/settings"
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t("settings")}
                  </NavLink>

                  <NavLink
                    to="/assistant"
                    className="flex items-center gap-3 w-full px-3 py-3 rounded-lg bg-[var(--color-gold)] text-white font-semibold hover:bg-opacity-90 transition-all duration-200 shadow-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    {t("assistant_button")}
                  </NavLink>

                  <NavLink
                    to="/Profile"
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Profile
                  </NavLink>

                  <NavLink
                    to="/smartRecommendation"
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                    Smart Recommendations
                  </NavLink>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 text-left"
                  >
                    {t("login")}
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setMenuOpen(false);
                    }}
                    className="w-full px-3 py-3 rounded-lg bg-[var(--color-gold)] text-white font-semibold hover:bg-opacity-90 transition-all duration-200 shadow-sm"
                  >
                    {t("signup")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;