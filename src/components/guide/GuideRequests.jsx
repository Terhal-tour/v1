import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import GuideRequestModal from "./GuideRequestModal";

export default function GuideRequests({ token }) {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all requests made by the logged-in traveler
  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:3000/guide/request/traveller", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data.requests);
    } catch (err) {
      console.error("Error fetching guide requests:", err);
    }
  };

  // Cancel a pending request by ID
  const cancelRequest = async (requestId) => {
    try {
      await axios.delete(`http://localhost:3000/guide/request/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Request canceled successfully");
      fetchRequests();
    } catch (err) {
      toast.error("Failed to cancel request");
    }
  };

  // Show modal and prepare selected request for editing
  const openEditModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  // Prepare values for the form modal from existing request
  const getInitialFormValues = (request) => ({
    userName: request.userName || "",
    userEmail: request.userEmail || "",
    message: request.message || "",
    date: request.date?.slice(0, 10), // Format: YYYY-MM-DD
    time: new Date(request.date).toISOString().slice(11, 16), // Format: HH:MM
    duration: request.duration || "",
    groupSize: request.groupSize || 1,
  });

  // Update request on submit from modal
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

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <>
      {/* Guide Request List */}
      <div className="w-full flex flex-col items-center px-4 py-6">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white rounded-2xl shadow-lg border-l-4 border-orange-400 w-full max-w-[650px] p-5 mb-6 transition hover:shadow-xl"
          >
            <div className="flex justify-between items-start">
              {/* Request Info */}
              <div className="space-y-2">
                <p className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  🧑‍🏫 Guide: <span>{req.guide?.name}</span>
                </p>
                <p className="text-sm text-gray-600">📅 Date: {new Date(req.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">⏳ Duration: {req.duration}</p>
                <p className="text-sm text-gray-600">💬 Message: {req.message || "No message"}</p>
                <p className="text-sm text-gray-500">
                  📌 Status:{" "}
                  <span
                    className={`font-semibold ${
                      req.status === "pending"
                        ? "text-yellow-600"
                        : req.status === "confirmed"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {req.status}
                  </span>
                </p>
              </div>

              {/* Pending Request Actions */}
              {req.status === "pending" && (
                <div className="flex flex-col gap-2 ml-4">
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
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reusable Modal for Editing */}
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
