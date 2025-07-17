import Link from "daisyui/components/link";
import React from "react";
import { NavLink } from "react-router-dom";

export default function ChildPlace({ place }) {
  return (
    <div className="bg-[var(--color-warm-white)] rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
      <div
        className="w-full h-56 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${
            place.image ||
            "https://www.planetware.com/wpimages/2020/02/egypt-in-pictures-beautiful-places-to-photograph-karnak-temple.jpg"
          })`,
        }}
      />

      <div className="p-6">
        <h3 className="text-xl text-amber-700 font-bold">{place.name}</h3>
        <p className="text-[var(--color-text-light)] mt-2">
          {place.description?.length > 100
            ? `${place.description.substring(0, 100)}...`
            : place.description || "No description available."}
        </p>
        <div className="flex flex-row-reverse justify-items-center">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-yellow-500 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              />
            </svg>
          </span>
          <span className="text-[var(--color-text-light)] ">
            {place.rating || "No description available."}
          </span>
        </div>
        {sessionStorage.getItem("jwt") && (
          <NavLink
            to={`/places/${place._id}`}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 mt-4"
          >
            View details
          </NavLink>
        )}
      </div>
    </div>
  );
}
