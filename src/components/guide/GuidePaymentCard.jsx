// This component displays a single guide request card with status and payment buttons
import React from "react";

export default function GuidePaymentCard({ request, token, onCancel, onEdit, onPayment }) {
  const handleCancel = () => onCancel(request._id);
  const handleEdit = () => onEdit(request);
  const handlePay = () => onPayment(request._id);

  return (
    <div className="bg-white rounded-2xl shadow-lg border-l-4 border-orange-400 w-full max-w-[650px] p-5 mb-6 transition hover:shadow-xl">
      <div className="flex justify-between items-start">
        {/* Guide Info */}
        <div className="space-y-2">
          <p className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            {/* 🧑‍🏫 Guide: <span>{request.guide?.name}</span> */}
            🧑‍🏫 Guide: <span>{request.guide?.name}</span>
          </p>
          <p className="text-sm text-gray-600">
            📅 Date: {new Date(request.date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            ⏳ Duration: {request.duration}
          </p>
          <p className="text-sm text-gray-600">
            💬 Message: {request.message || "No message"}
          </p>

          <p className="text-sm text-gray-500">
            📌 Status:{" "}
            <span
              className={`font-semibold ${
                request.status === "pending"
                  ? "text-yellow-600"
                  : request.status === "approved"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {request.status}
            </span>
          </p>
          {request.paid && (
            <p className="text-sm text-green-600 font-semibold">
              ✅ Payment Completed
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 ml-4">
          {request.status === "pending" && (
            <>
              <button
                onClick={handleEdit}
                className="bg-yellow-400 hover:bg-yellow-500 text-white w-24 py-1 rounded-full text-sm shadow"
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-600 text-white w-24 py-1 rounded-full text-sm shadow"
              >
                ❌ Cancel
              </button>
            </>
          )}

          {request.status === "approved" && (
            <>
              {!request.paid ? (
                <>
                  <p className="text-sm text-gray-600">
                    💰 Price: {request.price || "No price"}
                  </p>
                  <button
                    onClick={handlePay}
                    className="bg-orange-500 hover:bg-orange-600 text-white w-24 py-1 rounded-full text-sm shadow"
                  >
                    💳 Pay Now
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-500 hover:bg-red-600 text-white w-24 py-1 rounded-full text-sm shadow"
                  >
                    ❌ Cancel
                  </button>
                </>
              ) : (
                <div className="text-green-600 font-semibold text-sm text-center">
                  ✅ Paid
                </div>
              )}
            </>
          )}

          {request.status === "done" && (
            <div className="text-green-600 font-semibold text-sm text-center">
              ✅ Paid
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
