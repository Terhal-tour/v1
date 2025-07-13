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
        <NavLink
          href="#"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 mt-4"
        >
          View details
        </NavLink>
      </div>
    </div>
  );
}
