import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa";

const SupportUsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(5);

  const handleDonate = async () => {
    try {
      const { data } = await axios.post(
        `https://backend-mu-ten-26.vercel.app/supportus/checkout`,
        { amount }
      );
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white 
                   rounded-full p-4 shadow-lg hover:scale-110 transition-transform duration-300 
                   flex items-center justify-center z-50 animate-pulse"
        onClick={() => setIsOpen(true)}
        aria-label="Support Us"
      >
        <FaHeart size={24} />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl relative">
            <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2 text-orange-600">
               Support Us <FaHeart />
            </h2>

            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="input input-bordered w-full mb-4 text-center text-lg border-2 rounded-xl focus:border-orange-500"
              placeholder="Enter amount (USD)"
            />

            <div className="flex gap-3">
              {/* Cancel Button */}
              <button
                className="flex-1 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 
                           transition duration-300 font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>

              {/* Donate Button */}
              <button
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white 
                           hover:opacity-90 transition duration-300 font-semibold"
                onClick={handleDonate}
              >
                Donate ${amount}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportUsButton;
