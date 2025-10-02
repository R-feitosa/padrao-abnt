import React from "react";

export default function Logo({ size = "md" }) {
  const sizes = {
    sm: { container: "w-8 h-8", text: "text-xs" },
    md: { container: "w-10 h-10", text: "text-sm" },
    lg: { container: "w-16 h-16", text: "text-xl" }
  };

  const currentSize = sizes[size];

  return (
    <div 
      className={`${currentSize.container} rounded-xl flex items-center justify-center font-bold ${currentSize.text} text-white shadow-md`}
      style={{
        background: 'linear-gradient(135deg, #7d1f3c 0%, #a02952 50%, #5c1729 100%)',
      }}
    >
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-3/5 h-3/5"
        style={{ color: '#ffffff' }}
      >
        <path 
          d="M6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M8 6H16" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <path 
          d="M8 10H16" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <path 
          d="M8 14H13" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <path 
          d="M8 18H11" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}