import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bgImage from "../assets/aussieactive-GNdp2Q4VZjw-unsplash.jpg";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters long, include uppercase, lowercase, and a number"
    ),
});

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://backend-mu-ten-26.vercel.app/user/reactivate-account",
        data
      );
      toast.success("Account reactivated successfully");
      navigate("/login");
    } catch (error) {
        console.log(error)
      const errorMessage = "Something went wrong";
  toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Form container */}
      <div className="relative z-10 w-full max-w-md px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-6 shadow-lg bg-white bg-opacity-95 rounded-xl"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Reactivate Account</h2>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-2 border rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full"
            disabled={loading}
          >
            {loading ? "Loading..." : "Reactivate Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
