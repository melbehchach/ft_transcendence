import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

function Username() {
  const [name, setName] = useState<string>("");
  async function updateUsername() {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios.patch(
          "localhost:3000/user/settings/username",
          {
            username: `${name}`,
          },
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }

  return (
    <div className="flex flex-col justify-strat">
      <form className="flex flex-col gap-[0.5rem] ">
        <label className="text-xl font-light">Username: </label>
        <input
          className="w-full h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-lg font-light outline-none"
          type="text"
          placeholder="new username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </form>
    </div>
  );
}

export default Username;
