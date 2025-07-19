import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    mobile: "",
    nationality: "",
    language: "EN",
    image: "",
    email: "",
    role: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [activeTab, setActiveTab] = useState("liked");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("jwt");
        const res = await axios.get("https://terhal-backend-6jk2.vercel.app/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("mobile", user.mobile);
      formData.append("language", user.language);
      formData.append("nationality", user.nationality);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const token = sessionStorage.getItem("jwt");
      const res = await axios.put("http://localhost:3000/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data.user);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-8 flex items-center gap-6">
        <img
          src={
            user.image
            
              ||"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          }
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-2 border-gray-200"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.role} | Sharing my favorite spots</p>
          <div className="flex flex-wrap gap-4 text-sm mt-3 text-gray-500 items-center">
            <span className="flex items-center gap-1">
              <MdEmail /> {user.email}
            </span>
            <span className="flex items-center gap-1">
              <MdPhone /> {user.mobile}
            </span>
            <span className="flex items-center gap-1">
              <MdLocationOn /> {user.nationality}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10 flex justify-center gap-8 text-gray-600 font-medium border-b">
        <button
          className={`pb-2 ${activeTab === "liked" ? "border-b-2 border-orange-500 text-orange-600" : ""}`}
          onClick={() => setActiveTab("liked")}
        >
          ❤️ Liked Places
        </button>
        <button
          className={`pb-2 ${activeTab === "history" ? "border-b-2 border-orange-500 text-orange-600" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          📁 Visit History
        </button>
        <button
          className={`pb-2 ${activeTab === "edit" ? "border-b-2 border-orange-500 text-orange-600" : ""}`}
          onClick={() => setActiveTab("edit")}
        >
          ✏️ Edit Profile
        </button>
      </div>

      {/* Content Area */}
      {activeTab === "liked" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
          {[
            "/img/pyramid.jpg",
            "/img/abu-simbel.jpg",
            "/img/temple.jpg",
            "/img/art.jpg",
            "/img/luxor.jpg",
            "/img/desert.jpg",
          ].map((img, i) => (
            <img key={i} src={img} alt="place" className="rounded-lg object-cover w-full h-48 shadow" />
          ))}
        </div>
      )}

      {/* Edit Form */}
      {activeTab === "edit" && (
        <form
          className="max-w-xl mx-auto mt-10 space-y-5 bg-white p-6 rounded-xl shadow-md"
          onSubmit={handleUpdate}
          encType="multipart/form-data"
        >
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              className="w-full border p-2 rounded mt-1"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-medium">Mobile</label>
            <input
              type="text"
              className="w-full border p-2 rounded mt-1"
              value={user.mobile}
              onChange={(e) => setUser({ ...user, mobile: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-medium">Nationality</label>
            <input
              type="text"
              className="w-full border p-2 rounded mt-1"
              value={user.nationality}
              onChange={(e) => setUser({ ...user, nationality: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-medium">Language</label>
            <select
              className="w-full border p-2 rounded mt-1"
              value={user.language}
              onChange={(e) => setUser({ ...user, language: e.target.value })}
            >
              <option value="AR">Arabic</option>
              <option value="EN">English</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Profile Picture</label>
            <input
              type="file"
              className="w-full border p-2 rounded mt-1"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* Pagination */}
      {activeTab === "liked" && (
        <div className="mt-10 flex justify-center gap-4 items-center text-sm text-gray-600">
          <button className="p-2 hover:text-orange-500">&lt;</button>
          <button className="w-8 h-8 rounded-full bg-orange-500 text-white">1</button>
          <button className="w-8 h-8 rounded-full hover:bg-orange-100">2</button>
          <button className="p-2 hover:text-orange-500">&gt;</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
