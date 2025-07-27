// This component displays a single guide's card with contact info and a request button
import React from "react";
import { Mail, Globe, Languages, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function GuideCard({ guide, onRequest }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
      {/* Guide name */}
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <User size={18} className="text-orange-500" />
        {guide.name}
      </h3>

      {/* Email */}
      <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
        <Mail size={16} className="text-gray-500" />
        {guide.email}
      </p>

      {/* Nationality */}
      <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
        <Globe size={16} className="text-gray-500" />
        {guide.nationality}
      </p>

      {/* Languages */}
      <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
        <Languages size={16} className="text-gray-500" />
        {guide.language}
      </p>
      
      <NavLink
        to={`/chat/${guide._id}`}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
  </svg>
  Send Message
</NavLink>
      {/* Request button */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => onRequest(guide._id)}
          className="px-4 py-2 border border-orange-500 text-orange-500 rounded-full text-sm hover:bg-orange-500 hover:text-white transition"
        >
          Request Guide
        </button>
      </div>
    </div>
  );
}
