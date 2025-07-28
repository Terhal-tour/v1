import React, { useState, useEffect } from "react";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";

const SUPPORT_EMAIL = "tourterhal@gmail.com";

function handleLogout() {
  sessionStorage.removeItem("jwt");
  window.location.href = "/login";
}

async function handleDeleteAccount() {
  const token = sessionStorage.getItem("jwt");
  const password = window.prompt(i18n.t("enter_password_to_delete"));
  if (!password) return;
  if (!window.confirm(i18n.t("delete_confirm"))) return;
  try {
    await axios.delete("https://terhal-backend-6jk2.vercel.app/user/soft-delete", {
      headers: { Authorization: `Bearer ${token}` },
      data: { password }
    });
    sessionStorage.removeItem("jwt");
    toast.success(i18n.t("delete_success"));
    window.location.href = "/login";
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      toast.error(i18n.t("delete_failed") + "\n" + err.response.data.message);
    } else {
      toast.error(i18n.t("delete_failed") + "\n" + (err.message || err));
    }
    console.error('Delete account error:', err);
  }
}

export default function Settings() {
  const { t } = useTranslation();
  const [lang, setLang] = useState(localStorage.getItem("lang") || "EN");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.dir = lang === "AR" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
  }, [lang]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <main className="flex-1 px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-10 bg-[#122a4a] min-h-screen papyrus-bg dark:bg-[var(--background-light)] dark:text-[var(--text-color)]">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-3 p-4 border-b-2 border-[#d4af37] mb-8">
          <h2 className="tracking-wide text-4xl font-bold leading-tight text-white dark:text-[var(--text-color)]">{t('settings')}</h2>
          <p className="text-[#ff8c00] font-semibold" lang="ar">{t('discover_egypt')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <aside className="md:col-span-1">
            <nav className="sticky top-28">
              <ul className="space-y-2">
                <li><a className="block py-2 px-4 rounded-lg font-semibold text-gray-100 dark:text-gray-400 hover:bg-[#f5f5dc] hover:text-black dark:hover:bg-[var(--dark-navy)] dark:hover:text-white" href="#account">{t('account_actions')}</a></li>
                <li><a className="block py-2 px-4 rounded-lg font-semibold text-gray-100 dark:text-gray-400 hover:bg-[#f5f5dc] hover:text-black dark:hover:bg-[var(--dark-navy)] dark:hover:text-white" href="#preferences">{t('preferences')}</a></li>
              </ul>
            </nav>
          </aside>
          <div className="md:col-span-2 space-y-12">
            <section className="p-8 bg-gradient-to-br from-[#22375a] via-[#2a4068] to-[#1e2f52] dark:from-white/60 dark:via-white/50 dark:to-white/40 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/10 dark:border-gray-200/20" id="account">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#c19a6b]/20 to-transparent rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-blue-400/20 to-transparent rounded-full blur-xl"></div>

                <h3 className="text-3xl font-bold mb-8 pb-4 text-gray-100 dark:text-[var(--text-color)] relative">
                  <span className="bg-gradient-to-r from-gray-100 via-white to-gray-200 dark:from-[var(--text-color)] dark:via-gray-700 dark:to-[var(--text-color)] bg-clip-text text-transparent">
                    {t('account_actions')}
                  </span>
                  <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-[#c19a6b] to-[#4682b4] rounded-full"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-px bg-gradient-to-r from-[#c19a6b]/30 to-transparent"></div>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Logout Button */}
                  <button
                    className="group relative overflow-hidden flex items-center justify-center rounded-2xl h-16 px-8 bg-blue-500 text-white font-semibold text-base tracking-wide shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.4)] transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 ease-out border-2 border-blue-500 hover:border-blue-600 backdrop-blur-md"
                    onClick={handleLogout}
                    style={{ fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    {/* Animated background layers */}
                    <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 skew-x-12"></div>

                    {/* Content */}
                    <span className="relative z-10 flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                      </div>
                      <span className="font-medium text-sm tracking-wider uppercase letter-spacing-[0.05em] text-shadow-sm">
                        {t('logout')}
                      </span>
                    </span>

                    {/* Glowing edge effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-blue-300/40 to-blue-400/0 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 -z-10"></div>
                  </button>

                  {/* Delete Account Button */}
                  <button
                    className="group relative overflow-hidden flex items-center justify-center rounded-2xl h-16 px-8 bg-red-500 text-white border-2 border-red-500 hover:border-red-600 hover:bg-red-600 transition-all duration-500 font-semibold text-base tracking-wide shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(239,68,68,0.25)] transform hover:-translate-y-1 hover:scale-[1.02] backdrop-blur-md"
                    onClick={handleDeleteAccount}
                    style={{ fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 skew-x-12"></div>

                    <span className="relative z-10 flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </div>
                      <span className="font-medium text-sm tracking-wider uppercase letter-spacing-[0.05em]">
                        {t('delete_profile')}
                      </span>
                    </span>

                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-400/0 via-red-300/30 to-red-400/0 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 -z-10"></div>
                  </button>

                  {/* Support/Complaint Button */}
                  <a
                    href={`mailto:${SUPPORT_EMAIL}?subject=Complaint&body=Please describe your issue...`}
                    className="group relative overflow-hidden flex items-center justify-center rounded-2xl h-16 px-8 bg-amber-500 text-white border-2 border-amber-500 hover:border-amber-600 hover:bg-amber-600 transition-all duration-500 font-semibold text-base tracking-wide shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(245,158,11,0.25)] transform hover:-translate-y-1 hover:scale-[1.02] backdrop-blur-md"
                    title={t('make_complaint')}
                    style={{ fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    <div className="absolute inset-0 bg-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 skew-x-12"></div>

                    <span className="relative z-10 flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                      </div>
                      <span className="font-medium text-sm tracking-wider uppercase letter-spacing-[0.05em]">
                        {t('make_complaint')}
                      </span>
                    </span>

                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/0 via-amber-300/30 to-amber-400/0 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 -z-10"></div>
                  </a>

                  {/* Saved Recommendations Button */}
                  <a
                    href="/recommendations/saved"
                    className="group relative overflow-hidden flex items-center justify-center rounded-2xl h-16 px-8 bg-emerald-500 text-white border-2 border-emerald-500 hover:border-emerald-600 hover:bg-emerald-600 transition-all duration-500 font-semibold text-base tracking-wide shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.25)] transform hover:-translate-y-1 hover:scale-[1.02] backdrop-blur-md"
                    style={{ fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    <div className="absolute inset-0 bg-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 skew-x-12"></div>

                    <span className="relative z-10 flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                      </div>
                      <span className="font-medium text-sm tracking-wider uppercase letter-spacing-[0.05em]">
                        Saved Recommendations
                      </span>
                    </span>

                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/0 via-emerald-300/30 to-emerald-400/0 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 -z-10"></div>
                  </a>
                </div>
              </div>
            </section>
            <section className="p-6 bg-[#22375a] dark:bg-white/50 rounded-xl shadow-lg" id="preferences">
              <h3 className="text-2xl font-bold mb-6 border-b border-[#c19a6b]/30 pb-3 text-gray-100 dark:text-[var(--text-color)]">{t('preferences')}</h3>
              <div className="space-y-6">
                <label className="flex flex-col">
                  <p className="text-sm font-semibold text-gray-200 dark:text-gray-700 pb-1">{t('language')}</p>
                  <select
                    className="form-select w-full rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d4af37] border border-gray-300 bg-[#2c4267] focus:border-[#d4af37] h-12 px-4 text-base dark:bg-[#22375a] dark:text-white"
                    value={lang}
                    onChange={e => setLang(e.target.value)}
                  >
                    <option value="AR">{t('arabic')}</option>
                    <option value="EN">{t('english')}</option>
                  </select>
                </label>
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium text-gray-200 dark:text-gray-700">{t('dark_mode')}</p>
                  <label className={`relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-gray-200 dark:bg-gray-700 p-0.5 ${darkMode ? 'justify-end bg-[#d4af37]' : ''}`}>
                    <div className="h-full w-[27px] rounded-full bg-white transition-transform pointer-events-none" style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px" }}></div>
                    <input
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                      type="checkbox"
                      checked={darkMode}
                      onChange={() => setDarkMode(d => !d)}
                      aria-label={t('toggle_dark_mode')}
                    />
                  </label>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
} 