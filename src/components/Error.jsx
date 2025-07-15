import React from "react";
import "./../css/error.css";

const Error = ({ message = "Something went wrong.", onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="text-3xl text-red-600 font-bold mb-4">Error</div>
    <div className="text-lg text-[var(--color-text-light)] mb-6">{message}</div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-[var(--color-gold)] text-[var(--color-nile-blue)] rounded font-semibold hover:bg-white transition"
      >
        Retry
      </button>
    )}
  </div>
);

export default Error; 