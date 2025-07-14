import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function RecommendationReviews() {
  const [status, setStatus] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      const token = sessionStorage.getItem("jwt");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3000/user/reviews/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.review) {
            setStatus(data.review.status || "");
            setReview(data.review.review || "");
            setExistingReview(data.review);
          }
        } else {
          console.warn("No previous review found.");
        }
      } catch (err) {
        console.error("Failed to fetch review", err);
      }
    };

    fetchReview();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = sessionStorage.getItem("jwt");
    if (!token) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    const payload = { status, review };

    try {
      const response = await fetch("http://localhost:3000/user/reviews", {
        method: existingReview ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        existingReview
          ? toast.success("Recommendation updated successfully!")
          : toast.success("Recommendation created successfully!");

        setExistingReview(payload);
      } else {
        const err = await response.json();
        toast.error("terhal says: " + err.message);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
    console.log(existingReview);
  };
  const handleDelete = async () => {
    const token = sessionStorage.getItem("jwt");
    if (!token) {
      toast.error("You must be logged in to delete a review.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete your review?")) return;

    try {
      const res = await fetch("http://localhost:3000/user/reviews", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success("Review deleted successfully.");
        setReview("");
        setStatus("");
        setExistingReview(null);
      } else {
        const err = await res.json();
        toast.error("terhal says: " + err.message);
      }
    } catch (err) {
      console.error("Failed to delete review", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-amber-900/60 to-orange-900/60 backdrop-blur-sm z-50">
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 p-8 rounded-2xl shadow-2xl w-full max-w-md border-4 border-amber-600 relative overflow-hidden">
        <Link
          to="/"
          className="absolute top-3 left-3 text-amber-700 hover:text-red-600 text-2xl font-bold transition-colors duration-200"
          aria-label="Close and return to home"
        >
          &times;
        </Link>
        {/* Decorative lines */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600"></div>
        <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600"></div>

        {/* Decorative icons */}
        <div className="absolute top-4 right-4 text-amber-600 text-2xl">𓂀</div>
        <div className="absolute bottom-4 left-4 text-amber-600 text-2xl">
          𓊪
        </div>

        <div className="relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-amber-900 mb-2">
              Share Your Journey
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-600 to-yellow-500 mx-auto rounded-full"></div>
            <p className="text-amber-700 mt-2 text-sm">
              Tell us about your Egyptian adventure
            </p>
          </div>

          {existingReview && (
            <div className="text-sm text-amber-700 bg-yellow-100 border border-yellow-300 rounded-md px-4 py-2 mb-4">
              You've already submitted a review. Feel free to update it below.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mood selection */}
            <div className="bg-white/50 p-4 rounded-xl border border-amber-200">
              <label className="block mb-3 font-semibold text-amber-900 text-center">
                How was your experience?
              </label>
              <div className="flex justify-center space-x-8">
                {[
                  {
                    mood: "happy",
                    emoji: "😊",
                    color: "text-green-600",
                    label: "Amazing!",
                  },
                  {
                    mood: "ordinary",
                    emoji: "😐",
                    color: "text-yellow-600",
                    label: "Good",
                  },
                  {
                    mood: "sad",
                    emoji: "😞",
                    color: "text-red-600",
                    label: "Could be better",
                  },
                ].map(({ mood, emoji, color, label }) => (
                  <div key={mood} className="text-center">
                    <button
                      type="button"
                      onClick={() => setStatus(mood)}
                      className={`text-4xl transition-all duration-300 hover:scale-110 ${
                        status === mood
                          ? "scale-125 drop-shadow-lg"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      aria-label={mood}
                    >
                      {emoji}
                    </button>
                    <div className={`text-xs mt-1 font-medium ${color}`}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Text area */}
            <div className="bg-white/50 p-4 rounded-xl border border-amber-200">
              <label className="block mb-3 font-semibold text-amber-900">
                Share your story:
              </label>
              <textarea
                className="w-full border-2 border-amber-300 rounded-lg p-3 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200 resize-none text-amber-800 placeholder:text-amber-500"
                rows="4"
                placeholder="Tell us about the pyramids, the Nile, the culture... What made your trip special?"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center pt-4">
              <Link
                to="/"
                className="text-amber-700 hover:text-amber-900 font-medium px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors duration-200"
              >
                Maybe Later
              </Link>
              <button
                type="submit"
                disabled={loading || !status || !review.trim()}
                className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-6 py-3 rounded-lg hover:from-amber-700 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Review</span>
                    <span className="text-lg">𓊪</span>
                  </>
                )}
              </button>

              {existingReview && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-800 font-medium px-4 py-2 rounded-lg hover:bg-red-100 transition-colors duration-200"
                >
                  Delete My Review
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Soft background pattern */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-amber-200 via-transparent to-orange-200 pointer-events-none"></div>
      </div>
    </div>
  );
}
