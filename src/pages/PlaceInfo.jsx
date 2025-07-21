import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import "../css/placeDetailsPage.css";
import { ToastContainer, toast } from "react-toastify";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import Spinner from "./../components/Spinner";

function PlaceInfo() {
  const token = sessionStorage.getItem("jwt");
  const { _id } = useParams();
  console.log(_id);

  const [place, setPlace] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isFavourite, setIsFavourite] = useState(false);
  const ratingAdded = () => toast("rating added succsessfuly");
  const placeAddedToFavorites = (status) => {
    switch (status) {
      case "added":
        toast.success("Place added to favourites successfully!");
        break;
      case "removed":
        toast.info("Place removed from favourites.");
        break;
      default:
        toast.warn(`Unexpected status: ${status}`);
        break;
    }
  };

  const getLimitedDescription = (text, limit) => {
    const words = text.split(" ");
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
  };
  const handleRate = async (value) => {
    console.log("cccccccc");
    
    console.log(
      `Submitting rating ${value} for place with ID ${place._id}...`
    );
    
    try {
      await axios.post(
        `https://backend-mu-ten-26.vercel.app/places/${place._id}/rate`,
        {
          rating: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Rating submitted:", value);
      setRating(value);
      ratingAdded();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit rating");
    }
  };

  const handleFavourite = async () => {
    try {
      // 1️⃣ Check if the place is favourited
      const checkRes = await axios.get(
        `https://backend-mu-ten-26.vercel.app/places/${place._id}/is-favourited`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const isCurrentlyFavourited = checkRes.data.isFavourited;

      let response;

      if (isCurrentlyFavourited) {
        // 2️⃣ Remove if it’s already favourited
        response = await axios.delete(
          `https://backend-mu-ten-26.vercel.app/places/${place._id}/favourite`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsFavourite(false);
        placeAddedToFavorites("removed");
      } else {
        // 2️⃣ Add if not favourited
        response = await axios.post(
          `https://backend-mu-ten-26.vercel.app/places/${place._id}/favourite`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setIsFavourite(true);
        placeAddedToFavorites("added");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle favourite");
    }
  };

  // useEffect(() => {
  //   axios
  //     .get(`https://backend-mu-ten-26.vercel.app/places/${_id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res.data.data);
  //       setPlace(res.data.data);
  //       setSuggestions(res.data.suggestions.places);
  //     })
  //     .catch((err) => console.error("Error fetching place details:", err));
  // }, [_id]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      // 1️⃣ Get the full place info (includes average rating)
      const placeRes = await axios.get(
        `https://backend-mu-ten-26.vercel.app/places/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPlace(placeRes.data.data);
      setSuggestions(placeRes.data.suggestions.places);

      // 2️⃣ Get the current user’s personal rating for this place
      const userRatingRes = await axios.get(
        `https://backend-mu-ten-26.vercel.app/places/${_id}/user-rating`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // If no rating yet, default to 0
      setRating(userRatingRes.data.rating || 0);

      // 3️⃣ Get whether the user has favourited this place
      const favRes = await axios.get(
        `https://backend-mu-ten-26.vercel.app/places/${_id}/is-favourited`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFavourite(favRes.data.isFavourited);

    } catch (err) {
      console.error("Error loading place details:", err);
    }
  };

  fetchData();
}, [_id]);

  console.log("place", place);
  if (!place) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <title>Place Details</title>

      <main className="px-4 md:px-10 lg:px-20 xl:px-40 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <section
            className="relative rounded-2xl shadow-lg overflow-hidden min-h-[400px] flex items-end p-8 bg-cover bg-center"
            style={{
              backgroundImage: `url(${place.image})`,
            }}
          >
            <div className="relative z-10">
              <h2 className="text-5xl font-bold text-white tracking-tight">
                {place.name}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-white/90">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-5 h-5 text-[var(--sunset-coral)]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M9.69 18.933l-4.263-4.263a1.5 1.5 0 010-2.121l4.263-4.263a1.5 1.5 0 012.121 0l4.263 4.263a1.5 1.5 0 010 2.121l-4.263 4.263a1.5 1.5 0 01-2.121 0zM9.69 4.343L5.427 8.606a.5.5 0 000 .707l4.263 4.263a.5.5 0 00.707 0l4.263-4.263a.5.5 0 000-.707L10.397 4.343a.5.5 0 00-.707 0z"
                      fillRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">{place.address}</span>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <section>
                <h3 className="text-2xl font-bold mb-4">Location</h3>
                <div className="w-full aspect-video rounded-xl shadow-md overflow-hidden">
                  {place.coordinates && (
                    <iframe
                      className="w-full h-full border-0"
                      src={`https://maps.google.com/maps?q=${place.coordinates}&z=15&output=embed`}
                      allowFullScreen=""
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Or a clickable link: */}
                <a
                  href={place.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline mt-2 block"
                >
                  View on Google Maps
                </a>

                <div className="my-8">
                  {/*  Rating  */}
                  <h3 className="text-xl font-semibold mb-2">
                    Rate this place
                  </h3>
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <svg
                        key={value}
                        onClick={() => handleRate(value)}
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-8 h-8 cursor-pointer transition-colors ${
                          (hoverRating || rating) >= value
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.975h4.184c.969 0 1.371 1.24.588 1.81l-3.39 2.46 1.286 3.975c.3.921-.755 1.688-1.54 1.118l-3.39-2.46-3.39 2.46c-.784.57-1.838-.197-1.539-1.118l1.285-3.975-3.39-2.46c-.784-.57-.38-1.81.588-1.81h4.184l1.286-3.975z" />
                      </svg>
                    ))}
                  </div>
                  {/* <ToastContainer /> */}

                  {/*  Add to favourites */}
                  <button
                    onClick={handleFavourite}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
                      isFavourite ? "bg-rose-500" : "bg-gray-700"
                    } hover:opacity-90 transition cursor-pointer`}
                  >
                    {isFavourite ? (
                      <>
                        <HeartSolid className="w-5 h-5" />
                        <span>Remove from Favourites</span>
                      </>
                    ) : (
                      <>
                        <HeartOutline className="w-5 h-5" />
                        <span>Add to Favourites</span>
                      </>
                    )}
                  </button>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-bold mb-4">About this place</h3>
                <div className="space-y-4 text-[var(--text-light)]">
                  <div className="flex items-start gap-4 border-b border-stone-200 pb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m6.115 5.19.319 1.913A6 6 0 0 0 8.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 0 0 2.288-4.042 1.087 1.087 0 0 0-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 0 1-.98-.314l-.295-.295a1.125 1.125 0 0 1 0-1.591l.13-.132a1.125 1.125 0 0 1 1.3-.21l.603.302a.809.809 0 0 0 1.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 0 0 1.528-1.732l.146-.292M6.115 5.19A9 9 0 1 0 17.18 4.64M6.115 5.19A8.965 8.965 0 0 1 12 3c1.929 0 3.716.607 5.18 1.64"
                      />
                    </svg>

                    <div>
                      <p className="font-semibold text-[var(--text-dark)]">
                        Address
                      </p>
                      <p>{place.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 border-b border-stone-200 pb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                      />
                    </svg>

                    <div>
                      <p className="font-semibold text-[var(--text-dark)]">
                        Rating
                      </p>
                      <p>{place.rating}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 border-b border-stone-200 pb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                      />
                    </svg>

                    <div>
                      <p className="font-semibold text-[var(--text-dark)]">
                        Category
                      </p>
                      <p>{place.category}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 border-b border-stone-200 pb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold text-[var(--text-dark)]">
                        Description
                      </p>
                      <p className="text-lg leading-relaxed">
                        {showFullDescription
                          ? place.description
                          : getLimitedDescription(place.description, 50)}
                      </p>

                      <button
                        className="mt-2 text-blue-600 underline"
                        onClick={() =>
                          setShowFullDescription(!showFullDescription)
                        }
                      >
                        {showFullDescription ? "Show Less" : "Show More"}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          {/* suggestions */}
          <section>
            <h3 className="text-3xl font-bold mb-6">Similar Places</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions &&
                suggestions.map((suggestedPlace) => (
                  <NavLink
                    to={`/places/${suggestedPlace._id}`}
                    key={suggestedPlace._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        alt={suggestedPlace.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        src={suggestedPlace.image}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-bold">
                        {suggestedPlace.name}
                      </h4>
                      <p className="text-sm text-[var(--text-light)]">
                        {suggestedPlace.address}
                      </p>
                    </div>
                  </NavLink>
                ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default PlaceInfo;

