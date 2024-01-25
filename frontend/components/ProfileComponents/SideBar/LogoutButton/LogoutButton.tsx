import React from "react";
import Cookies from "js-cookie";
import LogoutIcon from "./LogoutIcon";

function LogoutButton() {
  function handleClick() {
    Cookies.remove('JWT_TOKEN');
    Cookies.remove('USER_ID');
    window.location.replace("/");
  }
  return (
    <button
      type="button"
      className="flex justify-center gap-[2rem] text-2xl text-white"
      onClick={handleClick}
    >
      <LogoutIcon />
      <h3>Logout</h3>
    </button>
  );
}

export default LogoutButton;
