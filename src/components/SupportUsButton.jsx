import { useState } from "react";
import axios from "axios";

const SupportUsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(5);

  const handleDonate = async () => {
    try {
      const { data } = await axios.post(`https://backend-mu-ten-26.vercel.app/payment/checkout`, { amount });
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  // Shared button styles
  const sharedButtonStyle =
    "cursor-pointer px-6 py-3 rounded-full shadow-lg transition duration-300 hover:scale-105";

  return (
    <>
      {/* Floating Button */}
      <button
        className={`${sharedButtonStyle} fixed bottom-5 right-5 bg-[#ed7b2a] text-white z-50`}
        onClick={() => setIsOpen(true)}
      >
        Support Us 🤍 
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Donate to Support Us</h2>

            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="input input-bordered w-full mb-4"
              placeholder="Enter amount (USD)"
            />

            <div className="flex justify-between">
              {/* Cancel Button - Gray Style */}
              <button
                className={`${sharedButtonStyle} bg-gray-300 text-black hover:bg-gray-400`}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>

              {/* Donate Button - Orange Style */}
              <button
                className={`${sharedButtonStyle} bg-[#ed7b2a] text-white hover:bg-orange-600`}
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
