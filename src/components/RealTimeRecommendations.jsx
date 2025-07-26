import React, { useEffect, useState } from "react";
import {
  MapPin,
  Thermometer,
  Clock,
  Sparkles,
  Navigation,
  Star,
  Camera,
  RefreshCw,
  Heart,
  Share2,
  ChevronRight,
  Compass,
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  Zap,
  TrendingUp,
  Award,
} from "lucide-react";
import { toast } from "react-toastify";

// Enhanced Spinner component
const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="relative">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 absolute top-0 left-0"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
      </div>
    </div>
  </div>
);
const handleShare = () => {
  if (navigator.share && data?.recommendation) {
    navigator
      .share({
        title: "Travel Recommendation",
        text: data.recommendation,
      })
      .catch((err) => {
        console.error("Share failed:", err.message);
      });
  } else {
    navigator.clipboard.writeText(data?.recommendation || "").then(() => {
      toast.success("Copied to clipboard!");
    });
  }
};
export default function RealTimeRecommendations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoritePlace, setFavoritePlace] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
const parsedRecommendations = (() => {
  try {
    if (typeof data?.recommendation === "string") {
      const cleaned = data.recommendation.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned); // لا حاجة للوصول إلى .recommendations
    }
  } catch (err) {
    console.error("Failed to parse recommendations JSON", err);
  }
  return [];
})();
const lang=localStorage.getItem("lang") || "AR";

  const fetchRecommendations = async (lat, lng) => {
    try {
      setRefreshing(true);
      const response = await fetch(
        "https://backend-mu-ten-26.vercel.app/realTimeRecomendation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
          },
          body: JSON.stringify(lang === "AR" ? { lat, lng } : { lat, lng, lang }),
        }
      );
