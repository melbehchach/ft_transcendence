import axios from "axios";
import Cookies from "js-cookie";
import React from "react";

type props = {
  setTfaCheck: any;
};

function RemoveGoogleAuth({ setTfaCheck }: props) {
  async function remove2FA() {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios.patch(
          "http://localhost:3000/auth/tfa/disable",
          {},
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        if (response.data.success == true) setTfaCheck(false);
      } else throw new Error("bad req");
    } catch (error) {
    }
  }

  function handleClick() {
    remove2FA();
  }

  return (
    <div className="w-full h-full">
      <button
        className="w-[10rem] h-[2.5rem] rounded-[10px] border border-red-700 text-red-700 items-center"
        onClick={handleClick}
      >
        Remove 2FA
      </button>
    </div>
  );
}

export default RemoveGoogleAuth;
