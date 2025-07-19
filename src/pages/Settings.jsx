import React, { useState, useEffect } from "react";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import axios from "axios";

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
    alert(i18n.t("delete_success"));
    window.location.href = "/signup";
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      alert(i18n.t("delete_failed") + "\n" + err.response.data.message);
    } else {
      alert(i18n.t("delete_failed") + "\n" + (err.message || err));
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
            <section className="p-6 bg-[#22375a] dark:bg-white/50 rounded-xl shadow-lg" id="account">
              <h3 className="text-2xl font-bold mb-6 border-b border-[#c19a6b]/30 pb-3 text-gray-100 dark:text-[var(--text-color)]">{t('account_actions')}</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="flex w-full sm:w-auto items-center justify-center rounded-lg h-10 px-6 bg-[#4682b4] text-white text-sm font-bold shadow hover:bg-blue-700 transition-colors dark:bg-[#4682b4] dark:text-white dark:hover:bg-blue-700"
                  onClick={handleLogout}
                >
                  {t('logout')}
                </button>
                <button
                  className="flex w-full sm:w-auto items-center justify-center rounded-lg h-10 px-6 bg-transparent text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition-colors font-bold dark:bg-transparent dark:text-red-400 dark:border-red-400 dark:hover:bg-red-400 dark:hover:text-black"
                  onClick={handleDeleteAccount}
                >
                  {t('delete_profile')}
                </button>
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=Complaint&body=Please describe your issue...`}
                  className="flex w-full sm:w-auto items-center justify-center rounded-lg h-10 px-6 bg-yellow-100 text-yellow-800 border border-yellow-400 hover:bg-yellow-200 transition-colors font-bold dark:bg-yellow-300 dark:text-yellow-900 dark:border-yellow-500 dark:hover:bg-yellow-400"
                  title={t('make_complaint')}
                >
                  {t('make_complaint')}
                </a>
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