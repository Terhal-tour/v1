import React from 'react'
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";

import "react-phone-number-input/style.css";
import bgImage from "../assets/aussieactive-GNdp2Q4VZjw-unsplash.jpg";
export default function EditForm() {
  return (
    <div
      style={{ backgroundImage: `url(${bgImage})` }}
      className="relative min-h-screen bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-black/40"></div>

      
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-lg space-y-8 rounded-2xl bg-white/90 backdrop-blur-md text-gray-900 p-10 shadow-2xl tracking-wide text-[17px] leading-relaxed">
          <div>
            <h1 className="text-center text-4xl font-extrabold text-[var(--dark-slate-green)]">
              Edit Your Profile
            </h1>
          </div>

          <form className="mt-8 space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full rounded-md border border-orange-400 px-3 py-2 shadow-sm focus:border-[var(--sunset-orange)] focus:ring-[var(--sunset-orange)] focus:outline-none"
            />

           

            <label className="block text-base font-semibold text-gray-900 tracking-wide mb-1">
              Phone Number
            </label>
            <PhoneInput
              international
              defaultCountry="EG"
              placeholder="e.g. +20 100 123 4567"
              className="w-full rounded-md border border-orange-400 px-3 py-2 pr-10 bg-white text-gray-800 shadow-sm focus:border-[var(--sunset-orange)] focus:ring-[var(--sunset-orange)] focus:outline-none"
            />

            <select
              name="nationality"
              className="w-full rounded-md border border-orange-400 px-3 py-2 shadow-sm focus:border-[var(--sunset-orange)] focus:ring-[var(--sunset-orange)] focus:outline-none"
            >
              <option value="">Select your Nationality</option>
            </select>

            <div className="space-y-2">
              <label
                htmlFor="language"
                className="block text-base font-semibold text-gray-900 tracking-wide"
              >
                Preferred Language
              </label>

              <select
                name="language"
                className="w-full rounded-md border border-orange-400 px-3 py-2 bg-white text-gray-800 shadow-sm focus:border-[var(--sunset-orange)] focus:ring-[var(--sunset-orange)] focus:outline-none"
              >
                <option value="">Select Language</option>
                <option value="AR">🇪🇬 العربية</option>
                <option value="EN">🇬🇧 English</option>
              </select>
            </div>
             <label className="block font-medium">Profile Picture</label>
            <input
              type="file"
              className="w-full border p-2 rounded mt-1"
            //   onChange={(e) => setImageFile(e.target.files[0])}
            />
            <button type="submit" className="w-full py-3 px-4 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
