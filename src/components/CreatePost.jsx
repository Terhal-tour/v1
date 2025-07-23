import React, { useEffect, useState } from "react";
import axios from "axios";

const CreatePost = ({ onPostCreated }) => {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  // 🔑 Fetch current user profile
  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    if (!token) return;

    axios
      .get("http://localhost:3000/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data.user))
      .catch((err) => {
        console.error(err);
        alert("❌ Failed to load profile");
      });
  }, []);

  // Fallbacks
  const userName = profile?.name || "User";
  const userImage = profile?.image || "";
  const firstLetter = userName.charAt(0).toUpperCase();


  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      alert("⚠️ Please enter a description for the post.");
      return;
    }

    if (images.length === 0) {
      alert("⚠️ Please add at least one image.");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    images.forEach((img) => formData.append("images", img));

    try {
      setLoading(true);

      await axios.post("http://localhost:3000/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Post published successfully!");
      setDescription("");
      setImages([]);
      setPreviewUrls([]);

      onPostCreated?.();
    } catch (err) {
      console.error("❌ Error creating post:", err);
      alert("❌ An error occurred while publishing the post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold ring-2 ring-blue-100">
              {firstLetter}
            </div>
          )}
          <span className="font-semibold text-gray-800">What's on your mind?</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Share your thoughts..."
            className="w-full p-4 border border-gray-200 rounded-lg resize-none outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />

          {previewUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {previewUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`preview-${index}`}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer text-gray-600 hover:text-blue-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Photo</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagesChange}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-md ${loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
