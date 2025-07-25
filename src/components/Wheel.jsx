import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Wheel = () => {
  const [places, setPlaces] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef();
  const navigate = useNavigate();

  const fetchPlaces = async () => {
    try {
      const res = await axios.get("http://localhost:3000/randomplaces/random");
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

  // Color palette for wheel segments
  const colors = [
    '#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB',
    '#B5EAD7', '#C7CEEA', '#F8B195', '#F67280'
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-12">
      <div className="max-w-md w-full text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-purple-800">🎡 Adventure Wheel</h1>
        <p className="text-gray-600 mb-6">
          Spin the wheel to discover a random destination! 
          All places are visible before spinning. After spinning, 
          you'll get a random selection.
        </p>
      </div>

      {/* Wheel Container */}
      <div className="relative w-96 h-96 mb-12">
        {/* Wheel */}
        <div
          ref={wheelRef}
          className="absolute inset-0 rounded-full shadow-xl border-8 border-white"
          style={{
            transform: 'rotate(0deg)',
            transition: 'none',
            background: 'conic-gradient(' +
              places.map((_, i) => 
                `${colors[i % colors.length]} 0 ${100/places.length * (i+1)}%`
              ).join(', ') + ')'
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
                    fontWeight: '600',
                    fontSize: '14px',
                    textShadow: '0 0 2px white'
                  }}
                >
                  {place.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white border-4 border-purple-600 shadow-md z-10 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-purple-600"></div>
        </div>

        {/* Pointer */}
        <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px] border-l-transparent border-r-transparent border-b-red-500 shadow-lg"></div>
        </div>
      </div>

      {/* Controls */}
      {!showResult ? (
        <button
          onClick={spin}
          disabled={spinning}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 text-lg font-semibold"
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
            "SPIN THE WHEEL 🎯"
          )}
        </button>
      ) : (
        <div className="flex flex-col items-center gap-6 bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-purple-800 mb-2">Your Destination!</h2>
            <p className="text-xl font-semibold text-gray-800">{places[selectedIndex]?.name}</p>
          </div>
          <div className="flex gap-4 w-full">
            <button
              onClick={handleGoToDetails}
              className="flex-1 bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition shadow-md font-medium"
            >
              View Details
            </button>
            <button
              onClick={handleSpinAgain}
              className="flex-1 bg-purple-100 text-purple-700 px-5 py-3 rounded-lg hover:bg-purple-200 transition shadow-md font-medium"
            >
              Spin Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wheel;