import axios from "axios";
import { useState } from "react";

const LikeButton = ({ postId, likes = [], onLike }) => {
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    const token = sessionStorage.getItem("jwt");

    if (!token) {
      alert("❌ You must be logged in to like this post");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `http://localhost:3000/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ Call parent handler to update likes without reload
      onLike?.();
    } catch (err) {
      console.error("❌ Error liking post:", err);
      alert("❌ Something went wrong while adding your like");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`px-3 py-1 rounded-full transition-colors ${
        loading
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      👍 Like ({likes.length ?? 0}) {loading && "⏳"}
    </button>
  );
};

export default LikeButton;
