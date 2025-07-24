// This component displays a single guide's card with contact info and a request button
import React from "react";
import { Mail, Globe, Languages, User } from "lucide-react";

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
