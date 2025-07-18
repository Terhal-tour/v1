import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import bgImage from '../assets/dmitrii-zhodzishskii-5aEHOQrb2Qk-unsplash.jpg';
export default function ForgetPassword() {
    const navigate = useNavigate();
 const [formData, setFormData] = useState({
   email: "",   
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
   
  
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Email is invalid";
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

      const res = await axios.post("http://localhost:3000/auth/forgetPassword", formData);
      setMessage(res.data.message);
      setErrors({});
      navigate("/reset-password");
        } catch (err) {
      setMessage(err.response?.data?.error);
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
          <h1 className="text-center text-4xl font-extrabold text-orange-500">Terhal</h1>
          {/* <h2 className="mt-2 text-center text-2xl font-bold text-[var(--dark-slate-green)]">Login To your account</h2> */}
         
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full rounded-md border border-orange-400 px-3 py-2 shadow-sm focus:border-[var(--sunset-orange)] focus:ring-[var(--sunset-orange)] focus:outline-none"
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}


          <button
            type="submit"
            className="group relative w-full flex justify-center rounded-md bg-orange-500 py-3 px-4 text-base font-semibold text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--sunset-orange)] focus:ring-offset-2"
          >
           Send
          </button>

        
            {message && (
              <p
                className={`text-center text-sm ${
                  message.toLowerCase().includes("invalid") ||
                  message.toLowerCase().includes("fail") ||
                  message.toLowerCase().includes("not") ||
                   message.toLowerCase().includes("verify") ||
                  message.toLowerCase().includes("exists")
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {message}
              </p>
            )}
        </form>

      </div>
    </div>
  </div>
);
}
