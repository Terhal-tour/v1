import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import bgImage from "../assets/dmitrii-zhodzishskii-5aEHOQrb2Qk-unsplash.jpg";

export default function VerifyEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [status, setStatus] = useState("loading"); // success | error

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.post(`https://backend-mu-ten-26.vercel.app/auth/verify-email/${token}`);
        setMessage(res.data.message || "Email verified successfully!");
        setStatus("success");
      } catch (err) {
        setMessage(err.response?.data?.error || "Verification failed.");
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        fontFamily: '"Encode Sans Expanded", sans-serif',
      }}
    >
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-xl text-center w-full max-w-md">
        <h2
          className={`text-2xl font-bold mb-4 ${
            status === "success"
              ? "text-green-700"
              : status === "error"
              ? "text-red-600"
              : "text-gray-800"
          }`}
        >
          {message}
        </h2>

        {status === "success" && (
          <Link
            to="/login"
            className="inline-block mt-4 px-5 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-200"
          >
            Go to Login
          </Link>
        )}

        {status === "error" && (
          <Link
            to="/signup"
            className="inline-block mt-4 px-5 py-2 rounded-md bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-all duration-200"
          >
            Back to Register
          </Link>
        )}
      </div>
    </div>
  );
}
