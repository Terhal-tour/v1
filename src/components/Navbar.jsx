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
  return (
    <nav className="bg-white sticky top-0 z-50 font-jakarta">
      {/* Backdrop for mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-4 navbar-container relative">
        {/* Logo and Brand */}
        <NavLink
          to="/"
          className="flex items-center gap-2"
          style={{ textDecoration: "none" }}
          onClick={() => setMenuOpen(false)}
        >
          {/* Orange logo */}
          {/* <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="8" fill="#ed7b2a" />
            <ellipse cx="16" cy="16" rx="7" ry="12" fill="white" />
          </svg> */}
          <img src="/favicon.png" alt="" width={50} height={50} />
          <span className="text-2xl font-bold text-black">{t("brand")}</span>
        </NavLink>
        {/* Hamburger for mobile */}
        <button
          className="navbar-mobile-menu lg:hidden ml-4 z-50"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
        {/* Centered Links + Right Side (mobile: all in menu) */}
        <div
          ref={menuRef}
          className={`navbar-links fixed left-0 right-0 top-0 pt-24 pb-8 bg-white shadow-lg transition-all duration-300 z-50 flex-col items-center gap-6 text-lg ${
            menuOpen ? "open flex" : "hidden"
          } lg:static lg:flex lg:flex-row lg:justify-center lg:items-center lg:gap-10 lg:pt-0 lg:pb-0 lg:bg-transparent lg:shadow-none lg:text-base`}
          style={{ minHeight: menuOpen ? "100vh" : undefined }}
        >
          {/* Always show navigation links, same order, both logged in and out */}
          <NavLink
            to="/places"
            className="text-black font-medium hover:text-[var(--color-gold)] transition"
            onClick={() => setMenuOpen(false)}
          >
            {t("destinations")}
          </NavLink>
          <NavLink
            to="/"
            className="text-black font-medium hover:text-[var(--color-gold)] transition"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                document
                  .getElementById("topRated")
                  ?.scrollIntoView({ behavior: "smooth" });
              } else {
                e.preventDefault();
                navigate("/", { state: { scrollTo: "topRated" } });
              }
              setMenuOpen(false);
            }}
          >
            {t("near_by_title")}
          </NavLink>
          <NavLink
            to="/"
            className="text-black font-medium hover:text-[var(--color-gold)] transition"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                document
                  .getElementById("events")
                  ?.scrollIntoView({ behavior: "smooth" });
              } else {
                e.preventDefault();
                navigate("/", { state: { scrollTo: "events" } });
              }
              setMenuOpen(false);
            }}
          >
            {t("experiences")}
          </NavLink>
          <NavLink
            to="/"
            className="text-black font-medium hover:text-[var(--color-gold)] transition"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" });
              } else {
                e.preventDefault();
                navigate("/", { state: { scrollTo: "about" } });
              }
              setMenuOpen(false);
            }}
          >
            {t("about")}
          </NavLink>
          {/* Right Side: Language Switcher & Auth Buttons (mobile: inside menu, desktop: right) */}
          <div className="flex flex-col gap-4 mt-6 w-full items-center lg:mt-0 lg:flex-row lg:gap-4 lg:w-auto lg:ml-8 lg:items-center">
            <button
              className="flex items-center gap-1 px-4 py-2 rounded bg-gray-100 text-black font-semibold border border-gray-200 hover:bg-gray-200 transition w-full max-w-xs lg:w-auto lg:max-w-none"
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
                  className="flex items-center gap-1 px-4 py-2 rounded bg-gray-100 text-black font-semibold border border-gray-200 hover:bg-gray-200 transition w-full max-w-xs lg:w-auto lg:max-w-none"
                  title="Settings"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7zm7.5-3.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"
                    />
                  </svg>
                  {t("settings")}
                </NavLink>
                <NavLink
                  to={"/assistant"}
                  className="flex items-center gap-3 bg-[var(--color-gold)] text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:-translate-y-1 transition-all duration-300 w-full max-w-xs text-center justify-center lg:w-auto lg:max-w-none"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5l.375 1.405a1.875 1.875 0 01-2.25 2.25L15 16.5l-1.405.375a1.875 1.875 0 01-2.25-2.25L12 13.5l.375-1.405a1.875 1.875 0 012.25-2.25L15 10.5l1.405-.375a1.875 1.875 0 012.25 2.25L18 13.5z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{t("assistant_button")}</span>
                </NavLink>
                <NavLink
                  to={"/Profile"}
                  className="flex items-center gap-3 bg-[var(--color-gold)] text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:-translate-y-1 transition-all duration-300 w-full max-w-xs text-center justify-center lg:w-auto lg:max-w-none"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>

                  {/* <span>{t("assistant_button")}</span> */}
                </NavLink>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setMenuOpen(false);
                  }}
                  className="px-6 py-2 rounded bg-[var(--color-gold)] text-white font-semibold hover:bg-[var(--color-nile-blue)] hover:text-[var(--color-gold)] transition w-full max-w-xs lg:w-auto lg:max-w-none"
                >
                  {t("signup")}
                </button>
                <button
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                  className="px-6 py-2 rounded bg-gray-100 text-black font-semibold hover:bg-[var(--color-gold)] hover:text-white transition w-full max-w-xs lg:w-auto lg:max-w-none"
                >
                  {t("login")}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
