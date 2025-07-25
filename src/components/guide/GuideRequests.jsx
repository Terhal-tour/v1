import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import GuideRequestModal from "./GuideRequestModal";

export default function GuideRequests({ token }) {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all requests made by the traveler
  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/guide/request/traveller",
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
        `http://localhost:3000/guide/request/${selectedRequest._id}`,
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
        `http://localhost:3000/payments/create/${requestId}`,
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
