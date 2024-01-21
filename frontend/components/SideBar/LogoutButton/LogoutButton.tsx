import React from "react";
import LogoutIcon from "./LogoutIcon";

function LogoutButton() {
  return (
    <button
      type="button"
      className="flex justify-center gap-[2rem] text-2xl text-white"
    >
      <LogoutIcon />
      <h3>Logout</h3>
    </button>
  );
}

export default LogoutButton;
