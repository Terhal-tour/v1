import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import bgImage from '../assets/dmitrii-zhodzishskii-5aEHOQrb2Qk-unsplash.jpg';

export default function Register() {
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
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile is required";
    if (!formData.nationality.trim()) newErrors.nationality = "Nationality is required";
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

      const res = await axios.post("http://localhost:3000/auth/register", formData);
      setMessage(res.data.message);
      setErrors({});
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

return (
  <div
    className="relative min-h-screen bg-cover bg-center"
    style={{ backgroundImage: `url(${bgImage})`, fontFamily: '"Encode Sans Expanded", sans-serif' }}
  >
    {/* Layer dark overlay */}
    <div className="absolute inset-0 bg-black/50"></div>

    {/* Centered form container */}
    <div className="relative flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8 rounded-2xl bg-white/90 backdrop-blur-md text-gray-900 p-10 shadow-2xl tracking-wide text-[17px] leading-relaxed">
        <div>
          <h1 className="text-center text-4xl font-extrabold text-[var(--dark-slate-green)]">Terhal</h1>
          <h2 className="mt-2 text-center text-2xl font-bold text-[var(--dark-slate-green)]">Create your account</h2>
          <p className="mt-2 text-center text-sm text-orange-500">
            Join Terhal and start planning your authentic Egyptian adventure today.
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
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full rounded-md border border-orange-400 px-3 py-2 shadow-sm focus:border-[var(--sunset-orange)] focus:ring-[var(--sunset-orange)] focus:outline-none"
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full rounded-md border border-orange-400 px-3 py-2 shadow-sm focus:border-[var(--sunset-orange)] focus:ring-[var(--sunset-orange)] focus:outline-none"
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <input
            type="tel"
            name="mobile"
            placeholder="Phone Number"
            className="w-full rounded-md border border-orange-400 px-3 py-2 shadow-sm focus:border-[var(--sunset-orange)] focus:ring-[var(--sunset-orange)] focus:outline-none"
            onChange={handleChange}
          />
          {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}

          <select
  name="nationality"
  value={formData.nationality}
  onChange={handleChange}
  className="w-full rounded-md border border-orange-400 px-3 py-2 bg-white text-gray-800 shadow-sm focus:border-[var(--sunset-orange)] focus:ring-[var(--sunset-orange)] focus:outline-none"

>
  <option value="">Select your Nationality</option>
  <option value="Egyptian">Egyptian</option>
  <option value="American">American</option>
  <option value="British">British</option>
  <option value="German">German</option>
  <option value="French">French</option>
</select>

          {errors.nationality && <p className="text-red-500 text-sm">{errors.nationality}</p>}

          {/* Language toggle */}
         <div className="space-y-2">
  <label htmlFor="language" className="block text-base font-semibold text-gray-900 tracking-wide">
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

          {message && <p className="text-center text-sm text-[var(--palm-green)]">{message}</p>}
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
