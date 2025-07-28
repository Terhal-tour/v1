import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import GuideRequestModal from "./GuideRequestModal";
import GuidePaymentCard from "./GuidePaymentCard"; 

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
          <GuidePaymentCard
            key={req._id}
            request={req}
            token={token}
            onCancel={cancelRequest}
            onEdit={openEditModal}
            onPayment={handlePayment}
          />
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
