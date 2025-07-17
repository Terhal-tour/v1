import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";

import "react-phone-number-input/style.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import bgImage from "../assets/dmitrii-zhodzishskii-5aEHOQrb2Qk-unsplash.jpg";

export default function Register() {
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,cca2,idd"
        );
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Unexpected response:", data);
          return;
        }

        const list = data
          .map((c) => ({
            name: c.name.common,
            cca2: c.cca2,
            code:
              c.idd?.root && c.idd?.suffixes
                ? `+${c.idd.root}${c.idd.suffixes[0]}`
                : "",
            flag: c.flags?.png,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(list);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };

    fetchCountries();
  }, []);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    nationality: "",
    language: "AR",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? (checked ? "AR" : "EN") : value;

    setFormData((prev) => ({ ...prev, [name]: fieldValue }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]{3,30}$/.test(formData.name.trim())) {
      newErrors.name = "Name must be 3-30 letters only";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(
        formData.password.trim()
      )
    ) {
      newErrors.password =
        "Password must be at least 8 characters, include uppercase, lowercase and number";
    }

    if (!formData.mobile) {
  newErrors.mobile = "Mobile is required";
} else if (!isValidPhoneNumber(formData.mobile)) {
  newErrors.mobile = "Enter a valid international phone number";
}


    if (!formData.nationality.trim()) {
      newErrors.nationality = "Nationality is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      console.log(formData);

      const res = await axios.post(
        "https://terhal-backend-6jk2.vercel.app/auth/register",
        formData
      );
      setMessage(res.data.message);
      setErrors({});
      console.log(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        fontFamily: '"Encode Sans Expanded", sans-serif',
      }}
    >
      {/* Layer dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Centered form container */}
      <div className="relative flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-8 rounded-2xl bg-white/90 backdrop-blur-md text-gray-900 p-10 shadow-2xl tracking-wide text-[17px] leading-relaxed">
          <div>
            <h1 className="text-center text-4xl font-extrabold text-[var(--dark-slate-green)]">
              Terhal
            </h1>
            {/* <h2 className="mt-2 text-center text-2xl font-bold text-[var(--dark-slate-green)]">
              Create your account
            </h2> */}
            <p className="mt-2 text-center text-sm text-orange-500">
              Join Terhal and start planning your authentic Egyptian adventure
              today.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full rounded-md border border-orange-400 px-3 py-2 shadow-sm focus:border-[var(--sunset-orange)] focus:ring-[var(--sunset-orange)] focus:outline-none"
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full rounded-md border border-orange-400 px-3 py-2 shadow-sm focus:border-[var(--sunset-orange)] focus:ring-[var(--sunset-orange)] focus:outline-none"
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full rounded-md border border-orange-400 px-3 py-2 pr-10 shadow-sm focus:border-[var(--sunset-orange)] focus:ring-[var(--sunset-orange)] focus:outline-none"
                onChange={handleChange}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </span>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}

           
<label className="block text-base font-semibold text-gray-900 tracking-wide mb-1">
  Phone Number
</label>

<PhoneInput
  international
  defaultCountry="EG"
  placeholder="e.g. +20 100 123 4567"
  value={formData.mobile}
  onChange={(phone) => {
    setFormData((prev) => ({ ...prev, mobile: phone }));
    setErrors((prev) => ({ ...prev, mobile: "" }));
  }}
  className="w-full rounded-md border border-orange-400 px-3 py-2 pr-10 bg-white text-gray-800 shadow-sm focus:border-[var(--sunset-orange)] focus:ring-[var(--sunset-orange)] focus:outline-none"
/>

            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile}</p>
            )}

            <select
              name="nationality"
              onChange={handleChange}
              value={formData.nationality}
              className="w-full rounded-md border border-orange-400 px-3 py-2 shadow-sm focus:border-[var(--sunset-orange)] focus:ring-[var(--sunset-orange)] focus:outline-none"
            >
              <option value="">Select your Nationality</option>
              {countries.map((c) => (
                <option key={c.cca2} value={c.cca2}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.nationality && (
              <p className="text-red-500 text-sm">{errors.nationality}</p>
            )}

            {/* Language toggle */}
            <div className="space-y-2">
              <label
                htmlFor="language"
                className="block text-base font-semibold text-gray-900 tracking-wide"
              >
                Preferred Language
              </label>

              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full rounded-md border border-orange-400 px-3 py-2 bg-white text-gray-800 shadow-sm focus:border-[var(--sunset-orange)] focus:ring-[var(--sunset-orange)] focus:outline-none"
              >
                <option value="">Select Language</option>
                <option value="AR">🇪🇬 العربية</option>
                <option value="EN">🇬🇧 English</option>
              </select>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center rounded-md bg-orange-500 py-3 px-4 text-base font-semibold text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--sunset-orange)] focus:ring-offset-2"
            >
              Create Account
            </button>

            {message && (
              <p
                className={`text-center text-sm ${
                  message.toLowerCase().includes("error") ||
                  message.toLowerCase().includes("fail") ||
                  message.toLowerCase().includes("exists")
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>

          <div className="text-sm text-center mt-4">
            <Link
              to="/login"
              className="inline-block text-black-900 font-semibold tracking-wide hover:underline transition-all duration-200"
            >
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
