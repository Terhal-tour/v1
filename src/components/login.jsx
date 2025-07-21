import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import bgImage from '../assets/dmitrii-zhodzishskii-5aEHOQrb2Qk-unsplash.jpg';

export default function Register() {
    const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
   
    email: "",
    password: "",
   
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

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
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
        setLoading(true);
        console.log(formData);

      const res = await axios.post("https://backend-mu-ten-26.vercel.app/auth/login", formData);
      setMessage(res.data.message);
      const user = res.data.user;
      console.log(user)
      setErrors({});
        sessionStorage.setItem("jwt", res.data.token); 
        navigate("/")
    } catch (err) {
      console.log(err)
      setMessage(err.response.data.message|| "login failed");
    }finally{
      setLoading(false)
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
            {/* Forgot password link */}
 
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

           <div className="text-right">
    <Link
      to="/forget-password"
      className="text-sm text-orange-500 font-medium hover:underline"
    >
      Forgot your password?
    </Link>
  </div>
        <Link
      to="/reactive-account"
      className="text-sm text-orange-500 font-medium hover:underline"
    >
     Reactive your account?
    </Link> 
        <button
  type="submit"
  disabled={loading}
  className={`group relative w-full flex justify-center rounded-md py-3 px-4 text-base font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[var(--sunset-orange)] focus:ring-offset-2 ${
    loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-opacity-90'
  }`}
>
  {loading ? (
    <span className="flex items-center gap-2">
      <i className="fa fa-spinner fa-spin"></i> 
    </span>
  ) : (
    "Login"
  )}
</button>

        
            {message && (
              <p
                className={`text-center text-sm ${
                  message.toLowerCase().includes("invalid") ||
                  message.toLowerCase().includes("fail") ||
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

        <div className="text-sm text-center mt-4">
          <Link to="/signup" className="inline-block text-black-900 font-semibold tracking-wide hover:underline transition-all duration-200">
  Do Not have an account? Sign Up
</Link>

        </div>
      </div>
    </div>
  </div>
);

}
