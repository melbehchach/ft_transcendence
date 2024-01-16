import React from "react";

function LightTheme() {
  return (
    <svg
      width="82"
      height="40"
      viewBox="0 0 92 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="92" height="50" rx="5" fill="#056CF2" />
      <line
        x1="46.5"
        y1="1"
        x2="46.5"
        y2="50"
        stroke="white"
        strokeDasharray="2 2"
      />
      <path
        d="M5.5 19L5.5 31"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M86.5 19V31"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="66" cy="26" r="2" fill="#D9D9D9" />
    </svg>
  );
}

export default LightTheme;
