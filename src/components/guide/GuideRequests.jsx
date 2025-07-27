import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import GuideRequestModal from "./GuideRequestModal";
import { NavLink } from 'react-router-dom';

export default function GuideRequests({ token }) {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all requests made by the traveler
  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "https://backend-mu-ten-26.vercel.app/guide/request/traveller",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data.requests);

      setRequests(res.data.requests);
    } catch (err) {
      console.error("Error fetching guide requests:", err);
    }
  };

  // Cancel a guide request by ID
  const cancelRequest = async (requestId) => {
    try {
      await axios.delete(
        `https://backend-mu-ten-26.vercel.app/guide/request/${requestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Request canceled successfully");
      fetchRequests();
    } catch (err) {
      toast.error("Failed to cancel request");
    }
  };

  // Open the modal to edit a request
  const openEditModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  // Pre-fill form values for editing
  const getInitialFormValues = (request) => ({
    userName: request.userName || "",
    userEmail: request.userEmail || "",
    message: request.message || "",
    date: request.date?.slice(0, 10),
    time: new Date(request.date).toISOString().slice(11, 16),
    duration: request.duration || "",
    groupSize: request.groupSize || 1,
  });

  // Submit updated guide request
  const handleUpdateSubmit = async (values) => {
    try {
      await axios.put(
        `https://backend-mu-ten-26.vercel.app/guide/request/${selectedRequest._id}`,
        {
          message: values.message,
          date: new Date(`${values.date}T${values.time}`),
          duration: values.duration,
          groupSize: values.groupSize,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Request updated successfully");
      fetchRequests();
    } catch (err) {
      toast.error("Failed to update request");
    }
  };

  // Create a Stripe checkout session and redirect to Stripe
  const handlePayment = async (requestId) => {
    try {
      const res = await axios.post(
        `https://backend-mu-ten-26.vercel.app/payments/create/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.href = res.data.url;
    } catch (err) {
      toast.error("Failed to initiate payment");
    }
  };

  useEffect(() => {
    fetchRequests();

    // Check if returning from Stripe payment
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("payment") === "success") {
      toast.success("Payment completed successfully!");
      fetchRequests(); // Reload updated data
    }
  }, []);

  return (
    <>
      <div className="w-full flex flex-col items-center px-4 py-6">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white rounded-2xl shadow-lg border-l-4 border-orange-400 w-full max-w-[650px] p-5 mb-6 transition hover:shadow-xl"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  🧑‍🏫 Guide: <span>{req.guide?.name}</span>
                </p>
                <p className="text-sm text-gray-600">
                  📅 Date: {new Date(req.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  ⏳ Duration: {req.duration}
                </p>
                <p className="text-sm text-gray-600">
                  💬 Message: {req.message || "No message"}
                </p>

                <p className="text-sm text-gray-500">
                  📌 Status:{" "}
                  <span
                    className={`font-semibold ${
                      req.status === "pending"
                        ? "text-yellow-600"
                        : req.status === "approved"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {req.status}
                  </span>
                </p>
                {req.paid && (
                  <p className="text-sm text-green-600 font-semibold">
                    ✅ Payment Completed
                  </p>
                )}
              </div>

              {/* Buttons shown depending on request status */}
              <div className="flex flex-col gap-2 ml-4">
                {req.status === "pending" && (
                  <>
                    <button
                      onClick={() => openEditModal(req)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white w-24 py-1 rounded-full text-sm shadow"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => cancelRequest(req._id)}
                      className="bg-red-500 hover:bg-red-600 text-white w-24 py-1 rounded-full text-sm shadow"
                    >
                      ❌ Cancel
                    </button>
                   
                  </>
                )}

                {req.status === "approved" && (
                  <>
                    {!req.paid ? (
                      <>
                        <p className="text-sm text-gray-600">
                          💰 Price: {req.price || "No price"}
                        </p>
                        <button
                          onClick={() => handlePayment(req._id)}
                          className="bg-orange-500 hover:bg-orange-600 text-white w-24 py-1 rounded-full text-sm shadow"
                        >
                          💳 Pay Now
                        </button>
                        <button
                          onClick={() => cancelRequest(req._id)}
                          className="bg-red-500 hover:bg-red-600 text-white w-24 py-1 rounded-full text-sm shadow"
                        >
                          ❌ Cancel
                        </button>
                      </>
                    ) : (
                      <div className="text-green-600 font-semibold text-sm text-center">
                        ✅ Paid
                      </div>
                    )}
                  </>
                )}
                {req.status === "done" && (
                  <div className="text-green-600 font-semibold text-sm text-center">
                    ✅ Paid
                  </div>
                )}
                 <NavLink
                      to={`/chat/${req.user}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                        />
                      </svg>
                      Send Message
                    </NavLink>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for editing a request */}
      {isModalOpen && selectedRequest && (
        <GuideRequestModal
          guideId={selectedRequest.guide?._id}
          onClose={() => setIsModalOpen(false)}
          title="Edit Guide Request"
          initialValues={getInitialFormValues(selectedRequest)}
          onSubmit={handleUpdateSubmit}
        />
      )}
    </>
  );
}
