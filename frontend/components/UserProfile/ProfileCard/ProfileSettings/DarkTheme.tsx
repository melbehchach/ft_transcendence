import React from "react";

function DarkTheme() {
  return (
    <svg
      width="82"
      height="40"
      viewBox="0 0 92 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.75"
        y="0.75"
        width="90.5"
        height="48.5"
        rx="4.25"
        fill="black"
      />
      <rect
        x="0.75"
        y="0.75"
        width="90.5"
        height="48.5"
        rx="4.25"
        stroke="#4D5960"
        strokeWidth="1.5"
      />
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

export default DarkTheme;
