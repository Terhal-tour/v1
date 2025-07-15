import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import axios from "axios";

export default function VerifyEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.post(`http://localhost:3000/auth/verify-email/${token}`);
        setMessage(res.data.message || "Email verified successfully!");
      } catch (err) {
        setMessage(err.response?.data?.error || "Verification failed.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-green-700">{message}</h2>
        <Link to="/login" className="mt-4 inline-block text-blue-600 hover:underline">
          Go to Login
        </Link>
      </div>
    </div>
  );
}
