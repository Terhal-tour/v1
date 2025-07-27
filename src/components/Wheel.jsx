import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const Wheel = () => {
  const [places, setPlaces] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef();
  const navigate = useNavigate();
   const { t } = useTranslation();
useEffect(()=>{},[])
  const fetchPlaces = async () => {
    try {
      const res = await axios.get("https://backend-mu-ten-26.vercel.app/places");
      setPlaces(res.data);
    } catch (err) {
      console.error("Error fetching places", err);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const spin = () => {
    if (spinning || places.length === 0) return;

    const index = Math.floor(Math.random() * places.length);
    setSelectedIndex(index);
    setSpinning(true);
    setShowResult(false);

    const degreesPerSlice = 360 / places.length;
    const extraSpins = 6;
    const finalDeg = (360 * extraSpins) + (360 - index * degreesPerSlice) - (degreesPerSlice / 2);

    wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.21, 0.99)';
    wheelRef.current.style.transform = `rotate(${finalDeg}deg)`;

    setTimeout(() => {
      setSpinning(false);
      setShowResult(true);
    }, 4200);
  };

  const handleGoToDetails = () => {
    if (places[selectedIndex]) {
      navigate(`/places/${places[selectedIndex]._id}`);
    }
  };

  const handleSpinAgain = () => {
    setSelectedIndex(null);
    setShowResult(false);
    fetchPlaces();
    setTimeout(() => {
      wheelRef.current.style.transition = 'none';
      wheelRef.current.style.transform = 'rotate(0deg)';
    }, 50);
  };

const colors = [
  '#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB',
  '#B5EAD7', '#C7CEEA', '#F8B195', '#F67280'
];

return (
  <div id='wheel'
   className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
    <div className="max-w-md w-full text-center mb-8">
      <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
       ✨ {t("Spin")} 
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Take a chance and discover hidden gems across Egypt — your next adventure is just a spin away!
        <span className="block mt-2 text-md text-orange-500">Spin the wheel and let destiny guide you</span>
      </p>
    </div>

    {/* Wheel Container */}
    <div className="relative w-96 h-96 mb-12">
      {/* Outer Glow Effect */}
      <div className="absolute inset-0 rounded-full animate-pulse" style={{
        background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(10px)',
        zIndex: -1
      }}></div>
      
      {/* Wheel */}
      <div
        ref={wheelRef}
        className="absolute inset-0 rounded-full shadow-2xl border-8 border-white transform hover:scale-105 transition-transform duration-300"
        style={{
          transform: 'rotate(0deg)',
          transition: 'none',
          background: 'conic-gradient(' +
            places.map((_, i) => 
              `${colors[i % colors.length]} 0 ${100/places.length * (i+1)}%`
            ).join(', ') + ')',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
        }}
      >
        {/* Place Names (always visible) */}
        {places.map((place, i) => {
          const angle = (360 / places.length) * i + (360 / places.length / 2);
          return (
            <div
              key={place._id}
              className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div 
                className="absolute bottom-4 left-0 w-full text-center"
                style={{ 
                  transform: 'translateX(-50%) rotate(90deg)',
                  transformOrigin: 'left center',
                  color: '#1F2937',
                  fontWeight: '700',
                  fontSize: '15px',
                  textShadow: '0 1px 3px rgba(255,255,255,0.8)'
                }}
              >
                {place.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Center Circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white border-4 border-purple-600 shadow-lg z-10 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 animate-pulse"></div>
      </div>

      {/* Pointer */}
      {/* <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-0 h-0 border-l-[24px] border-r-[24px] border-b-[48px] border-l-transparent border-r-transparent border-b-red-500 shadow-xl relative">
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white bg-red-500 px-2 py-1 rounded text-xs font-bold">
            WINNER!
          </div>
        </div>
      </div> */}
    </div>

    {/* Controls */}
    {!showResult ? (
      <button
        onClick={spin}
        disabled={spinning}
        className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all shadow-xl disabled:opacity-50 text-lg font-bold transform hover:scale-105 active:scale-95 group"
      >
        {spinning ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Spinning...
          </span>
        ) : (
          <>
            <span className="relative z-10">SPIN THE WHEEL 🎡</span>
            <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </>
        )}
      </button>
    ) : (
      <div className="flex flex-col items-center gap-6 bg-pink-100 p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-100 transform transition-all duration-300 hover:scale-[1.02]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 mb-3">
            🎉 Your Destination! 🎉
          </h2>
          <p className="text-2xl font-bold text-gray-800 animate-bounce">{places[selectedIndex]?.name}</p>
          <p className="text-gray-500 mt-2">Ready for an amazing adventure?</p>
        </div>
        <div className="flex gap-4 w-full">
          <button
            onClick={handleGoToDetails}
            className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-5 py-3 rounded-lg hover:from-orange-400 hover:to-yellow-700 transition-all shadow-md font-medium flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            View Details
          </button>
          <button
            onClick={handleSpinAgain}
            className="flex-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-5 py-3 rounded-lg hover:from-purple-200 hover:to-indigo-200 transition-all shadow-md font-medium flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Spin Again
          </button>
        </div>
      </div>
    )}
  </div>
);
};

export default Wheel;