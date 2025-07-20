import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { toast } from "react-toastify";
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
  const [likedPlaces, setLikedPlaces] = useState([]);
  const[historyPlaces,setHistoryPlaces]=useState([]);
const token = sessionStorage.getItem("jwt");

useEffect(()=>{
  if(activeTab==="liked"){
    handleLikedPlaces();
  }
},[activeTab])
//fetch data of history
useEffect(()=>{
  if(activeTab==="history"){
    handleHistoryPlaces();
  }
},[activeTab])
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
const handleLikedPlaces = async () => {
  try {
    const res = await axios.get("https://terhal-backend-t42w.vercel.app/user/favorite", {
      headers: {
        Authorization: `Bearer ${token}` ,
      }
    });

    console.log("DATA:", res.data); 
if (Array.isArray(res.data.data)) {
  const likedPlaces = res.data.data
    .filter((item) => item.placeId) 
    .map((item) => item.placeId);
    
  setLikedPlaces(likedPlaces);
} else {
  console.error("Expected array but got:", res.data.data);
}


  } catch (err) {
    console.log("Error:", err);
  }
};
//handle history places
 const handleHistoryPlaces = async () => {
    try {
      const res = await axios.get("https://terhal-backend-t42w.vercel.app/user/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res)
       setHistoryPlaces(res.data.history); 
       console.log("Places:", historyPlaces);
    } catch (err) {
      console.error("Error fetching history places:", err);
    }
  };
//update profile
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
      const res = await axios.put("https://terhal-backend-t42w.vercel.app/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data.user);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update profile");
    }
  };
// delete image profile 

const handleDeleteProfileImage = async () => {
  try {
    const formData = new FormData();
    formData.append('image', ''); 

    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('mobile', user.mobile);
    formData.append('nationality', user.nationality);

    const response = await axios.put('https://terhal-backend-t42w.vercel.app/profile/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Image deleted:', response.data);
    setUser(prev => ({ ...prev, image: "" }));
  } catch (error) {
    console.error('Failed to delete image', error);
  }
};
//pagination
const [currentPage, setCurrentPage] = useState(1);
const cardsPerPage = 4;

// Data slicing
const getCurrentPageData = (data) => {
  const start = (currentPage - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  return data.slice(start, end);
};

const likedData = getCurrentPageData(likedPlaces);
const historyData = getCurrentPageData(historyPlaces);

const totalPages = (activeTab === "liked" ? likedPlaces.length : historyPlaces.length) / cardsPerPage;

return (
  <div
    className="min-h-screen flex flex-col items-center justify-start px-4  pt-7"
    style={{ backgroundColor: "#e5e7eb"  }} 
  >
    {/* Profile Header */}
   
<div className="w-full max-w-3xl mx-auto mt-8">
  <h1 className="text-3xl font-bold mb-6 text-center text-orange-500">Your Profile</h1>

  <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-6">
    {/* Profile Image */}
    <div className="flex flex-col items-center">
      <div className="w-28 h-28 relative">
        <img
          src={
            user.image ||
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          }
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
        />
      </div>
      {user.image && (
  <button
    onClick={handleDeleteProfileImage}
    className="text-sm text-red-600 mt-2 hover:underline"
  >
    Delete Your Image
  </button>
)}

    </div>

    {/* Info */}
    <div>
      <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
      <p className="text-gray-600 mt-1">
        Traveller | Sharing my favorite spots
      </p>
      <div className="flex flex-wrap gap-4 text-sm mt-4 text-gray-600">
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
</div>



    {/* Tabs */}
    <div className="mt-8 flex justify-center gap-8 text-gray-600 font-medium border-b">
      <button
        className={`pb-2 ${
          activeTab === "liked"
            ? "border-b-2 border-orange-500 text-orange-600"
            : ""
        }`}
        onClick={() => setActiveTab("liked")}
      >
        Liked Places
      </button>
      <button
        className={`pb-2 ${
          activeTab === "history"
            ? "border-b-2 border-orange-500 text-orange-600"
            : ""
        }`}
        onClick={() => setActiveTab("history")}
      >
        Visit History
      </button>
      <button
        className={`pb-2 ${
          activeTab === "edit"
            ? "border-b-2 border-orange-500 text-orange-600"
            : ""
        }`}
        onClick={() => setActiveTab("edit")}
      >
        Edit Profile
      </button>
   </div>

    {/* Content Area */}


{activeTab === "liked" && (
  likedPlaces.length === 0 ? (
    <p className="text-center text-gray-500 mt-10">
      There are no favourite places until now
    </p>
  ) : (
    <>
      <div className="grid gap-6 mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 max-w-7xl mx-auto">
        {likedData.map((place) => (
          <div
            key={place._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
          >
            <img
              src={place.image}
              alt={place.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-gray-800">{place.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{place.address}</p>
              <p className="text-sm text-yellow-500 mt-1">⭐ {place.rating}</p>
              <div className="mt-auto">
                {place.location && (
                  <a
                    href={place.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm"
                  >
                    View on map
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
)}

{/*history */}

 {activeTab === "history" && (
  historyPlaces.length === 0 ? (
    <p className="text-center text-gray-500 mt-10">No history places found.</p>
  ) : (
    <>
      <div className="grid gap-6 mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 max-w-7xl mx-auto pb-10">
        {historyData.map((place) => (
          <div
            key={place._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
          >
            <img
              src={place.placeId.image}
              alt={place.placeId.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-gray-800">{place.placeId.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{place.placeId.address}</p>
              <p className="text-sm text-yellow-500 mt-1">⭐ {place.placeId.rating}</p>
              <div className="mt-auto">
                {place.placeId.location && (
                  <a
                    href={place.placeId.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm"
                  >
                    View on map
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
)}


    {/* Edit Form */}
    {activeTab === "edit" && (
     
         <form
        className="max-w-xl mb-7 w-full mt-10 space-y-5 bg-white p-7 rounded-xl shadow-md"
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
    {(activeTab === "liked" || activeTab === "history") && (
  <div className="mt-10 flex justify-center gap-2 pb-5 items-center text-sm text-gray-600">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 hover:text-orange-500 disabled:opacity-30"
    >
      &lt;
    </button>

    {Array.from({
      length: Math.ceil(
        (activeTab === "liked" ? likedPlaces.length : historyPlaces.length) / cardsPerPage
      ),
    }).map((_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`w-8 h-8 rounded-full ${
          currentPage === i + 1
            ? "bg-orange-500 text-white"
            : "hover:bg-orange-100"
        }`}
      >
        {i + 1}
      </button>
    ))}

    <button
      onClick={() =>
        setCurrentPage((prev) =>
          prev < totalPages ? prev + 1 : prev
        )
      }
      disabled={
        currentPage >= Math.ceil(
          (activeTab === "liked" ? likedPlaces.length : historyPlaces.length) / cardsPerPage
        )
      }
      className="px-3 py-1 hover:text-orange-500 disabled:opacity-30"
    >
      &gt;
    </button>
  </div>
)}

  </div>
);

};

export default Profile;