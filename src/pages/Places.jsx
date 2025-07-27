import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChildPlace from "../components/ChildPlace";
import axios from "axios";
import "../css/placesPage.css";
import { useTranslation } from "react-i18next";

function Places() {
  const { t, i18n } = useTranslation();
  const [places, setPlaces] = useState([]);
  const [placeName, setPlaceName] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("");

  // ✅ Fetch ALL places (with pagination) or SEARCHED places (by name)
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        let response;
        if (placeName.trim() !== "") {
          response = await axios.get(
            `https://backend-mu-ten-26.vercel.app/places/search?q=${placeName}`
            // `https://backend-mu-ten-26.vercel.app/places/search?q=${placeName}`

          );
          setPlaces(response.data.places); // This is search result, no pagination
          setTotalPages(1); // No pagination for search, treat as single page
        } else {
          response = await axios.get(
            `https://backend-mu-ten-26.vercel.app/places?page=${currentPage}`
          );
          setPlaces(response.data.data);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };
    fetchPlaces();
  }, [placeName, currentPage]);

  // fetch categories
  useEffect(() => {
    axios
      .get(
        `https://backend-mu-ten-26.vercel.app/categories`
        , {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzRlZTllNzMzMzE4MTAzYmJkNmUwYyIsImlhdCI6MTc1MjQ5MzgxOSwiZXhwIjoxNzUzMDk4NjE5fQ.jUTXtIpz0-g_Ni4Cl0ceUGSn-B8UPCX2QGf482fekeQ`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => setCategories(res.data.categories))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // ✅ Apply category filter
  const filteredPlaces =
    activeCategory === "All"
      ? places
      : places.filter((place) => place.category === activeCategory);

  // ✅ Apply sorting
  const filteredAndSortedPlaces = [...filteredPlaces].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div>
      <main className="container mx-auto px-6 py-10">
        {/* breadcrump */}
        <div className="breadcrumbs text-sm text-support mb-4">
          <ul>
            <li>
              <Link to="/" className="hover:text-primary-action">
                {t("home")}
              </Link>
            </li>
            <li className="text-primary-action font-medium">{t("places")}</li>
          </ul>
        </div>
        {/* heading section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-primary-action font-display">
            {t("discover_places_title")}
          </h2>
          <p className="text-lg text-support mt-2">
            {t("discover_places_subtitle", { count: places.length })}
          </p>
        </div>
        {/* Search, Filters, Sort */}
        <div className="backdrop-blur-md py-6 rounded-xl shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 items-center">
            {/* Search input */}
            <div className="relative md:col-span-2">
              <input
                value={placeName}
                onChange={(e) => {
                  setPlaceName(e.target.value);
                  setCurrentPage(1); // Always reset page if searching
                }}
                className="form-input w-full pl-10 pr-4 py-3 rounded-lg border-2 border-muted-brown/30 
                bg-warm-white focus:ring-2 focus:ring-highlight focus:border-highlight transition-shadow"
                placeholder={t("search_by_name")}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-support">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>
            </div>
            {/* Categories */}
            <div className="md:col-span-9 flex flex-col md:flex-row md:justify-evenly md:items-center gap-4">
  {/* Dropdown for small screens */}
  <select
    value={activeCategory}
    onChange={(e) => setActiveCategory(e.target.value)}
    className="block md:hidden w-full px-4 py-2 text-sm rounded-md border border-gray-300 text-primary-action bg-warm-white focus:outline-none focus:ring-2 focus:ring-primary-action"
  >
    <option value="All">{t('all')}</option>
    {categories?.map((category) => (
      <option key={category._id} value={category.title}>
        {category.title}
      </option>
    ))}
  </select>

  {/* Buttons for medium and larger screens */}
  <div className="hidden md:flex flex-wrap justify-evenly items-center gap-4">
    <button
      onClick={() => setActiveCategory("All")}
      className={`px-4 py-2 text-sm md:text-base font-medium rounded-full bg-warm-white text-primary-action hover:bg-soft-cream transition-colors cursor-pointer ${
        activeCategory === "All" ? "active-link" : ""
      }`}
    >
      {t('all')}
    </button>
    {categories?.map((category) => (
      <button
        key={category._id}
        onClick={() => setActiveCategory(category.title)}
        className={`px-4 py-2 text-sm md:text-base font-medium rounded-full bg-warm-white text-primary-action hover:bg-soft-cream transition-colors cursor-pointer ${
          activeCategory === category.title ? "active-link" : ""
        }`}
      >
        {category.title}
      </button>
    ))}
  </div>
</div>

            {/* Sort */}
            <div className="md:col-span-1 flex justify-center items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select rounded-lg border-2 border-muted-brown/30 bg-warm-white focus:ring-2 focus:ring-highlight focus:border-highlight transition-shadow py-3"
              >
                <option value="">{t("sort_by")}</option>
                <option value="rating">{t("sort_by_rating")}</option>
                <option value="name">{t("sort_by_name")}</option>
              </select>
            </div>
          </div>
        </div>
        {/* Places Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAndSortedPlaces?.length > 0 ? (
            filteredAndSortedPlaces.map((place) => (
              <ChildPlace place={place} key={place._id} />
            ))
          ) : (
            <p className="text-center">{t("no_places_found")}</p>
          )}
        </div>

        {/* Pagination */}
        {placeName.trim() === "" && (
          <div className="flex gap-4 justify-center mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Places;
