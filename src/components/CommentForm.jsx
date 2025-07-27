import React, { useState } from "react";
import axios from "axios";

const CommentForm = ({ postId, onAddComment }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = text.trim();
    if (!trimmed) {
      alert("❌ Comment cannot be empty");
      return;
    }

    const token = sessionStorage.getItem("jwt");
    if (!token) {
      alert("❌ You must be logged in to comment");
      return;
    }

    try {
      setLoading(true);

      const { data: comment } = await axios.post(
        "https://backend-mu-ten-26.vercel.app/comments",
        { postId, text: trimmed },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fallback: if your backend doesn’t attach user info, add minimal fallback
      if (!comment.userId || !comment.userId.name) {
        comment.userId = { name: "You" };
      }

      onAddComment(comment);
      setText("");
    } catch (err) {
      console.error("Error creating comment:", err);
      alert("❌ Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <input
        type="text"
        placeholder="Write a comment..."
        value={text}
        disabled={loading}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 px-4 py-2 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <button
        type="submit"
        disabled={loading || !text.trim()}
        className={`ml-2 px-4 py-2 rounded-full font-medium transition ${
          loading || !text.trim()
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
};

export default CommentForm;
