import React from "react";
import { Mail, Globe, Languages, User } from "lucide-react";

export default function GuideCard({ guide, onRequest }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition hover:shadow-2xl hover:-translate-y-1 duration-300">
      {/* Guide Info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-orange-100 text-orange-500 rounded-full p-2">
          <User size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{guide.name}</h3>
          <p className="text-sm text-gray-500">{guide.nationality}</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-gray-500" />
          <span>{guide.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-gray-500" />
          <span>{guide.nationality}</span>
        </div>
        <div className="flex items-center gap-2">
          <Languages size={16} className="text-gray-500" />
          <span>{guide.language}</span>
        </div>
      </div>

      {/* Request Button (Outlined + Full Width) */}
      <button
        onClick={() => onRequest(guide._id)}
        className="cursor-pointer mt-6 w-full border border-orange-500 text-orange-500 rounded-full text-sm font-medium py-2 hover:bg-orange-500 hover:text-white transition"
      >
        Request Guide
      </button>
    </div>
  );
}
