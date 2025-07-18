import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import bgImage from "../assets/dmitrii-zhodzishskii-5aEHOQrb2Qk-unsplash.jpg";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = "Verification code is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(formData.password)
    ) {
      newErrors.password =
        "Password must be at least 8 characters, include uppercase, lowercase and number";
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
      const res = await axios.post("http://localhost:3000/auth/resetPassword", formData);
      setMessage(res.data.message);
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.error || "Reset failed");
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})`, fontFamily: '"Encode Sans Expanded", sans-serif' }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-8 rounded-2xl bg-white/90 backdrop-blur-md text-gray-900 p-10 shadow-2xl tracking-wide text-[17px] leading-relaxed">
          <div>
            <h1 className="text-center text-4xl font-extrabold text-orange-500">Terhal</h1>
            <h2 className="mt-2 text-center text-xl font-semibold text-gray-700">Reset your password</h2>
          </div>

     <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
  {/* Label + Input */}
  <div>
    <label htmlFor="code" className="block text-sm font-semibold text-orange-800 mb-1">
     Enter The Code Sent To Your(valid for 15 minutes)
    </label>
    <input
      type="text"
      name="code"
      id="code"
      placeholder=" Code  "
      className="w-full rounded-md border border-orange-400 px-3 py-2 shadow-sm focus:border-[var(--sunset-orange)] focus:ring-[var(--sunset-orange)] focus:outline-none"
      onChange={handleChange}
    />
    {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
  </div>

  {/* Label + Input */}
  <div>
    <label htmlFor="password" className="block text-sm font-semibold text-orange-800 mb-1">
    Enter  New Password
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        id="password"
        placeholder=" new password"
        className="w-full rounded-md border border-orange-400 px-3 py-2 pr-10 shadow-sm focus:border-[var(--sunset-orange)] focus:ring-[var(--sunset-orange)] focus:outline-none"
        onChange={handleChange}
      />
      <span
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
      </span>
    </div>
    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
  </div>

  <button
    type="submit"
    className="group relative w-full flex justify-center rounded-md bg-orange-500 py-3 px-4 text-base font-semibold text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--sunset-orange)] focus:ring-offset-2"
  >
    Reset Password
  </button>

  {message && (
    <p
      className={`text-center text-sm mt-2 ${
        message.toLowerCase().includes("fail") || message.toLowerCase().includes("invalid")
          ? "text-red-500"
          : "text-green-600"
      }`}
    >
      {message}
    </p>
  )}
  <Link
            to="/login"
            className="inline-block mt-4 px-5 py-2 rounded-md bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-all duration-200"
          >
            Back to login
          </Link>
</form>

        </div>
      </div>
    </div>
  );
}