// console.log(response ,"resssponsss");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(responseData, "responseData");
      
      setData(responseData);
    } catch (err) {
      setError(err.message || "Error fetching data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchRecommendations(latitude, longitude);
      },
      (err) => {
        setError("Location permission denied");
        setLoading(false);
      }
    );
  }, []);

  const getWeatherIcon = (weather) => {
    if (!weather) return <Sun className="w-7 h-7 text-yellow-500" />;
    const w = weather.toLowerCase();
    if (w.includes("sunny") || w.includes("clear"))
      return <Sun className="w-7 h-7 text-yellow-500" />;
    if (w.includes("cloudy"))
      return <Cloud className="w-7 h-7 text-gray-500" />;
    if (w.includes("rain"))
      return <CloudRain className="w-7 h-7 text-blue-500" />;
    if (w.includes("snow"))
      return <Snowflake className="w-7 h-7 text-blue-300" />;
    if (w.includes("storm")) return <Zap className="w-7 h-7 text-purple-500" />;
    return <Sun className="w-7 h-7 text-yellow-500" />;
  };

  const getPlaceIcon = (type) => {
    if (!type) return "📍";
    const t = type.toLowerCase();
    if (t.includes("restaurant") || t.includes("food")) return "🍽️";
    if (t.includes("hotel") || t.includes("accommodation")) return "🏨";
    if (t.includes("museum") || t.includes("gallery")) return "🏛️";
    if (t.includes("park") || t.includes("nature")) return "🌳";
    if (t.includes("shopping") || t.includes("store")) return "🛍️";
    if (t.includes("tourist") || t.includes("attraction")) return "🎯";
    if (t.includes("beach")) return "🏖️";
    if (t.includes("church") || t.includes("temple")) return "⛪";
    return "📍";
  };

  const handleRefresh = () => {
    if (data?.lat && data?.lng) {
      fetchRecommendations(data.lat, data.lng);
    } else {
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <Spinner />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-800">
              Discovering Amazing Places
            </h3>
            <p className="text-gray-600">
              Analyzing your location for personalized recommendations...
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto text-center border-2 border-red-100">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            Location Access Error
          </h3>
          <p className="text-red-600 text-sm mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  const handleSave = () => {
    {console.log("Saving recommendation:", data?.recommendation);
    }
    if (data?.recommendation) {
      const saved = {
        recommendation: data.recommendation,
        time: new Date().toISOString(),
      };
      const existing = JSON.parse(
        localStorage.getItem("savedRecommendations") || "[]"
      );
      existing.push(saved);
      localStorage.setItem("savedRecommendations", JSON.stringify(existing));
      toast.success("Recommendation saved successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header with floating elements */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
          <div
            className="absolute top-32 right-16 w-16 h-16 bg-white/5 rounded-full animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-10 left-1/3 w-12 h-12 bg-white/10 rounded-full animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center border border-white/30 shadow-xl">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Smart Travel Recommendations
                </h1>
                <p className="text-blue-100 text-lg">
                  Discover personalized places just for you
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20">
                <div className="flex items-center space-x-2 text-white">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-medium">Live Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Location & Weather Card */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg">
                <Compass className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold mb-1">
                  Current Location
                </p>
                <p className="text-gray-800 font-bold text-xl mb-1">
                  {data?.lat?.toFixed(6)}, {data?.lng?.toFixed(6)}
                </p>
                <p className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full inline-block">
                  GPS Coordinates
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  {getWeatherIcon(data?.weather)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">
                    Current Weather
                  </p>
                  <p className="text-gray-800 font-bold text-lg">
                    {data?.weather || "Unknown"} • {data?.temperature || "--"}°C
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Live Data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Nearby Places - Enhanced */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Navigation className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Nearby Gems</h3>
                    <p className="text-emerald-100 text-sm">
                      Handpicked for you
                    </p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold">
                    {data?.nearby_places?.length || 0} places
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8">
              {Array.isArray(data?.nearby_places) &&
              data.nearby_places.length > 0 ? (
                <div className="space-y-4">
                  {data.nearby_places.map((place, idx) => (
                    <div
                      key={idx}
                      className="group relative flex items-center space-x-4 p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 hover:from-emerald-50 hover:to-teal-50 transition-all duration-500 cursor-pointer border border-gray-200 hover:border-emerald-300 hover:shadow-lg transform hover:scale-[1.02]"
                      onClick={() =>
                        setFavoritePlace(idx === favoritePlace ? null : idx)
                      }
                    >
                      <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow border border-gray-100">
                        <span className="text-2xl">
                          {getPlaceIcon(place.type)}
                        </span>
                      </div>

                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-800 group-hover:text-emerald-700 transition-colors text-lg mb-1">
                          {place.name}
                        </h4>
                        <div className="flex items-center space-x-3">
                          <p className="text-sm text-gray-500 capitalize font-medium bg-gray-100 px-3 py-1 rounded-full">
                            {place.type}
                          </p>
                          {place.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600 font-semibold">
                                {place.rating}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {/* <button
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                            favoritePlace === idx
                              ? "bg-red-500 text-white shadow-lg scale-110"
                              : "bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500"
                          }`}
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              favoritePlace === idx ? "fill-current" : ""
                            }`}
                          />
                        </button> */}
                        <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-12 h-12 text-gray-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-600 mb-2">
                    No nearby places found
                  </h4>
                  <p className="text-sm text-gray-400">
                    Try refreshing or check your location settings
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* AI Recommendations - Enhanced */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-600 text-white px-6 py-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">AI Travel Guide</h3>
                  <p className="text-purple-100 text-sm">
                    Powered by intelligence
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {
                console.log("data:", data.recommendation , "parsedRecommendations:", parsedRecommendations)
              }
              {data?.recommendation ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-6 border-2 border-purple-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full -mr-10 -mt-10 opacity-50"></div>
                    <div className="space-y-4">
                      {parsedRecommendations.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-purple-100 rounded-xl p-4 shadow-sm"
                        >
                          <h4 className="font-semibold text-purple-800">
                            {item.place}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">
                            {item.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Updated just now</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2"></div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSave()}
                        className="flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-700 transition-colors bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-lg font-medium"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      {/* <button
                        onClick={() => handleShare()}
                        className="flex items-center space-x-1 text-xs text-pink-600 hover:text-pink-700 transition-colors bg-pink-50 hover:bg-pink-100 px-3 py-2 rounded-lg font-medium"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button> */}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-purple-400 animate-spin" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">
                    Generating recommendations...
                  </h4>
                  <p className="text-sm text-gray-400">
                    Our AI is crafting your perfect day
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 px-8 rounded-3xl font-bold hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3 ${
              refreshing ? "animate-pulse" : ""
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <RefreshCw
              className={`w-6 h-6 relative z-10 ${
                refreshing ? "animate-spin" : "group-hover:rotate-180"
              } transition-transform duration-500`}
            />
            <span className="relative z-10">
              {refreshing ? "Refreshing..." : "Refresh Recommendations"}
            </span>
          </button>

          {/* <button className="group relative overflow-hidden bg-white text-gray-700 py-6 px-8 rounded-3xl font-bold border-2 border-gray-200 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <MapPin className="w-6 h-6 group-hover:text-indigo-600 transition-colors relative z-10" />
            <span className="group-hover:text-indigo-700 transition-colors relative z-10">
              Explore on Map
            </span>
          </button> */}
          <button
            onClick={() => {
              if (data?.lat && data?.lng) {
                const mapUrl = `https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lng}`;
                window.open(mapUrl, "_blank");
              } else {
                toast.error("Location data not available");
              }
            }}
            className="group relative overflow-hidden bg-white text-gray-700 py-6 px-8 rounded-3xl font-bold border-2 border-gray-200 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <MapPin className="w-6 h-6 group-hover:text-indigo-600 transition-colors relative z-10" />
            <span className="group-hover:text-indigo-700 transition-colors relative z-10">
              Explore on Map
            </span>
          </button>
        </div>
      </div>

     <style>{`
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
`}</style>

    </div>
  );
}
