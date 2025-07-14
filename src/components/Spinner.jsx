import React from "react";

const Spinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <span className="relative flex h-20 w-20 items-center justify-center">
      {/* Glowing animated ring */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-gradient-to-tr from-[var(--color-gold)] to-[var(--color-nile-blue)] opacity-30 animate-pulse blur-sm"></span>
      {/* Main spinner ring */}
      <svg className="animate-spin h-20 w-20 text-[var(--color-gold)] drop-shadow-xl" viewBox="0 0 50 50">
        <circle
          className="opacity-20"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="#003366"
          strokeWidth="6"
          strokeDasharray="31.4 94.2"
          fill="none"
        />
      </svg>
      {/* Terhal logo in the center */}
      <span className="absolute flex items-center justify-center w-10 h-10">
        <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="#ed7b2a"/>
          <ellipse cx="16" cy="16" rx="7" ry="12" fill="white"/>
        </svg>
      </span>
    </span>
    <div className="mt-6 text-lg font-extrabold text-[var(--color-nile-blue)] tracking-wide animate-pulse" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>Loading...</div>
  </div>
);

export default Spinner; 