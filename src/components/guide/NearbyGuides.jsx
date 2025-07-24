import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import GuideRequestModal from "./GuideRequestModal";
import GuideCard from "./GuideCard"; // Imported the new GuideCard component

export default function NearbyGuides({ placeId }) {
  const token = sessionStorage.getItem("jwt");
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedGuideId, setSelectedGuideId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  //  Submit handler for guide request modal
  const handleSubmitRequest = async (formData) => {
    try {
      await axios.post(
        `https://backend-mu-ten-26.vercel.app/guide/request/${selectedGuideId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Request sent successfully!");
    } catch (error) {
      console.error("Failed to send guide request:", error);
      toast.error("Failed to send guide request");
    }
  };

  // Fetch nearby guides on mount
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await axios.get(
          `https://backend-mu-ten-26.vercel.app/guide/${placeId}/place`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGuides(res.data || []);
      } catch (err) {
        console.info("This place has no guides nearby");
        toast.error("Failed to load nearby guides");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchGuides();
  }, [placeId, token]);

  // Open modal and set selected guide
  const openRequestModal = (guideId) => {
    setSelectedGuideId(guideId);
    setShowModal(true);
  };

  if (loading) return <p>Loading nearby guides...</p>;

  if (guides.length === 0)
    return <p className="text-gray-500">No nearby guides found.</p>;

  return (
    <div className="mt-10">
      <h3 className="text-3xl font-bold mb-6">Nearby Tour Guides</h3>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <GuideCard
            key={guide._id}
            guide={guide}
            onRequest={openRequestModal}
          />
        ))}
      </div>

      {/* Modal shown when a guide is selected */}
      {showModal && (
        <GuideRequestModal
          guideId={selectedGuideId}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitRequest} // Pass the handler to fix error
        />
      )}
    </div>
  );
}
