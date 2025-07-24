import React, { useState } from 'react';

export default function ConfirmTour({setIsOpen, handleConfirm ,requestId}) {
  const [price, setPrice] = useState('');
    
  return (
    <>
      {/* Enhanced Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 transition-all duration-300" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 sm:mx-auto transform transition-all duration-300 border border-gray-100">
          {/* Header with icon */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Tour</h3>
            <p className="text-gray-600 text-sm">Enter the price to make this journey</p>
          </div>

          {/* Input and Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 font-medium">$</span>
              </div>
              <input
                type="text"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium placeholder-gray-400"
                placeholder="Enter price"
              />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={() => handleConfirm(requestId, price)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}