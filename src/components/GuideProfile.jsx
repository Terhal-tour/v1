import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Globe,
  CheckCircle,
  Trash2,
  Calendar,
  MapPin,
  Star,
  Clock,
  Bell,
  LogOut,
} from "lucide-react";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import GeoLocation from "./GeoLocation";

export default function GuideProfile() {
  const guide = JSON.parse(sessionStorage.getItem("user"));
  console.log(guide);
  const navigator = useNavigate();
  const [requests, setRequests] = useState([]);
  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("user");
    navigator("/login");
  };
  const handleConfirm = async (requestId) => {
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) return;

      const response = await fetch(
        `https://backend-mu-ten-26.vercel.app/guide/request/${requestId}/confirm`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        toast.error("Failed to confirm request");
        throw new Error("Failed to confirm request");
      }

      setRequests((prev) =>
        prev.map((r) =>
          r._id === requestId ? { ...r, status: "confirmed" } : r
        )
      );
      toast.success("this request was confirmed successfully");
    } catch (error) {
      //   toast.error("some thing went wrong try later");

      console.error("Error confirming request:", error.message);
    }
  };

  const handleDelete = async (requestId) => {
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) return;

      const response = await fetch(
        `https://backend-mu-ten-26.vercel.app/guide/request/${requestId}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        toast.error("Failed to reject request");
        throw new Error("Failed to reject request");
      }

      setRequests((prev) => prev.filter((r) => r._id !== requestId));
      toast.success("this request was rejected successfully");
    } catch (error) {
      //   toast.error("some thing went wrong try later");

      console.error("Error rejecting request:", error.message);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const confirmedRequests = requests.filter((r) => r.status === "confirmed");

  if (!guide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Access Required
            </h2>
            <p className="text-gray-600">
              Please log in to view your guide dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (guide.role !== "guide") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-3 w-fit mx-auto mb-4">
              <User className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600">
              You don't have permission to access the guide dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = sessionStorage.getItem("jwt");
        if (!token) return;

        const response = await fetch(
          "https://backend-mu-ten-26.vercel.app/guide/request/all",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }

        const data = await response.json();
        setRequests(data.requests);
      } catch (error) {
        console.error("Error fetching guide requests:", error.message);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <GeoLocation />

      {/* Professional Header with Gradient */}

      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Guide Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your tours and client requests
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                {pendingRequests.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {pendingRequests.length}
                  </div>
                )}
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {guide.name.charAt(0)}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Enhanced Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{guide.name}</h2>
                    <p className="text-blue-100">Professional Tour Guide</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-sm">{guide.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-sm">{guide.nationality}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-sm">Local Area Expert</span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rating</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {guide.rating}
                    </p>
                  </div>
                  <div className="bg-yellow-100 rounded-full p-3">
                    <Star className="h-6 w-6 text-yellow-600 fill-current" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Tours
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {confirmedRequests.length + pendingRequests.length}
                    </p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="bg-purple-100 rounded-full p-3">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Requests */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Tour Requests
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {pendingRequests.length} Pending
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {confirmedRequests.length} Confirmed
                    </span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {requests.filter((req) => req.status !== "rejected").length ===
                0 ? (
                  <div className="p-12 text-center">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No requests yet
                    </h3>
                    <p className="text-gray-600">
                      Tour requests will appear here when clients book your
                      services.
                    </p>
                  </div>
                ) : (
                  requests
                    .filter((req) => req.status !== "rejected")
                    .map((req) => (
                      <div
                        key={req._id}
                        className="p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h4 className="text-lg font-semibold text-gray-900 mr-3">
                                {req.userName}
                              </h4>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  req.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {req.status === "confirmed"
                                  ? "Confirmed"
                                  : "Pending Review"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {req.userEmail}
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {req.message}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              {new Date(req.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{req.duration}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <User className="h-4 w-4 mr-2" />
                            <span>{req.groupSize} guests</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            Submitted{" "}
                            {new Date(req.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex space-x-2">
                            {req.status !== "confirmed" && (
                              <button
                                onClick={() => handleConfirm(req._id)}
                                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Confirm Tour
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(req._id)}
                              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Terhal</h3>
              <p className="text-sm text-gray-600 mt-1">
                Connecting travelers with local experts
              </p>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Terhal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
